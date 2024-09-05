import { Alert, Button, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../ApiConfigs/ApiRoute';
import MenuBalcao from './MenuBalcao';
import MenuCadastroUsuario from './MenuCadastroUsuario';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../assets/colors';

type Mesa = {
    idMesa: string,
    numeroMesa: number,
    emUso: boolean,
    mesaSuja: boolean
}

type ProdutosMesaDTO = {
    idProduto: string,
    nomeProduto: string,
    valorProduto: number
}

type PedidosMesaDTO = {
    idPedido: string,
    produtos: ProdutosMesaDTO[]
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
    const [view, setView] = useState('Mesas');
    

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

    const renderProdutos = ({item}: {item: ProdutosMesaDTO}) => {
        if (item != null) {
            return(
                <View>
                    <Text>{item.nomeProduto}</Text>
                    <Text>{formatToReais(item.valorProduto)}</Text>
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
                        
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text style={{backgroundColor: 'blue'}}>X</Text>
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
        if (view === 'Mesas')
        {
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
        else if(view === 'Balcão')
        {
            return(
                <MenuBalcao/>
            );
        }
        else if(view === 'Cadastrar usuário')
        {
            return(
                <MenuCadastroUsuario/>
            );
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.menu}>
                {/* essa logo de preferencia uma imagem sem fundo mesmo */}
                <Image source={require('./assets/logo.png')} style={{width: 90, height: 90}}/>
                <TouchableOpacity style={styles.itemMenu} onPress={() => setView('Mesas')}>
                    <Icon name="table-chair" color="white" size={40}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemMenu} onPress={() => setView('Balcão')}>
                    <Icon name="cash-register" color="white" size={40}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemMenu} onPress={() => setView('Cadastrar usuário')}>
                    <Icon name="account-plus" color="white" size={40}/>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, padding: 30, paddingTop: 10}}>
                <Text style={styles.tituloPagina}>{view}</Text>
                {renderMenu()}
            </View>        
        </SafeAreaView>
    );
}

export default MenuMesa;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1
    },
    menu: {
        height: '100%',
        width: 90,
        backgroundColor: colors['bright-blue']
    },
    itemMenu: {
        display: 'flex',
        alignItems: 'center',
        padding: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    tituloPagina: {
        fontSize: 40,
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        color: colors['bright-blue']
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
});
