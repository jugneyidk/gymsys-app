// src/components/modals/ModalModificarAtleta.js
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

import {
  obtenerAtleta, modificarAtleta,
  obtenerTiposAtleta, obtenerEntrenadoresLite,
} from '../../services/atletas';

/* ───── helpers ───── */
const fmt = (d) => d.toISOString().split('T')[0];
const edad = (d) => {
  const h = new Date(), n = new Date(d);
  let e = h.getFullYear() - n.getFullYear(),
      m = h.getMonth()  - n.getMonth();
  if (m < 0 || (m === 0 && h.getDate() < n.getDate())) e--;
  return e;
};

/* estado base */
const EMPTY = {
  cedula: '', nombres: '', apellidos: '',
  genero: 'M', estado_civil: '',
  fecha_nacimiento: '', lugar_nacimiento: '',
  peso: '', altura: '',
  tipo_atleta: '', entrenador_asignado: '',
  telefono: '', correo_electronico: '',
  password: '', cedula_original: '',

  nombre_representante: '', cedula_representante: '',
  telefono_representante: '', parentesco_representante: '',
};

export default function ModalModificarAtleta({ visible, onClose, id, onSave }) {
  const toast = useToast();

  /* estado UI / datos */
  const [form, setForm] = useState(EMPTY);
  const [pwdOn, setPwdOn] = useState(false);
  const [tipos, setTipos] = useState([]);
  const [ents, setEnts] = useState([]);
  const [showDate, setShowDate] = useState(false);
  const [tmpDate, setTmpDate] = useState(new Date());

  const h = (k) => (v) => setForm({ ...form, [k]: v });

  /* carga de datos */
  useEffect(() => {
    if (!visible || !id) return;

    (async () => {
      try {
        const t = await obtenerTiposAtleta();
        setTipos(t.tipos ?? []);
        const e = await obtenerEntrenadoresLite();
        setEnts(e.entrenadores ?? []);

        const { atleta: a } = await obtenerAtleta(id);
        setForm({
          cedula: a.cedula,
          cedula_original: id,
          nombres: a.nombre,
          apellidos: a.apellido,
          genero: a.genero.startsWith('M') ? 'M' : 'F',
          estado_civil: a.estado_civil,
          fecha_nacimiento: a.fecha_nacimiento,
          lugar_nacimiento: a.lugar_nacimiento,
          peso: a.peso?.toString() ?? '',
          altura: a.altura?.toString() ?? '',
          tipo_atleta: a.id_tipo_atleta_encriptado ?? a.id_tipo_atleta,
          entrenador_asignado: a.entrenador_encriptado ?? a.entrenador,
          telefono: a.telefono,
          correo_electronico: a.correo_electronico,
          password: '',

          nombre_representante: a.nombre_representante ?? '',
          cedula_representante: a.cedula_representante ?? '',
          telefono_representante: a.telefono_representante ?? '',
          parentesco_representante: a.parentesco_representante ?? '',
        });

        setTmpDate(new Date(a.fecha_nacimiento));
        setPwdOn(false);
      } catch (err) {
        toast.show({ title: err.message, variant: 'solid', action: 'error' });
        onClose();
      }
    })();
  }, [visible, id]);

  /* guardar cambios */
  const guardar = async () => {
    try {
      await modificarAtleta({
        ...form,
        genero: form.genero === 'M' ? 'Masculino' : 'Femenino',
        modificar_contraseña: pwdOn ? 1 : 0,
      });
      toast.show({ title: 'Atleta modificado', variant: 'solid', action: 'success' });
      onSave?.();
      onClose();
    } catch (e) {
      toast.show({ title: e.message ?? 'Error', variant: 'solid', action: 'error' });
    }
  };

  const menor = form.fecha_nacimiento && edad(form.fecha_nacimiento) < 18;

  /* ───── UI ───── */
  return (
    <Modal isOpen={visible} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text bold>Modificar atleta</Text>
        </ModalHeader>

        <ModalBody>
          <ScrollView showsVerticalScrollIndicator>
            <VStack space="md">
              {/* datos básicos */}
              <Input>
                <InputField
                  placeholder="Cédula"
                  keyboardType="numeric"
                  value={form.cedula}
                  onChangeText={h('cedula')}
                />
              </Input>
              <Input>
                <InputField
                  placeholder="Nombres"
                  value={form.nombres}
                  onChangeText={h('nombres')}
                />
              </Input>
              <Input>
                <InputField
                  placeholder="Apellidos"
                  value={form.apellidos}
                  onChangeText={h('apellidos')}
                />
              </Input>

              {/* género / estado civil */}
              <HStack space="md">
                <Select flex={1} selectedValue={form.genero} onValueChange={h('genero')}>
                  <SelectTrigger>
                    <SelectInput placeholder="Género" />
                    <SelectIcon>
                      <Icon as={FontAwesome5} name="chevron-down" />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      <SelectItem label="Masculino" value="M" />
                      <SelectItem label="Femenino" value="F" />
                    </SelectContent>
                  </SelectPortal>
                </Select>

                <Select
                  flex={1}
                  selectedValue={form.estado_civil}
                  onValueChange={h('estado_civil')}
                >
                  <SelectTrigger>
                    <SelectInput placeholder="Estado civil" />
                    <SelectIcon>
                      <Icon as={FontAwesome5} name="chevron-down" />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      {['Soltero', 'Casado', 'Divorciado', 'Viudo'].map((x) => (
                        <SelectItem key={x} label={x} value={x} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </HStack>

              {/* fecha nacimiento */}
              <Input>
                <Pressable onPress={() => setShowDate(true)}>
                  <InputField
                    editable={false}
                    placeholder="Fecha nacimiento YYYY-MM-DD"
                    value={form.fecha_nacimiento}
                  />
                </Pressable>
              </Input>
              {showDate && (
                <DateTimePicker
                  value={tmpDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(e, d) => {
                    if (Platform.OS !== 'ios') {
                      setShowDate(false);
                    }
                    if (d) {
                      setTmpDate(d);
                      h('fecha_nacimiento')(fmt(d));
                    }
                  }}
                />
              )}

              {/* lugar / peso / altura */}
              <Input>
                <InputField
                  placeholder="Lugar de nacimiento"
                  value={form.lugar_nacimiento}
                  onChangeText={h('lugar_nacimiento')}
                />
              </Input>
              <HStack space="md">
                <Input flex={1}>
                  <InputField
                    placeholder="Peso (kg)"
                    keyboardType="decimal-pad"
                    value={form.peso}
                    onChangeText={h('peso')}
                  />
                </Input>
                <Input flex={1}>
                  <InputField
                    placeholder="Altura (m)"
                    keyboardType="decimal-pad"
                    value={form.altura}
                    onChangeText={h('altura')}
                  />
                </Input>
              </HStack>

              {/* tipo atleta / entrenador */}
              <HStack space="md">
                <Select
                  flex={1}
                  selectedValue={form.tipo_atleta}
                  onValueChange={h('tipo_atleta')}
                >
                  <SelectTrigger>
                    <SelectInput placeholder="Tipo atleta" />
                    <SelectIcon>
                      <Icon as={FontAwesome5} name="chevron-down" />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      {tipos.map((t) => (
                        <SelectItem
                          key={t.id_tipo_atleta_encriptado}
                          label={t.nombre_tipo_atleta}
                          value={t.id_tipo_atleta_encriptado}
                        />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>

                <Select
                  flex={1}
                  selectedValue={form.entrenador_asignado}
                  onValueChange={h('entrenador_asignado')}
                >
                  <SelectTrigger>
                    <SelectInput placeholder="Entrenador" />
                    <SelectIcon>
                      <Icon as={FontAwesome5} name="chevron-down" />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      {ents.map((e) => (
                        <SelectItem
                          key={e.cedula_encriptado}
                          label={`${e.nombre} ${e.apellido}`}
                          value={e.cedula_encriptado}
                        />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </HStack>

              {/* contacto */}
              <HStack space="md">
                <Input flex={1}>
                  <InputField
                    placeholder="Teléfono"
                    keyboardType="phone-pad"
                    value={form.telefono}
                    onChangeText={h('telefono')}
                  />
                </Input>
                <Input flex={1}>
                  <InputField
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    value={form.correo_electronico}
                    onChangeText={h('correo_electronico')}
                  />
                </Input>
              </HStack>

              {/* contraseña */}
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

              {/* representante */}
              {menor && (
                <>
                  <Text bold mt="$2">
                    Datos del representante
                  </Text>
                  <Input>
                    <InputField
                      placeholder="Nombre completo"
                      value={form.nombre_representante}
                      onChangeText={h('nombre_representante')}
                    />
                  </Input>
                  <HStack space="md">
                    <Input flex={1}>
                      <InputField
                        placeholder="Cédula"
                        keyboardType="numeric"
                        value={form.cedula_representante}
                        onChangeText={h('cedula_representante')}
                      />
                    </Input>
                    <Input flex={1}>
                      <InputField
                        placeholder="Teléfono"
                        keyboardType="phone-pad"
                        value={form.telefono_representante}
                        onChangeText={h('telefono_representante')}
                      />
                    </Input>
                  </HStack>
                  <Input>
                    <InputField
                      placeholder="Parentesco"
                      value={form.parentesco_representante}
                      onChangeText={h('parentesco_representante')}
                    />
                  </Input>
                </>
              )}
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

/* ── PropTypes ───────────────────────────────────────────── */
ModalModificarAtleta.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSave: PropTypes.func,
};
