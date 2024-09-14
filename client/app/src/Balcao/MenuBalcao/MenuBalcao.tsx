import { Button, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import api from '../../../ApiConfigs/ApiRoute';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../assets/colors';

type Product = {
    idProd: string;
    nomeProd: string;
    precoProd: number;
    quantity: number; // Add quantity field
};

const formatToReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const MenuBalcao = () => {
    const [buscaProduto, setBuscaProduto] = useState('');
    const [produtoResponse, setProdutoResponse] = useState<Product[] | null>(null);
    const [produtosBalcao, setProdutosBalcao] = useState<Product[]>([]);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [metodosPagamento, setMetodosPagamento] = useState<string[]>([]);
    const [clienteCPF, setClienteCPF] = useState<string>('');
    const [metodoEscolhido, setMetodoEscolhido] = useState(null);
    const [modalConfirmarPagamento, setModalConfirmarPagamento] = useState<boolean>(false);

    useEffect(() => {
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
    }, [])

    async function findProduto(query: string) {
        if (query === "") {
            return;
        } else {
            api.post('api/products/search', null , {
                params:{
                    pesquisa:query
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                setProdutoResponse(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    const saveProduto = (produto: Product) => {
        setProdutosBalcao(prevProducts => {
            const existingProduct = prevProducts.find(p => p.idProd === produto.idProd);
            
            if (existingProduct) {
                return prevProducts.map(p =>
                    p.idProd === produto.idProd
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            } else {
                return [...prevProducts, { ...produto, quantity: 1 }];
            }
        });
    };

    const deleteProduto = (id: string) => {
        setProdutosBalcao(prevProducts => {
            const updatedProducts = prevProducts.filter(produto => produto.idProd !== id);
            return updatedProducts;
        });
    };

    const increaseQuantity = (id: string) => {
        setProdutosBalcao(prevProducts =>
            prevProducts.map(produto =>
                produto.idProd === id
                    ? { ...produto, quantity: produto.quantity + 1 }
                    : produto
            )
        );
    };

    const decreaseQuantity = (id: string) => {
        setProdutosBalcao(prevProducts =>
            prevProducts.map(produto =>
                produto.idProd === id && produto.quantity > 1
                    ? { ...produto, quantity: produto.quantity - 1 }
                    : produto
            )
        );
    };
    
    const renderPesquisa = () => {
      if (produtoResponse && produtoResponse.length > 0) {
            return produtoResponse.map(produto => (
                <View 
                  key={produto.idProd}
                  style={styles.produtoContainer}
                >
                    <Text style={styles.itemProdutoContainer}>{produto.nomeProd}</Text>
                    <Text style={{color: colors['raisin-black'], flex: 1, alignItems: 'center'}}>{formatToReais(produto.precoProd)}</Text>
                    <View style={{flex: 1}}>
                        <Pressable style={styles.button} onPress={() => saveProduto(produto)}>
                            <Text style={{color: 'white'}}>+</Text>
                        </Pressable>
                    </View>
                </View>
            ));
        } else {
            return <Text>Nenhum produto encontrado</Text>;
        }
    };

    const handleSearchInputChange = (text: string) => {
        setBuscaProduto(text);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            findProduto(text);
        }, 600); 
    };

    const renderProdutosBalcao = ({ item }: { item: Product }) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <Pressable onPress={() => decreaseQuantity(item.idProd)}>
                        <Icon style={styles.botaoMudarQuantidade} name='minus-circle-outline'></Icon>
                    </Pressable>
                    <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text> {/* Display quantity */}
                    <Pressable onPress={() => increaseQuantity(item.idProd)}>
                        <Icon style={styles.botaoMudarQuantidade} name='plus-circle-outline'></Icon>
                    </Pressable>
                </View>
                <View style={{ flex: 1 }}>
                    <Text>{item.nomeProd}</Text>
                    <Text>{formatToReais(item.precoProd * item.quantity)}</Text> {/* Display total price */}
                </View>
                <Pressable onPress={() => deleteProduto(item.idProd)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Exluir</Text>
                </Pressable>
            </View>
        );
    };

    const valorTotal = () => {
        if (produtosBalcao.length > 0) {
            let soma = 0;
            produtosBalcao.forEach(produto => soma += produto.precoProd * produto.quantity); // Calculate total based on quantity
            return <Text>Total: {formatToReais(soma)}</Text>;
        } else {
            return;
        }
    };

    async function tryEfetuarPagamento()
    {
        if (clienteCPF.length > 1 &&clienteCPF.length < 11)
        {
            console.log('cpf tem que ter mais que 11 letras');
        }
        else if (metodoEscolhido === null)
        {
            console.log('escolha um metodo de pagamento')
        }
        else{

            const produtos = produtosBalcao.map(produto => ({
                idProd: produto.idProd,
                quantidade: produto.quantity
            }));
    
            const dataToSend = {
                pedido: {
                    produtos:produtos,
                    cpfCliente: clienteCPF || null
                },
                metodoPagamento: metodoEscolhido
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
                setModalConfirmarPagamento(false);
            })
            .catch(error => {
                console.log(error as string);
            })
        }
    }

    const renderProdutosSalvos = () => {
        return (
            <View style={styles.carrinho}>
                <Text style={styles.tituloCarrinho}>Produtos selecionados ({produtosBalcao.length})</Text>
                <FlatList
                    data={produtosBalcao}
                    renderItem={renderProdutosBalcao}
                    keyExtractor={(item) => item.idProd}
                />
                {valorTotal()}
                <br></br>
                <Pressable style={styles.efetuarPagamento} onPress={() => setModalConfirmarPagamento(true)}>
                    <Text style={{color:'white'}}>Efetuar pagamento</Text>
                </Pressable>
            </View>
        );
    };

    const renderProdutosPagamento = ({item}: {item: Product}) => {
        return(
            <View style={{flexDirection:'row', width:'100%', marginBottom:10}}>
                <View style={{flex:2}}>
                    <Text style={{fontWeight:'bold', color: colors['raisin-black'], fontSize:14}}>{item.nomeProd}</Text>
                    <Text style={{color: '#888', fontSize:12}}>{item.quantity}x {formatToReais(item.precoProd)}</Text>
                </View>
                <Text style={{flex:1, alignSelf:'center', fontWeight: 'bold'}}>{formatToReais(item.precoProd * item.quantity)}</Text>
            </View>
        )
    }

    const renderMetodoPagamento = () => {
        if (metodosPagamento) {
          return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalConfirmarPagamento}
                onRequestClose={() => setModalConfirmarPagamento(false)}
            >
                <View style={styles.modalView}>
                <View style={styles.tituloTabela}>
                    <Text style={{flex:2, fontWeight:'bold', fontSize:18, color: colors['raisin-black']}}>Produtos</Text>
                    <Text style={{flex:1, fontWeight:'bold', fontSize:18, color: colors['raisin-black']}}>Total</Text>
                </View>
                <FlatList
                    data={produtosBalcao}
                    renderItem={renderProdutosPagamento}
                    keyExtractor={(item) => item.idProd}
                    style={{width:'100%'}}
                />
                <View style={styles.dashedLine}></View>
                <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
                    <Text style={{fontWeight:'bold', fontSize:20, color: colors['raisin-black']}}>
                        Total: {valorTotal()}
                    </Text>
                </View>
                <View>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        inputSearchStyle={styles.inputSearch}
                        iconStyle={styles.dropdownIcon}
                        data={metodosPagamento}
                        maxHeight={300}
                        labelField="label"
                        valueField="label"
                        placeholder="Escolha um metodo de pagamento"
                        value={metodoEscolhido}
                        onChange={(item) => {
                            setMetodoEscolhido(item.label);
                        }}
                    />
                    <TextInput
                        style={styles.inputCPF}
                        placeholder='CPF do cliente'
                        onChangeText={setClienteCPF}
                        value={clienteCPF}
                    />
                </View>
                <Pressable 
                    style={styles.confirmButton}
                    onPress={() => {
                        //oq faz aq
                    }}
                >
                    <Text style={styles.confirmButtonText}>Confirmar pagamento</Text>
                </Pressable>
                <Pressable style={styles.closeButton} onPress={() => setModalConfirmarPagamento(false)}>
                    <Icon name='close' size={15}></Icon>
                </Pressable>
            </View>
            </Modal>
          );
        } else {
          return (
            <Text>As categorias não foram carregadas corretamente, tente novamente mais tarde.</Text>
          );
        }
    };

    // if (modalConfirmarPagamento === true && ((clienteCPF.length > 0 && clienteCPF.length < 11) || metodoEscolhido === null))
    // {
    //     setModalConfirmarPagamento(false);
    //     console.log('Faltam preencher alguns campos.');
    // }

    const renderModalConfirmarPagamento = () => {
        return(
            <View style={styles.modalView}>
                <Text>Deseja mesmo confirmar o pagamento?</Text>
                <Pressable onPress={() => tryEfetuarPagamento()} style={{borderColor:'black', borderWidth:1, backgroundColor:'green'}}>
                    <Text style={{color:'white'}}>Sim</Text>
                </Pressable>

                <Pressable onPress={() => setModalConfirmarPagamento(false)} style={{borderColor:'black', borderWidth:1, backgroundColor:'red'}}>
                    <Text style={{color:'white'}}>Não</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder='Busque por um produto'
              placeholderTextColor="#888"
              value={buscaProduto}
              onChangeText={handleSearchInputChange}
            />
            <Icon name="magnify" size={24} color="#333" style={styles.icon} />
          </View>
          <View style={{flexDirection: 'row', width: '100%', gap: 20}}>
            <View style={styles.listaPesquisa}>
              {renderPesquisa()}
            </View>
            <View style={{width: 300}}>
              {renderProdutosSalvos()}
            </View>
          </View>
          {renderMetodoPagamento()}
            {/* <Modal
                animationType="slide"
                transparent={false}
                visible={modalConfirmarPagamento}
                onRequestClose={() => setModalConfirmarPagamento(false)}
            >
                {renderModalConfirmarPagamento()}
            </Modal> */}
        </View>
    );
};

export default MenuBalcao;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center'
    },
    confirmButton: {
        backgroundColor: 'rgb(76, 175, 80)',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
    },
    dashedLine: {
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ccc', 
        width: '100%',
        height: 1,           
        marginVertical: 10,
    },
    inputCPF: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginTop: 10
    },
    input: {
        borderRadius: 25,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        fontSize: 16,
        color: '#333',
        paddingHorizontal: 40,
        paddingVertical: 10,
        flex: 1,
    },
    searchContainer: {
        width: '90%',
        marginBottom: 20,
    },
    icon: {
        position: 'absolute',
        left: 10,
        top: 10,
        color: '#888',
    },
    dropdownIcon: {
        width: 20,
        height: 20,
    },
    tituloTabela: {
        flexDirection:'row', 
        width:'100%',
        marginBottom:10
    },
    listaPesquisa: {
        flex: 1,
    },
    modalView: {
        width: 500,
        marginTop: 40,
        alignSelf: 'center',
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
    produtoContainer: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 15,
        height: 120,
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        maxHeight: 70
    },
    itemProdutoContainer: {
        flex: 1
    },
    button: {
        color: 'white',
        backgroundColor: colors['bright-blue'],
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
        fontWeight: 'semibold',
        alignSelf: 'flex-end',
    },
    efetuarPagamento: {
        color: 'white',
        backgroundColor: colors['bright-blue'],
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        fontWeight: 'semibold',
    },
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
        marginLeft: 10,
    },
    deleteButtonText: {
        color: 'white',
    },
    dropdown: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        width: 300,
        marginTop: 15
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
    carrinho: {
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        borderColor: colors['slate-gray'],
    },
    tituloCarrinho: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 10
    },
    botaoMudarQuantidade: {
        color: colors['dim-gray'],
        fontSize: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
});