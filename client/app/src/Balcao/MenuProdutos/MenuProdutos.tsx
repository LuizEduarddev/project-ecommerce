import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import MenuCadastraProduto from './MenuCadastraProduto';
import MenuPesquisaProduto from './MenuPesquisaProduto';
import { colors } from '../../assets/colors';

const MenuProdutos = () => {
    const [view, setView] = useState<string>('');

    const paginaBase = () => {
        return (
            <View style={styles.containerBotoes}>
                <Pressable 
                    style={styles.botaoNavegar} 
                    onPress={() => setView('pesquisa-produto')}
                >
                    <Text style={styles.textoBotao}>Pesquisar um produto</Text>
                </Pressable>
                <Pressable 
                    style={styles.botaoNavegar} 
                    onPress={() => setView('cadastra-produto')}
                >
                    <Text style={styles.textoBotao}>Cadastrar um produto</Text>
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

const styles = StyleSheet.create({
    botaoNavegar: {
        backgroundColor: colors['bright-blue'],
        padding: 10,
        borderRadius: 5,
        width: '50%',
        alignItems: 'center',
    },
    textoBotao: {
        color: colors['white'],
        fontWeight: 'semibold',
    },
    containerBotoes: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        paddingHorizontal: 20,
    }
});
