// src/components/ModalEventosAnteriores.js
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  VStack,
  HStack,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Divider,
  FlatList,
  Spinner,
  Center,
  Box
} from '@gluestack-ui/themed';
import { obtenerEventosAnteriores } from '../../services/eventos';

export default function ModalEventosAnteriores({ visible, onClose }) {
  const [busqueda, setBusqueda] = useState('');
  const [eventos, setEventos]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  /* carga inicial */
  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        setLoading(true);
        const res = await obtenerEventosAnteriores();
        setEventos(res.eventos ?? []);
        setFiltered(res.eventos ?? []);
      } catch (e) {
        setError(e.message ?? 'Error al cargar eventos');
      } finally {
        setLoading(false);
      }
    })();
  }, [visible]);

  useEffect(() => {
    const txt = busqueda.toLowerCase();
    setFiltered(
      eventos.filter((ev) => ev.nombre.toLowerCase().includes(txt))
    );
  }, [busqueda, eventos]);

  const renderItem = ({ item, index }) => (
    <HStack
      py="$2"
      borderBottomWidth={1}
      borderColor="#e5e7eb"
      alignItems="center"
    >
      <Box width="5%">
        <Text>{index + 1}</Text>
      </Box>
      <Box width="30%">
        <Text>{item.nombre}</Text>
      </Box>
      <Box width="20%">
        <Text>{item.fecha_inicio}</Text>
      </Box>
      <Box width="20%">
        <Text>{item.fecha_fin}</Text>
      </Box>
      <Box width="15%">
        <Text>{item.lugar_competencia}</Text>
      </Box>
      <Box width="10%" alignItems="flex-end">
        <Button size="xs" variant="outline">
          <ButtonText>Consultar</ButtonText>
        </Button>
      </Box>
    </HStack>
  );

  return (
    <Modal isOpen={visible} onClose={onClose} size="xl">
      <ModalBackdrop />
      <ModalContent borderRadius="$lg" maxHeight="85%">
        <ModalHeader>
          <Text fontSize="$lg" fontWeight="bold">
            Consulta eventos anteriores
          </Text>
        </ModalHeader>

        <ModalBody>
          {/* buscador */}
          <HStack mb="$3" justifyContent="flex-end">
            <Input width="50%">
              <InputField
                placeholder="Buscar…"
                value={busqueda}
                onChangeText={setBusqueda}
              />
            </Input>
          </HStack>

          {/* tabla */}
          {loading ? (
            <Center py="$6">
              <Spinner size="large" />
            </Center>
          ) : error ? (
            <Center py="$6">
              <Text color="red.600">{error}</Text>
            </Center>
          ) : filtered.length === 0 ? (
            <Center py="$6">
              <Text color="#9ca3af">Sin resultados</Text>
            </Center>
          ) : (
            <VStack>
              {/* encabezados */}
              <HStack
                py="$2"
                bg="#f3f4f6"
                borderBottomWidth={1}
                borderColor="#e5e7eb"
              >
                <Box width="5%">
                  <Text bold>#</Text>
                </Box>
                <Box width="30%">
                  <Text bold>Nombre</Text>
                </Box>
                <Box width="20%">
                  <Text bold>Fecha Inicio</Text>
                </Box>
                <Box width="20%">
                  <Text bold>Fecha Final</Text>
                </Box>
                <Box width="15%">
                  <Text bold>Ubicación</Text>
                </Box>
                <Box width="10%" />
              </HStack>

              <FlatList
                data={filtered}
                renderItem={renderItem}
                keyExtractor={(item) => item.id_competencia}
                maxHeight={350}
              />
            </VStack>
          )}
        </ModalBody>

        <Divider />

        <ModalFooter>
          <Button onPress={onClose} bg="$blue600">
            <ButtonText color="white">Cerrar</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
