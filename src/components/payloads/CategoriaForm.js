// src/components/payloads/CategoriaForm.js
import React, { useState } from 'react';
import {
  VStack, HStack, Input, InputField,
} from '@gluestack-ui/themed';

/**
 * Formulario de alta / edición de Categorías.
 * Recibe las funciones del hook CRUD como props.
 */
export default function CategoriaForm({ createItem, updateItem, editando, onSuccess, setSubmit, setCanSubmit}) {
  const [nombre, setNombre]   = useState(editando?.nombre ?? '');
  const [min, setMin]         = useState(editando?.peso_minimo ?? '');
  const [max, setMax]         = useState(editando?.peso_maximo ?? '');

  const submit = async () => {
  const dto = {
    nombre:      nombre.trim(),
    pesoMinimo:  parseFloat(min.replace(',', '.')),
    pesoMaximo:  parseFloat(max.replace(',', '.')),
  };

if (editando) {
   await updateItem({ ...dto, id_categoria: editando.id_categoria });
 } else {
   await createItem(dto);
 }
    onSuccess();            // avisa al ModalShell para cambiar de vista
  };

  /* ModalShell busca la firma estática */
 React.useEffect(() => {
   if (setSubmit)      setSubmit(() => submit);
   if (setCanSubmit)   setCanSubmit(!!(nombre.trim() && min && max));
 }, [nombre, min, max]);
  return (
    <VStack space="md">
      <Input><InputField placeholder="Nombre" value={nombre} onChangeText={setNombre} /></Input>
      <HStack space="md">
        <Input flex={1}><InputField placeholder="Peso mínimo" keyboardType="decimal-pad" value={min} onChangeText={setMin} /></Input>
        <Input flex={1}><InputField placeholder="Peso máximo" keyboardType="decimal-pad" value={max} onChangeText={setMax} /></Input>
      </HStack>
    </VStack>
  );
}
