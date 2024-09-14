import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useRef, useState } from 'react';
import api from '../../../ApiConfigs/ApiRoute';
import MenuEditarUsuario from './MenuEditarUsuario';
import { useToast } from 'react-native-toast-notifications';

type UserDTO = {
  userFullName: string,
  userCpf: string,
  userTelefone: string,
  userEmail: string,
  userEndereco: string,
};

const MenuPesquisarUsuario = () => {
  const toast = useToast();
  const [buscaUsuario, setBuscaUsuario] = useState('');
  const [usuarioResponse, setUsuarioResponse] = useState<UserDTO | null>(null);
  const [viewMenuEditarUsuario, setViewMenuEditarUsuario] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const formatCpf = (text: string) => {
    let cpf = text.replace(/\D/g, '');

    if (cpf.length <= 3) {
      cpf = cpf.replace(/(\d{0,3})/, '$1');
    } else if (cpf.length <= 6) {
      cpf = cpf.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    } else if (cpf.length <= 9) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    }

    return cpf;
  };

  const getUnformattedCpf = (cpf: string) => cpf.replace(/\D/g, '');

  const renderPesquisa = () => {
    if (usuarioResponse) {
      return (
        <View style={{ borderColor: 'black', borderWidth: 1 }}>
          <Pressable style={{ borderColor: 'black', borderWidth: 1 }} onPress={() => setViewMenuEditarUsuario(true)}>
            <Text>{usuarioResponse.userCpf}</Text>
            <Text>{usuarioResponse.userEmail}</Text>
            <Text>{usuarioResponse.userEndereco}</Text>
            <Text>{usuarioResponse.userFullName}</Text>
            <Text>{usuarioResponse.userTelefone}</Text>
          </Pressable>
        </View>
      );
    } else {
      return <Text style={{ alignSelf: 'center', marginVertical: 20 }}>Nenhum usuário encontrado</Text>;
    }
  };

  async function findCliente(query: string) {
    if (query === '') {
      return;
    } else {
      api.post('api/auth/get-by-cpf', query, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session-token')}` 
        }
      })
      .then((response) => {
        if (response.data === null) {
          toast.show("Usuário não encontrado no sistema.", {
            type: "warning",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
          });
        } else {
          setUsuarioResponse(response.data);
        }
      })
      .catch((error) => {
        toast.show("Erro ao tentar buscar o usuário", {
          type: "danger",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      });
    }
  }

  const handleSearchInputChange = (text: string) => {
    const formattedCpf = formatCpf(text);
    setBuscaUsuario(formattedCpf);

    if (getUnformattedCpf(formattedCpf).length === 11) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        findCliente(getUnformattedCpf(formattedCpf)); 
      }, 600);
    }
  };

  return (
    <View>
      {viewMenuEditarUsuario === true ? (
        <MenuEditarUsuario user={usuarioResponse}/>
      ) : (
        <View style={styles.container}>
          <TextInput
            keyboardType="numeric"
            maxLength={14}
            style={styles.input}
            placeholder="Busque por um cliente"
            onChangeText={handleSearchInputChange}
            value={buscaUsuario}
          />
          {renderPesquisa()}
        </View>
      )}
    </View>
  );
};

export default MenuPesquisarUsuario;

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
});
