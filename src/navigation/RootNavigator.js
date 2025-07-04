// src/navigation/RootNavigator.js
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppNavigation  from './AppNavigation';
import LoginScreen    from '../screens/Auth/LoginScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    })();
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>

      <Stack.Screen name="AppNavigation">
        {props => <AppNavigation {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
