import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
/*
async function tryEfetuarPagamento()
    {
        if (formaDePagamentoEscolhida === null)
        {
            console.log('escolha um metodo de pagamento')
        }
        else{
            const dataToSend = {
                idPedidos:[pedidoFechamentoParcial.idPedido],
                pedido: {
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

    useEffect(() => {
        getMetodoPagamento();
      }, []);
    

      async function getMetodoPagamento() {
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
            setMetodosPagamentoCarregados(true); 
        })
        .catch(error => {
            console.log(error);
        });
    }

    const fechamento = () => 
        {
            setModalVisible(false);
            setModalEscolhaFechamento(true);
        }
    
        const fechamentoCompleto = () => {
            setModalFecharContaVisible(true);
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
                                    onPress={() => {(setModalConfirmaFechamentoCompleto(true)), setPedidoFechamentoCompleto(pedidos.pedidosMesa)}}
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
                            onPress={() => {(setModalConfirmaFechamentoCompleto(true)), setPedidoFechamentoCompleto(pedidos.pedidosMesa)}}
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

    async function tryEfetuarPagamento()
    {
        if (formaDePagamentoEscolhida === null)
        {
            console.log('escolha um metodo de pagamento')
        }
        else{
            const dataToSend = {
                idPedidos:[pedidoFechamentoParcial.idPedido],
                pedido: {
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
                <Pressable onPress={() => {setModalConfirmaFechamentoParcial(false), tryEfetuarPagamento()}} style={{borderColor:'black', borderWidth:1, backgroundColor:'green'}}>
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
                <Pressable onPress={() => tryEfetuarPagamento()} style={{borderColor:'black', borderWidth:1, backgroundColor:'green'}}>
                    <Text style={{color:'white'}}>Sim</Text>
                </Pressable>

                <Pressable onPress={() => setModalConfirmaFechamentoParcial(false)} style={{borderColor:'black', borderWidth:1, backgroundColor:'red'}}>
                    <Text style={{color:'white'}}>Não</Text>
                </Pressable>
            </View>
        );
    }

    

    const renderModalFechamentoParcial = () => {
        const renderPedidosFechamentoParcial = ({ item }: { item: PedidosMesaDTO }) => (
            <View>
                <Pressable
                    onPress={() => {
                        setModalFechamentoParcial(false);
                        setModalFecharContaParcial(true);
                        setPedidoFechamentoParcial(item);
                    }}
                    style={{ borderColor: 'black', borderWidth: 2 }}
                >
                    <Text>Cliente: {item.cpfClientePedido}</Text>
                    <FlatList
                        data={item.produtos}
                        renderItem={renderProdutosFechamentoParcial}
                        keyExtractor={(item) => item.idProduto}
                    />
                </Pressable>
            </View>
        );
    
        const renderProdutosFechamentoParcial = ({ item }: { item: ProductsMesaDTO }) => (
            <View>
                <Text>{item.nomeProd} - x {item.quantidadeProduto}</Text>
                <Text>{formatToReais(item.precoProd)} - {formatToReais(item.precoProd * item.quantidadeProduto)}</Text>
            </View>
        );
    
        if (!pedidos) {
            return null;
        }
    
        return (
            <View style={styles.modalView}>
                <FlatList
                    data={pedidos.pedidosMesa}
                    renderItem={renderPedidosFechamentoParcial}
                    keyExtractor={(item) => item.idPedido}
                />
            </View>
        );
    };
    

    const renderModalFecharContaParcial = () => {
        useEffect(() => {
            if (!metodosPagamentoCarregados) {
                getMetodoPagamento();
            }
        }, [metodosPagamentoCarregados]);
    
        if (pedidoFechamentoParcial && pedidoFechamentoParcial != null) {
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
*/
const MenuPagamento = ({ modalVisible, setModalVisible }) => {
  
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalView}>
                <Text>Olá, de modal.</Text>
                <Pressable onPress={() => setModalVisible(false)}>
                    <Text>X</Text>
                </Pressable>
            </View>
        </Modal>
  )
}

export default MenuPagamento

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
})