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

const RenderPromocoes = ({ item }: { item: Item }) => {
    
    return(
        <View>
            <Text>{item.nomeProd}</Text>
            <Text>{item.precoProd}</Text>
        </View>
    );
}

const PromotionsScreen = ({item}: {item: Item[] | null}) => {
    if (item != null)
    {
        return(
            <View>
                <Text>Promocoes do dia</Text>
                <FlatList
                    data={item}
                    renderItem={({item}) => <RenderPromocoes item={item}/>}
                />
            </View>
        );
    }
    else{
        return(null);
    }    
}
const ProductsScreen = ({item}: {item: Item[] | null}) => {
    if (item != null)
    {
        return(
            <View>
                <Text>Promocoes do dia</Text>
                <FlatList
                    data={item}
                    renderItem={({item}) => <RenderPromocoes item={item}/>}
                />
            </View>
        );
    }
    else{
        return(null);
    }    
}

const HomeScreen = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsername = async () => {
            try
            {
                const promise = await AsyncStorage.getItem('username');
                setUsername(promise);
                setLoading(false);
            }
            catch(error)
            {
                Alert.alert('Falha ao tentar pegar o nome do usuário');
            }
        }

        fetchUsername();
    }, [])

    if (loading)
    {
        return(
            <View>
                <View>
                    <Text>Carregando informacoes de perfil.</Text>
                    <Image
                    src={require('./assets/yasuo.png')}
                    />
                </View>
            </View>
        );
    }

    return(
        <View>
            <View>
                <Text>Olá, {username}</Text>
            </View>
        </View>
    );

}

async function testeLogin(navigation)
{
    const sessionToken = await AsyncStorage.getItem('session-token');
    if (sessionToken == null)
    {
        Alert.alert('Parece que houve um erro ao tentar buscar o usuário.');
        navigation.navigate('Login');
    }
}

export default function Home({navigation})
{
    const [promocoes, setPromocoes] = useState<Item[] | null>(null);
    const [produtos, setProdutos] = useState<Item[] | null>(null);

    useEffect(() => {
        
        testeLogin(navigation);

        axios.get('http://192.168.0.111:8080/api/products/get-promotion')
        .then(response => {
            setPromocoes(response.data);
        })
        .catch(error => {
            Alert.alert('Ocorreu um erro ao tentar buscar as promocoes.');
        })

    }, [])
    
    return(
        <SafeAreaView>
            <HomeScreen/>
            <PromotionsScreen item={promocoes}/>
        </SafeAreaView>
    );
}