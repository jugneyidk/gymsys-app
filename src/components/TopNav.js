import React, { useState } from 'react';
import {
  Box, HStack, Text, Icon, Pressable, Actionsheet, ActionsheetBackdrop,
  ActionsheetContent, ActionsheetItem, ActionsheetItemText, Divider, VStack
} from '@gluestack-ui/themed';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function TopNav({ title = "Gimnasio Eddie Suarez UPTAEB", onMenuPress }) {

  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigation = useNavigation();

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    });
  };

  return (
    <>
      <Box bg="#2f5ca8" px="$4" py="$3" shadow="2">
        <HStack justifyContent="space-between" alignItems="center">
          <Pressable onPress={onMenuPress}>
            <Icon as={Ionicons} name="menu" size="xl" color="white" />
          </Pressable>

          <Text color="white" fontSize="$lg" fontWeight="$bold" textAlign="center" flex={1} ml="$2">
            {title}
          </Text>

          <Pressable onPress={() => setShowUserMenu(true)}>
            <Icon as={FontAwesome5} name="user-circle" size={22} color="white" />
          </Pressable>
        </HStack>
      </Box>

      {/* Menú de usuario  */}
      <Actionsheet isOpen={showUserMenu} onClose={() => setShowUserMenu(false)}>
        <ActionsheetBackdrop onPress={() => setShowUserMenu(false)} />
        <ActionsheetContent>

          <Box alignItems="flex-end" px="$3" py="$2">
            <Pressable onPress={() => setShowUserMenu(false)}>
              <Icon as={Ionicons} name="close" size="xl" color="$coolGray600" />
            </Pressable>
          </Box>

          <VStack px="$4" pb="$2">
            <Text bold fontSize="$md">Menú de usuario</Text>
            <Text fontSize="$sm" color="$coolGray500">Jugney Vargas</Text>
            <Text fontSize="$xs" color="$coolGray400">Superusuario</Text>
          </VStack>

          <Divider my="$1" />

          <ActionsheetItem>
            <Icon as={FontAwesome5} name="chart-bar" mr="$3" size="sm" />
            <ActionsheetItemText>Reportes</ActionsheetItemText>
          </ActionsheetItem>

          <ActionsheetItem>
            <Icon as={MaterialIcons} name="article" mr="$3" size="sm" />
            <ActionsheetItemText>Bitácora</ActionsheetItemText>
          </ActionsheetItem>

          <ActionsheetItem>
            <Icon as={FontAwesome5} name="moon" mr="$3" size="sm" />
            <ActionsheetItemText>Tema</ActionsheetItemText>
          </ActionsheetItem>

          <ActionsheetItem onPress={cerrarSesion}>
            <Icon as={FontAwesome5} name="sign-out-alt" mr="$3" size="sm" />
            <ActionsheetItemText>Cerrar sesión</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
