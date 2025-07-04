import React from 'react';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  ButtonText,
  HStack,
  Text
} from '@gluestack-ui/themed';

export default function ModalConfirmarCerrar({
  open,
  leastRef,
  onCancel,
  onAccept
}) {
  return (
    <AlertDialog isOpen={open} leastDestructiveRef={leastRef} onClose={onCancel}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Text size="lg" bold>Confirmar cierre</Text>
        </AlertDialogHeader>

        <AlertDialogBody>
          <Text textAlign="center">
            ¿Estás seguro de que deseas cerrar este evento?
          </Text>
        </AlertDialogBody>

        <AlertDialogFooter>
          <HStack space="sm" justifyContent="center" w="100%">
            <Button bg="$red600" onPress={onAccept}>
              <ButtonText color="white">Sí, cerrar</ButtonText>
            </Button>
            <Button ref={leastRef} variant="outline" onPress={onCancel}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
          </HStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
