import React, { useEffect } from 'react';
import ModalShell   from './common/ModalShell';
import SubForm      from './payloads/SubForm';
import SubTable     from './payloads/SubTable';
import useSubCrud   from '../hooks/useSubCrud';

export default function SubModal({ open, onClose, onCatalogoCambia }) {
  const crud = useSubCrud();

  /* carga inicial y refresh cuando se abra */
  useEffect(() => { if (open) crud.fetchList(); }, [open]);

  /* notificar al modal padre si cambió el catálogo */
  useEffect(() => { if (open) onCatalogoCambia?.(); }, [crud.items]);

  return (
    <ModalShell
      title="Registrar Subs"
      open={open}
      onClose={onClose}
      crud={crud}
      FormComponent={SubForm}
      TableComponent={SubTable}
    />
  );
}
