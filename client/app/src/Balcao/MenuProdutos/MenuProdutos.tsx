import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import MenuCadastraProduto from './MenuCadastraProduto';
import MenuPesquisaProduto from './MenuPesquisaProduto';

const MenuProdutos = () => {
    const [view, setView] = useState<string>('');

    const paginaBase = () => {
        return (
            <View>
                <Pressable 
                    style={{borderColor: 'green', borderWidth: 1}} 
                    onPress={() => setView('pesquisa-produto')}
                >
                    <Text>Pesquisar um produto</Text>
                </Pressable>
                <Pressable 
                    style={{borderColor: 'red', borderWidth: 1}} 
                    onPress={() => setView('cadastra-produto')}
                >
                    <Text>Cadastrar um produto</Text>
                </Pressable>
            </View>
        );
    };

    return (
        <View>
            {paginaBase()}

            {view === 'pesquisa-produto' && <MenuPesquisaProduto />}
            {view === 'cadastra-produto' && <MenuCadastraProduto />}
        </View>
    );
};

export default MenuProdutos;

const styles = StyleSheet.create({});
