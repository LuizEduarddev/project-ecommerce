import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function Home({navigation})
{
    const [promocoes, setPromocoes] = useState<Item[] | null>(null);
    const [produtos, setProdutos] = useState<Item[] | null>(null);

    useEffect(() => {
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
            <PromotionsScreen item={promocoes}/>
        </SafeAreaView>
    );
}