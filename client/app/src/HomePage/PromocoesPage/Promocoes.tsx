import { Alert, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../ApiConfigs/ApiRoute';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

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

async function getPromocoes(setPromocoes: React.Dispatch<React.SetStateAction<Item[] | null>>) {
    api.get('api/products/get-promotion')
    .then((response) => {
    setPromocoes(response.data);
    })
    .catch((error) => {
    Alert.alert('Ocorreu um erro ao tentar buscar as promoções.');
    });
}

const RenderPromocoes = ({ item}: { item: Item}) => {
    return(
        <View>
            <Image
                source={{ uri: `data:image/png;base64,${item.imagemProduto}` }}
                onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
            />
            <View>
                <Text >{item.nomeProd}</Text>
                <Text >{item.precoProd}</Text>
                <Text >{item.precoPromocao}</Text>
            </View>
        </View>
    );
};

const Promocoes = () => {
    const isFocused = useIsFocused();
    const [promocoes, setPromocoes] = useState<Item[] | null>(null);

    useEffect(() => {
        if (isFocused) {
    
          getPromocoes(setPromocoes);
        }
      }, [isFocused]);
    
    if (promocoes != null) {
        return (
            <View style={stylesPromocoes.promocaoScreen}>
                <Text>Promoções do dia</Text>
                <View style={stylesPromocoes.listPromocoesBox}>
                  <FlatList
                      data={promocoes}
                      keyExtractor={(item) => item.idProd}
                      renderItem={({ item, index }) => (
                          <RenderPromocoes
                              item={item}
                          />
                      )}
                  />
                </View>
            </View>
        );
    } else {
        return (
            <Text>As promoções não estão disponíveis no momento</Text>
        );
    }
};

export default Promocoes

const stylesPromocoes = StyleSheet.create({
    listPromocoesBox: {
    },
    promocaoScreen: {
    },
    boxPromocoes: {
    },
    imagemPromocoes: {
    },
  });