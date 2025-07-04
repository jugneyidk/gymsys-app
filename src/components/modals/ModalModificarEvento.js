// src/components/ModalModificarEvento.js
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
  Input,
  InputField,
  Text,
  Button,
  ButtonText,
  Divider,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  Icon,
  SelectPortal,
  SelectContent,
  SelectItem
} from '@gluestack-ui/themed';
import { Platform, Pressable, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';

import { obtenerCompetencia, modificarEvento } from '../../services/eventos';
import useCatalogosEventos from '../../hooks/useCatalogosEventos';

export default function ModalModificarEvento({ idCompetencia, visible, onClose, onSave }) {
  /* estados de formulario */
  const [nombre,  setNombre]  = useState('');
  const [lugar,   setLugar]   = useState('');
  const [fecIni,  setFecIni]  = useState(new Date());
  const [fecFin,  setFecFin]  = useState(new Date());
  const [cat,     setCat]     = useState('');
  const [sub,     setSub]     = useState('');
  const [tipo,    setTipo]    = useState('');

  const [showIni, setShowIni] = useState(false);
  const [showFin, setShowFin] = useState(false);

  /* catálogos */
  const { categorias, subs, tipos } = useCatalogosEventos();

  /* al abrir => obtener datos */
  useEffect(() => {
    if (!visible || !idCompetencia) return;

    (async () => {
      try {
        const res  = await obtenerCompetencia(idCompetencia);
        const cmp  = res.competencia;
        setNombre(cmp.nombre);
        setLugar(cmp.lugar_competencia);
        setFecIni(new Date(cmp.fecha_inicio));
        setFecFin(new Date(cmp.fecha_fin));
        setCat(cmp.categoria);
        setSub(cmp.subs);
        setTipo(cmp.tipo_competicion);
      } catch (e) {
        Alert.alert('Error', e.message);
        onClose();
      }
    })();
  }, [visible, idCompetencia]);

  const fmt = (d) => d.toISOString().split('T')[0];

  const handleModificar = async () => {
    try {
      await modificarEvento({
        id_competencia: idCompetencia,
        nombre,
        lugar_competencia: lugar,
        fecha_inicio: fmt(fecIni),
        fecha_fin: fmt(fecFin),
        categoria: cat,
        subs: sub,
        tipo_competencia: tipo
      });
      Alert.alert('Éxito', 'Competencia modificada');
      onSave && onSave();
      onClose();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  /* UI */
  return (
    <Modal isOpen={visible} onClose={onClose} size="xl">
      <ModalBackdrop />
      <ModalContent borderRadius="$lg">
        <ModalHeader>
          <Text fontSize="$lg" fontWeight="bold">
            Modificar Competencia
          </Text>
        </ModalHeader>

        <ModalBody>
          <VStack space="lg">
            {/* nombre + lugar */}
            <Input>
              <InputField value={nombre}  onChangeText={setNombre} placeholder="Nombre del Evento" />
            </Input>
            <Input>
              <InputField value={lugar}   onChangeText={setLugar}  placeholder="Ubicación" />
            </Input>

            {/* fechas */}
            <HStack space="md">
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
                  onChange={(e, d) => {
                    setShowIni(false);
                    if (d) setFecIni(d);
                  }}
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
                  onChange={(e, d) => {
                    setShowFin(false);
                    if (d) setFecFin(d);
                  }}
                />
              )}
            </HStack>

            {/* selects */}
            <HStack space="md" flexWrap="wrap">
              {/* cat */}
              <Select flex={1} selectedValue={cat} onValueChange={setCat}>
                <SelectTrigger>
                  <SelectInput placeholder="Categoría" />
                  <SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent>
                    {categorias.map((c) => (
                      <SelectItem key={c.id_categoria} label={c.nombre} value={c.id_categoria} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>

              {/* sub */}
              <Select flex={1} selectedValue={sub} onValueChange={setSub}>
                <SelectTrigger>
                  <SelectInput placeholder="Subs" />
                  <SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent>
                    {subs.map((s) => (
                      <SelectItem key={s.id_sub} label={s.nombre} value={s.id_sub} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>

              {/* tipo */}
              <Select flex={1} selectedValue={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectInput placeholder="Tipo" />
                  <SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent>
                    {tipos.map((t) => (
                      <SelectItem key={t.id_tipo_competencia} label={t.nombre} value={t.id_tipo_competencia} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </HStack>
          </VStack>
        </ModalBody>

        <Divider />

        <ModalFooter>
          <HStack space="sm">
            <Button bg="$blue600" onPress={handleModificar}>
              <ButtonText color="white">Modificar</ButtonText>
            </Button>
            <Button variant="outline" onPress={onClose}>
              <ButtonText>Cerrar</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
