import { Button, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import api from '../../../ApiConfigs/ApiRoute';

const MenuCadastroUsuario = () => {
  const [userFullName, setUserFullName] = useState<string>('');
  const [userCpf, setUserCpf] = useState<string>('');
  const [userTelefone, setUserTelefone] = useState<string>('');
  const [userEndereco, setUserEndereco] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [modalBlankVisible, setModalBlankVisible] = useState<boolean>(false);
  const [view, setView] = useState<string>();

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

    setUserCpf(cpf);
  };

  const getUnformattedCpf = (cpf: string) => cpf.replace(/\D/g, '');

  async function cadastrarUsuario() {
    if (
      !userFullName.trim() ||
      !userCpf.trim() ||
      !userTelefone.trim() ||
      !userEndereco.trim() ||
      !userEmail.trim()
    ) {
      setModalBlankVisible(true);
    } else {
      const dataToSend = {
        userFullName,
        userCpf: getUnformattedCpf(userCpf),
        userTelefone,
        userEndereco,
        userEmail,
      };
      api.post('api/auth/register/avulso', dataToSend)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.response.data);
      })
    }
  }

  const renderModalBlank = () => {
    return (
      <View style={styles.modalView}>
        <Text>Nenhum campo pode ficar em branco</Text>
        <Button title="X" onPress={() => setModalBlankVisible(false)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalBlankVisible}
        onRequestClose={() => setModalBlankVisible(false)}
      >
        {renderModalBlank()}
      </Modal>
      <TextInput 
        placeholder="Nome completo" 
        onChangeText={setUserFullName} 
        style={styles.input}
        />
      <TextInput
        placeholder="CPF"
        value={userCpf}
        onChangeText={formatCpf}
        keyboardType="numeric"
        maxLength={14}
        style={styles.input}
      />
      <TextInput 
        placeholder="Endereço" 
        onChangeText={setUserEndereco} 
        style={styles.input}/>
      <TextInput 
        placeholder="Email" 
        onChangeText={setUserEmail} 
        style={styles.input}/>
      <TextInput 
        placeholder="Telefone" 
        onChangeText={setUserTelefone} 
        style={styles.input} />
      <Pressable style={styles.submitButton} onPress={cadastrarUsuario}>
        <Text style={styles.submitButtonText}>Cadastrar Usuário</Text>
      </Pressable>
    </View>
  );
};

export default MenuCadastroUsuario;

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
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
  input: {
    backgroundColor: '#fff',
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  submitButton: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
