import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../../../ApiConfigs/ApiRoute'

type Produtos = {
    idProd: string,
    nomeProd: string,
    precoProd: number
}

type Pedidos = {
    idPedido: string,
    dataPedido: string,
    horaPedido: string,
    totalPedido: number,
    pedidoPago: boolean,
    produtos: Produtos[]
}

const formatToReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const RenderProdutos = ({produto}:{produto:Produtos}) => {
    return(
        <View>
            <Text>{produto.nomeProd}</Text>
            <Text>{formatToReais(produto.precoProd)}</Text>
        </View>
    );
}   

const RenderPedidos = ({pedido}:{pedido:Pedidos}) => {
    return(
        <View>
            <Text>{pedido.dataPedido}</Text>
            <Text>{pedido.horaPedido}</Text>
            <Text>{pedido.pedidoPago}</Text>
            <Text>{pedido.dataPedido}</Text>
            <Text>{formatToReais(pedido.totalPedido)}</Text>
            <FlatList
                data={pedido.produtos}
                renderItem={({item}) => <RenderProdutos produto={item}/>}
                keyExtractor={(item) => item.idProd}
            />
        </View>
    );
}

const PedidosScreen = ({pedidos}:{pedidos:Pedidos[]}) => {
    if (pedidos)
    {
        return(
            <View>
                <FlatList
                    data={pedidos}
                    renderItem={({item}) => <RenderPedidos pedido={item}/>}
                    keyExtractor={(pedido) => pedido.idPedido}
                />
            </View>
        );
    }
    else{
        return(
            <View>
                <Text>Você não possui pedidos anteriores.</Text>
            </View>
        );
    }
}

async function getPedidosAnteriores(setPedidos: React.Dispatch<React.SetStateAction<Pedidos[] | null>>)
{
    const sessionToken = await AsyncStorage.getItem('session-token');
    if (sessionToken)
    {
        api.post('api/pedidos/get-by-user', sessionToken)
        .then(response => {
            setPedidos(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }
}

const PedidosCli = () => {
    const [pedidos, setPedidos] = useState<Pedidos[] | null>();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused)
        {
            getPedidosAnteriores(setPedidos);
        }
    }, [isFocused])

    return (
    <SafeAreaView>
        <PedidosScreen pedidos={pedidos}/>
    </SafeAreaView>
  )
}

export default PedidosCli

const styles = StyleSheet.create({})