// src/navigation/AuthNavigation.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigation({ setIsAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
