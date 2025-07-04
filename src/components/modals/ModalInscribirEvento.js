import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
  Text,
  Button,
  ButtonText,
  Spinner,
  Center,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  FlatList,
  Box,
  ScrollView
} from '@gluestack-ui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import {
  obtenerCompetencia,
  obtenerAtletasDisponibles,
  inscribirAtletas
} from '../../services/eventos';

export default function ModalInscribirEvento({
  idCompetencia,
  visible,
  onClose,
  onSave
}) {
  const [evento, setEvento]   = useState(null);
  const [atletas, setAtletas] = useState([]);
  const [sel, setSel]         = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  /* cargar al abrir */
  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        setLoading(true);
        const [cmp, disp] = await Promise.all([
          obtenerCompetencia(idCompetencia),
          obtenerAtletasDisponibles(idCompetencia)
        ]);
        setEvento(cmp.competencia);
        setAtletas(disp.atletas ?? []);
        setSel({});
        setError(null);
      } catch (e) {
        setError(e.message ?? 'Error al cargar');
      } finally {
        setLoading(false);
      }
    })();
  }, [visible, idCompetencia]);

  const toggle = (id) => setSel((p) => ({ ...p, [id]: !p[id] }));
  const marcados = Object.keys(sel).filter((k) => sel[k]);

  const inscribir = async () => {
    if (marcados.length === 0) return;
    try {
      setSaving(true);
      await inscribirAtletas(idCompetencia, marcados);
      onSave && onSave();
      onClose();
    } catch (e) {
      alert(e.message ?? 'Error al inscribir');
    } finally {
      setSaving(false);
    }
  };

  /* fila atleta */
  const Row = ({ item, index }) => (
    <HStack
      py="$1"
      borderBottomWidth={1}
      borderColor="#e5e7eb"
      alignItems="center"
    >
      <Box w={45}><Text>{index + 1}</Text></Box>
      <Box w={150}><Text fontSize={12}>{item.nombre} {item.apellido}</Text></Box>
      <Box w={90}><Text fontSize={12}>{item.id_atleta}</Text></Box>
      <Box w={65}><Text fontSize={12}>{item.peso}</Text></Box>
      <Box w={55}><Text fontSize={12}>{/* edad aquí si tu API lo envía */}</Text></Box>
      <Box w={55}>
        <Checkbox
          isChecked={!!sel[item.id_atleta]}
          onChange={() => toggle(item.id_atleta)}
        >
          <CheckboxIndicator mr="$1" size="sm">
            <CheckboxIcon as={FontAwesome5} name="check" />
          </CheckboxIndicator>
        </Checkbox>
      </Box>
    </HStack>
  );

  return (
    <Modal isOpen={visible} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent borderRadius="$lg" maxWidth={640}>
        <ModalHeader>
          <Text size="lg" bold>Inscribir Participante</Text>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <Center py="$6"><Spinner size="large" /></Center>
          ) : error ? (
            <Center py="$6"><Text color="$red600">{error}</Text></Center>
          ) : (
            <>
              {/* datos del evento */}
              <HStack flexWrap="wrap" mb="$4">
                <Box w="50%"><Text><Text bold>Nombre del Evento:</Text> {evento.nombre}</Text></Box>
                <Box w="50%"><Text><Text bold>Ubicación:</Text> {evento.lugar_competencia}</Text></Box>
                <Box w="50%"><Text><Text bold>Fecha de Inicio:</Text> {evento.fecha_inicio}</Text></Box>
                <Box w="50%"><Text><Text bold>Fecha de Clausura:</Text> {evento.fecha_fin}</Text></Box>
              </HStack>

              {/* tabla en scroll horizontal */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Box minWidth={460}>
                  {/* cabecera */}
                  <HStack bg="#2563eb" py="$2">
                    {['#','Nombre','Cédula','Peso','Edad','Sel.'].map((h,i)=>(
                      <Box
                        key={h}
                        w={[45,150,90,65,55,55][i]}
                        px="$1"
                      >
                        <Text color="white" bold fontSize={12}>{h}</Text>
                      </Box>
                    ))}
                  </HStack>

                  {atletas.length === 0 ? (
                    <Text py="$4">No se encontraron atletas que cumplan con los requisitos.</Text>
                  ) : (
                    <FlatList
                      data={atletas}
                      renderItem={Row}
                      keyExtractor={(it) => it.id_atleta}
                      maxHeight={260}
                    />
                  )}
                </Box>
              </ScrollView>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <HStack space="sm">
            <Button
              bg="$blue600"
              isDisabled={marcados.length === 0 || saving}
              onPress={inscribir}
            >
              <ButtonText color="white">Inscribir</ButtonText>
            </Button>
            <Button variant="outline" onPress={onClose} isDisabled={saving}>
              <ButtonText>Cerrar</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
