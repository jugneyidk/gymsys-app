// src/navigation/AppNavigation.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import EventosScreen from '../screens/EventosScreen';
import EntrenadoresScreen from '../screens/EntrenadoresScreen';
import AtletasScreen from '../screens/AtletasScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProteccionSesion  from '../components/ProteccionSesion';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <ProteccionSesion>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Eventos" component={EventosScreen} />
        <Stack.Screen name="Entrenadores" component={EntrenadoresScreen} />
        <Stack.Screen name="Atletas" component={AtletasScreen} />
        <Stack.Screen
  name="Reportes"
  component={ReportsScreen}
  
/>
      </Stack.Navigator>
    </ProteccionSesion>
  );
}
