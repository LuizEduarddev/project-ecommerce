import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome6';
import api from '../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import { formatToReais, getUnformattedCpf } from './utils/formatting';

type LancarPedidoGarcomProps = {
    idMesa: string;
    modalTela: boolean;
};

type ProductsMesaDTO = {
    idProd: string,
    nomeProd: string,
    precoProd: number;
    quantidadeProduto: number;
};

const LancarPedidoGarcom = ({idMesa, modalTela} :LancarPedidoGarcomProps) => {
    
    const toast = useToast();
        const [modalPedidosLancar, setModalPedidosLancar] = useState<boolean>(false);
    const [produtosLancar, setProdutosLancar] = useState<ProductsMesaDTO[]>([]);
    const [userCpf, setUserCpf] = useState<string>('');
    const [produtosCategorias, setProdutosCategorias] = useState<ProductsMesaDTO[] | null>(null);
    const [produtoResponse, setProdutoResponse] = useState<ProductsMesaDTO[] | null>(null);
    const [categorias, setCategorias] = useState<{ label: string, value: number }[] | null>(null);
    const [buscaProduto, setBuscaProduto] = useState<string>('');
    const [modalLancarPedido, setModalLancarPedido] = useState(modalTela);
    const [modalProdutosCategoria, setModalProdutosCategoria] = useState<boolean>(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    async function getProdutos(categoria: string) 
    {
        api.post('api/products/get-by-categoria', null, {
            params: { categoria: categoria } 
        })
        .then(response => {
            setProdutosCategorias(response.data);
            setModalProdutosCategoria(true);
        })
        .catch(error => {
            toast.show("Falha ao tentar capturar os pedidos por categoria", {
                type: "danger",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
            });
        });
    }

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

    async function tryLancarPedido()
    {
        if (getUnformattedCpf(userCpf).length < 11)
        {
            toast.show("Cpf precisa ter 11 caracteres.", {
                type: "warning",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
              });
        }
        else{
            const produtos = produtosLancar.map(productMesa => ({
                idProd: productMesa.idProd,
                quantidade: productMesa.quantidadeProduto
              }));
            const dataToSend = {
                produtos: produtos,
                token: "",
                idMesa: idMesa,
                cpfClientePedido: getUnformattedCpf(userCpf)
            }

            api.post('api/pedidos/add', dataToSend)
            .then(response => {
                setModalLancarPedido(false);
                setProdutosLancar([]);
                toast.show("Pedido lançado com sucesso.", {
                    type: "success",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                  });
            })
            .catch(error => {
                toast.show("Falha ao tentar lançar o pedido", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                  });
            })
        }
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
  
    async function findProduto(query: string) {
        if (query === "") {
            return;
        } else {
            api.post('api/products/search', null, {
                params:{
                    pesquisa:query
                }
            })
            .then(response => {
                setProdutoResponse(response.data);
            })
            .catch(error => {
                toast.show("Falha ao tentar buscar o produto", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                  });
            });
        }
    }

    const handleSearchInputChange = (text: string) => {
        setBuscaProduto(text);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            findProduto(text);
        }, 600); 
    };

    const renderPesquisa = () => {
        if (buscaProduto && produtoResponse && produtoResponse.length > 0) {
            return produtoResponse.map(produto => (
                <View 
                    key={produto.idProd}
                    style={{width: '40%'}}
                >
                    <Pressable style={styles.item}>
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

    const openProdutosCategoria = (item: string) => {
        getProdutos(item); 
    }

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
        toast.show("Produto salvo com sucesso", {
            type: "success",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
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

    const renderProdutosCategorias = ({ item }: { item: ProductsMesaDTO }) => {
        return (
            <View style={{width: '100%'}}>
                <Pressable
                    onPress={() => saveProduto(item)}
                    style={styles.item}
                >   
                    <Text>{item.nomeProd}</Text>
                    <Text>{formatToReais(item.precoProd)}</Text>
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
                        style={{width: '60%'}}
                    />
                    <Pressable onPress={() => setModalProdutosCategoria(false)} style={{position:'absolute', top:15, right:15}}>
                        <Icon name='x' size={15}></Icon>
                    </Pressable>
                </View>
            );
        }
        else{
            return(
                <View style={styles.modalView}>
                    <Text>Nenhum produto desta categoria disponível.</Text>
                    <Pressable onPress={() => setModalProdutosCategoria(false)} style={{position:'absolute', top:15, right:15}}>
                        <Icon name='x' size={15}></Icon>
                    </Pressable>
                </View>
            );
        }
    }

    const renderCategories = ({ item }: { item: { label: string, value: number } }) => {
        return (
            <View style={{margin: 5}}>
                <Pressable style={styles.categoria} onPress={() => openProdutosCategoria(item.label)}>
                    <Text style={{ color: '#18acd9' }}>{item.label}</Text>
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

    const deleteProduto = (id: string) => {
        setProdutosLancar(prevProducts => {
            const updatedProducts = prevProducts.filter(produto => produto.idProd !== id);
            toast.show("Produto deletado com sucesso", {
                type: "success",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
              });
            return updatedProducts;
        });
    };

    const renderProdutosLancar = ({item}:{item:ProductsMesaDTO}) => {
        return(
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                    <Pressable onPress={() => decreaseQuantity(item.idProd)} >
                        <Text>-</Text>
                    </Pressable>
                    <Text style={{ marginHorizontal: 15 }}>{item.quantidadeProduto}</Text> 
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

    const valorTotal = () => {
        if (produtosLancar.length > 0) {
            let soma = 0;
            produtosLancar.forEach(produto => soma += produto.precoProd * produto.quantidadeProduto); // Calculate total based on quantity
            return <Text>Total: {formatToReais(soma)}</Text>;
        } else {
            return;
        }
    };

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
                        <Pressable onPress={() => setModalPedidosLancar(false)} style={{ position:'absolute', top:15, right:15 }}>
                            <Icon name='x' size={15}></Icon>
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
                        <Pressable onPress={() => setModalPedidosLancar(false)} style={{position:'absolute', top:15, right:15}}>
                            <Icon name='x' size={15}></Icon>
                        </Pressable>
                    </View>
                </Modal>
            );
        }
    }

    const renderModalLancarPedido = () => {
        if (categorias && categorias.length > 0) {
            return (
                <View style={styles.modalPesquisarProduto}>
                    <TextInput
                        style={styles.input}
                        placeholder='Busque por um produto'
                        onChangeText={handleSearchInputChange}
                        value={buscaProduto}
                    />
                    {renderPesquisa()}
                    <FlatList
                        data={categorias}
                        key={'_categorias'}
                        renderItem={renderCategories}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                    />
                    <Pressable onPress={() => setModalLancarPedido(false)} style={{ position: 'absolute', top: 15, right: 15 }}>
                        <Icon name='x' size={15}></Icon>
                    </Pressable>
                    <Pressable onPress={() => setModalPedidosLancar(true)} style={styles.botaoConferirPedido}>
                        <Text style={{ color: 'white' }}>Conferir Pedido</Text>
                    </Pressable>
                    {renderModalConferirPedido()}
                </View>
            );
        } else {
            return (
                <View style={styles.modalView}>
                    <Text>Ocorreu um erro ao tentar renderizar as categorias.</Text>
                    <Pressable onPress={() => setModalLancarPedido(false)} style={{ position: 'absolute', top: 15, right: 15 }}>
                        <Icon name='x' size={15}></Icon>
                    </Pressable>
                </View>
            );
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalLancarPedido}
            onRequestClose={() => setModalLancarPedido(false)}
        >
            {renderModalLancarPedido()}
        </Modal>
  )
}

export default LancarPedidoGarcom

const styles = StyleSheet.create({
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
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
    botaoConferirPedido: {
        borderRadius: 30,
        padding: 10,
        backgroundColor: '#18acd9',
        marginTop: 10,
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
        marginLeft: 15,
    },
    deleteButtonText: {
        color: 'white',
    },
})