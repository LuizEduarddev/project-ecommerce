import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications';
import api from '../../ApiConfigs/ApiRoute';
import { SafeAreaView } from 'react-native-safe-area-context';
import VisualizarFuncionario from './EditarFuncionario';
import { colors } from '../assets/colors';

type Props = {
    id: string,
    authorities:string,
    nome: string,
    telefone: string,
    cpf:string,
    endereco:string,
    email:string
}

const TabelaEmpregados = () => {
  
    const toast = useToast();
    const [funcionarios, setFuncionarios] = useState<Props[]>([]);
    const [modalVisualizarFuncionario, setModalVisualizarFuncionario] = useState(false);
    const [idFuncionario, setIdFuncionario] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('session-token');
        if (token === null) window.location.reload();
        
        api.get('api/auth/get-by-empresa', {
            params:{
                token:token
            }
        })
        .then(response => {
            setFuncionarios(response.data);
        })
        .catch(error => {
            toast.show("Falha ao tentar buscar os funcionários.", {
                type: "warning",
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
            });
        })
    }, [])

    const renderTabelaFuncionarios = () => {
        if (funcionarios && funcionarios.length > 0)
        {
            return (
                <ScrollView horizontal>
                    <View style={styles.container}>
                        <View style={styles.row}>
                            <Text style={[styles.cell, styles.header]}>Nome</Text>
                            <Text style={[styles.cell, styles.header]}>Telefone</Text>
                            <Text style={[styles.cell, styles.header]}>Email</Text>
                            <Text style={[styles.cell, styles.header]}>Cpf</Text>
                            <Text style={[styles.cell, styles.header]}>Endereço</Text>
                            <Text style={[styles.cell, styles.header]}>Autoridades</Text>
                        </View>
    
                        {funcionarios.map((funcionario) => (
                            <Pressable key={funcionario.id} style={styles.row} onPress={() => {
                                setIdFuncionario(funcionario.id), setModalVisualizarFuncionario(true)
                                }}>
                                <Text style={styles.cell}>{funcionario.nome}</Text>
                                <Text style={styles.cell}>{funcionario.telefone}</Text>
                                <Text style={styles.cell}>{funcionario.email}</Text>
                                <Text style={styles.cell}>{funcionario.cpf}</Text>
                                <Text style={styles.cell}>{funcionario.endereco}</Text>
                                <Text style={styles.cell}>{funcionario.authorities}</Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            );
        }
        else{
            return(
                <View>
                    <Text>Nada para mostrar no momento....</Text>
                </View>
            );
        }
    }

    return (
        <SafeAreaView>
            <View>
                {renderTabelaFuncionarios()}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisualizarFuncionario}
                    onRequestClose={() => setModalVisualizarFuncionario(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <VisualizarFuncionario id={idFuncionario}/>
                            <Pressable onPress={() => setModalVisualizarFuncionario(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
  )
}

export default TabelaEmpregados

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