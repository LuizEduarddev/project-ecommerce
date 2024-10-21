import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import MenuCadastraProduto from './MenuCadastraProduto';
import MenuPesquisaProduto from './MenuPesquisaProduto';
import TabelaProdutos from './TabelaProdutos';
import { colors } from '../../assets/colors';

const MenuProdutos = () => {
    const [modalCadastraProduto, setModalCadastraProduto] = useState<boolean>(false); 

    const paginaBase = () => {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.searchAndButtonContainer}>
                    <MenuPesquisaProduto />
                    <Pressable 
                        style={styles.newProductButton} 
                        onPress={() => setModalCadastraProduto(true)} 
                    >
                        <Text style={styles.textoBotao}>Novo Produto</Text>
                    </Pressable>
                </View>

                <TabelaProdutos />
            </View>
        );
    };

    return (
        <View>
            {paginaBase()}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalCadastraProduto}
                onRequestClose={() => setModalCadastraProduto(false)} 
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <MenuCadastraProduto />
                        <Pressable onPress={() => setModalCadastraProduto(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default MenuProdutos;

const styles = StyleSheet.create({
    mainContainer: {
        padding: 20,
        backgroundColor: '#f8f8f8', // Slight background color
        flex: 1,
    },
    searchAndButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20, // Space between the button and the table
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginRight: 10, // Space between input and button
    },
    newProductButton: {
        backgroundColor: 'green', // Green color for the "Novo Produto" button
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
    },
    textoBotao: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
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
});
