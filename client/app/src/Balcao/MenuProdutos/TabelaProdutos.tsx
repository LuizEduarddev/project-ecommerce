import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import MenuEditarProduto from './MenuEditarProduto';
import { colors } from '../../assets/colors';

type Products = {
    idProduto: string,
    nomeProd: string,
    precoProd: number,
    promoProd: boolean,
    categoria: string,
    precoPromocao: number,
    imagemProduto: string
}

const TabelaProdutos = () => {
    const toast = useToast();
    const [produtosEmpresa, setProdutosEmpresa] = useState<Products[]>([]);
    const [modalEditarProduto, setModalEditarProduto] = useState<boolean>(false);
    const [idProdutoEditar, setIdProdutoEditar] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('session-token');
        if (token === null) window.location.reload();

        api.post('api/products/get-by-empresa', null, {
            params: { token: token }
        })
        .then(response => {
            setProdutosEmpresa(response.data);
        })
        .catch(error => {
            toast.show("Erro ao tentar buscar os produtos.", {
                type: "warning",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
            });
        });
    }, []);

    const loadProdutosEmpresa = () => {
        if (produtosEmpresa.length > 0 && produtosEmpresa) {
            return (
                <ScrollView horizontal>
                    <View style={styles.container}>
                        <View style={styles.row}>
                            <Text style={[styles.cell, styles.header]}>ID</Text>
                            <Text style={[styles.cell, styles.header]}>Nome</Text>
                            <Text style={[styles.cell, styles.header]}>Preço</Text>
                            <Text style={[styles.cell, styles.header]}>Promoção</Text>
                            <Text style={[styles.cell, styles.header]}>Categoria</Text>
                            <Text style={[styles.cell, styles.header]}>Preço Promo</Text>
                        </View>
    
                        {produtosEmpresa.map((product) => (
                            <Pressable key={product.idProduto} style={styles.row} onPress={() => {
                                setIdProdutoEditar(product.idProduto), setModalEditarProduto(true)
                                }}>
                                <Text style={styles.cell}>{product.idProduto}</Text>
                                <Text style={styles.cell}>{product.nomeProd}</Text>
                                <Text style={styles.cell}>{product.precoProd}</Text>
                                <Text style={styles.cell}>{product.promoProd ? 'Sim' : 'Não'}</Text>
                                <Text style={styles.cell}>{product.categoria}</Text>
                                <Text style={styles.cell}>{product.precoPromocao}</Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            );
        } else {
            return (
                <View>
                    <Text>Nenhum produto para mostrar no momento.</Text>
                </View>
            );
        }
    };

    return (
        <View>
            {loadProdutosEmpresa()}  
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalEditarProduto}
                onRequestClose={() => setModalEditarProduto(false)} 
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <MenuEditarProduto id={idProdutoEditar}/>
                        <Pressable onPress={() => setModalEditarProduto(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default TabelaProdutos

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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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