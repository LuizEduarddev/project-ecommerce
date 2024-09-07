import { Button, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import api from '../../../ApiConfigs/ApiRoute';
import { Dropdown } from 'react-native-element-dropdown';

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
                    style={{borderColor: 'black', borderWidth: 1}}
                >
                    <Pressable onPress={() => saveProduto(produto)}>
                        <Text>{produto.nomeProd}</Text>
                        <Text>{formatToReais(produto.precoProd)}</Text>
                    </Pressable>
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
                    <Button title="-" onPress={() => decreaseQuantity(item.idProd)} />
                    <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text> {/* Display quantity */}
                    <Button title="+" onPress={() => increaseQuantity(item.idProd)} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text>{item.nomeProd}</Text>
                    <Text>{formatToReais(item.precoProd * item.quantity)}</Text> {/* Display total price */}
                </View>
                <Pressable onPress={() => deleteProduto(item.idProd)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
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
        if (produtosBalcao.length > 0) {
            return (
                <View>
                    <FlatList
                        data={produtosBalcao}
                        renderItem={renderProdutosBalcao}
                        keyExtractor={(item) => item.idProd}
                    />
                    {valorTotal()}
                    <Button
                        title='Efetuar pagamento'
                        onPress={() => setModalConfirmarPagamento(true)}
                    />
                </View>
            );
        } else {
            return;
        }
    };

    const renderMetodoPagamento = () => {
        if (metodosPagamento) {
          return (
            <View>
    
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
                placeholder="Escolha um metodo de pagamento"
                value={metodoEscolhido}
                onChange={(item) => {
                  setMetodoEscolhido(item.label);
                }}
              />
            </View>
          );
        } else {
          return (
            <Text>As categorias não foram carregadas corretamente, tente novamente mais tarde.</Text>
          );
        }
    };

    if (modalConfirmarPagamento === true && ((clienteCPF.length > 0 &&clienteCPF.length < 11) || metodoEscolhido === null))
    {
        setModalConfirmarPagamento(false);
        console.log('Faltam preencher alguns campos.');
    }

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
        <View>
            <View style={styles.modalView}>
                <TextInput
                    style={{borderColor:'gray', borderWidth: 1}}
                    placeholder='Busque por um produto'
                    onChangeText={handleSearchInputChange}
                    value={buscaProduto}
                />
                <TextInput
                    style={{borderColor:'gray', borderWidth: 1}}
                    placeholder='CPF do cliente'
                    onChangeText={setClienteCPF}
                    value={clienteCPF}
                />
                {renderPesquisa()}
                {renderProdutosSalvos()}
                {renderMetodoPagamento()}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalConfirmarPagamento}
                    onRequestClose={() => setModalConfirmarPagamento(false)}
                >
                    {renderModalConfirmarPagamento()}
                </Modal>
            </View>
        </View>
    );
};

export default MenuBalcao;

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