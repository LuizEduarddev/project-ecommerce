import { Button, FlatList, Pressable, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import React, { useState, useRef } from 'react';
import api from '../../../ApiConfigs/ApiRoute';
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
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    async function findProduto(query: string) {
        if (query === "") {
            return;
        } else {
            api.post('api/products/search', query)
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
      const imagem = 'https://img.elo7.com.br/product/zoom/4D35E8D/bolo-decorado-kg-batizado.jpg'
      if (produtoResponse && produtoResponse.length > 0) {
            return produtoResponse.map(produto => (
                <View 
                  key={produto.idProd}
                  style={styles.produtoContainer}
                >
                  <Image source={{ uri: imagem }} style={{ width: 90, height: 90, borderRadius: 10 }} resizeMode='cover'></Image>
                  <View style={{marginLeft: 10, gap: 5}}>
                    <Text style={{fontWeight: 'bold', color: colors['raisin-black']}}>{produto.nomeProd}</Text>
                  </View>
                  <View style={{position: 'absolute', right: 10, height: 90, justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <Text style={{color: colors['raisin-black'], fontSize: 20, fontWeight: 'bold'}}>{formatToReais(produto.precoProd)}</Text>
                    <Pressable style={styles.button} onPress={() => saveProduto(produto)}>+ Adicionar produto</Pressable>
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
                <Pressable style={styles.button} onPress={() => tryEfetuarPagamento()}>Efetuar pagamento</Pressable>
            </View>
        );
    };

    return (
        <View style={styles.modalView}>
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
        </View>
    );
};

export default MenuBalcao;

const styles = StyleSheet.create({
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
  listaPesquisa: {
    flex: 1,
  },
  modalView: {
    width: '100%',
    alignItems: 'center'
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
  },
  button: {
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
});