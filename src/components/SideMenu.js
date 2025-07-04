// src/components/SideMenu.js
import React, { useState } from 'react';
import {
  Box, VStack, Text, Icon, Pressable, Divider, HStack
} from '@gluestack-ui/themed';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function SideMenu({ isOpen, onClose, navigation }) {
  const [showUserSubmenu, setShowUserSubmenu] = useState(false);

  if (!isOpen) return null;

  const otrasOpciones = [
    { label: 'Asistencias', icon: 'clipboard-list', screen: 'Asistencias' },
    { label: 'Eventos', icon: 'calendar-alt', screen: 'Eventos' },
    // dentro de tu lista de items


    { label: 'Mensualidad', icon: 'file-invoice-dollar', screen: 'Mensualidad' },
    { label: 'WADA', icon: 'vial', screen: 'WADA' },
    { label: 'Notificaciones', icon: 'bell', screen: 'Notificaciones' }
  ];

  return (
    <>
      <Pressable position="absolute" top={0} left={0} right={0} bottom={0} bg="rgba(0,0,0,0.5)" onPress={onClose} zIndex={9} />

      <Box position="absolute" top={0} bottom={0} left={0} width="70%" maxWidth={280} bg="#2f5ca8" px="$4" py="$6" zIndex={10} shadow="9">

        <Text color="white" fontSize="$lg" fontWeight="$bold" mb="$4">
          Gimnasio Eddie Suarez UPTAEB
        </Text>

        <VStack space="md">
          <Pressable onPress={() => setShowUserSubmenu(!showUserSubmenu)}>
            <HStack alignItems="center" justifyContent="space-between">
              <HStack space="md" alignItems="center">
                <Icon as={FontAwesome5} name="users" color="white" size="sm" />
                <Text color="white" fontSize="$sm">Gestionar Usuarios</Text>
              </HStack>
              <Icon as={Ionicons} name={showUserSubmenu ? 'chevron-up' : 'chevron-down'} color="white" size="sm"/>
            </HStack>
          </Pressable>

          {showUserSubmenu && (
            <VStack pl="$6" mt="$2" space="sm">
              <Pressable onPress={() => { onClose(); navigation.navigate('Entrenadores'); }}>
                <Text color="white" fontSize="$sm">Entrenadores</Text>
              </Pressable>
              <Pressable onPress={() => { onClose(); navigation.navigate('Atletas'); }}>
                <Text color="white" fontSize="$sm">Atletas</Text>
              </Pressable>
              <Pressable onPress={() => { onClose(); navigation.navigate('Rolespermisos'); }}>
                <Text color="white" fontSize="$sm">Roles y permisos</Text>
              </Pressable>
            </VStack>
          )}

          <Divider my="$2" bg="white" opacity={0.1} />

          {otrasOpciones.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                onClose();
                navigation.navigate(item.screen);
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
