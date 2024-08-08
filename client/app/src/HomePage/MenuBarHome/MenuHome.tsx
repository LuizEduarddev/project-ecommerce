import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../../ApiConfigs/ApiRoute'

const RenderProfile = ({item}:{item:object}) => {
  if (item != null)
  {
    return(
      <View>
        
      </View>
    );
  }
}

const Menu = ({navigation}) => {
  const [perfil, setPerfil] = useState([]);
  const isFocused = useIsFocused();

  async function getProfileSettings()
  {
    const token = await AsyncStorage.getItem('session-token');
    if (token != null)
    {
      api.post('api/auth/profile', token)
      .then(response => {
        setPerfil(response.data);
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

const styles = StyleSheet.create({})