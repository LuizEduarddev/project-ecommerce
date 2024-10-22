import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications';
import api from '../../ApiConfigs/ApiRoute';
import debounce from 'lodash.debounce'
import { colors } from '../assets/colors';
import EditarFuncionario from './EditarFuncionario';

type EmpregadosDTO = {
    id: string,
    authorities:string,
    nome: string,
    telefone: string,
    cpf:string,
    endereco:string,
    email:string
}

const PesquisaFuncionario = () => {
  const toast = useToast();
  const [buscaFuncionario, setBuscaFuncionario] = useState<string>('');
  const [funcionarioResponse, setFuncionarioResponse] = useState<EmpregadosDTO[]>([]);
  const [modalVisualizaFuncionario, setModalVisualizaFuncionario] = useState(false);
  const [idFuncionario, setIdFuncionario] = useState('');

  async function findFuncionario(query: string) {
    const token = localStorage.getItem('session-token');
    if (token === null) window.location.reload();
    if (query === '') {
      return;
    } else {
      const dto = {
        query:query,
        token: token
      }
      api.post('api/auth/search', dto)
      .then((response) => {
        if (response.data === null) {
          toast.show("Funcionário não encontrado", {
            type: "warning",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
          });
        } else {
            setFuncionarioResponse(response.data);
        }
      })
      .catch((error) => {
        toast.show("Falha no servidor.", {
          type: "danger",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      });
    }
  }

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length > 2) { 
        findFuncionario(query);
      } else {
        setFuncionarioResponse([]); 
      }
    }, 600),
    []
  );

  useEffect(() => {
    debouncedSearch(buscaFuncionario);
    return () => {
      debouncedSearch.cancel();
    };
  }, [buscaFuncionario]);

  const renderFuncionario = ({ item }: {item: EmpregadosDTO}) => (
      <Pressable onPress={() => {setIdFuncionario(item.id), setModalVisualizaFuncionario(true)}} style={styles.item}>
          <Text>{item.email}</Text>
          <Text>{item.nome}</Text>
      </Pressable>
  );

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={buscaFuncionario}
          placeholder="Busque por um funcionario"
          onChangeText={setBuscaFuncionario}
        />
        {funcionarioResponse?.length > 0 &&
          <FlatList
            data={funcionarioResponse}
            renderItem={renderFuncionario}
            keyExtractor={(item) => item.id}
            style={styles.dropdown}
          />
        }
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisualizaFuncionario}
            onRequestClose={() => setModalVisualizaFuncionario(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <EditarFuncionario id={idFuncionario}/>
                    <Pressable onPress={() => setModalVisualizaFuncionario(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
      </View>
    </>
  );
};

export default PesquisaFuncionario;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',

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
});