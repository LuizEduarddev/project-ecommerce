import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Item  = {
    idProd: string,
    nomeProd: string,
    precoProd: number,
    promoProd: boolean
}

type Carrinho = {
    idProd: string,
    nomeProd: string,
    precoProd: number,
    valorTotalCarrinho: number
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

const HomeScreen = () => {
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

    function buttonAdicionarCarrinho(item: Item) {
        // Adicione sua lógica para adicionar ao carrinho aqui
    }

    useEffect(() => {
        testeLogin(navigation);

        getPromocoes();
        getProdutos();
    }, [])
    
    return(
        <SafeAreaView>
            <HomeScreen />

            <PromocoesScreen item={promocoes} onAddToCart={buttonAdicionarCarrinho} />
            <ProductsScreen item={produtos} onAddToCart={buttonAdicionarCarrinho} />
        </SafeAreaView>
    );
}
