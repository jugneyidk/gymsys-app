// src/components/payloads/SubTable.js
import React from 'react';
import {
  HStack, Text, FlatList, Box, Button, ButtonText,
  Center, Spinner,
} from '@gluestack-ui/themed';

export default function SubTable({ items, loading, error, deleteItem, onEdit }) {

  const Row = ({ item, index }) => (
    <HStack py="$1" borderBottomWidth={1} borderColor="#e5e7eb" alignItems="center">
      <Box w="6%"><Text>{index + 1}</Text></Box>
      <Box w="34%"><Text>{item.nombre}</Text></Box>
      <Box w="30%"><Text>{item.edad_minima}</Text></Box>
      <Box w="20%"><Text>{item.edad_maxima}</Text></Box>
      <Box w="10%" flexDir="row" justifyContent="flex-end" space="xs">
        <Button size="xs" bg="$amber400" onPress={() => onEdit(item)}><ButtonText>Editar</ButtonText></Button>
        <Button size="xs" bg="$red600"   onPress={() => deleteItem(item.id_sub)}><ButtonText color="white">Eliminar</ButtonText></Button>
      </Box>
    </HStack>
  );

  if (loading) return <Center py="$4"><Spinner size="large" /></Center>;
  if (error)   return <Center py="$4"><Text color="$red600">{error}</Text></Center>;
  if (items.length === 0) return <Center py="$4"><Text color="#6b7280">Sin resultados</Text></Center>;

  return (
    <>
      <HStack bg="#2563eb" py="$2">
        {['#','Nombre','Edad Mín','Edad Máx',''].map((h,i)=>(
          <Box key={i} w={['6%','34%','30%','20%','10%'][i]}><Text color="white" bold>{h}</Text></Box>
        ))}
      </HStack>
      <FlatList
        data={items}
        renderItem={Row}
        keyExtractor={(it)=>it.id_sub}
        maxHeight={300}
      />
    </>
  );
}
