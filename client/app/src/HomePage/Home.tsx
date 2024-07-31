import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
import { useKeenSliderNative } from 'keen-slider/react-native';
import api from '../../ApiConfigs/ApiRoute';

const { width } = Dimensions.get('window');

const Categorias: string[] = ['esportivo', 'casual', 'suv', 'luxo']

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

type HomeScreenProps = {
  navigation: any;
};

const ProductsScreen = ({ item, onAddToCart }: { item: Item[] | null; onAddToCart: (item: Item) => void }) => {
  if (item != null) {
    return (
      <View>
        <Text>Nossos produtos</Text>
        <FlatList data={item} renderItem={({ item }) => <RenderProdutos item={item} onAddToCart={onAddToCart} />} />
      </View>
    );
  } else {
    return <Text>Os produtos não estão disponíveis no momento</Text>;
  }
};

const RenderProdutos = ({ item, onAddToCart }: { item: Item; onAddToCart: (item: Item) => void }) => {
  return (
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
      <Button title="Adicionar ao carrinho" onPress={() => onAddToCart(item)} />
    </View>
  );
};

const RenderPromocoes = ({ item}: { item: Item}) => (
    <View style={stylesPromocoes.boxPromocoes}>
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

const PromocoesScreen = ({ item }: { item: Item[] | null }) => {
    if (item != null) {
        return (
            <View>
                <Text>Promoções do dia</Text>
                <FlatList
                    data={item}
                    horizontal={true}
                    keyExtractor={(item) => item.idProd}
                    renderItem={({ item, index }) => (
                        <RenderPromocoes
                            item={item}
                        />
                    )}
                />
            </View>
        );
    } else {
        return (
            <Text>As promoções não estão disponíveis no momento</Text>
        );
    }
};

const CategoriaScreen: React.FC = () => {
    return (
        <View>
            {Categorias.map((categoria, index) => (
                <View key={index}>
                    <Text>{categoria}</Text>
                </View>
            ))}
        </View>
    );
};


const HomeScreen = ({ navigation, quantidadeCarrinho }: HomeScreenProps & { quantidadeCarrinho: number }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      <Icon.Button style={stylesProfile.buttonCarrinho} name="shopping-cart" onPress={() => navigation.navigate('Cart')}>
        <Text>Carrinho</Text>
        <Text style={stylesProfile.quantidadeCarrinho}>{quantidadeCarrinho}</Text>
      </Icon.Button>
      <TouchableOpacity onPress={() => navigation.navigate('MenuProfile')}>
        <Image style={stylesProfile.profileImage} source={require('./assets/yasuo.png')} />
      </TouchableOpacity>
    </View>
  );
};

async function testeLogin(navigation) {
  const sessionToken = await AsyncStorage.getItem('session-token');
  if (sessionToken == null) {
    Alert.alert('Parece que houve um erro ao tentar buscar o usuário.');
    navigation.navigate('Login');
  }
}

export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const [promocoes, setPromocoes] = useState<Item[] | null>(null);
  const [produtos, setProdutos] = useState<Item[] | null>(null);
  const [quantidadeCarrinho, setQuantidadeCarrinho] = useState<number>(0);

  async function getPromocoes() {
    api
      .get('api/products/get-promotion')
      .then((response) => {
        setPromocoes(response.data);
      })
      .catch((error) => {
        Alert.alert('Ocorreu um erro ao tentar buscar as promoções.');
      });
  }

  async function getProdutos() {
    api     
      .get('api/products/get-all')
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((error) => {
        Alert.alert('Ocorreu um erro ao tentar buscar os produtos.');
      });
  }

  async function buttonAdicionarCarrinho(item: Item) {
    try {
      item.quantidade = 1;
      let storedCart = await AsyncStorage.getItem('user-cart');
      let carrinho: Carrinho = storedCart ? JSON.parse(storedCart) : { itens: [], valorTotalCarrinho: 0 };

      const newKey = item.idProd;
      if (carrinho.itens.find((carrinhoItem) => carrinhoItem.idProd === newKey)) {
        Alert.alert(item.nomeProd + ' já está no carrinho.');
      } else {
        const newItens = [...carrinho.itens, item];
        const newTotalValue = carrinho.valorTotalCarrinho + item.precoProd;

        const updatedCart: Carrinho = {
          itens: newItens,
          valorTotalCarrinho: newTotalValue,
        };

        await AsyncStorage.setItem('user-cart', JSON.stringify(updatedCart));
        Alert.alert('Produto salvo no carrinho');
        getQuantidadeCarrinho();
      }
    } catch (error) {
      Alert.alert('Falha ao tentar recuperar o carrinho.', error as string);
    }
  }

  async function getQuantidadeCarrinho() {
    let storedCart = await AsyncStorage.getItem('user-cart');
    let carrinho: Carrinho = storedCart ? JSON.parse(storedCart) : null;
    if (carrinho) {
      setQuantidadeCarrinho(carrinho.itens.length);
    } else {
      setQuantidadeCarrinho(0);
    }
  }

  useEffect(() => {
    if (isFocused) {
      getQuantidadeCarrinho();
      testeLogin(navigation);

      getPromocoes();
      getProdutos();
    }
  }, [isFocused]);

  return (
    <SafeAreaView>
      <HomeScreen navigation={navigation} quantidadeCarrinho={quantidadeCarrinho} />
      <PromocoesScreen item={promocoes} />
      <CategoriaScreen/>
      <ProductsScreen item={produtos} onAddToCart={buttonAdicionarCarrinho} />
    </SafeAreaView>
  );
}

const stylesPromocoes = StyleSheet.create({
    boxPromocoes:{
        borderWidth: 5,
        borderColor:'black',
        padding: 10,
        width: 200,
        height: 200
    }
});

const stylesProfile = StyleSheet.create({
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 10,
    },
    boxProfile: {
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
