import { Alert, Button, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../ApiConfigs/ApiRoute';
import MenuBalcao from '../MenuBalcao/MenuBalcao';
import MenuCadastroUsuario from '../MenuUsuario/MenuCadastroUsuario';
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
    precoProd: number
    quantidadeProduto:number
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
    const [modalFecharContaVisible, setModalFecharContaVisible] = useState<boolean>(false);
    const [modalConfirmaFechamentoParcial, setModalConfirmaFechamentoParcial] = useState<boolean>(false);
    const [modalConfirmaFechamentoCompleto, setModalConfirmaFechamentoCompleto] = useState<boolean>(false);
    const [modalEscolhaFechamento, setModalEscolhaFechamento] = useState<boolean>(false);
    const [modalFechamentoParcial, setModalFechamentoParcial] = useState<boolean>(false);
    const [modalFecharContaParcial, setModalFecharContaParcial] = useState<boolean>(false);
    const [pedidoFechamentoParcial, setPedidoFechamentoParcial] = useState<PedidosMesaDTO | null>(null);
    const [metodosPagamento, setMetodosPagamento] = useState<string[]>([]);
    const [view, setView] = useState('mesas');
    const [formaDePagamentoEscolhida, setFormaDePagamentoEscolhida] = useState(null);

    async function getMetodoPagamento()
    {
        api.get('api/pagamentos/get-metodos', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                'Content-Type': 'application/json',
                }
        })
        .then(response => {
            const formattedCategories = response.data.map((category, index) => ({
                label: category,
                value: index,
            }));
            setMetodosPagamento(formattedCategories);
            })
        .catch(error => {
        console.log(error);
        });
    }

    useEffect(() => {
        const fetchMesas = async () => {
            api.get('api/mesa/get-all', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                    'Content-Type': 'application/json',
                  }
            })
            .then(response => {
                setMesas(response.data);
            })
            .catch(error => {
                console.log(error as string);
            })
        };

        fetchMesas();
    }, []);


    async function getMesaInformation(idMesa: string) {
        const dataToSend = {
            idMesa: idMesa,
            token: ''
        }
        api.post('api/pedidos/get-by-mesa', dataToSend, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            setPedidos(response.data);
            setModalVisible(true);
        })
        .catch(error => {
            console.log(error as string);
        })
    }

    const renderProdutos = ({item}: {item: ProductsMesaDTO}) => {
        if (item != null) {
            return(
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

    const renderPedidosMesa = ({item}: {item: PedidosMesaDTO}) => {
        if (item != null) {
            return(
                <FlatList
                    data={item.produtos}
                    renderItem={renderProdutos}
                    keyExtractor={(item) => item.idProduto}
                />
            );
        } else {
            return(
                <View></View>
            );
        }
    }

    const fechamento = () => 
    {
        setModalVisible(false);
        setModalEscolhaFechamento(true);
    }

    const fechamentoCompleto = () => {
        setModalFecharContaVisible(true);
    }

    const renderModal = () => {
        if (pedidos && pedidos.pedidosMesa) {
            if (pedidos.pedidosMesa.length > 0) {
                return(
                    <View style={styles.modalView}>
                        <FlatList
                            data={pedidos.pedidosMesa}
                            renderItem={renderPedidosMesa}
                            keyExtractor={(item) => item.idPedido}
                        />
                        <Text>Valor total: {formatToReais(pedidos.valorTotal)}</Text>
                        <Pressable 
                            style={{backgroundColor:'green', borderColor:'green', borderWidth:1}}
                            onPress={() => {fechamento()}}
                        >
                            <Text style={{color:'white'}}>Fechamento</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text style={{backgroundColor: 'blue', color:'white'}}>X</Text>
                        </Pressable>
                    </View>
                );
            } else {
                return(
                    <View style={styles.modalView}>
                        <Text>A mesa não possui pedidos</Text>
                        
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text style={{backgroundColor: 'blue'}}>X</Text>
                        </Pressable>
                    </View>
                );
            }
        }
    }
    
    const renderMesa = ({ item }: { item: Mesa }) => {
        if (item.emUso == true) {
            return(
                <View>
                    <View style={styles.mesaContainer}>
                        <Pressable onPress={() => getMesaInformation(item.idMesa)}>
                            <Image 
                                style={{backgroundColor: 'red', width: 50, height: 50}}
                                source={require('./assets/mesaIcon.png')}
                            />
                            <Text style={styles.mesaText}>{item.numeroMesa}</Text>
                        </Pressable>
                    </View>
                </View>
            );
        } else {
            return(
                <View>
                    <View style={styles.mesaContainer}>
                        <Pressable onPress={() => getMesaInformation(item.idMesa)}>
                            <Image 
                                style={{width: 50, height: 50}}
                                source={require('./assets/mesaIcon.png')}
                            />
                            <Text style={styles.mesaText}>{item.numeroMesa}</Text>
                        </Pressable>
                    </View>
                </View>
            );
        }
    }

    const renderModalFecharConta = () => {
        if (pedidos && pedidos.pedidosMesa) {
            if (pedidos.pedidosMesa.length > 0) {
                return(
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
                            data={metodosPagamento}
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
                            style={{backgroundColor:'green', borderColor:'green', borderWidth:1}}
                            onPress={() => {(setModalConfirmaFechamentoCompleto(true))}}
                        >
                            <Text style={{color:'white'}}>Gerar pagamento</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalFecharContaVisible(false)}>
                            <Text style={{backgroundColor: 'blue', color:'white'}}>X</Text>
                        </Pressable>
                    </View>
                );
            } else {
                return(
                    <View style={styles.modalView}>
                        <Text>A mesa não possui pedidos</Text>
                        
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text style={{backgroundColor: 'blue'}}>X</Text>
                        </Pressable>
                    </View>
                );
            }
        }
    }

    const renderMenu = () => {
        if (mesas.length > 0)
        {
            return(
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
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        {renderModal()}
                    </Modal>
                </View>
            );
        }
        else{
            return(
                <Text>Nenhuma mesa disponível no momento.</Text>
            );
        }
    }

    async function tryEfetuarPagamentoParcial()
    {
        if (formaDePagamentoEscolhida === null)
        {
            console.log('escolha um metodo de pagamento')
        }
        else{
            const produtos = pedidoFechamentoParcial.produtos.map(produto => ({
                idProd: produto.idProduto,
                quantidade: produto.quantidadeProduto
            }));
    
            const dataToSend = {
                idPedido:pedidoFechamentoParcial.idPedido,
                pedido: {
                    produtos:produtos,
                    cpfCliente: pedidoFechamentoParcial.cpfClientePedido
                },
                metodoPagamento: formaDePagamentoEscolhida
            };
            
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
    }

    const renderModalConfirmaFechamentoParcial = () => {
        return(
            <View style={styles.modalView}>
                <Text>Deseja mesmo confirmar o pagamento?</Text>
                <Pressable onPress={() => {setModalConfirmaFechamentoParcial(false), tryEfetuarPagamentoParcial()}} style={{borderColor:'black', borderWidth:1, backgroundColor:'green'}}>
                    <Text style={{color:'white'}}>Sim</Text>
                </Pressable>

                <Pressable onPress={() => setModalConfirmaFechamentoParcial(false)} style={{borderColor:'black', borderWidth:1, backgroundColor:'red'}}>
                    <Text style={{color:'white'}}>Não</Text>
                </Pressable>
            </View>
        );
    }

    const renderModalConfirmaFechamentoCompleto = () => {
        return(
            <View style={styles.modalView}>
                <Text>Deseja mesmo confirmar o pagamento?</Text>
                <Pressable onPress={() => console.log('pressionou')} style={{borderColor:'black', borderWidth:1, backgroundColor:'green'}}>
                    <Text style={{color:'white'}}>Sim</Text>
                </Pressable>

                <Pressable onPress={() => setModalConfirmaFechamentoParcial(false)} style={{borderColor:'black', borderWidth:1, backgroundColor:'red'}}>
                    <Text style={{color:'white'}}>Não</Text>
                </Pressable>
            </View>
        );
    }

    const renderModalEscolhaFechamento = () => {
        return(
            <View style={styles.modalView}>
                <Pressable onPress={() => {setModalFechamentoParcial(true), setModalEscolhaFechamento(false)}} style={{borderColor:'black', borderWidth:1, backgroundColor:'green'}}>
                    <Text style={{color:'white'}}>Fechamento parcial</Text>
                </Pressable>

                <Pressable onPress={() =>{setModalFecharContaVisible(true), setModalEscolhaFechamento(false)}} style={{borderColor:'black', borderWidth:1, backgroundColor:'blue'}}>
                    <Text style={{color:'white'}}>Fechamento completo</Text>
                </Pressable>
                
                <Pressable onPress={() => setModalEscolhaFechamento(false)} style={{borderColor:'black', borderWidth:1, backgroundColor:'red'}}>
                    <Text style={{color:'white'}}>X</Text>
                </Pressable>
            </View>
        );
    }

    const renderModalFechamentoParcial = () => {
        const renderPedidosFechamentoParcial = ({item}: {item: PedidosMesaDTO}) => {
            if (item != null) {
                return(
                    <View>
                        <Pressable onPress={() => {setModalFechamentoParcial(false), setModalFecharContaParcial(true), setPedidoFechamentoParcial(item)}} style={{borderColor:'black', borderWidth:2}}>
                            <Text>cliente: {item.cpfClientePedido}</Text>
                            <FlatList
                                data={item.produtos}
                                renderItem={renderProdutosFechamentoParcial}
                                keyExtractor={(item) => item.idProduto}
                            />
                        </Pressable>
                    </View>
                );
            } else {
                return(
                    <View></View>
                );
            }
        }
        const renderProdutosFechamentoParcial = ({item}: {item: ProductsMesaDTO}) => {
            if (item != null) {
                return(
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
        if (pedidos && pedidos !== null)
        {
            return(
                <View style={styles.modalView}>
                    <FlatList
                        data={pedidos.pedidosMesa}
                        renderItem={renderPedidosFechamentoParcial}
                        keyExtractor={(item) => item.idPedido}
                    />
                </View>
            );  
        }
    }

    const renderModalFecharContaParcial = () => {
        if (pedidoFechamentoParcial && pedidoFechamentoParcial != null) {
            if (pedidos.pedidosMesa.length > 0) {
                getMetodoPagamento();
                return(
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
                            data={metodosPagamento}
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
                            style={{backgroundColor:'green', borderColor:'green', borderWidth:1}}
                            onPress={() => setModalConfirmaFechamentoParcial(true)}
                        >
                            <Text style={{color:'white'}}>Gerar pagamento</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalFecharContaVisible(false)}>
                            <Text style={{backgroundColor: 'blue', color:'white'}}>X</Text>
                        </Pressable>
                    </View>
                );
            } else {
                return(
                    <View style={styles.modalView}>
                        <Text>Pedido não encontrado</Text>
                        
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text style={{backgroundColor: 'blue'}}>X</Text>
                        </Pressable>
                    </View>
                );
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderMenu()}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalFecharContaVisible}
                onRequestClose={() => setModalFecharContaVisible(false)}
            >
                {renderModalFecharConta()}
            </Modal>


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalEscolhaFechamento}
                onRequestClose={() => setModalEscolhaFechamento(false)}
            >
                {renderModalEscolhaFechamento()}
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalFechamentoParcial}
                onRequestClose={() => setModalFechamentoParcial(false)}
            >
                {renderModalFechamentoParcial()}
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalFecharContaParcial}
                onRequestClose={() => setModalFecharContaParcial(false)}
            >
                {renderModalFecharContaParcial()}
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalConfirmaFechamentoCompleto}
                onRequestClose={() => setModalConfirmaFechamentoCompleto(false)}
            >
                {renderModalConfirmaFechamentoCompleto()}
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalConfirmaFechamentoParcial}
                onRequestClose={() => setModalConfirmaFechamentoParcial(false)}
            >
                {renderModalConfirmaFechamentoParcial()}
            </Modal>
        </SafeAreaView>
    );
}

export default MenuMesa;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    mesaContainer: {
        padding: 5,
        alignItems: 'center',
    },
    mesaText: {
        marginTop: 5,
        textAlign: 'center',
    },
    noMesaText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
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
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
      },
      placeholder: {
        fontSize: 16,
        color: '#999',
      },
      selectedText: {
        fontSize: 16,
        marginTop: 10,
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
