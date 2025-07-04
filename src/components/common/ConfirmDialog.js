import React from 'react';
import { HStack, Button, ButtonText, Text } from '@gluestack-ui/themed';
import ModalShell from './ModalShell';

export default function ConfirmDialog({
  open,
  onClose,
  onAccept,
  title   = 'Confirmar acción',
  message = '¿Estás seguro?'
}) {
  return (
    <ModalShell
      isOpen={open}
      onClose={onClose}
      title={title}
      footer={(
        <HStack space="sm" justifyContent="center" w="100%">
          <Button bg="$red600" onPress={onAccept}>
            <ButtonText color="white">Aceptar</ButtonText>
          </Button>
          <Button variant="outline" onPress={onClose}>
            <ButtonText>Cancelar</ButtonText>
          </Button>
        </HStack>
      )}
    >
      <Text textAlign="center">{message}</Text>
    </ModalShell>
  );
}
