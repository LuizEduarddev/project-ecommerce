import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import api from '../../../ApiConfigs/ApiRoute';

interface Product {
  idProd: string;
  nomeProd: string;
  precoProd: number;
  imagemProduto?: string;
}

const SearchBar = () => {
  const [pesquisa, setPesquisa] = useState<string>(''); // Initialize as an empty string
  const [produtos, setProdutos] = useState<Product[]>([]);

  const renderPesquisa = () => {
    if (produtos.length > 0) {
      return produtos.map(produto => (
        <View key={produto.idProd}> 
          <Text>{produto.nomeProd}</Text>
          <Text>{produto.precoProd}</Text>
          {produto.imagemProduto ? (
            <Image 
              style={{width: 100, height:100}}
              source={{ uri: `data:image/png;base64,${produto.imagemProduto}` }}
              onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
            />
          ) : (
            <Text>Erro ao renderizar a imagem</Text>
          )}
        </View>
      ));
    } else {
      return <Text>Nenhum produto encontrado</Text>;
    }
  };

  async function pesquisarBanco(text: string) {
    if (text.trim() === '') {
      setProdutos([]); 
      return;
    }

    try {
      const response = await api.post('api/products/search', text);
      setProdutos(response.data);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }
  
  const handleTextChange = (text: string) => {
    setPesquisa(text);
    pesquisarBanco(text);
  };

  return (
    <View>
      <TextInput
        placeholder='Pesquise por um produto'
        value={pesquisa}
        onChangeText={handleTextChange}
      />
      {renderPesquisa()}
    </View>
  );
}

export default SearchBar;

const styles = StyleSheet.create({});
