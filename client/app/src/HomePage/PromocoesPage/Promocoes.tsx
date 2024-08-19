import { Alert, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../ApiConfigs/ApiRoute';

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

const imagemTemporaria  = 'https://imgs.search.brave.com/dKVA7VGqDD8LaReis4K2lg3Do2EEgThPREN-33d56A4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTcw/MTA3NDQ1L3Bob3Rv/L3doaXRlLXNtYXJ0/LWNhci5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9UFJIV0lZ/SHVua2pFeTBLOEN1/c0JhTmMtS0hnRl9z/MHNYeE5ITW1DdVJ3/QT0'

const renderPromocoes = ({item}: {item: Promocoes}) => {
  function calculaPorcentagemDesconto(){
    const porcentagem = ((item.precoProd - item.precoPromocao) / item.precoProd) * 100
    return porcentagem.toFixed(0)
  }

  function formatValueToCurrency(value: number | string) {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  }

  const porcentagemDesconto = calculaPorcentagemDesconto()

  return(
    <View style={stylesPromocao.boxFilhoPromocoes}>
      <View style={stylesPromocao.imagemPromocao}>
        <Image
            style={{flex: 1, resizeMode: 'contain', width: undefined, height: undefined}}
            source={{ uri: imagemTemporaria}}
            onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
        />
      </View>
      <Text style={stylesPromocao.porcentagemDesconto}>-{porcentagemDesconto}%</Text>
      <Text style={stylesPromocao.tituloPromocao}>{item.nomeProd}</Text>
      <Text style={stylesPromocao.precoProduto}>{formatValueToCurrency(item.precoProd)}</Text>
      <Text style={stylesPromocao.precoPromocao}>{formatValueToCurrency(item.precoPromocao)}</Text>
    </View>
  );
}

const PromocoesScreen = ({promocoes}:{promocoes: Promocoes[] | null}) => {
  if (promocoes != null)
  {
    return(
      <View style={stylesPromocao.boxPaiPromocoes}>
        <Text style={stylesPromocao.boxPaiTitulo}>Promoções</Text>
        <FlatList
          data={promocoes}
          renderItem={renderPromocoes}
          keyExtractor={(item) => item.idProd}
          horizontal={true}
          ItemSeparatorComponent={() => <View style={stylesPromocao.separator} />}
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
  }, []);
  
  return(
      <View>
        <PromocoesScreen promocoes={promocoes}/>
      </View>
    );
  };

export default Promocoes


const stylesPromocao = StyleSheet.create({
  boxPaiPromocoes:{
    marginVertical: 20,
    marginHorizontal: 15,
  },
  boxPaiTitulo: {
    marginVertical: 7,
    fontSize: 20,
    fontWeight: 'bold',
  },
  boxFilhoPromocoes:{
    width: 160,
    height: 230,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  imagemPromocao: {
    width: '100%',
    height: 110,
  },
  separator: {
    width: 15,
  },
  tituloPromocao: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  precoPromocao: {
    fontSize: 18,
    color: '#ee4d2d',
    fontWeight: 'bold',
  },
  porcentagemDesconto: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: 'absolute',
    color: 'white',
    backgroundColor: '#ee4d2d',
    right: 0,
    fontSize: 12,
  },
  precoProduto: {
    textDecorationLine: 'line-through',
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
  }
  })