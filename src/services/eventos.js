// src/services/eventos.js
import { apiRequest } from '../services/Api';

export const obtenerCategorias = () =>
  apiRequest('?p=categorias&accion=listadoCategorias', 'GET');

export const obtenerSubs = () =>
  apiRequest('?p=subs&accion=listadoSubs', 'GET');

export const obtenerTiposCompetencia = () =>
  apiRequest('?p=tipocompetencia&accion=listadoTipos', 'GET');

export const obtenerEventosActivos = () =>
  apiRequest('?p=eventos&accion=listadoEventos', 'GET');

export const obtenerEventosAnteriores = () =>
  apiRequest('?p=eventos&accion=listadoEventosAnteriores', 'GET');

export const obtenerCompetencia = (id) =>
  apiRequest(`?p=eventos&accion=obtenerCompetencia&id=${id}`, 'GET');

export const modificarEvento = (data) =>
  apiRequest('?p=eventos&accion=modificarEvento', 'POST', data, true);

export const eliminarEvento = (id_competencia) =>
  apiRequest('?p=eventos&accion=eliminarEvento', 'POST', { id_competencia });

export const obtenerAtletasInscritos = (id) =>
  apiRequest(`?p=eventos&accion=listadoAtletasInscritos&id_competencia=${id}`, 'GET');

export const cerrarEvento = (id_competencia) =>
  apiRequest('?p=eventos&accion=cerrarEvento', 'POST', { id_competencia });

export const obtenerAtletasDisponibles = (id) =>
  apiRequest(`?p=eventos&accion=listadoAtletasDisponibles&id=${id}`, 'GET');

export const inscribirAtletas = (id_competencia, atletas /* array de ids */) =>
  apiRequest(
    '?p=eventos&accion=inscribirAtletas',
    'POST',
    { id_competencia, atletas: JSON.stringify(atletas) },
    true
  );

export const incluirCategoria = (data) =>
  apiRequest(
    '?p=categorias&accion=incluirCategoria',
    'POST',
    data,
    true        
  );

export const modificarCategoria = (data) =>
  apiRequest(
    '?p=categorias&accion=modificarCategoria',
    'POST',
    data,
    true
  );

export const eliminarCategoria = (id_categoria) =>
  apiRequest(
    '?p=categorias&accion=eliminarCategoria',
    'POST',
    { id_categoria },
    true
  );

export const incluirSub = (data) =>
    apiRequest(
    '?p=subs&accion=incluirSub',
    'POST',
    data,
    true
  );

export const modificarSub = (data) =>
  apiRequest(
    '?p=subs&accion=modificarSub',
    'POST',
    data,
    true
  );

export const eliminarSub = (id_sub) =>
  apiRequest(
    '?p=subs&accion=eliminarSub',
    'POST',
    { id_sub },
    true
  );