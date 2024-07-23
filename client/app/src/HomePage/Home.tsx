import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';

type Item  = {
    idProd: string,
    nomeProd: string,
    precoProd: number,
    promoProd: boolean
}

type Carrinho = {
    itens: Item[],
    valorTotalCarrinho: number
}

type HomeScreenProps = {
    quantidadeCarrinho: number
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

const RenderPromocoes = ({ item}: { item: Item}) => {
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

const PromocoesScreen = ({ item}: { item: Item[] | null}) => {
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

const HomeScreen = ({quantidadeCarrinho}: HomeScreenProps) => {
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
        }

        fetchUsername();
    }, [])

    if (loading) {
        return(
            <View>
                <View>
                    <Text>Carregando informações de perfil.</Text>
                </View>
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
                <Icon.Button name="shopping-cart">
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
    const [promocoes, setPromocoes] = useState<Item[] | null>(null);
    const [produtos, setProdutos] = useState<Item[] | null>(null);
    const [itensCarrinho, setItensCarrinho] = useState<number>(0);

    async function getItensCarrinho()
    {
        let storedCart = await AsyncStorage.getItem('user-cart');
        let carrinho: Carrinho = storedCart ? JSON.parse(storedCart) : { itens: [], valorTotalCarrinho: 0 };

        if (carrinho != null)
        {
            let number = 0;
            carrinho.itens.forEach(item => number += 1);
            setItensCarrinho(number);
        }
        else{
            setItensCarrinho(0);
        }
    }

    async function getPromocoes() {
        axios.get('http://192.168.0.112:8080/api/products/get-promotion')
        .then(response => {
            setPromocoes(response.data);
        })
        .catch(error => {
            Alert.alert('Ocorreu um erro ao tentar buscar as promoções.');
        })
    }

    async function getProdutos() {
        axios.get('http://192.168.0.112:8080/api/products/get-all')
        .then(response => {
            setProdutos(response.data);
        })
        .catch(error => {
            Alert.alert('Ocorreu um erro ao tentar buscar os produtos.');
        })
    }

    async function buttonAdicionarCarrinho(item: Item) {
        try{
            let storedCart = await AsyncStorage.getItem('user-cart');
            let carrinho: Carrinho = storedCart ? JSON.parse(storedCart) : { itens: [], valorTotalCarrinho: 0 };
            
            const newItens = [...carrinho.itens, item];
            const newTotalValue = carrinho.valorTotalCarrinho + item.precoProd;
            
            const updatedCart: Carrinho = {
            itens: newItens,
            valorTotalCarrinho: newTotalValue
            };
            
            setItensCarrinho(prevCount => prevCount + 1);

            await AsyncStorage.setItem('user-cart', JSON.stringify(updatedCart));
            Alert.alert('Produto salvo no carrinho');
        }
        catch(error)
        {
            Alert.alert('Falha ao tentar recuperar o carrinho.', error as string);
        }
        
    }

    useEffect(() => {
        testeLogin(navigation);

        getPromocoes();
        getProdutos();
        getItensCarrinho();
    }, [])
    
    return(
        <SafeAreaView>
            <HomeScreen quantidadeCarrinho={itensCarrinho}/>

            <PromocoesScreen item={promocoes} />
            <ProductsScreen item={produtos} onAddToCart={buttonAdicionarCarrinho} />
        </SafeAreaView>
    );
}
