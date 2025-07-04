// src/components/payloads/SubForm.js
import React, { useState } from 'react';
import {
  VStack, HStack, Input, InputField,
} from '@gluestack-ui/themed';

export default function SubForm({ createItem, updateItem, editando, onSuccess }) {
  /* ───── estados controlados ───── */
  const [nombre, setNombre] = useState(editando?.nombre ?? '');
  const [min,    setMin]    = useState(
    editando?.edad_minima?.toString() ?? ''
  );
  const [max,    setMax]    = useState(
    editando?.edad_maxima?.toString() ?? ''
  );

  /* ───── submit genérico ───── */
  const submit = async () => {
    // 👉 normalizamos a camelCase y convertimos a número
    const dto = {
      nombre:     nombre.trim(),
      edadMinima: parseInt(min,  10),
      edadMaxima: parseInt(max,  10),
    };

    if (editando) {
      await updateItem({ ...dto, id_sub: editando.id_sub });
    } else {
      await createItem(dto);
    }

    onSuccess();        // avisa al ModalShell para regresar a la tabla
  };

  /* el ModalShell “lee” estas props estáticas */
  SubForm.handleSubmit = submit;
  SubForm.canSubmit    = () =>
    nombre.trim() !== '' && min.trim() !== '' && max.trim() !== '';

  /* ───── UI ───── */
  return (
    <VStack space="md">
      <Input>
        <InputField
          placeholder="Nombre del Sub"
          value={nombre}
          onChangeText={setNombre}
        />
      </Input>

      <HStack space="md">
        <Input flex={1}>
          <InputField
            placeholder="Edad mínima"
            keyboardType="number-pad"
            value={min}
            onChangeText={setMin}
          />
        </Input>

        <Input flex={1}>
          <InputField
            placeholder="Edad máxima"
            keyboardType="number-pad"
            value={max}
            onChangeText={setMax}
          />
        </Input>
      </HStack>
    </VStack>
  );
}
