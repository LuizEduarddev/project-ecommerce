import { Button, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useRef } from 'react';
import api from '../../../ApiConfigs/ApiRoute';

type Product = {
    idProd: string;
    nomeProd: string;
    precoProd: number;
}

const formatToReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const MenuBalcao = () => {
    const [buscaProduto, setBuscaProduto] = useState('');
    const [produtoResponse, setProdutoResponse] = useState<Product[] | null>(null);
    const [produtosBalcao, setProdutosBalcao] = useState<Product[] | null>(null);
    const debounceTimeout = useRef(null);

    async function findProduto(query) {
        if (query == "")
        {
            return;
        }
        else{
            api.post('api/products/search', query)
            .then(response => {
                setProdutoResponse(response.data);
            })
            .catch(error => {
                console.log(error as string);
            })
        }
    }

    const saveProduto = (produto: Product) => {
        setProdutosBalcao(prevProducts => [...prevProducts, produto]);
    }

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

    const handleSearchInputChange = (text) => {
        setBuscaProduto(text);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            findProduto(text);
        }, 600); 
    };

    const renderProdutosBalcao = ({item}:{item:Product}) => {
        if (item)
        {
            return(
                <View>
                    <Text>{item.nomeProd}</Text>
                    <Text>{formatToReais(item.precoProd)}</Text>
                </View>
            );
        }
        else{
            return;
        }
    }

    //foi?

    const valorTotal = () => {
        if (produtosBalcao && produtosBalcao.length > 0)
        {
            let soma = 0;
            produtosBalcao.forEach(produto => soma+= produto.precoProd)
            return(
                <Text>Total: {formatToReais(soma)}</Text>
            );
        }
        else{
            return;
        }
    }

    const renderProdutosSalvos = () => {
        if (produtosBalcao && produtosBalcao.length > 0)
        {
            return(
                <View>
                    <FlatList
                        data={produtosBalcao}
                        renderItem={renderProdutosBalcao}
                        keyExtractor={(item) => item.idProd}
                    />
                    {valorTotal()}
                </View>
            );
        }
        else{
            return;
        }
    }

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
});
