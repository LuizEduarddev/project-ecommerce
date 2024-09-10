import { FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
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
    idProd: string,
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

const MenuGarcom = ({navigation}) => {
    const [categorias, setCategorias] = useState<{ label: string, value: number }[] | null>(null);
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [pedidos, setPedidos] = useState<Pedidos | null>(null);
    const [formaDePagamentoEscolhida, setFormaDePagamentoEscolhida] = useState<FormaDePagamento | undefined>();
    const [activeModal, setActiveModal] = useState<'none' | 'menu' | 'fecharConta' | 'escolha' | 'pedidoMesa' | 'visualizarPedidosMesa' | 'produtosCategoria' | 'pedidosClienteCpf'>('none');
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
    const [buscaPorCpf, setBuscaPorCpf] = useState('');
    const [pedidoCpf, setPedidoCpf] = useState<Pedidos | null>(null);

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
                        navigation.navigate('Login')
                    } else {
                        console.log('Other error response:', error.response.data);
                    }
                } else if (error.request) {
                    console.log('No response received:', error.request);
                } else {
                    console.log('Error message:', error.message);
                }
            });
        } else {
            navigation.navigate('Login');
        }
    }, []);

    async function getProdutos()
    {
        api.post('api/products/get-by-categoria', null,{
            params:{categoria: categoriaPesquisa},
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
            }
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
                });
        };

        fetchMesas();
    }, [mesas]);

    useEffect(() => {
        async function getCategorias() {
            api.get('api/products/get-categories', {
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
                    setCategorias(formattedCategories);
                })
                .catch(error => {
                    console.log(error);
                });
        }

        getCategorias();
    }, []);

    async function findProduto(query: string) {
        if (query === "") {
            return;
        } else {
            api.post('api/products/search', null, {
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

    async function findPedido(query: string) {
        if (query === "") {
            return;
        } else {
            api.post('api/pedidos/get-by-cpf', null, {
                params: {
                    cpf: query
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                setPedidoCpf(response.data);
                openModal('pedidosClienteCpf')
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    const handleSearchPedidoCpf = (text: string) => {
        if (text !== '' && text) {
            setBuscaPorCpf(text);
    
            if (getUnformattedCpf(text).length >= 11) {
                findPedido(getUnformattedCpf(text));
            }
        }
    };

    const saveProduto = (produto: ProductsMesaDTO) => {
        setProdutosLancar(prevProducts => {
            const existingProduct = prevProducts.find(p => p.idProd === produto.idProd);
            
            if (existingProduct) {
                return prevProducts.map(p =>
                    p.idProd === produto.idProd
                        ? { ...p, quantidadeProduto: p.quantidadeProduto + 1 }
                        : p
                );
            } else {
                return [...prevProducts, { ...produto, quantidadeProduto: 1 }];
            }
        });
    
        setBuscaProduto('');
        setProdutoResponse([]);
    };
    
    

    const deleteProduto = (id: string) => {
        setProdutosLancar(prevProducts => {
            const updatedProducts = prevProducts.filter(produto => produto.idProd !== id);
            return updatedProducts;
        });
    };

    const increaseQuantity = (id: string) => {
        setProdutosLancar(prevProducts =>
            prevProducts.map(produto =>
                produto.idProd === id
                    ? { ...produto, quantidadeProduto: produto.quantidadeProduto + 1 }
                    : produto
            )
        );
    };

    const decreaseQuantity = (id: string) => {
        setProdutosLancar(prevProducts =>
            prevProducts.map(produto =>
                produto.idProd === id && produto.quantidadeProduto > 1
                    ? { ...produto, quantidadeProduto: produto.quantidadeProduto - 1 }
                    : produto
            )
        );
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

    const openModal = (modalName: 'menu' | 'fecharConta' | 'escolha' | 'pedidoMesa' | 'visualizarPedidosMesa' | 'produtosCategoria' | 'pedidosClienteCpf') => {
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
                        keyExtractor={(item) => item.idProd}
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
        api.post('api/pedidos/get-by-mesa', dataToSend, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                setMesaSelecionada(idMesa);
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
                <Pressable style={{ backgroundColor: 'blue', borderColor: 'black', borderWidth: 1 }} onPress={() => closeModal()}>
                    <Text style={{ color: 'white' }}>X</Text>
                </Pressable>
            </View>
        );
    };

    const renderPesquisa = () => {
        if (buscaProduto && produtoResponse && produtoResponse.length > 0) {
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
        } else if (buscaProduto && produtoResponse && produtoResponse.length === 0) {
            return <Text>Nenhum produto encontrado</Text>;
        } else {
            return null; 
        }
    };
    
    const renderProdutosLancar = ({item}:{item:ProductsMesaDTO}) => {
        return(
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <Pressable onPress={() => decreaseQuantity(item.idProd)} >
                        <Text>-</Text>
                    </Pressable>
                    <Text style={{ marginHorizontal: 10 }}>{item.quantidadeProduto}</Text> 
                    <Pressable onPress={() => increaseQuantity(item.idProd)} >
                        <Text>+</Text>
                    </Pressable>
                </View>
                <View style={{ flex: 1 }}>
                    <Text>{item.nomeProd}</Text>
                    <Text>{formatToReais(item.precoProd * item.quantidadeProduto)}</Text>
                </View>
                <Pressable onPress={() => deleteProduto(item.idProd)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
            </View>
        );
    }

    const formatCpf = (text: string) => {
        let cpf = text.replace(/\D/g, '');
    
        if (cpf.length <= 3) {
          cpf = cpf.replace(/(\d{0,3})/, '$1');
        } else if (cpf.length <= 6) {
          cpf = cpf.replace(/(\d{3})(\d{0,3})/, '$1.$2');
        } else if (cpf.length <= 9) {
          cpf = cpf.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
        } else {
          cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
        }
    
        setUserCpf(cpf);
    };

    const valorTotal = () => {
        if (produtosLancar.length > 0) {
            let soma = 0;
            produtosLancar.forEach(produto => soma += produto.precoProd * produto.quantidadeProduto); // Calculate total based on quantity
            return <Text>Total: {formatToReais(soma)}</Text>;
        } else {
            return;
        }
    };

    const getUnformattedCpf = (userCpf: string) => userCpf.replace(/\D/g, '');

    async function tryLancarPedido()
    {
        
        if (getUnformattedCpf(userCpf).length < 11)
        {
            console.log('Cpf precisa ter 11 caracteres.\nCPF: ');
        }
        else{
            const produtos = produtosLancar.map(productMesa => ({
                idProd: productMesa.idProd,
                quantidade: productMesa.quantidadeProduto
              }));
            const dataToSend = {
                produtos: produtos,
                token: "",
                idMesa: mesaSelecionada,
                cpfClientePedido: getUnformattedCpf(userCpf)
            }

            api.post('api/pedidos/add', dataToSend, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                console.log(response.data);
                closeModal();
                setProdutosLancar([]);
            })
            .catch(error => {
                console.log(error as string);
            })
        }
    }

    const renderModalConferirPedido = () => {
        if (produtosLancar && produtosLancar.length > 0)
        {
            return(
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalPedidosLancar}
                    onRequestClose={() => setModalPedidosLancar(false)}
                >
                    <View style={styles.modalView}>
                        <TextInput
                            placeholder="CPF"
                            value={userCpf}
                            onChangeText={formatCpf}
                            keyboardType="numeric"
                            maxLength={14}
                        />
                        <FlatList
                            data={produtosLancar}
                            renderItem={renderProdutosLancar}
                            keyExtractor={(item) => item.idProd}
                        />
                        {valorTotal()}
                        <Pressable onPress={() => setModalPedidosLancar(false)} style={{backgroundColor:'blue', borderColor:'black', borderWidth:1}}>
                            <Text style={{color:'white'}}>X</Text>
                        </Pressable>
                        <Pressable onPress={() => tryLancarPedido()} style={{backgroundColor:'blue', borderColor:'black', borderWidth:1}}>
                            <Text style={{color:'white'}}>Lançar pedido</Text>
                        </Pressable>
                    </View>
                </Modal>
            );
        }
        else{
            return(
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalPedidosLancar}
                    onRequestClose={() => setModalPedidosLancar(false)}
                    
                >
                    <View style={styles.modalView}>
                        <Text>Nenhum produto selecionado</Text>
                        <Pressable onPress={() => setModalPedidosLancar(false)} style={{backgroundColor:'blue', borderColor:'black', borderWidth:1}}>
                            <Text style={{color:'white'}}>X</Text>
                        </Pressable>
                    </View>
                </Modal>
            );
        }
    }

    const renderModalPedidoMesa = () => {
        if (categorias && categorias.length > 0) {
            return (
                <View style={styles.modalView}>
                    <TextInput
                        style={{borderColor:'gray', borderWidth: 1}}
                        placeholder='Busque por um produto'
                        onChangeText={handleSearchInputChange}
                        value={buscaProduto}
                    />
                    {renderPesquisa()}
                    <FlatList
                        data={categorias}
                        horizontal={true}
                        renderItem={renderCategories}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <Pressable onPress={() => closeModal()} style={{ padding: 5, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 15 }}>
                        <Text style={{ color: 'white' }}>X</Text>
                    </Pressable>
                    <Pressable onPress={() => setModalPedidosLancar(true)} style={{ padding: 5, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 15 }}>
                        <Text style={{ color: 'white' }}>Conferir Pedido</Text>
                    </Pressable>
                    {renderModalConferirPedido()}
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
                    <TextInput
                        style={{borderColor:'gray', borderWidth: 1}}
                        placeholder='Busca pedido por CPF'
                        onChangeText={handleSearchPedidoCpf}
                        value={buscaPorCpf}
                    />
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
        return (
            <View>
                <Pressable
                    onPress={() => saveProduto(item)}
                    style={{borderColor:'black', borderWidth:1}}
                >
                    
                    <Text>{item.nomeProd} - {formatToReais(item.precoProd)}</Text>
                </Pressable>
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
                        keyExtractor={(item) => item.idProd}
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

    const renderModalPedidosCpf = () => {
        if (pedidoCpf.pedidosMesa.length > 0 && pedidoCpf)
        {
            return(
                <View style={styles.modalView}>
                    <FlatList
                        data={pedidoCpf.pedidosMesa}
                        renderItem={renderPedidosMesa}
                        keyExtractor={(item) => item.idPedido}
                    />
                    <Pressable onPress={() => closeModal()} style={{backgroundColor:'blue', borderColor:'black', borderWidth:1}}>
                        <Text style={{color:'white'}}>X</Text>
                    </Pressable>
                </View>
            );
        }
        else{
            return(
                <View style={styles.modalView}>
                    <Text>Cliente não possui nenhum pedido.</Text>
                    <Pressable onPress={() => closeModal()} style={{backgroundColor:'blue', borderColor:'black', borderWidth:1}}>
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
            case 'pedidosClienteCpf':
            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={closeModal}
                >
                    {renderModalPedidosCpf()}
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
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 5,
        marginLeft: 10,
    },
    deleteButtonText: {
        color: 'white',
    },
});

export default MenuGarcom;
