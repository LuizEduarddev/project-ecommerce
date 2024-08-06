import React, {useEffect} from 'react';
import {
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoriaScreen from './Categoria/CategoriaScreen';
import Promocoes from './PromocoesPage/Promocoes';
import Produtos from './ProdutosPage/Produtos';
import { useIsFocused } from '@react-navigation/native';
import HomeScreen from './HomeScreen/HomeScreen';

async function testeLogin(navigation) {
  const sessionToken = await AsyncStorage.getItem('session-token');
  if (sessionToken == null) {
    Alert.alert('Parece que houve um erro ao tentar buscar o usuário.');
    navigation.navigate('Login');
  }
}

export default function Home({ navigation }) {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      testeLogin(navigation);
    }
  }, [isFocused]);

  return (
    <SafeAreaView>
      <HomeScreen navigation={navigation}/>
      <Promocoes/>
      <CategoriaScreen/>
      <Produtos/>
    </SafeAreaView>
  );
}