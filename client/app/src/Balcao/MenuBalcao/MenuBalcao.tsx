import { Button, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState, useRef } from 'react';
import api from '../../../ApiConfigs/ApiRoute';

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
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    async function findProduto(query: string) {
        if (query === "") {
            return;
        } else {
            api.post('api/products/search', query, {
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

    /*
    async function checkPaymentStatus(idPedido) {
        const dataToSend = {
            idPedido: idPedido,
            token: tokenCliente
        };
        api.post('api/pagamentos/check', dataToSend)
        .then(response =>{
            console.log(response.data);
            setModalVisible(false); 
        })
        .catch(error => 
        {
            Alert.alert(error as string);
        }
        )
    }
    */

    async function tryEfetuarPagamento()
    {
        const produtos = produtosBalcao.map(produto => ({
            idProd: produto.idProd,
            quantidade: produto.quantity
        }));

        const dataToSend = {
            produtos: produtos,    
            token: ""
        };
        console.log(produtos)
        api.post('api/pagamentos/pagamento/avulso', dataToSend)
        .then(response => {
            console.log(response.data);
            // const linkPagamento = response.data.pointOfInteraction.transactionData.ticketUrl;
            // if (linkPagamento) {
            //     setPaymentUrl(linkPagamento);
            //     setModalVisible(true);
            //     checkPaymentStatus(item.idPedido); 
            // } else {
            //     Alert.alert("Invalid payment link.");
            // }
        })
        .catch(error => {
            console.log(error as string);
        })
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
                        onPress={() => tryEfetuarPagamento()}
                    />
                </View>
            );
        } else {
            return;
        }
    };

    return (
        <View>
            <View style={styles.modalView}>
                <TextInput
                    style={{borderColor:'gray', borderWidth: 1}}
                    placeholder='Busque por um produto'
                    onChangeText={handleSearchInputChange}
                    value={buscaProduto}
                />
                {renderPesquisa()}
                {renderProdutosSalvos()}
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
});