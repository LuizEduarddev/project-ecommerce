import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import api from '../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome6';

type ProductsMesaDTO = {
    idProd: string,
    nomeProd: string,
    precoProd: number;
    quantidadeProduto: number;
};

type PedidosMesaDTO = {
    idPedido: string,
    pedidoPronto: boolean,
    produtos: ProductsMesaDTO[],
    cpfClientePedido: string
};

type Pedidos = {
    pedidosMesa: PedidosMesaDTO[],
    valorTotal: number;
};

const PesquisarPedidoCpf = () => {
  
    const toast = useToast();
    const [buscaPorCpf, setBuscaPorCpf] = useState('');
    const [pedidoCpf, setPedidoCpf] = useState<Pedidos>();
    const [modalPedidoCliente, setModalPedidoCliente] = useState(false);
    
    const getUnformattedCpf = (userCpf: string) => userCpf.replace(/\D/g, '');
    
    const formatToReais = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };
    
    async function findPedido(query: string) {
        const token = localStorage.getItem('session-token');
        if (token === null) window.location.reload();
        if (query === "") {
            return;
        } else {
            const dto = {
                token:token,
                cpf: query
            }
            api.post('api/pedidos/get-by-cpf', dto)
            .then(response => {
                setPedidoCpf(response.data);
                setModalPedidoCliente(true);
            })
            .catch(error => {
                toast.show("Falha ao buscar o pedido pelo CPF", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                  });
            });
        }
    }

    const handleSearchPedidoCpf = (text: string) => {
        const unformattedCPF = getUnformattedCpf(text);
        if (unformattedCPF?.length <= 11) {
            setBuscaPorCpf(text);

            if (getUnformattedCpf(text).length >= 11) {
                findPedido(getUnformattedCpf(text));
            }
        }
    };

    const renderModalPedidosCpf = () => {
        if (pedidoCpf && pedidoCpf.pedidosMesa.length > 0) {
            return (
                <View style={styles.modalView}>
                    <FlatList
                        data={pedidoCpf.pedidosMesa}
                        renderItem={renderPedidosMesa}
                        keyExtractor={(item) => item.idPedido}
                    />
                    <Pressable onPress={() => setModalPedidoCliente(false)} style={{position:'absolute', top:15, right:15}}>
                        <Icon name='x' size={15}></Icon>
                    </Pressable>
                </View>
            );
        } else {
            return (
                <View style={styles.modalView}>
                    <Text>Cliente não possui nenhum pedido.</Text>
                    <Pressable onPress={() => setModalPedidoCliente(false)} style={{position:'absolute', top:15, right:15}}>
                        <Icon name='x' size={15}></Icon>
                    </Pressable>
                </View>
            );
        }
    };
    
    const renderPedidosMesa = ({ item }: { item: PedidosMesaDTO }) => {
        if (item != null) {
            return (
                <View>
                    <Text>{item.cpfClientePedido}</Text>
                    <FlatList
                        data={item.produtos}
                        renderItem={renderProdutos}
                        keyExtractor={(item) => item.idProd}
                    />
                    <Text>{item.pedidoPronto ? 'pronto' : 'em preparo'}</Text>
                </View>
            );
        } else {
            return (
                <></>
            );
        }
    };

    const renderProdutos = ({ item }: { item: ProductsMesaDTO }) => {
        if (item != null) {
            return (
                <View>
                    <Text>{item.nomeProd} - x {item.quantidadeProduto}</Text>
                    <Text>{formatToReais(item.precoProd)} - {formatToReais(item.precoProd * item.quantidadeProduto)}</Text>
                </View>
            );
        } else {
            return (
                <Text>Produtos vazios</Text>
            );
        }
    };

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder='Busque o pedido pelo CPF'
                onChangeText={handleSearchPedidoCpf}
                value={buscaPorCpf}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalPedidoCliente && pedidoCpf !== null}  
                onRequestClose={() => setModalPedidoCliente(false)}
            >
                {pedidoCpf !== null ? renderModalPedidosCpf() : null}  
            </Modal>
        </View>
  )
}

export default PesquisarPedidoCpf

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        backgroundColor: '#fff',
        marginVertical: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
})