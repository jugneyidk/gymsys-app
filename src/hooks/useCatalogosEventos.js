import { useEffect, useState, useCallback } from 'react';
import { obtenerCategorias, obtenerSubs, obtenerTiposCompetencia } from '../services/eventos';

export default function useCatalogosEventos() {
  const [data, setData] = useState({
    categorias: [], subs: [], tipos: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarCatalogos = useCallback(async () => {
    try {
      setLoading(true);
      const [categorias, subs, tipos] = await Promise.all([
        obtenerCategorias(),
        obtenerSubs(),
        obtenerTiposCompetencia(),
      ]);
      setData({ categorias: categorias.categorias, subs: subs.subs, tipos: tipos.tipos });
    } catch (e) {
      setError(e.message ?? 'Error al cargar catálogos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarCatalogos(); }, [cargarCatalogos]);

  return { ...data, loading, error, recargar: cargarCatalogos };
}
