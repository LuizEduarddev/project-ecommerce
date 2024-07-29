import { useCallback, useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';   
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { Dimensions } from "react-native";

const { width } = Dimensions.get('window');


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

const RenderPromocoes = ({ item, index }: { item: Item, index: number }) => (
    <View style={[styles.itemContainer, index === 1 ? styles.middleItem : null]}>
        <Text style={styles.productName}>{item.nomeProd}</Text>
        <Text style={styles.productPrice}>{item.precoProd}</Text>
        <Text style={styles.productPromo}>{item.promoProd ? "Em promoção" : "Preço normal"}</Text>
        <Text style={styles.productQuantity}>Quantidade: {item.quantidade}</Text>
    </View>
);

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
        return (
            <View>
                <Text style={styles.title}>Promoções do dia</Text>
                <FlatList
                    data={item}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.idProd}
                    renderItem={({ item, index }) => <RenderPromocoes item={item} index={index} />}
                />
            </View>
        );
    } else {
        return (
            <Text style={styles.noPromotions}>As promoções não estão disponíveis no momento</Text>
        );
    }
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
        <View style={styles.boxProfile}>
            <Text style={styles.greetingText}>Olá, {username}</Text>
            <Icon.Button style={styles.buttonCarrinho} name="shopping-cart" onPress={() => navigation.navigate('Cart')}>
                <Text>
                    Carrinho
                </Text>
                <Text style={styles.quantidadeCarrinho}> {quantidadeCarrinho}</Text>
            </Icon.Button>
            <TouchableOpacity onPress={() => navigation.navigate('MenuProfile')}>
                <Image
                    style={styles.profileImage}
                    source={require('./assets/yasuo.png')}
                />
            </TouchableOpacity>
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

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 10,
    },
    noPromotions: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10,
    },
    itemContainer: {
        width: width * 0.8,
        marginHorizontal: width * 0.1,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleItem: {
        transform: [{ scale: 1.1 }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: 'green',
    },
    productPromo: {
        fontSize: 14,
        color: 'red',
    },
    productQuantity: {
        fontSize: 14,
        color: 'blue',
    },
    boxProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    greetingText: {
        marginRight: 10, // Adjust margin as needed
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
    boxPromocoes:{
        alignItems:'center',
        display:"flex",
        borderColor: 'black',
        justifyContent:"space-between", 
        width: 250,
        borderWidth: 2,
        margin: 'auto',
        padding:5
    }
});