import { useEffect, useState } from 'react';
import { apiRequest } from '../services/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useEstadisticasDashboard = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');

        if (!token) {
          throw new Error('Token no disponible');
        }

        const response = await apiRequest('?p=dashboard&accion=obtenerDatosSistema', 'GET');
        setEstadisticas(response.estadisticas);
      } catch (err) {
        setError(err.message || 'Error al cargar las estadísticas');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  return { estadisticas, cargando, error };
};
