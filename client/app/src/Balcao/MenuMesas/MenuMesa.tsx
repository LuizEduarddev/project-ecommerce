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
    produtos: ProductsMesaDTO[]
}

type Pedidos = {
    pedidosMesa: PedidosMesaDTO[],
    valorTotal: number
}

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

const MenuMesa = () => {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [pedidos, setPedidos] = useState<Pedidos | null>(null);
    const [modalFecharContaVisible, setModalFecharContaVisible] = useState<boolean>(false);
    const [view, setView] = useState('mesas');
    const [formaDePagamentoEscolhida, setFormaDePagamentoEscolhida] = useState<'pix' | 'crédito' | 'débito' | 'dinheiro'>();

    

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

    const finalizarPedido = () => 
    {
        setModalVisible(false);
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
                            onPress={() => {finalizarPedido()}}
                        >
                            <Text style={{color:'white'}}>Finalizar pedido</Text>
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
                            style={{backgroundColor:'green', borderColor:'green', borderWidth:1}}
                            onPress={() => {finalizarPedido()}}
                        >
                            <Text style={{color:'white'}}>Finalizar pedido</Text>
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
