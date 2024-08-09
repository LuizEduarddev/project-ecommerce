import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../ApiConfigs/ApiRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';

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


const renderProdutos = ({ item }: { item: Produtos }) => {
    return (
        <View>
            <Text>{item.nomeProd}</Text>
            <Text>{item.precoProd}</Text>
        </View>
    );
}

const RenderPedidos = ({ item, navigation }: { item: Pedidos, navigation}) => {
    return (
        <View>
            <Text>{item.dataPedido}</Text>
            <Text>{item.horaPedido}</Text>
            <Text>{item.totalPedido}</Text>
            <FlatList
                data={item.produtos}
                renderItem={renderProdutos}
                keyExtractor={(produto) => produto.idProd}
            />
            <Button
                title='Efetuar pagamento'
                onPress={() => navigation.navigate('Pagamento')}
            />
        </View>
    );
}

const Pendencias = ({ navigation }) => {
    const [pedidosPendentes, setPedidosPendentes] = useState<Pedidos[]>([]);

    useEffect(() => {
        getPedidos();
    }, []);

    async function getPedidos() {
        const token = await AsyncStorage.getItem('session-token');
        if (token) {
            api.post('api/pedidos/pendencias', token)
            .then(response => {
                setPedidosPendentes(response.data);
                console.log(response.data);
            })
            .catch(error => {
                Alert.alert(error as string);
            });
        }
    }

    return (
        <SafeAreaView>
            <View>
                {pedidosPendentes.length > 0 ? (
                    <FlatList
                        data={pedidosPendentes}
                        renderItem={({item}) => <RenderPedidos navigation={navigation} item={item} />}
                        keyExtractor={(pedido) => pedido.idPedido}
                    />
                ) : (
                    <Text>Você não possui pendências</Text>
                )}
            </View>
        </SafeAreaView>
    );
}

export default Pendencias;

const styles = StyleSheet.create({});
