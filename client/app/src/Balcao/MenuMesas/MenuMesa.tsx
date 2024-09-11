import { Alert, Button, FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../ApiConfigs/ApiRoute';
import { Dropdown } from 'react-native-element-dropdown';

type Mesa = {
    idMesa: string,
    numeroMesa: number,
    emUso: boolean,
    mesaSuja: boolean
}

type ProductsMesaDTO = {
    idProduto: string,
    nomeProd: string,
    precoProd: number,
    quantidadeProduto: number
}

type PedidosMesaDTO = {
    idPedido: string,
    pedidoPronto: boolean,
    produtos: ProductsMesaDTO[],
    cpfClientePedido: string
}

type Pedidos = {
    pedidosMesa: PedidosMesaDTO[],
    valorTotal: number
}
 
const formatToReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const MenuMesa = () => {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [pedidos, setPedidos] = useState<Pedidos | null>(null);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [modalSelecaoPedidoFechamento, setModalSelecaoPedidoFechamento] = useState<boolean>(false);
    const [pedidosSelecionadosFechamento, setPedidosSelecionadosFechamento] = useState<PedidosMesaDTO[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<ProductsMesaDTO[]>([]);
    const [contadorPedidosSelecionadosFechamento, setContadorPedidosSelecionadosFechamento] = useState(0);
    const [metodosPagamento, setMetodosPagamento] = useState<{ label: string, value: string }[]>([]);
    const [metodosPagamentoCarregados, setMetodosPagamentoCarregados] = useState<boolean>(false);
    const [modalConfirmacao, setModalConfirmacao] = useState<boolean>(false);
    const [modalFecharContaVisible, setModalFecharContaVisible] = useState<boolean>(false);
    const [formaDePagamentoEscolhida, setFormaDePagamentoEscolhida] = useState<string | null>(null);

    useEffect(() => {
        getMetodoPagamento();
    }, []);

    async function tryEfetuarPagamento()
    {
        const dataToSend = {
            idPedidos: pedidosSelecionadosFechamento.map(pedido => pedido.idPedido),
            metodoPagamento: formaDePagamentoEscolhida
        }
        api.post('api/pagamentos/add', dataToSend, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error as string);
        })
    }

    async function getMetodoPagamento() {
        try {
            const response = await api.get('api/pagamentos/get-metodos', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                    'Content-Type': 'application/json',
                }
            });
            const formattedCategories = response.data.map((category: string, index: number) => ({
                label: category,
                value: category,
            }));
            setMetodosPagamento(formattedCategories);
            setMetodosPagamentoCarregados(true);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const fetchMesas = async () => {
            try {
                const response = await api.get('api/mesa/get-all', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                        'Content-Type': 'application/json',
                    }
                });
                setMesas(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMesas();
    }, []);

    const toggleSelectPedido = (pedido: PedidosMesaDTO) => {
        const isSelected = pedidosSelecionadosFechamento.some(p => p.idPedido === pedido.idPedido);
        if (isSelected) {
            setPedidosSelecionadosFechamento(pedidosSelecionadosFechamento.filter(p => p.idPedido !== pedido.idPedido));
            setContadorPedidosSelecionadosFechamento(contadorPedidosSelecionadosFechamento - 1);
        } else {
            setPedidosSelecionadosFechamento([...pedidosSelecionadosFechamento, pedido]);
            setContadorPedidosSelecionadosFechamento(contadorPedidosSelecionadosFechamento + 1);
        }
    };

    const handleConfirmSelection = () => {
        const total = pedidosSelecionadosFechamento.reduce((acc, pedido) => {
            const produtos = pedidos?.pedidosMesa.find(p => p.idPedido === pedido.idPedido)?.produtos || [];
            return acc + produtos.reduce((prodAcc, produto) => prodAcc + (produto.precoProd * produto.quantidadeProduto), 0);
        }, 0);
        
        setTotalValue(total);
        setSelectedProducts(pedidosSelecionadosFechamento.flatMap(pedido => pedido.produtos));
    
        setModalSelecaoPedidoFechamento(false);
        setModalFecharContaVisible(true);
    };

    async function getMesaInformation(idMesa: string) {
        const dataToSend = {
            idMesa: idMesa,
            token: ''
        };
        try {
            const response = await api.post('api/pedidos/get-by-mesa', dataToSend, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setPedidos(response.data);
            setModalVisible(true);
        } catch (error) {
            console.error(error);
        }
    }

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
    }

    const renderModalFecharConta = () => {
        if (selectedProducts.length > 0 )
        {
            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalFecharContaVisible}
                    onRequestClose={() => setModalFecharContaVisible(false)}
                >
                    <View style={styles.modalView}>
                            <>
                                <FlatList
                                    data={selectedProducts}
                                    renderItem={({ item }) => (
                                        <View style={styles.pedidoItem}>
                                            <Text>{item.nomeProd} - x {item.quantidadeProduto}</Text>
                                            <Text>{formatToReais(item.precoProd * item.quantidadeProduto)}</Text>
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.idProduto}
                                />
                                <Text>Valor total: {formatToReais(totalValue)}</Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholder}
                                    selectedTextStyle={styles.selectedText}
                                    inputSearchStyle={styles.inputSearch}
                                    iconStyle={styles.icon}
                                    data={metodosPagamento}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Forma de pagamento"
                                    value={formaDePagamentoEscolhida}
                                    onChange={(item) => {
                                        setFormaDePagamentoEscolhida(item.value); // item.value will be the payment method like "pix"
                                    }}
                                />
                                <Pressable 
                                    style={styles.confirmButton}
                                    onPress={() => {
                                        setModalConfirmacao(true);
                                        // setPedidoFechamentoCompleto(selectedProducts); // handle complete payment action here
                                    }}
                                >
                                    <Text style={styles.confirmButtonText}>Gerar pagamento</Text>
                                </Pressable>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalConfirmacao}
                                    onRequestClose={() => setModalConfirmacao(false)}
                                >
                                    {renderModalConfirmacao()}
                                </Modal>
                            </>
                    </View>
                </Modal>
            );
        }
        
    };

    const renderPedidosMesa = ({ item }: { item: PedidosMesaDTO }) => {
        if (item != null) {
            return (
                <FlatList
                    data={item.produtos}
                    renderItem={renderProdutos}
                    keyExtractor={(item) => item.idProduto}
                />
            );
        } else {
            return (
                <View></View>
            );
        }
    }

    const renderModalConfirmacao = () =>{
        return(
            <View style={styles.modalView}>
                <Text>Confirma pagamento?</Text>
                <Pressable style={{
                    backgroundColor: 'green',
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,}}
                    onPress={() => tryEfetuarPagamento()}
                >
                    <Text style={{
                        color: 'white',
                        fontSize: 16,
                    }}
                    >
                        Sim
                    </Text>
                </Pressable>
                <Pressable style={{
                    backgroundColor: 'red',
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,}}
                    onPress={() => setModalConfirmacao(false)}
                >
                    <Text style={{
                        color: 'white',
                        fontSize: 16,
                    }}
                    >
                        Não
                    </Text>
                </Pressable>
            </View>
        );
    }

    const renderModal = () => {
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
                            onPress={() => setModalSelecaoPedidoFechamento(true)}
                        >
                            <Text style={{ color: 'white' }}>Fechamento</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text style={{ backgroundColor: 'red', color: 'white' }}>Fechar</Text>
                        </Pressable>
                    </View>
                );
            } else {
                return (
                    <Text>Não há pedidos para esta mesa.</Text>
                );
            }
        } else {
            return (
                <Text>Não há pedidos disponíveis.</Text>
            );
        }
    }

    return (
        <SafeAreaView>
            {mesas.map(mesa => (
                <Pressable 
                    key={mesa.idMesa}
                    onPress={() => getMesaInformation(mesa.idMesa)}
                    style={styles.mesaButton}
                >
                    <Image 
                        style={{backgroundColor: 'red', width: 50, height: 50}}
                        source={require('./assets/mesaIcon.png')}
                    />
                    <Text style={styles.mesaText}>Mesa {mesa.numeroMesa}</Text>
                </Pressable>
            ))}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                {renderModal()}
            </Modal>

            {renderModalFecharConta()}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalSelecaoPedidoFechamento}
                onRequestClose={() => setModalSelecaoPedidoFechamento(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.selectedText}>Pedidos Selecionados: {contadorPedidosSelecionadosFechamento}</Text>
                    <FlatList
                        data={pedidos?.pedidosMesa || []}
                        renderItem={({ item }) => (
                            <View style={styles.pedidoContainer}>
                                <Pressable
                                    onPress={() => toggleSelectPedido(item)}
                                    style={styles.checkbox}
                                >
                                    {pedidosSelecionadosFechamento.some(p => p.idPedido === item.idPedido) && (
                                        <View style={styles.checkboxChecked} />
                                    )}
                                </Pressable>
                                <View style={styles.pedidoContent}>
                                    <Text style={styles.cpfText}>{item.cpfClientePedido}</Text>
                                    {item.produtos.slice(0, 3).map((produto) => (
                                        <Text key={produto.idProduto} style={styles.produtoText}>
                                            {produto.nomeProd}
                                        </Text>
                                    ))}
                                    {item.produtos.length > 3 && (
                                        <Text style={styles.moreProductsText}>
                                            ...e mais {item.produtos.length - 3} produtos
                                        </Text>
                                    )}
                                </View>
                            </View>
                        )}
                        keyExtractor={(item) => item.idPedido}
                    />
                    <Pressable
                        style={styles.button}
                        onPress={() => handleConfirmSelection()}
                    >
                        <Text style={styles.buttonText}>Confirmar Seleção</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={() => setModalSelecaoPedidoFechamento(false)}
                    >
                        <Text style={styles.buttonText}>Fechar</Text>
                    </Pressable>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mesaButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    mesaText: {
        fontSize: 16,
        fontWeight: 'bold',
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
    pedidoButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    pedidoText: {
        fontSize: 16,
    },
    confirmButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#FF0000',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: 8,
        marginVertical: 10,
    },
    placeholder: {
        fontSize: 16,
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
    pedidoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    pedidoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#007BFF',
        borderRadius: 3,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        width: 14,
        height: 14,
        backgroundColor: '#007BFF',
        borderRadius: 2,
    },
    pedidoContent: {
        flex: 1,
    },
    cpfText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    produtoText: {
        fontSize: 14,
    },
    moreProductsText: {
        fontSize: 12,
        color: '#888',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default MenuMesa;
