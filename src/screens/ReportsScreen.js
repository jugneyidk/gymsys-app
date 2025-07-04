/* ─────────────────── src/screens/ReportsScreen.js ─────────────────── */
/* eslint-disable consistent-return */
import React, { useState, useRef } from 'react';
import {
  Box, VStack, HStack, ScrollView, Text, Button, ButtonText, Input, InputField,
  Select, SelectTrigger, SelectInput, SelectPortal, SelectContent, SelectItem,
  Badge, FlatList, Pressable, Checkbox, CheckboxIndicator, CheckboxIcon,
  Center, Spinner, Icon, useToast,
} from '@gluestack-ui/themed';
import { FontAwesome5 }   from '@expo/vector-icons';
import DateTimePicker     from '@react-native-community/datetimepicker';
import * as FileSystem    from 'expo-file-system';
import { useNavigation }  from '@react-navigation/native';

import TopNav   from '../components/TopNav';
import SideMenu from '../components/SideMenu';
import { apiRequest } from '../services/Api';

/* opcional expo-sharing */
let shareAsync; try { ({ shareAsync } = require('expo-sharing')); } catch { /* noop */ }

/* catálogo de reportes */
const REPORT_TYPES = [
  { value: 'atletas',                 label: 'Atletas' },
  { value: 'reporteIndividualAtleta', label: 'Atletas (individual)' },
  { value: 'entrenadores',            label: 'Entrenadores' },
  { value: 'eventos',                 label: 'Eventos' },
  { value: 'mensualidades',           label: 'Mensualidades' },
  { value: 'wada',                    label: 'WADA' },
  { value: 'asistencias',             label: 'Asistencias' },
];
const BADGE_COLORS = ['#2563eb', '#059669', '#f59e0b', '#d946ef', '#dc2626'];

/* utils */
const fmt = (d) => d?.toISOString().split('T')[0] ?? '';

/* ─────────────────────────────────────────────────────────────── */
export default function ReportsScreen() {
  const nav   = useNavigation();
  const toast = useToast();

  /* -------- UI layout -------- */
  const [showSidebar, setShowSidebar] = useState(false);

  /* -------- filtros -------- */
  const [type, setType]     = useState('atletas');
  const [fecIni, setFecIni] = useState(null);
  const [fecFin, setFecFin] = useState(null);

  const [edadMin, setEdadMin] = useState('');
  const [edadMax, setEdadMax] = useState('');
  const [genero,  setGenero]  = useState('');

  const [cedula, setCedula] = useState('');
  const [datosInd, setDatosInd] = useState({
    asistencias: false, campeonatos: false, mensualidades: false, wada: false,
  });

  const [grado, setGrado] = useState('');

  /* -------- resultados -------- */
  const [reportes,     setReportes]     = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const loading = useRef(false);

  const limpiarResultados = () => { setReportes([]); setEstadisticas(null); };

  /* ---- construcción payload ---- */
  const buildPayload = () => {
    const p = {};
    if (fecIni) p.fechaInicio = fmt(fecIni);
    if (fecFin) p.fechaFin    = fmt(fecFin);

    if (type === 'atletas') {
      if (edadMin) p.edadMin = edadMin;
      if (edadMax) p.edadMax = edadMax;
      if (genero)  p.genero  = genero;
    }

    if (type === 'reporteIndividualAtleta') {
      p.cedulaAtleta = cedula.trim();
      p.datosReporte = Object.entries(datosInd).filter(([,v]) => v).map(([k]) => k);
    }

    if (type === 'entrenadores' && grado) p.gradoInstruccion = grado;
    return p;
  };

  /* ---------------- acciones ---------------- */
  const handleGenerate = async () => {
    if (loading.current) return;
    loading.current = true;
    limpiarResultados();

    try {
      if (type === 'reporteIndividualAtleta' && !cedula.trim()) {
        toast.show({ title: 'Ingresa la cédula del atleta', placement: 'top' });
        return;
      }
      const accion = type === 'reporteIndividualAtleta'
        ? 'obtenerReporteIndividual' : 'obtenerReportes';

      const data = await apiRequest(
        `?p=reportes&accion=${accion}`,
        'POST',
        { tipoReporte: type, ...buildPayload() },
      );

      setReportes(data.reportes ?? []);
      setEstadisticas(data.estadisticas ?? null);
      toast.show({ title: 'Reporte generado', placement: 'top', action: 'success' });
    } catch (e) {
      toast.show({ title: e.message ?? 'Error', placement: 'top', action: 'error' });
    } finally { loading.current = false; }
  };

  const handleExport = async () => {
    if (!reportes.length && !estadisticas) {
      toast.show({ title: 'Genera primero un reporte', placement: 'top' }); return;
    }
    try {
      const pdf = await apiRequest(
        'reporte_pdf.php',
        'POST',
        { tipoReporte: type, datos: buildPayload(), reportes, estadisticas },
      );
      if (!pdf?.file?.includes('base64')) throw new Error('El servidor no devolvió PDF');

      const path = `${FileSystem.documentDirectory}reporte_${Date.now()}.pdf`;
      await FileSystem.writeAsStringAsync(
        path,
        pdf.file.split(',')[1],
        { encoding: FileSystem.EncodingType.Base64 },
      );

      if (shareAsync) await shareAsync(path, { mimeType: 'application/pdf' });
      else toast.show({ title: `PDF guardado en:\n${path}`, placement: 'top' });
    } catch (e) {
      toast.show({ title: e.message ?? 'No se pudo exportar', placement: 'top', action: 'error' });
    }
  };

  /* ---------------- widgets ---------------- */
  const DateBox = ({ label, date, setDate }) => {
    const [show, setShow] = useState(false);

    return (
      <Pressable flex={1} onPress={() => setShow(true)}>
        <Input>
          <InputField editable={false} placeholder={label} value={fmt(date)} />
          {date && (
            <Icon
              as={FontAwesome5}
              name="times-circle"
              color="#9ca3af"
              size={16}
              mr="$2"
              onPress={() => { setDate(null); }}
            />
          )}
        </Input>
        {show && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={(_, d) => {
              setShow(false);
              if (d) setDate(d);
            }}
          />
        )}
      </Pressable>
    );
  };

  const FiltrosEspecificos = () => {
    switch (type) {
      case 'atletas':
        return (
          <HStack space="md" flexWrap="wrap">
            <Input flex={1}>
              <InputField
                keyboardType="numeric"
                placeholder="Edad mínima"
                value={edadMin}
                onChangeText={setEdadMin}
              />
            </Input>
            <Input flex={1}>
              <InputField
                keyboardType="numeric"
                placeholder="Edad máxima"
                value={edadMax}
                onChangeText={setEdadMax}
              />
            </Input>
            <Select flex={1} selectedValue={genero} onValueChange={setGenero}>
              <SelectTrigger><SelectInput placeholder="Género" /></SelectTrigger>
              <SelectPortal>
                <SelectContent>
                  <SelectItem label="Todos"     value="" />
                  <SelectItem label="Masculino" value="Masculino" />
                  <SelectItem label="Femenino"  value="Femenino" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </HStack>
        );

      case 'reporteIndividualAtleta':
        return (
          <>
            <Input mt="$2">
              <InputField
                placeholder="Cédula del atleta"
                keyboardType="numeric"
                value={cedula}
                onChangeText={setCedula}
              />
            </Input>
            <Box mt="$3" borderWidth={1} borderColor="$coolGray300" p="$3" rounded="$md">
              <Text mb="$2" bold>Datos a incluir</Text>
              {Object.keys(datosInd).map((k) => (
                <Checkbox
                  key={k}
                  value={k}
                  isChecked={datosInd[k]}
                  onChange={(v) => setDatosInd({ ...datosInd, [k]: v })}
                  mr="$4"
                  mb="$2"
                >
                  <CheckboxIndicator mr="$2">
                    <CheckboxIcon as={FontAwesome5} name="check" />
                  </CheckboxIndicator>
                  <Text>{k.charAt(0).toUpperCase() + k.slice(1)}</Text>
                </Checkbox>
              ))}
            </Box>
          </>
        );

      case 'entrenadores':
        return (
          <Select mt="$2" selectedValue={grado} onValueChange={setGrado}>
            <SelectTrigger><SelectInput placeholder="Grado de instrucción" /></SelectTrigger>
            <SelectPortal>
              <SelectContent>
                {['Todos','Primaria','Secundaria','TSU','Universidad','Magister','Doctorado']
                  .map((g) => <SelectItem key={g} label={g} value={g === 'Todos' ? '' : g} />)}
              </SelectContent>
            </SelectPortal>
          </Select>
        );

      default: return null;
    }
  };

  const TablaResultados = () => {
    if (!reportes.length) return null;
    const columns = Object.keys(reportes[0]);

    return (
      <Box mt="$4" borderWidth={1} borderColor="$coolGray300" rounded="$md" p="$2">
        <FlatList
          data={reportes}
          keyExtractor={(_, i) => i.toString()}
          ListHeaderComponent={() => (
            <HStack bg="$blue600" px="$2" py="$1">
              {columns.map((c) => (
                <Box key={c} flex={1} mr="$1"><Text color="white" bold>{c.replace(/_/g,' ')}</Text></Box>
              ))}
            </HStack>
          )}
          renderItem={({ item }) => (
            <HStack borderBottomWidth={1} borderColor="$coolGray200" px="$2" py="$1">
              {columns.map((c) => (
                <Box key={c} flex={1} mr="$1"><Text>{item[c]}</Text></Box>
              ))}
            </HStack>
          )}
        />
      </Box>
    );
  };

  const Estadisticas = () => {
    if (!estadisticas) return null;
    return (
      <Box mt="$4" borderWidth={1} borderColor="$coolGray300" rounded="$md" p="$3">
        <Text bold mb="$2">Estadísticas</Text>
        {Object.entries(estadisticas).map(([k, v], i) => (
          typeof v !== 'object' && (
            <HStack key={k} justifyContent="space-between" mb="$1">
              <Text>{k.replace(/_/g,' ')}</Text>
              <Badge bg={BADGE_COLORS[i % BADGE_COLORS.length]}>
                <Text color="white">{String(v)}</Text>
              </Badge>
            </HStack>
          )
        ))}
      </Box>
    );
  };

  /* ---------------- render ---------------- */
  return (
    <>
      <Box flex={1} bg="#f9fafb">
        <TopNav title="Reportes" onMenuPress={() => setShowSidebar(true)} />
        <ScrollView px="$4" py="$4">
          {/* hero / encabezado */}
          <Box bg="#1f2937" rounded="$lg" px="$4" py="$3" mb="$4" shadow="2">
            <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Text color="white" size="xl" bold>Generación de Reportes</Text>
              {loading.current && <Spinner color="white" />}
            </HStack>
          </Box>

          <VStack space="lg">
            {/* tipo de reporte */}
            <Select selectedValue={type} onValueChange={(v) => { setType(v); limpiarResultados(); }}>
              <SelectTrigger><SelectInput placeholder="Tipo de reporte" /></SelectTrigger>
              <SelectPortal>
                <SelectContent>
                  {REPORT_TYPES.map((opt) => (
                    <SelectItem key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>

            {/* fechas (salvo individual) */}
            {type !== 'reporteIndividualAtleta' && (
              <HStack space="md" flexWrap="wrap">
                <DateBox label="Fecha inicio" date={fecIni} setDate={setFecIni} />
                <DateBox label="Fecha fin"    date={fecFin} setDate={setFecFin} />
              </HStack>
            )}

            <FiltrosEspecificos />

            {/* acciones */}
            <HStack space="md" mt="$4">
              <Button flex={1} bg="$blue600" onPress={handleGenerate}>
                <ButtonText color="white"><FontAwesome5 name="chart-line" />  Generar</ButtonText>
              </Button>
              <Button flex={1} variant="outline" onPress={handleExport}>
                <ButtonText><FontAwesome5 name="file-pdf" />  Exportar PDF</ButtonText>
              </Button>
            </HStack>
          </VStack>

          <TablaResultados />
          <Estadisticas />

          <Box h="$12" />
        </ScrollView>
      </Box>

      {/* menú lateral */}
      <SideMenu isOpen={showSidebar} onClose={() => setShowSidebar(false)} navigation={nav} />
    </>
  );
}
