// src/components/ModalRegistrarEvento.js
import React, { useState } from 'react';
import {
  Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, ButtonText, Input, InputField, VStack, HStack, Text,
  Select, SelectTrigger, SelectInput, SelectIcon,
  SelectPortal, SelectContent, SelectItem, Divider, Icon
} from '@gluestack-ui/themed';
import { Platform, Pressable, Alert } from 'react-native';
import DateTimePicker                 from '@react-native-community/datetimepicker';
import { FontAwesome5 }               from '@expo/vector-icons';

import useCatalogosEventos            from '../../hooks/useCatalogosEventos';
import { apiRequest }                 from '../../services/Api';

import CategoriaModal from '../CategoriaModal';
import SubModal       from '../SubModal';


export default function ModalRegistrarEvento({ visible, onClose, onSave }) {
  /* ─────────────────────────── estados internos ─────────────────────────── */
  const [nombre, setNombre]     = useState('');
  const [lugar,  setLugar]      = useState('');

  const [fecIni, setFecIni]     = useState(new Date());
  const [fecFin, setFecFin]     = useState(new Date());
  const [showIni, setShowIni]   = useState(false);
  const [showFin, setShowFin]   = useState(false);

  const [showCat, setShowCat]   = useState(false);   // sub-modal categorías
  const [showSub, setShowSub]   = useState(false);   // sub-modal subs

  /* ─────────────────────────── catálogos ─────────────────────────── */
  const {
    categorias, subs, tipos,
    loading: catLoad, error: catErr, recargar   // recargar ⇒ refetch
  } = useCatalogosEventos();

  const [catSel,  setCatSel]  = useState('');
  const [subSel,  setSubSel]  = useState('');
  const [tipoSel, setTipoSel] = useState('');

  /* ─────────────────────────── helpers ─────────────────────────── */
  const fmt = (d) => d.toISOString().split('T')[0];

  const limpiar = () => {
    setNombre(''); setLugar('');
    setCatSel(''); setSubSel(''); setTipoSel('');
  };

  const registrar = async () => {
    try {
      await apiRequest('?p=eventos&accion=incluirEvento', 'POST', {
        nombre,
        lugar_competencia: lugar,
        fecha_inicio:      fmt(fecIni),
        fecha_fin:         fmt(fecFin),
        categoria:         catSel,
        subs:              subSel,
        tipo_competencia:  tipoSel
      });
      Alert.alert('Éxito', 'Evento registrado');
      onSave && onSave();
      limpiar();
      onClose();
    } catch (e) {
      Alert.alert('Error', e.message ?? 'No se pudo registrar');
    }
  };

  /* ─────────────────────────── render ─────────────────────────── */
  return (
    <>
      {/* ============ Modal Registro de Evento ============ */}
      <Modal isOpen={visible} onClose={onClose} size="lg">
        <ModalBackdrop />
        <ModalContent borderRadius="$lg">
          <ModalHeader>
            <Text size="lg" bold>Registrar Evento</Text>
          </ModalHeader>

          <ModalBody>
            <VStack space="lg">
              {/* nombre & ubicación */}
              <HStack space="md" flexWrap="wrap">
                <Input flex={1}>
                  <InputField
                    placeholder="Nombre del Evento"
                    value={nombre}
                    onChangeText={setNombre}
                  />
                </Input>

                <Input flex={1}>
                  <InputField
                    placeholder="Ubicación"
                    value={lugar}
                    onChangeText={setLugar}
                  />
                </Input>
              </HStack>

              {/* fechas */}
              <HStack space="md" flexWrap="wrap">
                <Input flex={1}>
                  <Pressable onPress={() => setShowIni(true)}>
                    <InputField editable={false} value={fmt(fecIni)} />
                  </Pressable>
                </Input>
                {showIni && (
                  <DateTimePicker
                    value={fecIni}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, d) => { setShowIni(false); if (d) setFecIni(d); }}
                  />
                )}

                <Input flex={1}>
                  <Pressable onPress={() => setShowFin(true)}>
                    <InputField editable={false} value={fmt(fecFin)} />
                  </Pressable>
                </Input>
                {showFin && (
                  <DateTimePicker
                    value={fecFin}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, d) => { setShowFin(false); if (d) setFecFin(d); }}
                  />
                )}
              </HStack>

              {/* selects */}
              <HStack space="md" flexWrap="wrap">
                {/* categoría */}
                <Select flex={1} isDisabled={catLoad||!!catErr} selectedValue={catSel} onValueChange={setCatSel}>
                  <SelectTrigger>
                    <SelectInput placeholder="Categoría" />
                    <SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      {categorias.map(c=>(
                        <SelectItem key={c.id_categoria} label={c.nombre} value={c.id_categoria} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>

                {/* subs */}
                <Select flex={1} isDisabled={catLoad||!!catErr} selectedValue={subSel} onValueChange={setSubSel}>
                  <SelectTrigger>
                    <SelectInput placeholder="Subs" />
                    <SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      {subs.map(s=>(
                        <SelectItem key={s.id_sub} label={s.nombre} value={s.id_sub} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>

                {/* tipo */}
                <Select flex={1} isDisabled={catLoad||!!catErr} selectedValue={tipoSel} onValueChange={setTipoSel}>
                  <SelectTrigger>
                    <SelectInput placeholder="Tipo" />
                    <SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      {tipos.map(t=>(
                        <SelectItem key={t.id_tipo_competencia} label={t.nombre} value={t.id_tipo_competencia} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </HStack>

              {/* enlaces rápidos */}
             {/* enlaces rápidos */}
<HStack justifyContent="space-between" px="$2">
  <Text
    size="xs"
    color="$blue600"
    underline
    onPress={() => setShowCat(true)}
  >
    Registrar Categoría
  </Text>

  <Text
    size="xs"
    color="$blue600"
    underline
    onPress={() => setShowSub(true)}
  >
    Registrar Subs
  </Text>

  {/* El modal de Tipo aún no está hecho */}
  <Text size="xs" color="$blue600" underline>
    Registrar Tipo
  </Text>
</HStack>

            </VStack>
          </ModalBody>

          <Divider />

          <ModalFooter>
            <HStack space="sm" justifyContent="flex-end" w="100%">
              <Button
                bg="$blue600"
                isDisabled={
                  !nombre.trim() || !lugar.trim() || !catSel || !subSel || !tipoSel
                }
                onPress={registrar}
              >
                <ButtonText color="white">Registrar</ButtonText>
              </Button>

              <Button bg="$amber400" onPress={limpiar}>
                <ButtonText>Limpiar</ButtonText>
              </Button>

              <Button variant="outline" onPress={onClose}>
                <ButtonText>Cancelar</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ========= Sub-modales reutilizables ========= */}
      <CategoriaModal
        open={showCat}
        onClose={() => setShowCat(false)}
        onCatalogoCambia={recargar}
      />

      <SubModal
        open={showSub}
        onClose={() => setShowSub(false)}
        onCatalogoCambia={recargar}
      />
    </>
  );
}
