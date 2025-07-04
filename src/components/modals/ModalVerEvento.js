import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  ButtonText,
  Spinner,
  Center,
  FlatList,
  Box
} from '@gluestack-ui/themed';
import {
  obtenerCompetencia,
  obtenerAtletasInscritos
} from '../../services/eventos';

export default function ModalVerEvento({ id, visible, onClose }) {
  const [datos, setDatos]     = useState(null);
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        setLoading(true);
        const [comp, insc] = await Promise.all([
          obtenerCompetencia(id),
          obtenerAtletasInscritos(id)
        ]);
        setDatos(comp.competencia);
        setAtletas(insc.atletas ?? []);
        setError(null);
      } catch (e) {
        setError(e.message ?? 'Error al cargar');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, visible]);

  const fila = ({ item, index }) => (
    <HStack py="$2" borderBottomWidth={1} borderColor="#e5e7eb">
      <Box width="8%"><Text>{index + 1}</Text></Box>
      <Box width="40%"><Text>{item.nombre} {item.apellido}</Text></Box>
      <Box width="27%"><Text>{item.id_atleta}</Text></Box>
      <Box width="25%" />
    </HStack>
  );

  return (
    <Modal isOpen={visible} onClose={onClose} size="xl">
      <ModalBackdrop />
      <ModalContent borderRadius="$lg" maxHeight="85%">
        <ModalHeader>
          <Text size="lg" bold>
            Detalles del Evento
          </Text>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <Center py="$6"><Spinner size="large" /></Center>
          ) : error ? (
            <Center py="$6"><Text color="$red600">{error}</Text></Center>
          ) : (
            <>
              <VStack space="xs" mb="$4">
                <Text><Text bold>Nombre:</Text> {datos.nombre}</Text>
                <Text>
                  <Text bold>Fecha:</Text> {datos.fecha_inicio} - {datos.fecha_fin}
                </Text>
                <Text><Text bold>Ubicación:</Text> {datos.lugar_competencia}</Text>
                <Text><Text bold>Estado:</Text> {datos.estado}</Text>
              </VStack>

              <Divider my="$2" />

              <Text size="md" bold mb="$2">
                Atletas Inscritos
              </Text>

              {atletas.length === 0 ? (
                <Text color="#9ca3af">No hay atletas inscritos en esta competencia.</Text>
              ) : (
                <VStack>
                  <HStack
                    py="$2"
                    bg="#f3f4f6"
                    borderBottomWidth={1}
                    borderColor="#e5e7eb"
                  >
                    <Box width="8%"><Text bold>#</Text></Box>
                    <Box width="40%"><Text bold>Nombre</Text></Box>
                    <Box width="27%"><Text bold>Cédula</Text></Box>
                    <Box width="25%" />
                  </HStack>

                  <FlatList
                    data={atletas}
                    renderItem={fila}
                    keyExtractor={(it) => it.id_atleta}
                    maxHeight={260}
                  />
                </VStack>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onPress={onClose} bg="$blue600">
            <ButtonText color="white">Cerrar</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
