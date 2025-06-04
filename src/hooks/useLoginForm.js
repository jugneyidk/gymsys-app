import { useState } from 'react';
import { validarCedula, validarPassword } from '../utils/validators';
import { apiRequest } from '../services/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useLoginForm = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errorUsuario, setErrorUsuario] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const navigation = useNavigation();

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

      if (response.accessToken) {
        await AsyncStorage.setItem('access_token', response.accessToken);
        if (response.refreshToken) {
          await AsyncStorage.setItem('refresh_token', response.refreshToken);
        }

        Alert.alert('Éxito', 'Has iniciado sesión correctamente');
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Error', 'No se recibió token');
      }

    } catch (error) {
      Alert.alert('Error', error.message || 'Ocurrió un error al iniciar sesión');
    }
  };

  return {
    usuario,
    password,
    errorUsuario,
    errorPassword,
    onUsuarioChange,
    onPasswordChange,
    onLogin
  };
};
