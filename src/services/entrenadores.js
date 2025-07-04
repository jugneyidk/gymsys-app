// src/services/entrenadores.js
import { apiRequest } from './Api';

// GET listado completo
export const obtenerEntrenadores = () =>
  apiRequest('?p=entrenadores&accion=listadoEntrenadores', 'GET');

// GET un registro puntual (id = cedula encriptada)
export const obtenerEntrenador = (id) =>
  apiRequest(
    `?p=entrenadores&accion=obtenerEntrenador&id=${encodeURIComponent(id)}`,
    'GET'
  );

export const obtenerGrados = () =>
  apiRequest('?p=entrenadores&accion=listadoGradosInstruccion', 'GET');
 
export const registrarEntrenador = (payload) =>
  apiRequest(
    '?p=entrenadores&accion=incluirEntrenador',
    'POST',
    payload
  );
 
export const modificarEntrenador = (payload) =>
  apiRequest(
    '?p=entrenadores&accion=modificarEntrenador',
    'POST',
    payload
  );

export const eliminarEntrenador = (id) =>
  apiRequest(
    '?p=entrenadores&accion=eliminarEntrenador',
    'POST',
    { cedula: id }
  );
