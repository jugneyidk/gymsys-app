import React, { useEffect } from 'react';
import ModalShell   from './common/ModalShell';
import CategoriaForm  from './payloads/CategoriaForm';
import CategoriaTable from './payloads/CategoriaTable';
import useCategoriaCrud from '../hooks/useCategoriaCrud';

export default function CategoriaModal({ open, onClose, onCatalogoCambia }) {
  const crud = useCategoriaCrud();

  /* auto-carga */
  useEffect(() => { if (open) crud.fetchList(); }, [open]);

  /* si cambiamos el catálogo avisamos al modal de evento */
  useEffect(() => {
    if (!open) return;
    onCatalogoCambia?.();
  }, [crud.items]);

  return (
    <ModalShell
      title="Registrar Categoría"
      open={open}
      onClose={onClose}
      crud={crud}
      FormComponent={CategoriaForm}
      TableComponent={CategoriaTable}
    />
  );
}
