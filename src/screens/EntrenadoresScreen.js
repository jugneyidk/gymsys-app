import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Box, Text, VStack, HStack, Button, ButtonText, ScrollView, Center, Spinner,
  Icon, Pressable, Input, AlertDialog, AlertDialogBackdrop, AlertDialogContent,
  AlertDialogHeader, AlertDialogBody, AlertDialogFooter, AlertDialogCloseButton,
  useToast,
} from '@gluestack-ui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

/* componentes */
import TopNav   from '../components/TopNav';
import SideMenu from '../components/SideMenu';

/* modales */
import ModalRegistrarEntrenador from '../components/modals/ModalRegistrarEntrenador';
import ModalModificarEntrenador from '../components/modals/ModalModificarEntrenador';

/* servicios */
import { obtenerEntrenadores, eliminarEntrenador } from '../services/entrenadores';

export default function EntrenadoresScreen() {
  const navigation = useNavigation();
  const toast      = useToast();

  /* UI */
  const [showSidebar, setSidebar] = useState(false);
  const [modalRegistrar, setReg]  = useState(false);
  const [modificarId, setModId]   = useState(null);

  /* confirmación eliminar */
  const [eliminarId, setDelId]         = useState(null);
  const [confirmOpen, setConfirmOpen]  = useState(false);
  const cancelRef = useRef(null);

  /* datos */
  const [entrenadores, setEnt] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState(null);

  /* búsqueda local */
  const [query, setQuery] = useState('');
  const filtrados = useMemo(() => (
    entrenadores.filter(e =>
      e.nombre.toLowerCase().includes(query.toLowerCase()) ||
      e.cedula.includes(query)
    )
  ), [query, entrenadores]);

  /* cargar */
  const cargar = async () => {
    try {
      setLoading(true);
      const res = await obtenerEntrenadores();
      setEnt(res.entrenadores ?? []);
      setError(null);
    } catch (e) {
      setError(e.message ?? 'Error al cargar entrenadores');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { cargar(); }, []);

  /* eliminar */
  const solicitarEliminar = (id) => { setDelId(id); setConfirmOpen(true); };
  const confirmarEliminar = async () => {
    try {
      await eliminarEntrenador(eliminarId);
      toast.show({ title: 'Entrenador eliminado', placement: 'top', variant: 'solid', action: 'success' });
      setConfirmOpen(false); setDelId(null); cargar();
    } catch (e) {
      toast.show({ title: e.message ?? 'Error al eliminar', placement: 'top', variant: 'solid', action: 'error' });
      setConfirmOpen(false);
    }
  };

  /* tarjeta */
  const CardEntrenador = ({ ent }) => (
    <Box borderWidth={1} borderColor="#e5e7eb" borderRadius="$lg" bg="white" shadow="1" mb="$3" px="$4" py="$3">
      <HStack justifyContent="space-between" alignItems="center">
        <VStack>
          <Text bold>{ent.nombre}</Text>
          <Text color="#6b7280">C.I.: {ent.cedula}</Text>
        </VStack>

        <HStack space="sm">
          <Pressable onPress={() => setModId(ent.cedula_encriptado)}>
            <Icon as={FontAwesome5} name="edit" color="#d97706" size={16} />
          </Pressable>
          <Pressable onPress={() => solicitarEliminar(ent.cedula_encriptado)}>
            <Icon as={FontAwesome5} name="trash-alt" color="#dc2626" size={16} />
          </Pressable>
        </HStack>
      </HStack>
    </Box>
  );

  /* render */
  return (
    <>
      <Box flex={1} bg="#f9fafb">
        <TopNav title="Entrenadores" onMenuPress={() => setSidebar(true)} />

        <ScrollView px="$4" py="$4">
          <Box bg="#1f2937" borderRadius="$lg" px="$4" py="$3" mb="$4" shadow="2">
            <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Text color="white" size="xl" bold>Entrenadores</Text>
              <Button size="sm" bg="#17a2b8" mt="$2" onPress={() => setReg(true)}>
                <ButtonText color="white">Registrar</ButtonText>
              </Button>
            </HStack>
          </Box>

          <Input placeholder="Buscar por nombre o cédula" value={query} onChangeText={setQuery}
                 mb="$4" bg="white" borderColor="#d1d5db" />

          {loading ? (
            <Center mt="$8"><Spinner size="large" /></Center>
          ) : error ? (
            <Center mt="$8"><Text color="$red600">{error}</Text></Center>
          ) : filtrados.length === 0 ? (
            <Center mt="$8"><Text color="#9ca3af">No hay resultados</Text></Center>
          ) : (
            filtrados.map((e) => <CardEntrenador key={e.cedula} ent={e} />)
          )}
        </ScrollView>
      </Box>

      {/* modales */}
      <ModalRegistrarEntrenador visible={modalRegistrar} onClose={() => setReg(false)} onSave={cargar} />
      <ModalModificarEntrenador  visible={!!modificarId}  id={modificarId} onClose={() => setModId(null)} onSave={cargar} />

      {/* confirmación */}
      <AlertDialog isOpen={confirmOpen} leastDestructiveRef={cancelRef} onClose={() => setConfirmOpen(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader><Text size="lg" bold>Eliminar entrenador</Text></AlertDialogHeader>
          <AlertDialogBody><Text>¿Seguro que deseas eliminar este registro?</Text></AlertDialogBody>
          <AlertDialogFooter>
            <HStack space="sm" justifyContent="center" w="100%">
              <Button bg="$red600" onPress={confirmarEliminar}><ButtonText color="white">Sí, eliminar</ButtonText></Button>
              <Button ref={cancelRef} variant="outline" onPress={() => setConfirmOpen(false)}><ButtonText>Cancelar</ButtonText></Button>
            </HStack>
            <AlertDialogCloseButton />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* menú lateral */}
      <SideMenu isOpen={showSidebar} onClose={() => setSidebar(false)} navigation={navigation} />
    </>
  );
}
