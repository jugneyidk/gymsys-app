// src/hooks/useLoginForm.js
import { useState } from 'react';
import { validarCedula, validarPassword } from '../utils/validators';
import { apiRequest } from '../services/Api';
import { getCsrfToken } from '../services/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { navigationRef } from '../utils/navigationRef';

export const useLoginForm = (setIsAuthenticated) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errorUsuario, setErrorUsuario] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

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
    let valido = true;

    if (!validarCedula(usuario)) {
      setErrorUsuario('Cédula inválida (6-9 dígitos numéricos)');
      valido = false;
    }

    if (!validarPassword(password)) {
      setErrorPassword('Contraseña inválida (6-20 caracteres válidos)');
      valido = false;
    }

    return valido;
  };

  const onLogin = async () => {
    if (!validarFormulario()) return;

    try {
      const response = await apiRequest('?p=login&accion=authUsuario', 'POST', {
        id_usuario: usuario,
        password: password
      });
      console.log('🧪 response login:', response);

      if (response.accessToken) {
        await AsyncStorage.setItem('access_token', response.accessToken);
        if (response.refreshToken) {
          await AsyncStorage.setItem('refresh_token', response.refreshToken);
        }
        await getCsrfToken();
        // Esperar confirmación 
        const access = await AsyncStorage.getItem('access_token');
        const refresh = await AsyncStorage.getItem('refresh_token');

        console.log('access guardado:', access);
        console.log('refresh guardado:', refresh);

        if (access && refresh && setIsAuthenticated) {
          setIsAuthenticated(true);
          navigationRef.reset({
            index: 0,
            routes: [{ name: 'AppNavigation' }],
          });
        } else {
          Alert.alert('Error', 'No se pudieron guardar los tokens correctamente.');
        }

      } else {
        Alert.alert('Error', 'No se recibió atoken');
      }

    } catch (error) {
      Alert.alert('Error', error.message || 'Ocurrió un error al iniciar sesión');
    }
  };

  return { usuario, password, errorUsuario, errorPassword, onUsuarioChange, onPasswordChange, onLogin };
};
