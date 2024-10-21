import { FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import LancarPedidoGarcom from './LancarPedidoGarcom';


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

type Mesa = {
    idMesa: string,
    numeroMesa: number,
    emUso: boolean,
    mesaSuja: boolean
};

const formatToReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const MenuMesasGarcom = () => {
  
    const toast = useToast();
    const [showLancarPedidoModal, setShowLancarPedidoModal] = useState(false); 
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [mesaSelecionada, setMesaSelecionada] = useState('');
    const [pedidos, setPedidos] = useState<Pedidos | null>(null);
    const [modalVisualizarMesa, setModalVisualizarMesa] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('session-token');
        if (token === null) window.location.reload();
        const fetchMesas = async () => {
            api.get('api/mesa/get', {
                params:{
                    token:token
                }
            })
            .then(response => {
                setMesas(response.data);
            })
            .catch(error => {
                toast.show("Falha ao tentar capturar as mesas", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                });
            });
        };

        fetchMesas();
    }, []);

    const renderModalMesa = () => {
        /*
            <Pressable style={{
                    backgroundColor: 'blue',
                    borderRadius: 5,
                    padding: 5,
                    marginLeft: 15
                    }}  
                    onPress={() => openModal('pedidoMesa')}
                >
                    <Text style={{ color: 'white' }}>Lançar pedido mesa</Text>
                </Pressable>
                <Pressable style={{ position: 'absolute', top: 15, right: 15 }} onPress={() => closeModal()}>
                    <Icon name='x' size={15}></Icon>
                </Pressable>
        */
        return (
            <View>
                {openMesaPedidos()}
            </View>
        );
    };

    async function getMesaInformation(idMesa: string) {
        const token = localStorage.getItem('session-token');
        if (token === null) window.location.reload();
        const dataToSend = {
            idMesa: idMesa,
            token: token
        };
        api.post('api/pedidos/get-by-mesa', dataToSend)
        .then(response => {
            setMesaSelecionada(idMesa);
            setPedidos(response.data);
            setModalVisualizarMesa(true);
        })
        .catch(error => {
            toast.show("Falha ao tentar buscar os pedidos pela mesa", {
                type: "danger",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
                });
        });
    }

    const openMesaPedidos = () => {
        if (pedidos && pedidos.pedidosMesa) {
            if (pedidos.pedidosMesa.length > 0) {
                return (
                    <View style={styles.modalView}>
                        <Pressable 
                            onPress={() => setShowLancarPedidoModal(true)} 
                            style={{ borderColor: 'black', borderWidth: 1 }}>
                            <Text>Lançar pedido na mesa</Text>
                        </Pressable>
                        <FlatList
                            data={pedidos.pedidosMesa}
                            renderItem={renderPedidosMesa}
                            keyExtractor={(item) => item.idPedido}
                        />
                        <Text>Valor total: {formatToReais(pedidos.valorTotal)}</Text>
                        <Pressable onPress={() => setModalVisualizarMesa(false)}>
                            <Text style={{ backgroundColor: 'blue', color: 'white' }}>X</Text>
                        </Pressable>
    
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showLancarPedidoModal}  
                            onRequestClose={() => setShowLancarPedidoModal(false)} 
                        >
                            <LancarPedidoGarcom
                                idMesa={mesaSelecionada}
                                modalTela={showLancarPedidoModal}
                            />
                        </Modal>
                    </View>
                );
            } else {
                return (
                    <View style={styles.modalView}>
                        <Text>A mesa não possui pedidos</Text>
                        <Pressable 
                            onPress={() => setShowLancarPedidoModal(true)} 
                            style={{ borderColor: 'black', borderWidth: 1 }}>
                            <Text>Lançar pedido na mesa</Text>
                        </Pressable>
    
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showLancarPedidoModal}  
                            onRequestClose={() => setShowLancarPedidoModal(false)}
                        >
                            <LancarPedidoGarcom
                                idMesa={mesaSelecionada}
                                modalTela={showLancarPedidoModal}
                            />
                        </Modal>
                    </View>
                );
            }
        }
    };

    const renderMesa = ({ item }: { item: Mesa }) => {
        if (item.emUso) {
            return (
                <View>
                    <View style={styles.mesaContainer}>
                        <Pressable onPress={() => getMesaInformation(item.idMesa)}>
                            <Image
                                style={{ backgroundColor: 'red', width: 50, height: 50 }}
                                source={require('./assets/mesaIcon.png')}
                            />
                            <Text style={styles.mesaText}>{item.numeroMesa}</Text>
                        </Pressable>
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <View style={styles.mesaContainer}>
                        <Pressable onPress={() => getMesaInformation(item.idMesa)}>
                            <Image
                                style={{ width: 50, height: 50 }}
                                source={require('./assets/mesaIcon.png')}
                            />
                            <Text style={styles.mesaText}>{item.numeroMesa}</Text>
                        </Pressable>
                    </View>
                </View>
            );
        }
    };

    const renderPedidosMesa = ({ item }: { item: PedidosMesaDTO }) => {
        if (item != null) {
            return (
                <View style={{borderWidth:1, borderColor:'black', borderRadius:5}}>
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
            <FlatList
                data={mesas}
                horizontal={true}
                renderItem={renderMesa}
                keyExtractor={(item) => item.idMesa}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisualizarMesa}
                onRequestClose={() => setModalVisualizarMesa(false)}
            >
                {renderModalMesa()}
            </Modal>
        </View>
  )
}

export default MenuMesasGarcom

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
    mesaContainer: {
        margin: 5,
        padding: 15,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        alignItems: 'center',
    },
    mesaText: {
        fontSize: 18,
        color: 'black',
    },
})