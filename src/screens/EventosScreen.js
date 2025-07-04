// src/screens/EventosScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  ButtonText,
  ScrollView,
  Center,
  Spinner,
  Icon,
  Pressable,
  useToast,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
} from '@gluestack-ui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import TopNav from '../components/TopNav';
import SideMenu from '../components/SideMenu';

import ModalRegistrarEvento from '../components/modals/ModalRegistrarEvento';
import ModalEventosAnteriores from '../components/modals/ModalEventosAnteriores';
import ModalModificarEvento from '../components/modals/ModalModificarEvento';
import ModalVerEvento from '../components/modals/ModalVerEvento';
import ModalConfirmarCerrar from '../components/modals/ModalConfirmarCerrar';
import ModalInscribirEvento from '../components/modals/ModalInscribirEvento';
import SubModal from '../components/SubModal'; 

import {
  obtenerEventosActivos,
  eliminarEvento,
  cerrarEvento,
} from '../services/eventos';

export default function EventosScreen() {
  const navigation = useNavigation();
  const toast = useToast();

  const [showSidebar, setShowSidebar] = useState(false);

  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalAnt, setModalAnt]             = useState(false);
  const [modificarId, setModificarId]       = useState(null);
  const [verId, setVerId]                   = useState(null);
  const [inscribirId, setInscribirId]       = useState(null);
  const [showSub, setShowSub]               = useState(false);     // ⬅️ NUEVO
  const [confirmEliminarOpen, setConfirmEliminarOpen] = useState(false);
  const [confirmCerrarOpen,  setConfirmCerrarOpen]    = useState(false);
  const [eliminarId, setEliminarId] = useState(null);
  const [cerrarId,   setCerrarId]   = useState(null);
  const cancelRef = useRef(null);

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await obtenerEventosActivos();
      setEventos(res.eventos ?? []);
      setError(null);
    } catch (e) {
      setError(e.message ?? 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { cargar(); }, []);

  const solicitarEliminacion = (id) => {
    setEliminarId(id);
    setConfirmEliminarOpen(true);
  };

  const confirmarEliminacion = async () => {
    try {
      await eliminarEvento(eliminarId);
      toast.show({ placement: 'top', title: 'Evento eliminado', variant: 'solid', action: 'success' });
      setConfirmEliminarOpen(false);
      setEliminarId(null);
      cargar();
    } catch (e) {
      toast.show({ placement: 'top', title: e.message ?? 'Error al eliminar', variant: 'solid', action: 'error' });
      setConfirmEliminarOpen(false);
    }
  };

  const solicitarCierre = (id) => {
    setCerrarId(id);
    setConfirmCerrarOpen(true);
  };

  const aceptarCerrar = async () => {
    try {
      await cerrarEvento(cerrarId);
      toast.show({ placement: 'top', title: 'Evento cerrado', variant: 'solid', action: 'success' });
      setConfirmCerrarOpen(false);
      setCerrarId(null);
      cargar();
    } catch (e) {
      toast.show({ placement: 'top', title: e.message ?? 'Error al cerrar', variant: 'solid', action: 'error' });
      setConfirmCerrarOpen(false);
    }
  };

  const TarjetaEvento = ({ ev }) => (
    <Box
      borderWidth={1}
      borderColor="#e5e7eb"
      borderRadius="$lg"
      overflow="hidden"
      mb="$4"
      bg="white"
      shadow="1"
    >
      <HStack bg="#2563eb" px="$3" py="$2" justifyContent="space-between" alignItems="center">
        <Text color="white" bold>{ev.nombre}</Text>

        <Pressable onPress={() => solicitarEliminacion(ev.id_competencia)}>
          <Icon as={FontAwesome5} name="trash-alt" color="white" size={14} />
        </Pressable>
      </HStack>

      <VStack px="$4" py="$3" space="xs">
        <Text bold>{ev.nombre}</Text>
        <Text>Fecha: {ev.fecha_inicio} – {ev.fecha_fin}</Text>
        <Text>Cupos Disponibles: {ev.cupos_disponibles ?? '—'}</Text>
        <Text>Participantes: {ev.participantes ?? 0}</Text>
      </VStack>

      <HStack borderTopWidth={1} borderColor="#e5e7eb" px="$2" py="$2" space="sm">
        <Button size="xs" variant="outline" onPress={() => setVerId(ev.id_competencia)}>
          <ButtonText>Ver</ButtonText>
        </Button>

        <Button size="xs" variant="outline" onPress={() => setInscribirId(ev.id_competencia)}>
          <ButtonText>Inscribir</ButtonText>
        </Button>

        <Button size="xs" variant="outline" onPress={() => setModificarId(ev.id_competencia)}>
          <ButtonText>Modificar</ButtonText>
        </Button>

        <Button size="xs" bg="$red600" onPress={() => solicitarCierre(ev.id_competencia)}>
          <ButtonText color="white">Cerrar</ButtonText>
        </Button>
      </HStack>
    </Box>
  );

  return (
    <>
      <Box flex={1} bg="#f9fafb">
        <TopNav title="Eventos" onMenuPress={() => setShowSidebar(true)} />

        <ScrollView px="$4" py="$4">
          <Box bg="#1f2937" borderRadius="$lg" px="$4" py="$3" mb="$4" shadow="2">
            <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Text color="white" size="xl" bold>Eventos</Text>

              <HStack space="sm" mt="$2">
                <Button size="sm" bg="#17a2b8" onPress={() => setModalRegistrar(true)}>
                  <ButtonText color="white">Registrar</ButtonText>
                </Button>

                <Button size="sm" variant="outline" borderColor="white" onPress={() => setModalAnt(true)}>
                  <ButtonText color="white">Consultar</ButtonText>
                </Button>
              </HStack>
            </HStack>
          </Box>

          <VStack space="lg" mt="$3">
            <Text size="md" color="#1f2937" bold>Eventos activos</Text>

            {loading ? (
              <Center mt="$8"><Spinner size="large" /></Center>
            ) : error ? (
              <Center mt="$8"><Text color="$red600">{error}</Text></Center>
            ) : eventos.length === 0 ? (
              <Center mt="$8"><Text color="#9ca3af">No hay eventos activos</Text></Center>
            ) : (
              eventos.map((ev) => <TarjetaEvento key={ev.id_competencia} ev={ev} />)
            )}
          </VStack>
        </ScrollView>
      </Box>

      <ModalRegistrarEvento
        visible={modalRegistrar}
        onClose={() => setModalRegistrar(false)}
        onSave={cargar}
        openSub={() => setShowSub(true)}         
      />

      <ModalModificarEvento
        visible={!!modificarId}
        idCompetencia={modificarId}
        onClose={() => setModificarId(null)}
        onSave={cargar}
      />

      <ModalEventosAnteriores
        visible={modalAnt}
        onClose={() => setModalAnt(false)}
      />

      <ModalVerEvento
        visible={!!verId}
        id={verId}
        onClose={() => setVerId(null)}
      />

      <ModalInscribirEvento
        visible={!!inscribirId}
        idCompetencia={inscribirId}
        onClose={() => setInscribirId(null)}
        onSave={cargar}
      />

      <AlertDialog
        isOpen={confirmEliminarOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setConfirmEliminarOpen(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader><Text size="lg" bold>Confirmar eliminación</Text></AlertDialogHeader>
          <AlertDialogBody><Text>¿Estás seguro de que deseas eliminar este evento?</Text></AlertDialogBody>
          <AlertDialogFooter>
            <HStack space="sm" justifyContent="center" w="100%">
              <Button bg="$red600" onPress={confirmarEliminacion}>
                <ButtonText color="white">Sí, eliminar</ButtonText>
              </Button>
              <Button ref={cancelRef} variant="outline" onPress={() => setConfirmEliminarOpen(false)}>
                <ButtonText>Cancelar</ButtonText>
              </Button>
            </HStack>
            <AlertDialogCloseButton />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ModalConfirmarCerrar
        open={confirmCerrarOpen}
        leastRef={cancelRef}
        onCancel={() => setConfirmCerrarOpen(false)}
        onAccept={aceptarCerrar}
      />

      <SubModal
        open={showSub}
        onClose={() => setShowSub(false)}
        onCatalogoCambia={cargar}
      />

      <SideMenu
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        navigation={navigation}
      />
    </>
  );
}
