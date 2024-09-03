import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useRef, useState } from 'react';
import api from '../../../ApiConfigs/ApiRoute';
import MenuEditarUsuario from './MenuEditarUsuario';

type UserDTO = {
  userFullName: string,
  userCpf: string,
  userTelefone: string,
  userEmail: string,
  userEndereco: string,
};

const MenuPesquisarUsuario = () => {
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
      return <Text>Nenhum usuário encontrado</Text>;
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
          Alert.alert('Usuário não encontrado no sistema.');
        } else {
          setUsuarioResponse(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
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
        findCliente(getUnformattedCpf(formattedCpf)); // Pass unformatted CPF to the API
      }, 600);
    }
  };

  return (
    <View>
      {viewMenuEditarUsuario === true ? (
        <MenuEditarUsuario user={usuarioResponse}/>
      ) : (
        <View style={styles.modalView}>
          <TextInput
            keyboardType="numeric"
            maxLength={14}
            style={{ borderColor: 'gray', borderWidth: 1 }}
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
