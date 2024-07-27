import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';

type Item  = {
    idProd: string,
    nomeProd: string,
    precoProd: number,
    promoProd: boolean,
    quantidade: number
}

type Carrinho = {
    itens: Item[],
    valorTotalCarrinho: number
}

type DataSend = {
    idProd: string,
    nomeProd: string,
    quantidade: number
}

const RenderCarrinho = ({ item, carrinho, setCarrinho }: { item: Item, carrinho: Carrinho, setCarrinho: React.Dispatch<React.SetStateAction<Carrinho | null>> }) => {
    
    function renderQuantidade() {
        const quantity = item.quantidade ? item.quantidade : 1;
        return quantity;
    }

    async function decreaseQuantity() {
        const updatedCarrinho = {
            ...carrinho,
            itens: carrinho.itens.map(carrinhoItem => {
                if (carrinhoItem.idProd === item.idProd) {
                    const novaQuantidade = carrinhoItem.quantidade > 1 ? carrinhoItem.quantidade - 1 : 1;
                    return { ...carrinhoItem, quantidade: novaQuantidade };
                }
                return carrinhoItem;
            })
        };
        updatedCarrinho.valorTotalCarrinho = updatedCarrinho.itens.reduce((total, carrinhoItem) => total + carrinhoItem.precoProd * carrinhoItem.quantidade, 0);
        setCarrinho(updatedCarrinho);
        await AsyncStorage.setItem('user-cart', JSON.stringify(updatedCarrinho));
    }

    async function increaseQuantity() {
        const updatedCarrinho = {
            ...carrinho,
            itens: carrinho.itens.map(carrinhoItem => {
                if (carrinhoItem.idProd === item.idProd) {
                    const novaQuantidade = carrinhoItem.quantidade + 1;
                    return { ...carrinhoItem, quantidade: novaQuantidade };
                }
                return carrinhoItem;
            })
        };
        updatedCarrinho.valorTotalCarrinho = updatedCarrinho.itens.reduce((total, carrinhoItem) => total + carrinhoItem.precoProd * carrinhoItem.quantidade, 0);
        setCarrinho(updatedCarrinho);
        await AsyncStorage.setItem('user-cart', JSON.stringify(updatedCarrinho));
    }

    async function deleteItem() {
        const updatedCarrinho = {
            ...carrinho,
            itens: carrinho.itens.filter(carrinhoItem => carrinhoItem.idProd !== item.idProd)
        };
        updatedCarrinho.valorTotalCarrinho = updatedCarrinho.itens.reduce((total, carrinhoItem) => total + carrinhoItem.precoProd * carrinhoItem.quantidade, 0);
        setCarrinho(updatedCarrinho);
        await AsyncStorage.setItem('user-cart', JSON.stringify(updatedCarrinho));
    }

    return (
        <View>
            <Text>{item.nomeProd}</Text>
            <Text>{item.precoProd}</Text>
            <View>
                <Button title='+' onPress={increaseQuantity} />
                <Text>{renderQuantidade()}</Text>
                <Button title='-' onPress={decreaseQuantity} />
            </View>
            <MaterialIcons.Button name="restore-from-trash" onPress={deleteItem} />
        </View>
    );
}

const MainView = ({ carrinho, setCarrinho }: { carrinho: Carrinho | null, setCarrinho: React.Dispatch<React.SetStateAction<Carrinho | null>> }) => {

    if (!carrinho || carrinho.itens.length <= 0) {
        return(
            <View>
                <Text>No momento seu carrinho está vazio, adicione produtos e volte aqui.</Text>
            </View>
        );
    } else {
        const formatToReais = (value: number) => {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        };

        return (
            <View>
                <Text>Seu carrinho</Text>
                <FlatList
                    data={carrinho.itens}
                    renderItem={({ item }) => <RenderCarrinho item={item} carrinho={carrinho} setCarrinho={setCarrinho} />}
                    keyExtractor={(item) => item.idProd}
                />
                <Text>Total do carrinho: {formatToReais(carrinho.valorTotalCarrinho)}</Text>
                <Button title='Realize pedido' onPress={() => enviarPedido(carrinho, setCarrinho)} />
            </View>
        );
    }
}

async function enviarPedido(carrinho: Carrinho, setCarrinho: React.Dispatch<React.SetStateAction<Carrinho | null>>) {
    const sessionToken = await AsyncStorage.getItem('session-token');
    const dataToSend: DataSend[] = carrinho.itens.map(itemCarrinho => ({
        idProd: itemCarrinho.idProd,
        nomeProd: itemCarrinho.nomeProd,
        quantidade: itemCarrinho.quantidade
    }));
    const dataPost = {
        produtos: dataToSend,
        token: sessionToken
    }
    axios.post('http://192.168.105.26:8080/api/pedidos/add', dataPost)
    .then(async response => {
        Alert.alert('Pedido realizado com sucesso.');
        const newCart = {itens: [], valorTotalCarrinho: 0 }
        await AsyncStorage.setItem('user-cart', JSON.stringify(newCart));
        setCarrinho(newCart); // Update the state here
    })
    .catch(error => {
        Alert.alert(error as string);
    })
}

export default function Cart() {
    const [carrinho, setCarrinho] = useState<Carrinho | null>(null);
    const isFocused = useIsFocused();

    async function initialRequires() {
        let storedCart = await AsyncStorage.getItem('user-cart');
        let carrinho: Carrinho = storedCart ? JSON.parse(storedCart) : null;
        setCarrinho(carrinho);
    }

    useEffect(() => {
        if (isFocused)
        {
            initialRequires();
        }
    }, [isFocused]);

    return (
        <SafeAreaView>
            <MainView carrinho={carrinho} setCarrinho={setCarrinho} />
        </SafeAreaView>
    );
}
