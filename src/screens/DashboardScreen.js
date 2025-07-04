// src/screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import {
  Box, Text, VStack, ScrollView, HStack, Pressable, Icon, Spinner
} from '@gluestack-ui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import TopNav from '../components/TopNav';
import SideMenu from '../components/SideMenu';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '../services/Api';


export default function DashboardScreen() {

  const [showSidebar, setShowSidebar] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiRequest('?p=dashboard&accion=obtenerDatosSistema', 'GET');
        setEstadisticas(data.estadisticas);
      } catch (error) {
        console.error('Error cargando estadísticas:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Atletas',
      icon: 'users',
      bg: '#1d4ed8',
      count: estadisticas?.total_atletas || 0,
      description: 'Total de atletas registrados.'
    },
    {
      title: 'Entrenadores',
      icon: 'user-tie',
      bg: '#059669',
      count: estadisticas?.total_entrenadores || 0,
      description: 'Entrenadores registrados.'
    },
    {
      title: 'Mensualidades',
      icon: 'file-invoice-dollar',
      bg: '#f59e0b',
      count: estadisticas?.total_deudores || 0,
      description: 'Mensualidades pendientes.'
    },
    {
      title: 'WADA',
      icon: 'cogs',
      bg: '#ef4444',
      count: estadisticas?.total_wadas_pendientes || 0,
      description: 'WADAs pendientes.'
    }
  ];

  return (
    <>
      <Box flex={1} bg="#f9fafb">
        <TopNav
          onMenuPress={() => setShowSidebar(true)}
        />

        {loading ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Spinner size="large" color="#2f5ca8" />
            <Text mt="$2">Cargando datos del sistema...</Text>
          </Box>
        ) : (
          <ScrollView px="$4" py="$3">
            <VStack space="lg">
              {stats.map((item, index) => (
                <Pressable key={index}>
                  <Box
                    bg={item.bg}
                    borderRadius="$xl"
                    px="$4"
                    py="$3"
                    shadow="1"
                  >
                    <HStack justifyContent="space-between" alignItems="center">
                      <Icon as={FontAwesome5} name={item.icon} size="md" color="white" />
                      <Box flex={1} ml="$3">
                        <Text color="white" fontSize="$lg" bold>{item.title}</Text>
                        <Text color="white" fontSize="$sm" mt="$1">{item.description}</Text>
                      </Box>
                      <Text color="white" fontSize="$2xl" fontWeight="$bold">{item.count}</Text>
                    </HStack>
                  </Box>
                </Pressable>
              ))}
            </VStack>
          </ScrollView>
        )}
      </Box>

      <SideMenu
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        navigation={navigation}
      />
    </>
  );
}
