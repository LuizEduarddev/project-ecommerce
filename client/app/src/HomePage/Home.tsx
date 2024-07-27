import { useCallback, useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';   
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

type Item  = {
    idProd: string,
    nomeProd: string,
    precoProd: number,
    promoProd: boolean,
    quantidade: number
}

type Carrinho = {
    itens: Item[],
    valorTotalCarrinho: number
}

type HomeScreenProps = {
    navigation: any
} 

const RenderProdutos = ({ item, onAddToCart }: { item: Item, onAddToCart: (item: Item) => void }) => {
    return(
        <View>
            <Text>{item.nomeProd}</Text>
            <Text>{item.precoProd}</Text>
            <Button
                title="Adicionar ao carrinho"
                onPress={() => onAddToCart(item)}
            />
        </View>
    );
}

const RenderPromocoes = ({ item }: { item: Item }) => {
    return(
        <View>
            <Text>{item.nomeProd}</Text>
            <Text>{item.precoProd}</Text>
        </View>
    );
}

const ProductsScreen = ({ item, onAddToCart }: { item: Item[] | null, onAddToCart: (item: Item) => void }) => {
    if (item != null) {
        return(
            <View>
                <Text>Nossos produtos</Text>
                <FlatList
                    data={item}
                    renderItem={({ item }) => <RenderProdutos item={item} onAddToCart={onAddToCart} />}
                />
            </View>
        );
    } else {
        return(
            <Text>Os produtos não estão disponíveis no momento</Text>
        );
    }    
}

const PromocoesScreen = ({ item }: { item: Item[] | null }) => {
    if (item != null) {
        return(
            <View>
                <Text>Promoções do dia</Text>
                <FlatList
                    data={item}
                    renderItem={({ item }) => <RenderPromocoes item={item}/>}
                />
            </View>
        );
    } else {
        return(
            <Text>As promoções não estão disponíveis no momento</Text>
        );
    }    
}

const HomeScreen = ({ navigation, quantidadeCarrinho }: HomeScreenProps & { quantidadeCarrinho: number }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const promise = await AsyncStorage.getItem('username');
                setUsername(promise);
                setLoading(false);
            } catch(error) {
                Alert.alert('Falha ao tentar pegar o nome do usuário');
            }
        };

        fetchUsername();
    }, []);

    if (loading) {
        return(
            <View>
                <Text>Carregando informações de perfil.</Text>
            </View>
        );
    }

    return(
        <View>
            <View>
                <Text>Olá, {username}</Text>
                <Image
                    source={require('./assets/yasuo.png')}
                />
                <Icon.Button name="shopping-cart" onPress={() => navigation.navigate('Cart')}>
                    <Text>
                        Carrinho 
                        <Text> {quantidadeCarrinho}</Text>
                    </Text>
                </Icon.Button>
            </View>
        </View>
    );
}

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
        axios.get('http://192.168.105.26:8080/api/products/get-promotion')
        .then(response => {
            setPromocoes(response.data);
        })
        .catch(error => {
            Alert.alert('Ocorreu um erro ao tentar buscar as promoções.');
        });
    }

    async function getProdutos() {
        axios.get('http://192.168.105.26:8080/api/products/get-all')
        .then(response => {
            setProdutos(response.data);
        })
        .catch(error => {
            Alert.alert('Ocorreu um erro ao tentar buscar os produtos.');
        });
    }

    async function buttonAdicionarCarrinho(item: Item) {
        try{
            item.quantidade = 1;
            let storedCart = await AsyncStorage.getItem('user-cart');
            let carrinho: Carrinho = storedCart ? JSON.parse(storedCart) : { itens: [], valorTotalCarrinho: 0 };
            
            const newKey = item.idProd;
            if (carrinho.itens.find(carrinhoItem => carrinhoItem.idProd === newKey))
            {
                Alert.alert(item.nomeProd + ' já está no carrinho.');
            }
            else{
                const newItens = [...carrinho.itens, item];
                const newTotalValue = carrinho.valorTotalCarrinho + item.precoProd;
                
                const updatedCart: Carrinho = {
                    itens: newItens,
                    valorTotalCarrinho: newTotalValue
                };

                await AsyncStorage.setItem('user-cart', JSON.stringify(updatedCart));
                Alert.alert('Produto salvo no carrinho');
                getQuantidadeCarrinho();
            }          
        }
        catch(error)
        {
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
            <ProductsScreen item={produtos} onAddToCart={buttonAdicionarCarrinho} />
        </SafeAreaView>
    );
}
