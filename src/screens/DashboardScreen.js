
import React, { useState } from 'react';
import {
  Box, Text, VStack, ScrollView, HStack, Pressable, Icon
} from '@gluestack-ui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import TopNav from '../components/TopNav';
import SideMenu from '../components/SideMenu';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigation = useNavigation();

  const stats = [
    {
      title: 'Atletas',
      icon: 'users',
      bg: '#1d4ed8',
      count: 1,
      description: 'Total de atletas registrados.'
    },
    {
      title: 'Entrenadores',
      icon: 'user-tie',
      bg: '#059669',
      count: 2,
      description: 'Entrenadores registrados.'
    },
    {
      title: 'Mensualidades',
      icon: 'file-invoice-dollar',
      bg: '#f59e0b',
      count: 1,
      description: 'Mensualidades pendientes.'
    },
    {
      title: 'WADA',
      icon: 'cogs',
      bg: '#ef4444',
      count: 0,
      description: 'WADAs pendientes.'
    }
  ];

  return (
    <>
      <Box flex={1} bg="#f9fafb">
        <TopNav
          onMenuPress={() => setShowSidebar(true)}
          onProfilePress={() => {}} 
        />

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
      </Box>

      <SideMenu
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        navigation={navigation}
      />
    </>
  );
}
