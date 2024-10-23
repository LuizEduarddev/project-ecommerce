import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModalVisualizarVenda from './ModalVisualizarVenda';
import { colors } from '../../assets/colors';

type Vendas = {
    idPedido: string,
    cpf: string,
    dataPagamento: string,
    metodoPagamento: string,
    totalPagamento: number
}

const formatToReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const TabelaVendas = () => {
    const toast = useToast();
    const [vendas, setVendas] = useState<Vendas[]>([]);
    const [idVenda, setIdVenda] = useState('');
    const [modalVisualizarVenda, setModalVisualizarVenda] = useState(false);
    
    useEffect(() => {
        const token = localStorage.getItem('session-token');
        if (token === null) window.location.reload();
        api.get('api/pagamentos/get-by-empresa', {
            params:{
                token:token
            }
        })
        .then(response => {
            setVendas(response.data);
            console.log(response.data);
        })
        .catch(error => {
            toast.show("Erro ao tentar buscar os dados da empresa", {
                type: "warning",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
            });
        })
    }, [])

    const renderVendas = () => {
        if (vendas.length > 0 && vendas)
        {
            return(
                <ScrollView horizontal>
                    <View style={styles.container}>
                        <View style={styles.row}>
                            <Text style={[styles.cell, styles.header]}>CPF Cliente</Text>
                            <Text style={[styles.cell, styles.header]}>Método pagamento</Text>
                            <Text style={[styles.cell, styles.header]}>Data pagamento</Text>
                            <Text style={[styles.cell, styles.header]}>Valor pagamento</Text>
                        </View>
    
                        {vendas.map((venda) => (
                            <li key={venda.idPedido}>
                                <Pressable key={venda.idPedido} style={styles.row} onPress={() => {
                                    setIdVenda(venda.idPedido), setModalVisualizarVenda(true)
                                    }}>
                                    <Text style={styles.cell}>{venda.cpf}</Text>
                                    <Text style={styles.cell}>{venda.metodoPagamento}</Text>
                                    <Text style={styles.cell}>{venda.dataPagamento}</Text>
                                    <Text style={styles.cell}>{formatToReais(venda.totalPagamento)}</Text>
                                </Pressable>
                            </li>
                        ))}
                    </View>
                </ScrollView>
            );
        }
        else{
            return(
                <View>
                    <Text>Nada para mostrar no momento.</Text>
                </View>
            );
        }
    }

    return (
        <SafeAreaView>
            <View>
                {renderVendas()}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisualizarVenda}
                    onRequestClose={() => setModalVisualizarVenda(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <ModalVisualizarVenda id={idVenda}/>
                            <Pressable onPress={() => setModalVisualizarVenda(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
  )
}

export default TabelaVendas;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        margin: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cell: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
    },
    header: {
        backgroundColor: '#f4f4f4',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: colors['bright-blue'],
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: colors['white'],
    },
})