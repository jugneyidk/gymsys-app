// src/components/ProteccionSesion.js
import { useSesionActiva } from '../hooks/useSesionActiva';

export default function ProteccionSesion({ children }) {
  useSesionActiva();
  return children;
}
