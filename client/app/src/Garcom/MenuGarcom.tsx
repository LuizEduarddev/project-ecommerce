import { FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../ApiConfigs/ApiRoute';
import { Dropdown } from 'react-native-element-dropdown';

type Mesa = {
    idMesa: string,
    numeroMesa: number,
    emUso: boolean,
    mesaSuja: boolean
};

type ProductsMesaDTO = {
    idProduto: string,
    nomeProd: string,
    precoProd: number;
    quantidadeProduto: number;
};

type PedidosMesaDTO = {
    idPedido: string,
    pedidoPronto: boolean,
    produtos: ProductsMesaDTO[];
};

type Pedidos = {
    pedidosMesa: PedidosMesaDTO[],
    valorTotal: number;
};

type FormaDePagamento = 'pix' | 'crédito' | 'débito' | 'dinheiro';

const formasDePagamento: { label: string; value: FormaDePagamento }[] = [
    { label: 'Pix', value: 'pix' },
    { label: 'Crédito', value: 'crédito' },
    { label: 'Débito', value: 'débito' },
    { label: 'Dinheiro', value: 'dinheiro' },
];

const formatToReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const MenuGarcom = () => {
    const [categorias, setCategorias] = useState<{ label: string, value: number }[] | null>(null);
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [pedidos, setPedidos] = useState<Pedidos | null>(null);
    const [formaDePagamentoEscolhida, setFormaDePagamentoEscolhida] = useState<FormaDePagamento | undefined>();
    const [activeModal, setActiveModal] = useState<'none' | 'menu' | 'fecharConta' | 'escolha' | 'pedidoMesa' | 'visualizarPedidosMesa' | 'produtosCategoria'>('none');
    const [produtosCategorias, setProdutosCategorias] = useState<ProductsMesaDTO[] | null>(null);
    const [categoriaPesquisa, setCategoriaPesquisa] = useState<string>('');
    const [modalProdutosCategoria, setModalProdutosCategoria] = useState<boolean>(false);
    const [lancarProdutoPedido, setLancarProdutoPedido] = useState<ProductsMesaDTO[] | null>();
    const [produtoInicialQuantidade, setProdutoInicialQuantidade] = useState<ProductsMesaDTO[] | null>();

    async function getProdutos()
    {
        api.post('api/products/get-by-categoria', null,{
            params:{categoria: categoriaPesquisa}
        })
        .then(response => {
            setProdutosCategorias(response.data);
        })
        .catch(error => {
            console.log(error as string);
        })
    }


    useEffect(() => {
        if (modalProdutosCategoria) {
            getProdutos();
        }
    }, [categoriaPesquisa, modalProdutosCategoria]);
    
    useEffect(() => {
        const fetchMesas = async () => {
            api.post('api/mesa/get-all', "", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    setMesas(response.data);
                })
                .catch(error => {
                    console.log(error as string);
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
                    console.log(error);
                });
        }

        getCategorias();
    }, []);

    const openModal = (modalName: 'menu' | 'fecharConta' | 'escolha' | 'pedidoMesa' | 'visualizarPedidosMesa' | 'produtosCategoria') => {
        setActiveModal(modalName);
    };

    const closeModal = () => {
        setActiveModal('none');
    };

    const renderCategories = ({ item }: { item: { label: string, value: number } }) => {
        return (
            <View>
                <Pressable style={{ padding: 5, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 15 }} onPress={() => openProdutosCategoria(item.label)}>
                    <Text style={{ color: 'white' }}>{item.label}</Text>
                </Pressable>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalProdutosCategoria}
                    onRequestClose={() => setModalProdutosCategoria(false)}
                >
                    {renderModalProdutosCategoria()}
                </Modal>
            </View>
        );
    };

    const openProdutosCategoria = (item: string) => {
        setCategoriaPesquisa(item);
        setModalProdutosCategoria(true);
    }

    const finalizarPedido = () => {
        closeModal();
        openModal('fecharConta');
    };

    async function gerarPagamento()
    {

    }

    const renderModalFecharConta = () => {
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
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            inputSearchStyle={styles.inputSearch}
                            iconStyle={styles.icon}
                            data={formasDePagamento}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Forma de pagamento"
                            value={formaDePagamentoEscolhida}
                            onChange={(item) => {
                                setFormaDePagamentoEscolhida(item.value);
                            }}
                        />
                        <Pressable
                            style={{ backgroundColor: 'green', borderColor: 'green', borderWidth: 1 }}
                            onPress={() => { gerarPagamento() }}
                        >
                            <Text style={{ color: 'white' }}>Finalizar pedido</Text>
                        </Pressable>
                        <Pressable onPress={closeModal}>
                            <Text style={{ backgroundColor: 'blue', color: 'white' }}>X</Text>
                        </Pressable>
                    </View>
                );
            } else {
                return (
                    <View style={styles.modalView}>
                        <Text>A mesa não possui pedidos</Text>
                        <Pressable onPress={closeModal}>
                            <Text style={{ backgroundColor: 'blue' }}>X</Text>
                        </Pressable>
                    </View>
                );
            }
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

    const renderPedidosMesa = ({ item }: { item: PedidosMesaDTO }) => {
        if (item != null) {
            return (
                <View>
                    <FlatList
                        data={item.produtos}
                        renderItem={renderProdutos}
                        keyExtractor={(item) => item.idProduto}
                    />
                    <Text>{item.pedidoPronto ? 'pronto' : 'em preparo'}</Text>
                </View>
            );
        } else {
            return (
                <View></View>
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
                setPedidos(response.data);
                openModal('menu');
            })
            .catch(error => {
                console.log(error as string);
            });
    }

    const renderModalEscolha = () => {
        return (
            <View style={styles.modalView}>
                <Pressable style={{ backgroundColor: 'blue', borderColor: 'black', borderWidth: 1 }} onPress={() => openModal('visualizarPedidosMesa')}>
                    <Text style={{ color: 'white' }}>Ver pedidos da mesa</Text>
                </Pressable>
                <Pressable style={{ backgroundColor: 'blue', borderColor: 'black', borderWidth: 1 }} onPress={() => openModal('pedidoMesa')}>
                    <Text style={{ color: 'white' }}>Lançar pedido mesa</Text>
                </Pressable>
            </View>
        );
    };

    const renderModalPedidoMesa = () => {
        if (categorias && categorias.length > 0) {
            return (
                <View style={styles.modalView}>
                    <FlatList
                        data={categorias}
                        horizontal={true}
                        renderItem={renderCategories}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <Pressable onPress={() => closeModal()} style={{ padding: 5, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 15 }}>
                        <Text style={{ color: 'white' }}>X</Text>
                    </Pressable>
                </View>
            );
        } else {
            return (
                <View>
                    <Text>Ocorreu um erro ao tentar renderizar as categorias.</Text>
                </View>
            );
        }
    };

    const renderMenu = () => {
        if (mesas.length > 0) {
            return (
                <View>
                    <FlatList
                        data={mesas}
                        horizontal={true}
                        renderItem={renderMesa}
                        keyExtractor={(item) => item.idMesa}
                    />
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
                        <Pressable
                            style={{ backgroundColor: 'green', borderColor: 'green', borderWidth: 1 }}
                            onPress={() => { finalizarPedido() }}
                        >
                            <Text style={{ color: 'white' }}>Finalizar pedido</Text>
                        </Pressable>
                        <Pressable onPress={closeModal}>
                            <Text style={{ backgroundColor: 'blue', color: 'white' }}>X</Text>
                        </Pressable>
                    </View>
                );
            } else {
                return (
                    <View style={styles.modalView}>
                        <Text>A mesa não possui pedidos</Text>
                        <Pressable onPress={closeModal}>
                            <Text style={{ backgroundColor: 'blue' }}>X</Text>
                        </Pressable>
                    </View>
                );
            }
        }
    }

    const renderProdutosCategorias = ({ item }: { item: ProductsMesaDTO }) => {
        const quantity = item.quantidadeProduto || 1;
        return (
            <View>
                <Text>{item.nomeProd} - {formatToReais(item.precoProd)}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable
                        style={{ padding: 5, backgroundColor: 'green', marginRight: 10 }}
                        //onPress={() => //saveProduto(item)}
                    >
                        <Text style={{ color: 'white' }}>Adicionar Produto</Text>
                    </Pressable>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable
                            style={{ padding: 5, backgroundColor: 'blue', marginRight: 5 }}
                            //onPress={() => decreaseQuantity(item.idProduto)} 
                        >
                            <Text style={{ color: 'white' }}>-</Text>
                        </Pressable>
                        <Text style={{ marginHorizontal: 5 }}>{quantity}</Text>
                        <Pressable
                            style={{ padding: 5, backgroundColor: 'blue', marginLeft: 5 }}
                            //onPress={() => increaseQuantity(item.idProduto)} 
                        >
                            <Text style={{ color: 'white' }}>+</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    };

    const renderModalProdutosCategoria = () => {
        if (produtosCategorias && produtosCategorias.length > 0)
        {
            return(
                <View style={styles.modalView}>
                    <FlatList
                        data={produtosCategorias}
                        renderItem={renderProdutosCategorias}
                        keyExtractor={(item) => item.idProduto}
                    />
                    <Pressable onPress={() => setModalProdutosCategoria(false)} style={{padding:5, borderColor:'black', borderWidth: 1, backgroundColor: 'blue'}}>
                        <Text style={{color:'white'}}>X</Text>
                    </Pressable>
                </View>
            );
        }
        else{
            return(
                <View style={styles.modalView}>
                    <Text>Nenhum produto desta categoria disponível.</Text>
                    <Pressable onPress={() => setModalProdutosCategoria(false)} style={{padding:5, borderColor:'black', borderWidth: 1, backgroundColor: 'blue'}}>
                        <Text style={{color:'white'}}>X</Text>
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
            case 'fecharConta':
                return (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={true}
                        onRequestClose={closeModal}
                    >
                        {renderModalFecharConta()}
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
            case 'pedidoMesa':
                return (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={true}
                        onRequestClose={closeModal}
                    >
                        {renderModalPedidoMesa()}
                    </Modal>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View>
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
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
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
});

export default MenuGarcom;
