import React from 'react';
import {
  Box, VStack, Text, Icon, Pressable, Divider, HStack
} from '@gluestack-ui/themed';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SideMenu({ isOpen, onClose, navigation }) {
  if (!isOpen) return null;

  const opciones = [
    { label: 'Gestionar Usuarios', icon: 'users', screen: 'Usuarios' },
    { label: 'Asistencias', icon: 'clipboard-list', screen: 'Asistencias' },
    { label: 'Eventos', icon: 'calendar-alt', screen: 'Eventos' },
    { label: 'Mensualidad', icon: 'file-invoice-dollar', screen: 'Mensualidad' },
    { label: 'WADA', icon: 'vial', screen: 'WADA' },
    { label: 'Notificaciones', icon: 'bell', screen: 'Notificaciones' }
  ];

  return (
    <>
      <Pressable
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0,0,0,0.5)"
        onPress={onClose}
        zIndex={9}
      />

      {/* Panel lateral */}
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        width="70%"
        maxWidth={280}
        bg="#2f5ca8"
        px="$4"
        py="$6"
        zIndex={10}
        shadow="9"
      >
        <Text color="white" fontSize="$lg" fontWeight="$bold" mb="$4">
          Gimnasio Eddie Suarez UPTAEB
        </Text>

        <VStack space="md">
          {opciones.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                onClose();
                if (navigation) navigation.navigate(item.screen);
              }}
            >
              <HStack alignItems="center" space="md">
                <Icon as={FontAwesome5} name={item.icon} color="white" size="sm" />
                <Text color="white" fontSize="$sm">{item.label}</Text>
              </HStack>
              <Divider my="$2" bg="white" opacity={0.1} />
            </Pressable>
          ))}
        </VStack>
      </Box>
    </>
  );
}
