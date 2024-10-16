import { FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../ApiConfigs/ApiRoute';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useToast } from 'react-native-toast-notifications';
import PesquisarPedidoCpf from './PesquisarPedidoCpf';
import MenuMesasGarcom from './MenuMesasGarcom';

type Mesa = {
    idMesa: string,
    numeroMesa: number,
    emUso: boolean,
    mesaSuja: boolean
};

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

type ProdutoQuantidadeDTO = {
    idProduto: string,
    nomeProduto: string,
    quantidade: number
}

type PedidosProntosGarcomDTO = {
    idPedido: string,
    produtoDTO: ProdutoQuantidadeDTO[],
    numeroMesa: number
}

const formatToReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const MenuGarcom = ({navigation}) => {
    const toast = useToast();
    const [categorias, setCategorias] = useState<{ label: string, value: number }[] | null>(null);
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [pedidos, setPedidos] = useState<Pedidos | null>(null);
    const [activeModal, setActiveModal] = useState<'none' | 'menu' | 'fecharConta' | 'escolha' | 'pedidoMesa' | 'visualizarPedidosMesa' | 'produtosCategoria' | 'pedidosClienteCpf' | 'pedidosProntos'>('none');
    const [produtosCategorias, setProdutosCategorias] = useState<ProductsMesaDTO[] | null>(null);
    const [categoriaPesquisa, setCategoriaPesquisa] = useState<string>('');
    const [modalProdutosCategoria, setModalProdutosCategoria] = useState<boolean>(false);
    const [produtosLancar, setProdutosLancar] = useState<ProductsMesaDTO[]>([]);
    const [buscaProduto, setBuscaProduto] = useState<string>('');
    const [produtoResponse, setProdutoResponse] = useState<ProductsMesaDTO[] | null>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [modalPedidosLancar, setModalPedidosLancar] = useState<boolean>(false);
    const [userCpf, setUserCpf] = useState<string>('');
    const [mesaSelecionada, setMesaSelecionada] = useState('');
    const [pedidosProntos, setPedidosProntos] = useState<PedidosProntosGarcomDTO[]>([]);
    const [notificacaoPedidoPronto, setNotificacaoPedidoPronto] = useState(false);
    /*
    useEffect(() => {
        const token = localStorage.getItem('session-token');
        if (token) {
            api.get('api/auth/garcom', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 403) {
                        toast.show("Falha ao tentar capturar o token", {
                            type: "danger",
                            placement: "top",
                            duration: 4000,
                            animationType: "slide-in",
                          });
                        navigation.navigate('Login')
                    } else {
                        toast.show("Falha ao tentar capturar o token", {
                            type: "danger",
                            placement: "top",
                            duration: 4000,
                            animationType: "slide-in",
                          });
                        navigation.navigate('Login')
                    }
                } else if (error.request) {
                    toast.show("Falha ao tentar capturar o token", {
                        type: "danger",
                        placement: "top",
                        duration: 4000,
                        animationType: "slide-in",
                      });
                    navigation.navigate('Login')
                } else {
                    toast.show("Falha ao tentar capturar o token", {
                        type: "danger",
                        placement: "top",
                        duration: 4000,
                        animationType: "slide-in",
                      });
                    navigation.navigate('Login')
                }
            });
        } else {
            toast.show("Falha ao tentar capturar o token", {
                type: "danger",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
              });
            navigation.navigate('Login')
        }
    }, []);

    */

    async function getProdutos()
    {
        api.post('api/products/get-by-categoria', null,{
            params:{categoria: categoriaPesquisa}
        })
        .then(response => {
            setProdutosCategorias(response.data);
            setNotificacaoPedidoPronto(true);
        })
        .catch(error => {
            toast.show("Falha ao tentar capturar os pedidos por categoria", {
                type: "danger",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
              });
        })
    }

    const fetchPedidos = async () => {
        api.get('api/pedidos/pronto')
        .then(response => {
            setPedidosProntos(response.data);
        })
        .catch(error => {
            toast.show("Falha ao tentar capturar os pedidos prontos.", {
                type: "danger",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
            });
        })
    }

    useEffect(() => {
        fetchPedidos();
        const interval = setInterval(fetchPedidos, 60000);
        return () => clearInterval(interval);
      }, []);

    useEffect(() => {
        if (modalProdutosCategoria) {
            getProdutos();
        }
    }, [categoriaPesquisa, modalProdutosCategoria]);
    
    useEffect(() => {
        const fetchMesas = async () => {
            api.get('api/mesa/get-all')
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

    useEffect(() => {
        async function getCategorias() {
            api.get('api/products/get-categories')
                .then(response => {
                    const formattedCategories = response.data.map((category, index) => ({
                        label: category,
                        value: index,
                    }));
                    setCategorias(formattedCategories);
                })
                .catch(error => {
                    toast.show("Falha ao tentar capturar as categorias", {
                        type: "danger",
                        placement: "top",
                        duration: 4000,
                        animationType: "slide-in",
                      });
                });
        }

        getCategorias();
    }, []);

    

    const openModal = (modalName: 'menu' | 'fecharConta' | 'escolha' | 'pedidoMesa' | 'visualizarPedidosMesa' | 'produtosCategoria' | 'pedidosClienteCpf' | 'pedidosProntos') => {
        setActiveModal(modalName);
    };

    const closeModal = () => {
        setActiveModal('none');
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

    async function getMesaInformation(idMesa: string) {
        const dataToSend = {
            idMesa: idMesa,
            token: ''
        };
        api.post('api/pedidos/get-by-mesa', dataToSend)
            .then(response => {
                setMesaSelecionada(idMesa);
                setPedidos(response.data);
                openModal('menu');
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

    const renderModalEscolha = () => {
        return (
            <View style={styles.modalView}>
                <Pressable style={{
                    backgroundColor: 'green',
                    borderRadius: 5,
                    padding: 5,
                    marginLeft: 15
                    }} 
                    onPress={() => openModal('visualizarPedidosMesa')}
                >
                    <Text style={{ color: 'white' }}>Ver pedidos da mesa</Text>
                </Pressable>
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
            </View>
        );
    };

    
    const renderMenu = () => {
        if (mesas.length > 0) {
            return (
                <View style={{ padding: 20 }}>
                    <PesquisarPedidoCpf/>
                    <MenuMesasGarcom/>
                </View>
            );
        } else {
            return (
                <Text>Nenhuma mesa disponível no momento.</Text>
            );
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

    const renderModalVisualizarPedidosMesa = () => {
        if (pedidos && pedidos.pedidosMesa) {
            if (pedidos.pedidosMesa.length > 0) {
                return (
                    <View style={styles.modalView}>
                        <FlatList
                            data={pedidos.pedidosMesa}
                            renderItem={renderPedidosMesa}
                            keyExtractor={(item) => item.idPedido}
                        />
                        <Text>Valor total: {formatToReais(pedidos.valorTotal)}</Text>
                        <Pressable onPress={closeModal}>
                            <Text style={{ backgroundColor: 'blue', color: 'white' }}>X</Text>
                        </Pressable>
                    </View>
                );
            } else {
                return (
                    <View style={styles.modalView}>
                        <Text>A mesa não possui pedidos</Text>
                        <Pressable onPress={closeModal} style={{ position: 'absolute', top: 15, right: 15 }}>
                            <Icon name='x' size={15}></Icon>
                        </Pressable>
                    </View>
                );
            }
        }
    }

    const renderProdutosProntos = ({item}: {item: ProdutoQuantidadeDTO}) => {
        return(
            <View>
                <Text>{item.nomeProduto} x ({item.quantidade})</Text>
            </View>
        )
    }

    const renderPedidosProntos = ({ item }: { item: PedidosProntosGarcomDTO }) => {
        return(
            <View style={{borderWidth:1, borderColor:'black'}}>
                <FlatList
                    data={item.produtoDTO}
                    renderItem={renderProdutosProntos}
                    keyExtractor={(item) => item.idProduto}
                    style={{width: '60%'}}
                />
                <Text>Numero da mesa: {item.numeroMesa}</Text>
                <Pressable style={{borderRadius:10, backgroundColor:'green'}}>
                    <Text style={{color:'white'}}>Entregue</Text>
                </Pressable>
            </View>
        );
    }
    const renderModalPedidosProntos = () => {
        if (pedidosProntos.length > 0 && pedidosProntos)
        {
            //setNotificacaoPedidoPronto(false);
            return(
                <View style={styles.modalView}>
                    <FlatList
                        data={pedidosProntos}
                        renderItem={renderPedidosProntos}
                        keyExtractor={(item) => item.idPedido}
                        style={{width: '60%'}}
                    />
                </View>
            );
        }
        else{
            return(
                <View style={styles.modalView}>
                    <Text>Nenhum pedido pronto no momento</Text>
                    <Pressable onPress={() => closeModal()} style={{position:'absolute', top:15, right:15}}>
                        <Icon name='x' size={15}></Icon>
                    </Pressable>
                </View>
            );
        }
    }

    const renderModals = () => {
        switch (activeModal) {
            case 'menu':
                return (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={true}
                        onRequestClose={closeModal}
                    >
                        {renderModalEscolha()}
                    </Modal>
                );
            case 'visualizarPedidosMesa':
            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={closeModal}
                >
                    {renderModalVisualizarPedidosMesa()}
                </Modal>
                );
            case 'escolha':
                return (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={true}
                        onRequestClose={closeModal}
                    >
                        {renderModalEscolha()}
                    </Modal>
                );
            case 'pedidosProntos':
            return(
                <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={closeModal}
                >
                    {renderModalPedidosProntos()}
                </Modal>
            )
            default:
                return null;
        }
    };

    const renderBell = () => {
        if (notificacaoPedidoPronto === true)
        {
            return(
                <Pressable onPress={() => openModal('pedidosProntos')} style={{borderColor:'green'}}>
                    <Icon name='bell' size={40}></Icon>
                </Pressable>
            );
        }
        else{
            return(
                <Pressable onPress={() => openModal('pedidosProntos')}>
                    <Icon name='bell' size={40}></Icon>
                </Pressable>
            );
        }
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    {renderBell()}
                    {renderMenu()}
                    {renderModals()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
    modalPesquisarProduto: {
        marginVertical: 20,
        marginHorizontal: 'auto',
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
        width: 600,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    placeholder: {
        color: 'gray',
    },
    selectedText: {
        fontSize: 16,
    },
    inputSearch: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        width: 20,
        height: 20,
    },
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
        marginLeft: 15,
    },
    deleteButtonText: {
        color: 'white',
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
    categoria: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(24, 172, 217, 0.2)',
        borderColor: '#18acd9',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    botaoConferirPedido: {
        borderRadius: 30,
        padding: 10,
        backgroundColor: '#18acd9',
        marginTop: 10,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default MenuGarcom;
