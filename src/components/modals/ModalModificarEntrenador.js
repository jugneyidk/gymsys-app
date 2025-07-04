// src/components/modals/ModalModificarEntrenador.js
import React, { useEffect, useState } from 'react';
import {
  Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, ButtonText, Text, VStack, HStack,
  Input, InputField, ScrollView,
  Select, SelectTrigger, SelectContent, SelectItem, SelectInput,
  SelectPortal, SelectIcon, Switch, Icon, useToast,
} from '@gluestack-ui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import { obtenerEntrenador, modificarEntrenador } from '../../services/entrenadores';

/* ---------- helpers ---------- */
const fmt = (d) => d.toISOString().split('T')[0];

/* ---------- estado inicial ---------- */
const EMPTY = {
  nombres: '', apellidos: '', cedula: '',
  genero: 'M', fecha_nacimiento: '',
  lugar_nacimiento: '', estado_civil: '',
  telefono: '', correo_electronico: '',
  grado_instruccion: '', password: '',
  cedula_original: '',
};

export default function ModalModificarEntrenador({ visible, onClose, id, onSave }) {
  const toast = useToast();

  const [form,  setForm]  = useState(EMPTY);
  const [pwdOn, setPwdOn] = useState(false);

  /* date-picker */
  const [showDate, setShowDate] = useState(false);
  const [tmpDate,  setTmpDate]  = useState(new Date());

  const h = (k) => (v) => setForm({ ...form, [k]: v });

  /* ---------- cargar datos ---------- */
  useEffect(() => {
    if (!visible || !id) return;

    (async () => {
      try {
        const { entrenador: e } = await obtenerEntrenador(id);
        setForm({
          nombres:            e.nombre,
          apellidos:          e.apellido,
          cedula:             e.cedula,
          genero:             e.genero.startsWith('M') ? 'M' : 'F',
          fecha_nacimiento:   e.fecha_nacimiento,
          lugar_nacimiento:   e.lugar_nacimiento,
          estado_civil:       e.estado_civil,
          telefono:           e.telefono,
          correo_electronico: e.correo_electronico,
          grado_instruccion:  e.grado_instruccion,
          password:           '',
          cedula_original:    id,
        });
        setTmpDate(new Date(e.fecha_nacimiento));
        setPwdOn(false);
      } catch (err) {
        toast.show({ title: err.message, variant: 'solid', action: 'error' });
        onClose();
      }
    })();
  }, [visible, id]);

  /* ---------- guardar ---------- */
  const guardar = async () => {
    try {
      await modificarEntrenador({
        ...form,
        genero: form.genero === 'M' ? 'Masculino' : 'Femenino',
        modificar_contraseña: pwdOn ? 1 : 0,
      });
      toast.show({ title: 'Entrenador modificado', variant: 'solid', action: 'success' });
      onSave?.();
      onClose();
    } catch (e) {
      toast.show({ title: e.message ?? 'Error', variant: 'solid', action: 'error' });
    }
  };

  /* ---------- render ---------- */
  return (
    <Modal isOpen={visible} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader><Text bold>Modificar entrenador</Text></ModalHeader>

        <ModalBody>
          <ScrollView showsVerticalScrollIndicator>
            <VStack space="md">
              {/* cédula / nombres / apellidos */}
              <Input><InputField placeholder="Cédula" value={form.cedula} onChangeText={h('cedula')} /></Input>
              <Input><InputField placeholder="Nombres" value={form.nombres} onChangeText={h('nombres')} /></Input>
              <Input><InputField placeholder="Apellidos" value={form.apellidos} onChangeText={h('apellidos')} /></Input>

              {/* género & estado civil */}
              <HStack space="md">
                <Select flex={1} selectedValue={form.genero} onValueChange={h('genero')}>
                  <SelectTrigger>
                    <SelectInput placeholder="Género" />
                    <SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      <SelectItem label="Masculino" value="M" />
                      <SelectItem label="Femenino"  value="F" />
                    </SelectContent>
                  </SelectPortal>
                </Select>

                <Select flex={1} selectedValue={form.estado_civil} onValueChange={h('estado_civil')}>
                  <SelectTrigger>
                    <SelectInput placeholder="Estado civil" />
                    <SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      {['Soltero','Casado','Divorciado','Viudo'].map((op) => (
                        <SelectItem key={op} label={op} value={op} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </HStack>

              {/* fecha de nacimiento */}
              <Input>
                <Pressable onPress={() => setShowDate(true)}>
                  <InputField
                    editable={false}
                    value={form.fecha_nacimiento}
                    placeholder="Fecha nacimiento YYYY-MM-DD"
                  />
                </Pressable>
              </Input>
              {showDate && (
                <DateTimePicker
                  value={tmpDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(e, d) => {
                    if (Platform.OS !== 'ios') setShowDate(false);
                    if (d) {
                      setTmpDate(d);
                      h('fecha_nacimiento')(fmt(d));
                    }
                  }}
                />
              )}

              {/* lugar de nacimiento */}
              <Input><InputField placeholder="Lugar de nacimiento" value={form.lugar_nacimiento} onChangeText={h('lugar_nacimiento')} /></Input>

              {/* teléfono / correo */}
              <HStack space="md">
                <Input flex={1}><InputField placeholder="Teléfono" value={form.telefono} onChangeText={h('telefono')} /></Input>
                <Input flex={1}><InputField placeholder="Correo electrónico" value={form.correo_electronico} onChangeText={h('correo_electronico')} /></Input>
              </HStack>

              {/* grado de instrucción */}
              <Input><InputField placeholder="Grado de instrucción" value={form.grado_instruccion} onChangeText={h('grado_instruccion')} /></Input>

              {/* cambiar contraseña */}
              <HStack alignItems="center" space="md">
                <Switch value={pwdOn} onValueChange={setPwdOn} />
                <Text>Modificar contraseña</Text>
              </HStack>
              <Input isDisabled={!pwdOn}>
                <InputField
                  placeholder="Contraseña"
                  secureTextEntry
                  value={form.password}
                  onChangeText={h('password')}
                />
              </Input>
            </VStack>
          </ScrollView>
        </ModalBody>

        <ModalFooter>
          <HStack space="sm" justifyContent="flex-end" w="100%">
            <Button variant="outline" onPress={onClose}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button bg="#2563eb" onPress={guardar}>
              <ButtonText color="white">Guardar</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/* ---------- PropTypes ---------- */
ModalModificarEntrenador.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSave: PropTypes.func,
};
