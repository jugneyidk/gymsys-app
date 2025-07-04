// src/hooks/useUsuario.js
import { useEffect, useState } from 'react';
import { apiRequest } from '../services/Api';

export function useUsuario() {
  const [usuario, setUsuario] = useState({ nombre: '', rol: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const respuesta = await apiRequest('?p=rolespermisos&accion=obtenerPermisosNav', 'GET');
        if (respuesta?.usuario) {
          setUsuario(respuesta.usuario);
        }
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, []);

  return { usuario, loading };
}
