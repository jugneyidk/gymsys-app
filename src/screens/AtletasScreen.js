// src/screens/AtletasScreen.js
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Box, Text, VStack, HStack, Button, ButtonText,
  ScrollView, Center, Spinner, Icon, Pressable, Input,
  AlertDialog, AlertDialogBackdrop, AlertDialogContent,
  AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  AlertDialogCloseButton, useToast,
} from '@gluestack-ui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import TopNav   from '../components/TopNav';
import SideMenu from '../components/SideMenu';

import ModalRegistrarAtleta from '../components/modals/ModalRegistrarAtleta';
import ModalModificarAtleta from '../components/modals/ModalModificarAtleta';

import { obtenerAtletas, eliminarAtleta } from '../services/atletas';

export default function AtletasScreen() {
  const navigation = useNavigation();
  const toast      = useToast();

  /* UI */
  const [showSidebar, setShowSidebar] = useState(false);
  const [modalReg, setModalReg] = useState(false);
  const [modId,    setModId]    = useState(null);

  /* confirm eliminar */
  const [delId, setDelId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const cancelRef = useRef(null);

  /* datos */
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error ,  setError ]  = useState(null);

  /* búsqueda */
  const [q, setQ] = useState('');
  const filtrados = useMemo(()=> atletas.filter(a =>
    a.nombre.toLowerCase().includes(q.toLowerCase()) ||
    a.cedula.includes(q)
  ),[q, atletas]);

  /* cargar */
  const cargar = async () => {
    try{
      setLoading(true);
      const res = await obtenerAtletas();
      setAtletas(res.atletas ?? []);
      setError(null);
    }catch(e){
      setError(e.message ?? 'Error');
    }finally{ setLoading(false); }
  };
  useEffect(()=>{ cargar(); },[]);

  /* eliminar */
  const askDel = (id)=>{ setDelId(id); setConfirmDel(true); };
  const doDel = async()=>{
    try{
      await eliminarAtleta(delId);
      toast.show({title:'Atleta eliminado',variant:'solid',action:'success'});
      setConfirmDel(false); setDelId(null); cargar();
    }catch(e){
      toast.show({title:e.message??'Error',variant:'solid',action:'error'});
      setConfirmDel(false);
    }
  };

  /* tarjeta */
  const Card = ({at})=>(
    <Box borderWidth={1} borderColor="#e5e7eb" borderRadius="$lg"
         bg="white" mb="$3" px="$4" py="$3" shadow="1">
      <HStack justifyContent="space-between" alignItems="center">
        <VStack>
          <Text bold>{at.nombre} {at.apellido}</Text>
          <Text color="#6b7280">C.I.: {at.cedula}</Text>
        </VStack>
        <HStack space="sm">
          <Pressable onPress={()=>setModId(at.cedula_encriptado)}>
            <Icon as={FontAwesome5} name="edit" color="#d97706" size={16} />
          </Pressable>
          <Pressable onPress={()=>askDel(at.cedula_encriptado)}>
            <Icon as={FontAwesome5} name="trash-alt" color="#dc2626" size={16} />
          </Pressable>
        </HStack>
      </HStack>
    </Box>
  );

  return (
    <>
      <Box flex={1} bg="#f9fafb">
        <TopNav title="Atletas" onMenuPress={()=>setShowSidebar(true)} />
        <ScrollView px="$4" py="$4">
          {/* encabezado */}
          <Box bg="#1f2937" borderRadius="$lg" px="$4" py="$3" mb="$4" shadow="2">
            <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Text color="white" size="xl" bold>Atletas</Text>
              <Button size="sm" bg="#17a2b8" mt="$2" onPress={()=>setModalReg(true)}>
                <ButtonText color="white">Registrar</ButtonText>
              </Button>
            </HStack>
          </Box>

          {/* buscador */}
          <Input placeholder="Buscar por nombre o cédula"
                 value={q} onChangeText={setQ}
                 mb="$4" bg="white" borderColor="#d1d5db" />

          {/* lista */}
          {loading ? <Center mt="$8"><Spinner size="large" /></Center> :
           error   ? <Center mt="$8"><Text color="$red600">{error}</Text></Center> :
           filtrados.length===0 ?
           <Center mt="$8"><Text color="#9ca3af">No hay resultados</Text></Center> :
           filtrados.map((a)=><Card key={a.id} at={a} />)}
        </ScrollView>
      </Box>

      {/* modales */}
      <ModalRegistrarAtleta
        visible={modalReg}
        onClose={()=>setModalReg(false)}
        onSave={cargar}
      />
      <ModalModificarAtleta
        visible={!!modId}
        id={modId}
        onClose={()=>setModId(null)}
        onSave={cargar}
      />

      {/* confirmación eliminar */}
      <AlertDialog isOpen={confirmDel} leastDestructiveRef={cancelRef} onClose={()=>setConfirmDel(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader><Text size="lg" bold>Eliminar atleta</Text></AlertDialogHeader>
          <AlertDialogBody><Text>¿Seguro que deseas eliminar este registro?</Text></AlertDialogBody>
          <AlertDialogFooter>
            <HStack space="sm" justifyContent="center" w="100%">
              <Button bg="$red600" onPress={doDel}><ButtonText color="white">Sí, eliminar</ButtonText></Button>
              <Button ref={cancelRef} variant="outline" onPress={()=>setConfirmDel(false)}><ButtonText>Cancelar</ButtonText></Button>
            </HStack>
            <AlertDialogCloseButton />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SideMenu isOpen={showSidebar} onClose={()=>setShowSidebar(false)} navigation={navigation}/>
    </>
  );
}
