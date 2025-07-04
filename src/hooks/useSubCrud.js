// src/hooks/useSubCrud.js
import useCrudFactory from './useCrudFactory';
import {
  obtenerSubs,
  incluirSub,
  modificarSub,
  eliminarSub,
} from '../services/eventos';

export default function useSubCrud() {
  return useCrudFactory(
    obtenerSubs,
    incluirSub,
    modificarSub,
    eliminarSub,
  );
}
