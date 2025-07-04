// src/components/ModalShell.js
import React, { useState } from 'react';
import {
    Modal, ModalBackdrop, ModalContent, ModalHeader,
    ModalBody, ModalFooter, Divider, HStack, Button, ButtonText, Text,
} from '@gluestack-ui/themed';

export default function ModalShell({
    title,
    open,
    onClose,
    crud,                   
    FormComponent,           
    TableComponent,         
}) {
    const [showTable, setShowTable] = useState(false);
  const [editando,  setEditando]  = useState(null); 
    return (
        <Modal isOpen={open} onClose={onClose} size="xl">
            <ModalBackdrop />
            <ModalContent borderRadius="$lg" maxHeight="90%">
                <ModalHeader><Text size="lg" bold>{title}</Text></ModalHeader>

                <ModalBody>
                    {showTable ? (
               <TableComponent
                 {...crud}
                 onEdit={(item) => { setEditando(item); setShowTable(false); }}
               />
             )
           : (
               <FormComponent
                 {...crud}
                 editando={editando}
                 onSuccess={() => { setEditando(null); setShowTable(true); }}
               />
             )}
                </ModalBody>

                <Divider />

                <ModalFooter>
                    <HStack space="sm">
                        {!showTable && (
                            <Button
                                bg="$blue600"
                            >
                                <ButtonText color="white">Registrar</ButtonText>
                            </Button>
                        )}

                        <Button
                            bg="$teal600"
                            onPress={() => {
                                if (!showTable) crud.fetchList();
                                setShowTable(!showTable);
                            }}
                        >
                            <ButtonText>{showTable ? 'Regresar' : 'Consultar'}</ButtonText>
                        </Button>

                        <Button variant="outline" onPress={onClose}>
                            <ButtonText>Salir</ButtonText>
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
