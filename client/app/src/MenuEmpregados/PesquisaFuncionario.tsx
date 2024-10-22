import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications';
import api from '../../ApiConfigs/ApiRoute';
import debounce from 'lodash.debounce'

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
  const [funcionarioEditar, setFuncionarioEditar] = useState<EmpregadosDTO>();

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
      <Pressable onPress={() => console.log('pressionado')} style={styles.item}>
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
});