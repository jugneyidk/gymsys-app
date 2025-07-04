// src/hooks/useLoginForm.js
import { useState } from 'react';
import { validarCedula, validarPassword } from '../utils/validators';
import { getCsrfToken, API_BASE_URL } from '../services/Api';
import {
  generarClaveAES,
  encriptarAES,
  encriptarClaveAESRSA,
} from '../utils/encryption';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { navigationRef } from '../utils/navigationRef';

export const useLoginForm = (setIsAuthenticated) => {
  /* ---------------------- estado local ---------------------- */
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errorUsuario, setErrorUsuario] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  /* --------------------- handlers campos -------------------- */
  const onUsuarioChange = (value) => {
    setUsuario(value);
    if (!validarCedula(value)) {
      setErrorUsuario('Cédula inválida (6-9 dígitos numéricos)');
    } else {
      setErrorUsuario('');
    }
  };

  const onPasswordChange = (value) => {
    setPassword(value);
    if (!validarPassword(value)) {
      setErrorPassword('Contraseña inválida (6-20 caracteres válidos)');
    } else {
      setErrorPassword('');
    }
  };

  const validarFormulario = () => {
    let ok = true;
    if (!validarCedula(usuario)) { setErrorUsuario('Cédula inválida (6-9 dígitos numéricos)'); ok = false; }
    if (!validarPassword(password)) { setErrorPassword('Contraseña inválida (6-20 caracteres válidos)'); ok = false; }
    return ok;
  };


  const onLogin = async () => {
    if (!validarFormulario()) return;

    try {

      const { clave, iv } = generarClaveAES();
      const payload = JSON.stringify({ id_usuario: usuario, password });
      const encryptedData = await encriptarAES(payload, clave, iv);
      const encryptedKey = await encriptarClaveAESRSA(clave);
 console.log(encryptedData);
  console.log(encryptedKey);
      const fd = new FormData();
     
      fd.append('encryptedData', encryptedData);
      fd.append('encryptedKey', encryptedKey);
      console.log(fd);
      const res = await fetch(
        `${API_BASE_URL}?p=login&accion=authUsuario`,
        { method: 'POST', headers: { 'X-Client-Type': 'mobile' }, body: fd }
      );
       console.log(res);
      const json = await res.json();
      console.log(json);
      if (!res.ok) throw new Error(json?.data?.error || 'Credenciales inválidas');

      const { accessToken, refreshToken } = json.data;
      if (!accessToken) throw new Error('No se recibió token');

      await AsyncStorage.setItem('access_token', accessToken);
      if (refreshToken) await AsyncStorage.setItem('refresh_token', refreshToken);
      await getCsrfToken();

      setIsAuthenticated?.(true);
      navigationRef.reset({ index: 0, routes: [{ name: 'AppNavigation' }] });

    } catch (err) {
      console.log(err);
      Alert.alert('Error', err.message || 'Ocurrió un error al iniciar sesión');
    }
  };

  return {
    usuario,
    password,
    errorUsuario,
    errorPassword,
    onUsuarioChange,
    onPasswordChange,
    onLogin,
  };
};
