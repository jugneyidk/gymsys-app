// src/hooks/useSesionActiva.js
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

let cerrarSesionGlobal = null;

export const useSesionActiva = () => {
  const navigation = useNavigation();

  const cerrarSesion = async (desdeApi = false) => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');

    if (!desdeApi) {
      Alert.alert('Sesión finalizada', 'Debes iniciar sesión nuevamente.');
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  useEffect(() => {
    cerrarSesionGlobal = cerrarSesion;

    const verificarSesion = async () => {
      const token = await AsyncStorage.getItem('access_token');
      const refresh = await AsyncStorage.getItem('refresh_token');

      if (!token && !refresh) {
        console.warn('Sin token válido. Redirigiendo al login...');
        await cerrarSesion();
      }
    };
    verificarSesion();
  }, []);

  return {
    cerrarSesionManual: cerrarSesion,
  };
};

export const cerrarSesionDesdeApi = () => {
  if (cerrarSesionGlobal) {
    cerrarSesionGlobal(true);
  } else {
    console.warn('error');
  }
};
