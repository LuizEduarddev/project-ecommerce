import { FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../ApiConfigs/ApiRoute';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { colors } from '../../assets/colors';

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
    produtos: ProductsMesaDTO[]
}

type Pedidos = {
    pedidosMesa: PedidosMesaDTO[],
    valorTotal: number
}

type FormaDePagamento = 'pix' | 'crédito' | 'débito' | 'dinheiro';

const formasDePagamento: { label: string; value: FormaDePagamento }[] = [
  { label: '', value: null },
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
    const [formaDePagamentoEscolhida, setFormaDePagamentoEscolhida] = useState<'pix' | 'crédito' | 'débito' | 'dinheiro'>();

    useEffect(() => {
        const fetchMesas = async () => {
            api.post('api/mesa/get-all', "", {
                headers: {
                    'Accept': 'application/json',
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
        api.post('api/pedidos/get-by-mesa', dataToSend)
        .then(response => {
            setPedidos(response.data);
            setModalVisible(true);
        })
        .catch(error => {
            console.log(error as string);
        })
    }

    const renderProdutos = ({item}: {item: ProductsMesaDTO}) => {
        //item.nomeProd
        //item.quantidadeProduto
        //formatToReais(item.precoProd)
        //formatToReais(item.precoProd * item.quantidadeProduto)
        if (item != null) {
            return(
                <View style={{flexDirection:'row', width:'100%', marginBottom:10}}>
                    <View style={{flex:2}}>
                        <Text style={{fontWeight:'bold', color: colors['raisin-black'], fontSize:14}}>{item.nomeProd}</Text>
                        <Text style={{color: '#888', fontSize:12}}>{item.quantidadeProduto}x {formatToReais(item.precoProd)}</Text>
                    </View>
                    <Text style={{flex:1, alignSelf:'center', fontWeight: 'bold'}}>{formatToReais(item.precoProd * item.quantidadeProduto)}</Text>
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
                    style={{width:'100%'}}
                />
            );
        } else {
            return(
                <View></View>
            );
        }
    }

    const finalizarPedido = () => {
        //tem q fazer ainda
    }

    const renderModal = () => {
        if (pedidos && pedidos.pedidosMesa) {
            if (pedidos.pedidosMesa.length > 0) {
                return(
                    <View style={styles.modalView}>
                        <View style={styles.tituloTabela}>
                            <Text style={{flex:2, fontWeight:'bold', fontSize:18, color: colors['raisin-black']}}>Produtos</Text>
                            <Text style={{flex:1, fontWeight:'bold', fontSize:18, color: colors['raisin-black']}}>Total</Text>
                        </View>
                        <FlatList
                            data={pedidos.pedidosMesa}
                            renderItem={renderPedidosMesa}
                            keyExtractor={(item) => item.idPedido}
                            style={{width:'100%'}}
                        />
                        <View style={styles.dashedLine}></View>
                        <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
                            <Text style={{fontWeight:'bold', fontSize:20, color: colors['raisin-black']}}>
                                Total: {formatToReais(pedidos.valorTotal)}
                            </Text>
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
                            }}/>
                            
                        </View>
                        <View>
                        <Pressable 
                                style={{backgroundColor:'#4CAF50', borderRadius:5, padding:10, marginTop: 15}}
                                onPress={() => {finalizarPedido()}}
                            >
                                <Text style={{color:'white'}}>Finalizar pedido</Text>
                            </Pressable>
                        </View>
                        <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Icon name='x' size={15}></Icon>
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
      dropdown: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        minWidth: 150
      },
      placeholder: {
        fontSize: 16,
        color: '#999',
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
      closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
      },
      dashedLine: {
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ccc', 
        width: '100%',
        height: 1,           
        marginVertical: 10,
      },
      tituloTabela: {
        flexDirection:'row', 
        width:'100%',
        marginBottom:10
      }
});