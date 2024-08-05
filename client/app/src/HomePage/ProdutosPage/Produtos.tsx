import React, { useState, useEffect } from 'react';
import { Alert, Button, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import api from '../../../ApiConfigs/ApiRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Item = {
  idProd: string;
  nomeProd: string;
  precoProd: number;
  promoProd: boolean;
  categoriaProd: string;
  precoPromocao: number;
  imagemProduto: string;
  quantidade: number;
};

type Carrinho = {
  itens: Item[];
  valorTotalCarrinho: number;
};

const Produtos = () => {
  const [produtos, setProdutos] = useState<Item[] | null>(null);
  const [quantidadeCarrinho, setQuantidadeCarrinho] = useState<number>(0);

  useEffect(() => {
    getProdutos();
    getQuantidadeCarrinho();
  }, []);

  async function getProdutos() {
    try {
      const response = await api.get('api/products/get-all');
      setProdutos(response.data);
    } catch (error) {
      Alert.alert('Ocorreu um erro ao tentar buscar os produtos.');
    }
  }

  async function getQuantidadeCarrinho() {
    try {
      const storedCart = await AsyncStorage.getItem('user-cart');
      const carrinho: Carrinho = storedCart ? JSON.parse(storedCart) : { itens: [], valorTotalCarrinho: 0 };
      setQuantidadeCarrinho(carrinho.itens.length);
    } catch (error) {
      Alert.alert('Falha ao tentar recuperar o carrinho.');
    }
  }

  async function buttonAdicionarCarrinho(item: Item) {
    try {
      item.quantidade = 1;
      const storedCart = await AsyncStorage.getItem('user-cart');
      const carrinho: Carrinho = storedCart ? JSON.parse(storedCart) : { itens: [], valorTotalCarrinho: 0 };

      if (carrinho.itens.find((carrinhoItem) => carrinhoItem.idProd === item.idProd)) {
        Alert.alert(`${item.nomeProd} já está no carrinho.`);
      } else {
        const newItens = [...carrinho.itens, item];
        const newTotalValue = carrinho.valorTotalCarrinho + item.precoProd;

        const updatedCart: Carrinho = {
          itens: newItens,
          valorTotalCarrinho: newTotalValue,
        };

        await AsyncStorage.setItem('user-cart', JSON.stringify(updatedCart));
        Alert.alert('Produto salvo no carrinho');
        await getQuantidadeCarrinho();
      }
    } catch (error) {
      Alert.alert('Falha ao tentar adicionar o produto ao carrinho.');
    }
  }

  const renderProduto = ({ item }: { item: Item }) => (
    <View>
      <Text>{item.nomeProd}</Text>
      <Text>{item.precoProd}</Text>
      {item.imagemProduto ? (
        <Image
          source={{ uri: `data:image/png;base64,${item.imagemProduto}` }}
          onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
        />
      ) : (
        <Text>No Image Available</Text>
      )}
      <Button title="Adicionar ao carrinho" onPress={() => buttonAdicionarCarrinho(item)} />
    </View>
  );

  return (
    <View>
      <Text>Produtos</Text>
      {produtos ? (
        <FlatList
          data={produtos}
          renderItem={renderProduto}
          keyExtractor={(item) => item.idProd}
        />
      ) : (
        <Text>Os produtos não estão disponíveis no momento</Text>
      )}
    </View>
  );
};

export default Produtos;

const styles = StyleSheet.create({});
