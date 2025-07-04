// src/hooks/useCrudFactory.js
import { useState, useCallback } from 'react';

/**
 * Crea un CRUD hook a partir de los services que le pases.
 * @param {function} fetchFn      – GET/listar
 * @param {function} createFn     – POST/crear
 * @param {function} updateFn     – POST/editar
 * @param {function} deleteFn     – POST/eliminar
 */
export default function useCrudFactory(fetchFn, createFn, updateFn, deleteFn) {
    const [items, setItems] = useState([]);
    const [loading, setLoad] = useState(false);
    const [error, setError] = useState(null);

    /** listado */
    const fetchList = useCallback(async () => {
        try {
            setLoad(true);
            const res = await fetchFn();
             const data =
                res?.categorias ??
                res?.subs ??
                res?.tipos ??
                res?.data ?? [];

            setItems(data);
            setError(null);
        } catch (e) {
            setError(e.message ?? 'Error al consultar');
        } finally {
            setLoad(false);
        }
    }, [fetchFn]);

    /** crear / editar / borrar */
    const createItem = async (dto) => { await createFn(dto); await fetchList(); };
    const updateItem = async (dto) => { await updateFn(dto); await fetchList(); };
    const deleteItem = async (id) => { await deleteFn(id); await fetchList(); };

    return { items, loading, error, fetchList, createItem, updateItem, deleteItem };
}
