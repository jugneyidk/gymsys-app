import AsyncStorage from '@react-native-async-storage/async-storage';

let refreshInProgress = false;
let refreshPromise = null;

const API_BASE_URL = 'http://localhost/gymsys/';

export async function apiRequest(endpoint, method = 'POST', data = null, showLoader = true, isRetry = false) {
  try {
    const token = await AsyncStorage.getItem('access_token');

    const headers = {
      'X-Client-Type': 'mobile',
      ...(token && { Authorization: `Bearer ${token}` })
    };

    const formData = new FormData();
    if (data) {
      for (const key in data) {
        formData.append(key, data[key]);
      }
    }

    if (showLoader) console.log('🔄 Cargando...');

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: formData,
    });

    const contentType = response.headers.get('Content-Type');
    let json;

    if (contentType && contentType.includes('application/json')) {
      json = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Respuesta no JSON: ${text}`);
    }

    if (!response.ok) {
      const msg = json?.data?.error || json?.error || 'Error inesperado';
      throw new Error(`(${response.status}) ${msg}`);
    }

    return json.data;

  } catch (error) {
    console.error('Error en la solicitud:', error.message);
    console.error('Detalle completo:', error);
    alert(`Error al conectarse al servidor:\n${error.message}`);
    throw error;
  } finally {
    if (showLoader) console.log('Finalizó la carga');
  }
}

async function handleTokenRefresh() {
  if (refreshInProgress) {
    return refreshPromise;
  }

  refreshInProgress = true;
  refreshPromise = new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${API_BASE_URL}/?p=authrefresh&accion=refreshtoken`, {
        method: 'POST',
        headers: {
          'X-Client-Type': 'mobile'
        }
      });

      const json = await response.json();

      if (!response.ok || !json.data?.accessToken) {
        throw new Error('No se pudo refrescar el token');
      }

      await AsyncStorage.setItem('access_token', json.data.accessToken);
      resolve();
    } catch (err) {
      await AsyncStorage.removeItem('access_token');
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      reject(err);
    } finally {
      refreshInProgress = false;
    }
  });

  return refreshPromise;
}
