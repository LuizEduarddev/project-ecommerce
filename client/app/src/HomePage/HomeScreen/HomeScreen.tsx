import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';

const HomeScreen = ({ navigation}) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantidadeCarrinho, setQuantidadeCarrinho] = useState<number>(0);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getQuantidadeCarrinho();
    }
  }, [isFocused]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const promise = await AsyncStorage.getItem('username');
        setUsername(promise);
        setLoading(false);
      } catch (error) {
        Alert.alert('Falha ao tentar pegar o nome do usuário');
      }
    };

    fetchUsername();
  }, []);

  async function getQuantidadeCarrinho() {
    try {
      const storedCart = await AsyncStorage.getItem('user-cart');
      const carrinho = storedCart ? JSON.parse(storedCart) : { itens: [], valorTotalCarrinho: 0 };
      setQuantidadeCarrinho(carrinho.itens.length);
    } catch (error) {
      Alert.alert('Falha ao tentar recuperar o carrinho.');
    }
  }

  if (loading) {
    return (
      <View>
        <Text>Carregando informações de perfil.</Text>
      </View>
    );
  }

  return (
    <View style={stylesProfile.boxProfile}>
      <Text>Olá, {username}</Text>
      <MaterialIcons.Button style={stylesProfile.buttonCarrinho} name="shopping-cart" onPress={() => navigation.navigate('Cart')}>
        <Text>Carrinho</Text>
        <Text style={stylesProfile.quantidadeCarrinho}>{quantidadeCarrinho}</Text>
      </MaterialIcons.Button>
      <TouchableOpacity onPress={() => navigation.navigate('MenuProfile')}>
        <Image style={stylesProfile.profileImage} source={require('../assets/yasuo.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen


const stylesProfile = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  boxProfile: {
    marginTop:'5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
      width: 50,
      height: 50,
      marginHorizontal: 10,
      borderRadius: 50,
  },
  buttonCarrinho: {
      width: 150,
      height: 50,
  },
  quantidadeCarrinho: {
      width: 24, // Adjust size as needed to make it a circle
      height: 24, // Adjust size as needed to make it a circle
      borderRadius: 12, // Half of the width/height to make it a circle
      borderWidth: 2, // Adjust the thickness of the border as needed
      borderColor: 'black', // Change the color of the border
      backgroundColor: 'white',
      color: 'black',
      textAlign: 'center',
      textAlignVertical: 'center', // For Android, use 'center' for iOS
      lineHeight: 24, // Same as height for vertical alignment
  },
});
