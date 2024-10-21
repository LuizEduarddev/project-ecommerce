import { FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../ApiConfigs/ApiRoute';
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
    const [categorias, setCategorias] = useState<string[]>([]);
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [pedidos, setPedidos] = useState<Pedidos | null>(null);
    const [activeModal, setActiveModal] = useState<'none' | 'menu' | 'fecharConta' | 'escolha' | 'pedidoMesa' | 'visualizarPedidosMesa' | 'produtosCategoria' | 'pedidosClienteCpf' | 'pedidosProntos'>('none');
    const [produtosCategorias, setProdutosCategorias] = useState<ProductsMesaDTO[] | null>(null);
    const [categoriaPesquisa, setCategoriaPesquisa] = useState<string>('');
    const [modalProdutosCategoria, setModalProdutosCategoria] = useState<boolean>(false);
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
        const token = localStorage.getItem('session-token');
        if (token === null) window.location.reload();
        const dto = {
            categoria: categoriaPesquisa,
            token:token
        }
        api.post('api/products/get-by-categoria', dto)
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

    /*
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
    */

    /*
    useEffect(() => {
        fetchPedidos();
        const interval = setInterval(fetchPedidos, 60000);
        return () => clearInterval(interval);
      }, []);

    */
    useEffect(() => {
        if (modalProdutosCategoria) {
            getProdutos();
        }
    }, [categoriaPesquisa, modalProdutosCategoria]);

    useEffect(() => {
        const token = localStorage.getItem('session-token')
        if (token === null) window.location.reload();
        async function getCategorias() {
            api.get('api/empresas/categorias/get-by-empresa', {
                params:{
                    token:token
                }
            })
            .then(response => {
                setCategorias(response.data);
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

    /*
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
    */

    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    {/*{renderBell()}*/}
                    <PesquisarPedidoCpf/>
                    <MenuMesasGarcom/>
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
