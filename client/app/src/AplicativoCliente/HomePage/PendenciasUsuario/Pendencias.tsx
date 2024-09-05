import { Alert, Button, FlatList, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../../ApiConfigs/ApiRoute'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import WebView from 'react-native-webview'

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

const Pendencias = ({ navigation }) => {
    const [pedidosPendentes, setPedidosPendentes] = useState<Pedidos[]>([]);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [tokenCliente, setTokenCliente] = useState<string>();
    const [ultimoPagamento, setUltimoPagamento] = useState<Pedidos | null>(null);
    const [checkTime, setCheckTimes] = useState<number>(0);

    useEffect(() => {
        getPedidos();
    }, []);

    const RenderPedidos = ({ item }: { item: Pedidos }) => {
        if (item.pedidoPago === false)
        {
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
                        onPress={() => efetuarPagamento(item)}
                    />
                </View>
            );
        }
        else{
            return (
                <View>
                    <Text>Pedido</Text>
                    <Text>{item.dataPedido}</Text>
                    <Text>{item.horaPedido}</Text>
                    <Text>{item.totalPedido}</Text>
                    <FlatList
                        data={item.produtos}
                        renderItem={renderProdutos}
                        keyExtractor={(produto) => produto.idProd}
                    />
                </View>
            );
        }
        
    }

    async function efetuarPagamento(item: Pedidos) {
        setUltimoPagamento(item);
        const dataToSend = {
            idPedido: item.idPedido,
            token: tokenCliente
        };

        api.post('api/pagamentos/pagamento', dataToSend)
        .then(response => {
            const linkPagamento = response.data.pointOfInteraction.transactionData.ticketUrl;
            if (linkPagamento) {
                setPaymentUrl(linkPagamento);
                setModalVisible(true);
                checkPaymentStatus(item.idPedido); 
            } else {
                Alert.alert("Invalid payment link.");
            }
        })
        .catch(error => {
            Alert.alert(error as string);
        })
    }

    async function getPedidos() {
        const token = await AsyncStorage.getItem('session-token');
        if (token) {
            setTokenCliente(token);
            api.post('api/pedidos/pendencias', token)
            .then(response => {
                setPedidosPendentes(response.data);
            })
            .catch(error => {
                Alert.alert(error as string);
            });
        }
    }

    async function checkPaymentStatus(idPedido) {
        const dataToSend = {
            idPedido: idPedido,
            token: tokenCliente
        };
        api.post('api/pagamentos/check', dataToSend)
        .then(response =>{
            console.log(response.data);
            setModalVisible(false); 
        })
        .catch(error => 
        {
            Alert.alert(error as string);
        }
        )
    }

    return (
        <SafeAreaView>
            <View>
                {pedidosPendentes.length > 0 ? (
                    <FlatList
                        data={pedidosPendentes}
                        renderItem={({ item }) => <RenderPedidos item={item} />}
                        keyExtractor={(pedido) => pedido.idPedido}
                    />
                ) : (
                    <Text>Você não possui pendências</Text>
                )}
            </View>
            <Modal
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                style={styles.modal}
            >
                <WebView source={{ uri: paymentUrl }} />
                <Button title="Close" onPress={() => setModalVisible(false)} />
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 0,
    }
});

export default Pendencias;
