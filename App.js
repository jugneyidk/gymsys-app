import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import 'react-native-get-random-values';
import { navigationRef } from './src/utils/navigationRef';
import RootNavigator        from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
