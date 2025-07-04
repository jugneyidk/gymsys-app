// src/components/modals/ModalRegistrarAtleta.js
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

import {
  registrarAtleta, obtenerTiposAtleta, obtenerEntrenadoresLite,
} from '../../services/atletas';

/* helpers -------------------------------------------------- */
const fmt = (d) => d.toISOString().split('T')[0];
const edad = (d) => {
  const h = new Date(), n = new Date(d);
  let e = h.getFullYear() - n.getFullYear(),
      m = h.getMonth() - n.getMonth();
  if (m < 0 || (m === 0 && h.getDate() < n.getDate())) e--;
  return e;
};

/* estado inicial ------------------------------------------ */
const INIT = {
  cedula: '', nombres: '', apellidos: '',
  genero: '', estado_civil: '',
  fecha_nacimiento: '', lugar_nacimiento: '',
  peso: '', altura: '',
  tipo_atleta: '', entrenador_asignado: '',
  telefono: '', correo_electronico: '',
  password: '',
  /* en caso de <18 */
  nombre_representante: '', cedula_representante: '',
  telefono_representante: '', parentesco_representante: '',
};

export default function ModalRegistrarAtleta({ visible, onClose, onSave }) {
  const toast = useToast();
  const [form,   setForm]   = useState(INIT);
  const [tipos,  setTipos]  = useState([]);
  const [ents,   setEnts]   = useState([]);

  /* date-picker */
  const [showDate, setShowDate] = useState(false);
  const [tmpDate,  setTmpDate]  = useState(new Date());

  /* catálogo */
  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const t = await obtenerTiposAtleta();
        setTipos(t.tipos ?? []);
        const e = await obtenerEntrenadoresLite();
        setEnts(e.entrenadores ?? []);
      } catch (err) {
        toast.show({ title: err.message, variant: 'solid', action: 'error' });
      }
    })();
  }, [visible]);

  const h = (k) => (v) => setForm({ ...form, [k]: v });

  /* guardar */
  const guardar = async () => {
    try {
      const p = {
        ...form,
        genero: form.genero === 'M' ? 'Masculino' : 'Femenino',
      };
      await registrarAtleta(p);
      toast.show({ title: 'Atleta registrado', variant: 'solid', action: 'success' });
      onSave?.();
      setForm(INIT);
      setTmpDate(new Date());
      onClose();
    } catch (e) {
      toast.show({ title: e.message ?? 'Error', variant: 'solid', action: 'error' });
    }
  };

  /* representación */
  const menor = form.fecha_nacimiento && edad(form.fecha_nacimiento) < 18;

  return (
    <Modal isOpen={visible} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader><Text bold>Registrar atleta</Text></ModalHeader>

        <ModalBody>
          <ScrollView showsVerticalScrollIndicator>
            <VStack space="md">
              {/* cédula, nombre, apellido */}
              <Input><InputField placeholder="Cédula" keyboardType="numeric" value={form.cedula} onChangeText={h('cedula')} /></Input>
              <Input><InputField placeholder="Nombres" value={form.nombres} onChangeText={h('nombres')} /></Input>
              <Input><InputField placeholder="Apellidos" value={form.apellidos} onChangeText={h('apellidos')} /></Input>

              {/* selects género / estado civil */}
              <HStack space="md">
                <Select flex={1} selectedValue={form.genero} onValueChange={h('genero')}>
                  <SelectTrigger><SelectInput placeholder="Género" /><SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon></SelectTrigger>
                  <SelectPortal><SelectContent>
                    <SelectItem label="Masculino" value="M" />
                    <SelectItem label="Femenino"  value="F" />
                  </SelectContent></SelectPortal>
                </Select>

                <Select flex={1} selectedValue={form.estado_civil} onValueChange={h('estado_civil')}>
                  <SelectTrigger><SelectInput placeholder="Estado civil" /><SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon></SelectTrigger>
                  <SelectPortal><SelectContent>
                    {['Soltero','Casado','Divorciado','Viudo'].map((x)=>(<SelectItem key={x} label={x} value={x} />))}
                  </SelectContent></SelectPortal>
                </Select>
              </HStack>

              {/* fecha nac */}
              <Input>
                <Pressable onPress={() => setShowDate(true)}>
                  <InputField editable={false} placeholder="Fecha nacimiento YYYY-MM-DD" value={form.fecha_nacimiento} />
                </Pressable>
              </Input>
              {showDate && (
                <DateTimePicker
                  value={tmpDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(e,d)=>{
                    if (Platform.OS!=='ios') setShowDate(false);
                    if (d){ setTmpDate(d); h('fecha_nacimiento')(fmt(d)); }
                  }}
                />
              )}

              {/* lugar / peso / altura */}
              <Input><InputField placeholder="Lugar de nacimiento" value={form.lugar_nacimiento} onChangeText={h('lugar_nacimiento')} /></Input>
              <HStack space="md">
                <Input flex={1}><InputField placeholder="Peso (kg)" keyboardType="decimal-pad" value={form.peso} onChangeText={h('peso')} /></Input>
                <Input flex={1}><InputField placeholder="Altura (m)" keyboardType="decimal-pad" value={form.altura} onChangeText={h('altura')} /></Input>
              </HStack>

              {/* selects tipo atleta / entrenador */}
              <HStack space="md">
                <Select flex={1} selectedValue={form.tipo_atleta} onValueChange={h('tipo_atleta')}>
                  <SelectTrigger><SelectInput placeholder="Tipo atleta" /><SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon></SelectTrigger>
                  <SelectPortal><SelectContent>
                    {tipos.map(t=>(
                      <SelectItem key={t.id_tipo_atleta_encriptado} label={t.nombre_tipo_atleta} value={t.id_tipo_atleta_encriptado} />
                    ))}
                  </SelectContent></SelectPortal>
                </Select>

                <Select flex={1} selectedValue={form.entrenador_asignado} onValueChange={h('entrenador_asignado')}>
                  <SelectTrigger><SelectInput placeholder="Entrenador" /><SelectIcon><Icon as={FontAwesome5} name="chevron-down" /></SelectIcon></SelectTrigger>
                  <SelectPortal><SelectContent>
                    {ents.map(e=>(
                      <SelectItem key={e.cedula_encriptado} label={`${e.nombre} ${e.apellido}`} value={e.cedula_encriptado} />
                    ))}
                  </SelectContent></SelectPortal>
                </Select>
              </HStack>

              {/* contacto */}
              <HStack space="md">
                <Input flex={1}><InputField placeholder="Teléfono" keyboardType="phone-pad" value={form.telefono} onChangeText={h('telefono')} /></Input>
                <Input flex={1}><InputField placeholder="Correo electrónico" keyboardType="email-address" value={form.correo_electronico} onChangeText={h('correo_electronico')} /></Input>
              </HStack>

              <Input><InputField placeholder="Contraseña" secureTextEntry value={form.password} onChangeText={h('password')} /></Input>

              {/* representante si menor */}
              {menor && (
                <>
                  <Text bold mt="$2">Datos del representante</Text>
                  <Input><InputField placeholder="Nombre completo" value={form.nombre_representante} onChangeText={h('nombre_representante')} /></Input>
                  <HStack space="md">
                    <Input flex={1}><InputField placeholder="Cédula" keyboardType="numeric" value={form.cedula_representante} onChangeText={h('cedula_representante')} /></Input>
                    <Input flex={1}><InputField placeholder="Teléfono" keyboardType="phone-pad" value={form.telefono_representante} onChangeText={h('telefono_representante')} /></Input>
                  </HStack>
                  <Input><InputField placeholder="Parentesco" value={form.parentesco_representante} onChangeText={h('parentesco_representante')} /></Input>
                </>
              )}
            </VStack>
          </ScrollView>
        </ModalBody>

        <ModalFooter>
          <HStack space="sm" justifyContent="flex-end" w="100%">
            <Button variant="outline" onPress={onClose}><ButtonText>Cancelar</ButtonText></Button>
            <Button bg="#17a2b8" onPress={guardar}><ButtonText color="white">Guardar</ButtonText></Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/* ---------- PropTypes ---------- */
ModalRegistrarAtleta.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};
