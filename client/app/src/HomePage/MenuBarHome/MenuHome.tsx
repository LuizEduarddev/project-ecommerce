import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../../ApiConfigs/ApiRoute'

type Perfil = {
  loginUser: string,
  nomeCompleto: string,
  telefone: string,
  cpf: string,
  endereco: string,
  email: string,
  imagemUser: string,
  pontosCupcake: number
}

const RenderProfile = ({item}:{item:Perfil}) => {
  if (item != null)
  {
    return(
      <View>
        <Image
          style={{width: 100, height: 100}}
          source={{ uri: `data:image/png;base64,${item.imagemUser}` }}
          onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
        />
        <Text>{item.nomeCompleto}</Text>
        <Text>Pontos cupcake: {item.pontosCupcake}</Text>
      </View>
    );
  }
}

const Menu = ({navigation}) => {
  const [perfil, setPerfil] = useState<Perfil| null>(null);
  const isFocused = useIsFocused();

  async function getProfileSettings()
  {
    const token = await AsyncStorage.getItem('session-token');
    if (token != null)
    {
      api.post('api/auth/profile', token)
      .then(response => {
        setPerfil(response.data);
        console.log(response.data);
      })
      .catch(error => {
        Alert.alert('Falha ao tentar buscar o perfil do usuario.', error);
      })
    }
    else{
      Alert.alert('Falha ao tentar buscar o usuario, reconecte-se e tente novamente.');
    }
  }

  useEffect(() => {
    if (isFocused)
    {
      getProfileSettings();
    }
  }, [isFocused])
  
  return (
    <SafeAreaView>
        <View>
          <RenderProfile item={perfil}/>
          <Button
            title='Pendencias'
            onPress={() => navigation.navigate('Pendencias', {navigation})}
          />
          <Button
            title='Ir para o perfil'
            onPress={() => navigation.navigate('Profile')}
          />
          <Button
            title='Ir para pedidos anteriores'
            onPress={() => navigation.navigate('PedidosCliente')}
          />
        </View>
    </SafeAreaView>
  )
}

export default Menu
