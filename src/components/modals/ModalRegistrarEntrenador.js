// src/components/modals/ModalRegistrarEntrenador.js
import React, { useEffect, useState } from 'react';
import {
  Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, ButtonText, Text, VStack, HStack,
  Input, InputField, ScrollView,
  Select, SelectTrigger, SelectContent, SelectItem, SelectInput,
  SelectPortal, SelectIcon, Icon, useToast,
} from '@gluestack-ui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import PropTypes from 'prop-types';

import { registrarEntrenador, obtenerGrados } from '../../services/entrenadores';

/* ---------- helpers ---------- */
const fmt = (d) => d.toISOString().split('T')[0];

/* ---------- estado inicial ---------- */
const INIT = {
  nombres: '', apellidos: '', cedula: '',
  genero: '', fecha_nacimiento: '',
  lugar_nacimiento: '', estado_civil: '',
  telefono: '', correo_electronico: '',
  grado_instruccion: '', password: '',
};

export default function ModalRegistrarEntrenador({ visible, onClose, onSave }) {
  const toast = useToast();

  const [form, setForm] = useState(INIT);
  const [grados, setGrados] = useState([]);

  /* date-picker */
  const [showDate, setShowDate] = useState(false);
  const [tmpDate,  setTmpDate]  = useState(new Date());

  const h = (k) => (v) => setForm({ ...form, [k]: v });

  /* ---------- grados de instrucción ---------- */
  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const res = await obtenerGrados();
        setGrados(res.grados.map((g) => g.grado_instruccion));
      } catch (err) {
        toast.show({ title: err.message, variant: 'solid', action: 'error' });
      }
    })();
  }, [visible]);

  /* ---------- guardar ---------- */
  const guardar = async () => {
    try {
      const payload = {
        ...form,
        genero: form.genero === 'M' ? 'Masculino' : 'Femenino',
      };
      await registrarEntrenador(payload);
      toast.show({ title: 'Entrenador registrado', variant: 'solid', action: 'success' });
      onSave?.();
      onClose();
      setForm(INIT);
      setTmpDate(new Date());
    } catch (e) {
      toast.show({ title: e.message ?? 'Error', variant: 'solid', action: 'error' });
    }
  };

  /* ---------- render ---------- */
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader><Text bold>Registrar entrenador</Text></ModalHeader>

        <ModalBody>
          <ScrollView showsVerticalScrollIndicator>
            <VStack space="md">
              {/* cédula / nombres / apellidos */}
              <Input><InputField placeholder="Cédula" keyboardType="numeric" value={form.cedula} onChangeText={h('cedula')} /></Input>
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
                <Input flex={1}><InputField placeholder="Teléfono" keyboardType="phone-pad" value={form.telefono} onChangeText={h('telefono')} /></Input>
                <Input flex={1}><InputField placeholder="Correo electrónico" keyboardType="email-address" value={form.correo_electronico} onChangeText={h('correo_electronico')} /></Input>
              </HStack>

              {/* grado de instrucción */}
              <Select selectedValue={form.grado_instruccion} onValueChange={h('grado_instruccion')}>
                <SelectTrigger>
                  <SelectInput placeholder="Grado de instrucción" />
                  <SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent>
                    {grados.map((g) => (
                      <SelectItem key={g} label={g} value={g} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>

              {/* contraseña */}
              <Input><InputField placeholder="Contraseña" secureTextEntry value={form.password} onChangeText={h('password')} /></Input>
            </VStack>
          </ScrollView>
        </ModalBody>

        <ModalFooter>
          <HStack space="sm" justifyContent="flex-end" w="100%">
            <Button variant="outline" onPress={onClose}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button bg="#17a2b8" onPress={guardar}>
              <ButtonText color="white">Guardar</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/* ---------- PropTypes ---------- */
ModalRegistrarEntrenador.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};
