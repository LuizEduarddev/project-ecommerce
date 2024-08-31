import { Alert, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../../ApiConfigs/ApiRoute';

const { width } = Dimensions.get('window');

type Promocoes = {
  idProd: string,
  nomeProd: string,
  precoProd: number,
  promoProd: boolean,
  categoriaProd: string,
  precoPromocao: number,
  imagemProduto: string
}

const renderPromocoes = ({item}: {item: Promocoes}) => {
  return(
    <View style={stylesPromocao.boxFilhoPromocoes}>
      <Text>{item.nomeProd}</Text>
      <Text>{item.precoProd}</Text>
      <Text>{item.precoPromocao}</Text>
      <Image
          source={{ uri: `data:image/png;base64,${item.imagemProduto}` }}
          onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
      />
    </View>
  );
}

const PromocoesScreen = ({promocoes}:{promocoes: Promocoes[] | null}) => {
  if (promocoes != null)
  {
    return(
      <View style={stylesPromocao.boxPaiPromocoes}>
        <Text>Promocoes do dia!</Text>
        <FlatList
          data={promocoes}
          renderItem={renderPromocoes}
          keyExtractor={(item) => item.idProd}
        />
      </View>
    );
  }
  else{
    return(
      <View></View>
    );
  }
}

const Promocoes: React.FC = () => {
  
  const [promocoes, setPromocoes] = useState<Promocoes[] | null>(null);

  useEffect(() => {
    api.get('/api/products/get-promotion')
    .then(response => {
      setPromocoes(response.data);
    })
    .catch(error => {
      Alert.alert('Erro ao tentar buscar as promocoes');
    })
  })
  
  return(
      <View>
        <PromocoesScreen promocoes={promocoes}/>
      </View>
    );
  };

export default Promocoes


const stylesPromocao = StyleSheet.create({
  boxPaiPromocoes:{
    borderWidth:5,
    borderColor:'black'
  },
  boxFilhoPromocoes:{
    borderWidth: 5,
    borderColor:'green'
  }
  })