// src/services/atletas.js
import { apiRequest } from './Api';

export const obtenerTiposAtleta = () =>
  apiRequest('?p=tipoatleta&accion=listadoTipoAtletas', 'GET');

export const obtenerEntrenadoresLite = () =>
  apiRequest('?p=entrenadores&accion=listadoEntrenadores', 'GET');

export const obtenerAtletas = () =>
  apiRequest('?p=atletas&accion=listadoAtletas', 'GET');

export const obtenerAtleta = (id) =>
  apiRequest(`?p=atletas&accion=obtenerAtleta&id=${encodeURIComponent(id)}`,
    'GET');

export const registrarAtleta = (payload) =>
  apiRequest('?p=atletas&accion=incluirAtleta', 'POST', payload);

export const modificarAtleta = (payload) =>
  apiRequest('?p=atletas&accion=modificarAtleta', 'POST', payload);

export const eliminarAtleta = (id) =>
  apiRequest('?p=atletas&accion=eliminarAtleta', 'POST', { cedula: id });
