import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TabelaEmpregados from './TabelaEmpregados'
import PesquisaFuncionario from './PesquisaFuncionario'
import { colors } from '../assets/colors'
import CriaNovoFuncionario from './CriaNovoFuncionario'

const Empregados = () => {

    const [modalCadastraFuncionario, setModalCadastraFuncionario] = useState(false);

    return (
        <SafeAreaView>
            <View style={styles.mainContainer}>
                <View style={styles.searchAndButtonContainer}>
                    <PesquisaFuncionario/>
                    <Pressable
                        style={styles.newFuncionarioButton} 
                        onPress={() => setModalCadastraFuncionario(true)} 
                    >
                        <Text style={styles.textoBotao}>Novo funcionário</Text>
                    </Pressable>
                </View>
                <TabelaEmpregados/>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalCadastraFuncionario}
                    onRequestClose={() => setModalCadastraFuncionario(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <CriaNovoFuncionario/>
                            <Pressable onPress={() => setModalCadastraFuncionario(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
  )
}

export default Empregados

const styles = StyleSheet.create({
    mainContainer: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    searchAndButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20, 
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginRight: 10, 
    },
    newFuncionarioButton: {
        backgroundColor: 'green', 
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