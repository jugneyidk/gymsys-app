// src/hooks/useCategoriaCrud.js
import useCrudFactory from './useCrudFactory';
import {
  obtenerCategorias,
  incluirCategoria,
  modificarCategoria,
  eliminarCategoria,
} from '../services/eventos';

export default function useCategoriaCrud() {
  return useCrudFactory(
    obtenerCategorias,
    incluirCategoria,
    modificarCategoria,
    eliminarCategoria,
  );
}
