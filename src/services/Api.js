// src/services/Api.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert }    from 'react-native';
import { navegarAlLogin } from '../utils/navigationRef';

export const API_BASE_URL = 'http://10.0.2.2/gymsys/';
let PHPSESSID        = null; 
let refreshInProgress = false;
let refreshPromise    = null;

let csrfToken = null;

export async function getCsrfToken () {
  if (csrfToken) return csrfToken;           

  const saved = await AsyncStorage.getItem('csrf_token');
  if (saved) { csrfToken = saved; return csrfToken; }

  try {
    const res = await fetch(
      `${API_BASE_URL}?p=login&accion=csrfGlobal`,  
      {
        method : 'GET',
        headers: { 'X-Client-Type': 'mobile', ...(PHPSESSID ? { Cookie: PHPSESSID } : {}) }
      }
    ).then(r => r.json());

    csrfToken = res.data?.csrf_token ?? null;
    if (csrfToken) await AsyncStorage.setItem('csrf_token', csrfToken);
    return csrfToken;

  } catch (e) {
    console.warn('No se pudo obtener CSRF:', e.message);
    return null;
  }
}

export async function apiRequest (
  endpoint,
  method      = 'POST',
  data        = null,
  showLoader  = true,
  isRetry     = false
) {
  try {
 
    const tokenRaw = await AsyncStorage.getItem('access_token');
    const token    = tokenRaw?.trim();

    const headers  = {
      'X-Client-Type': 'mobile',
      ...(token     ? { Authorization: `Bearer ${token}` } : {}),
      ...(PHPSESSID ? { Cookie: PHPSESSID } : {})
    };

    const options = { method, headers };

    if (data && method !== 'GET' && method !== 'HEAD') {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));

      const tk = await getCsrfToken(); 
      if (tk) formData.append('_csrf_token', tk);

      options.body = formData;
    }

    if (showLoader) console.log('Cargando…');

    const url      = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, options);

    if (!PHPSESSID) {
      const setCookie = response.headers.get('set-cookie') || response.headers.get('Set-Cookie');
      if (setCookie) PHPSESSID = setCookie.split(';')[0];
    }

    const type = response.headers.get('Content-Type') ?? '';
    const json = type.includes('application/json')
      ? await response.json()
      : { ok:false, data:{ error:`Respuesta no JSON: ${await response.text()}` }};

    if (!response.ok) {
      const msg = json?.data?.error || json?.error || 'Error inesperado';

      if (response.status === 401 && !isRetry) {
        const ok = await handleTokenRefresh();
        if (ok) return apiRequest(endpoint, method, data, showLoader, true);
        throw new Error('No se pudo refrescar el token');
      }
      /* CSRF inválido → forzar renovación y reintentar 1 vez */
      if (response.status === 403 && msg.toLowerCase().includes('csrf') && !isRetry) {
        await AsyncStorage.removeItem('csrf_token');  // limpiamos
        csrfToken = null;
        return apiRequest(endpoint, method, data, showLoader, true);
      }

      // otro error
      const err = new Error(`(${response.status}) ${msg}`);
      err.statusCode = response.status;
      throw err;
    }

    return json.data;

  } catch (err) {
    console.error('[apiRequest]', err.message);
    Alert.alert('Error al conectarse', err.message);

    if (err.message === 'No se pudo refrescar el token') await cerrarSesionYRedirigir();
    throw err;

  } finally {
    if (showLoader) console.log('Finalizó la carga');
  }
}

/* --------------------------------------------------------------
   Funciones auxiliares que ya existían
   --------------------------------------------------------------*/
export const obtenerPerfil = () =>
  apiRequest('?p=login&accion=obtenerPerfil', 'GET');

async function cerrarSesionYRedirigir () {
  await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'csrf_token']);
  PHPSESSID = null; csrfToken = null;
  navegarAlLogin();
  Alert.alert('Sesión expirada', 'Debes iniciar sesión nuevamente.');
}

async function handleTokenRefresh () {
  if (refreshInProgress) return refreshPromise;

  refreshInProgress = true;
  refreshPromise    = new Promise(async (resolve) => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No se encontró refresh_token');

      const formData = new FormData();
      formData.append('refreshToken', refreshToken);

      const res = await fetch(
        `${API_BASE_URL}?p=authrefresh&accion=refreshtoken`,
        {
          method : 'POST',
          headers: { 'X-Client-Type': 'mobile', ...(PHPSESSID ? { Cookie: PHPSESSID } : {}) },
          body   : formData
        }
      );

      const json = await res.json();
      if (!res.ok || !json.data?.accessToken) throw new Error('No se pudo refrescar el token');

      await AsyncStorage.multiSet([
        ['access_token', json.data.accessToken],
        ['refresh_token', json.data.refreshToken ?? refreshToken]
      ]);

      console.log('Token refrescado.');
      resolve(true);

    } catch (e) {
      console.warn('Error al refrescar token:', e.message);
      resolve(false);

    } finally {
      refreshInProgress = false;
    }
  });

  return refreshPromise;
}
