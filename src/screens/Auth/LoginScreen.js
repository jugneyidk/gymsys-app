import React from 'react';
import { 
    GluestackUIProvider, Box, VStack, Text, Input, InputField, Button, ButtonText, Link, Center, HStack
} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLoginForm } from '../../hooks/useLoginForm';

export default function LoginScreen() {
 const { 
  usuario, password, errorUsuario, errorPassword, onUsuarioChange, onPasswordChange, onLogin
} = useLoginForm(navigation);

  return (
    <GluestackUIProvider config={config}>
      <Box flex={1} bg="#3f6a95" justifyContent="center" alignItems="center" px="$4">
        <Box bg="$white" p="$6" borderRadius="$2xl" width="100%" maxWidth={380} shadowColor="#000" shadowOpacity={0.1}>
          
          <Center mb="$4">
            <FontAwesome5 name="dumbbell" size={28} color="#3670ad" />
            <Text fontSize="$xl" color="#3670ad" bold>GIMNASIO</Text>
            <Text fontSize="$xl" color="#3670ad" bold>'EDDIE SUAREZ'</Text>
            <Box h={1} bg="$cyan600" width={100} mt="$1" mb="$3" borderRadius="$full" />
          </Center>

          <Text fontSize="$2xl" bold color="$coolGray800" textAlign="center" mb="$5">
            Iniciar Sesión
          </Text>

          <VStack space="lg">
            <Box>
              <Text mb="$1" color="$coolGray700">Usuario:</Text>
              <Input isInvalid={!!errorUsuario}>
                <InputField
                  placeholder="Ingresa tu cédula"
                  value={usuario}
                  onChangeText={onUsuarioChange}
                  keyboardType="numeric"
                />
              </Input>
              {errorUsuario ? <Text color="red" mt="$1">{errorUsuario}</Text> : null}
            </Box>

            <Box>
              <HStack justifyContent="space-between" mb="$1">
                <Text color="$coolGray700">Contraseña:</Text>
                <Link>
                  <Text fontSize="$sm" color="$blue600">Olvidé mi contraseña</Text>
                </Link>
              </HStack>
              <Input isInvalid={!!errorPassword}>
                <InputField
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChangeText={onPasswordChange}
                  secureTextEntry
                />
              </Input>
              {errorPassword ? <Text color="red" mt="$1">{errorPassword}</Text> : null}
            </Box>

            <Button size="md" bg="#17a2b8" borderRadius="$lg" onPress={onLogin}>
              <ButtonText color="white">Ingresar</ButtonText>
            </Button>

            <Button variant="outline" borderColor="$coolGray300" onPress={() => console.log('Volver')}>
              <ButtonText color="$coolGray700">Volver</ButtonText>
            </Button>
          </VStack>
        </Box>
      </Box>
    </GluestackUIProvider>
  );
}
