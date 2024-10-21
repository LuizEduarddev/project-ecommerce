import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';

type Vendas = {
    id: string,
    cpf: string,
    dataPagamento: string,
    metodoPagamento: string
}

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
                        </View>
    
                        {vendas.map((venda) => (
                            <Pressable key={venda.id} style={styles.row} onPress={() => {
                                setIdVenda(venda.id), setModalVisualizarVenda(true)
                                }}>
                                <Text style={styles.cell}>{venda.cpf}</Text>
                                <Text style={styles.cell}>{venda.dataPagamento}</Text>
                                <Text style={styles.cell}>{venda.metodoPagamento}</Text>
                            </Pressable>
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
})