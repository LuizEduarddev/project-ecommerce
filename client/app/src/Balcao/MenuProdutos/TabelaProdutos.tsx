import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';

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

    useEffect(() => {
        const token = localStorage.getItem('session-token');
        if (token === null) window.location.reload();

        api.post('api/products/get-by-empresa', null, {
            params: { token: token }
        })
        .then(response => {
            setProdutosEmpresa(response.data);
            console.log(response.data);
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
                            <Text style={[styles.cell, styles.header]}>Imagem</Text>
                        </View>
    
                        {produtosEmpresa.map((product) => (
                            <Pressable key={product.idProduto} style={styles.row}>
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
        loadProdutosEmpresa()  
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
})