import { Button, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';

const MenuCadastroUsuario = () => {
  const toast = useToast();
  const [userFullName, setUserFullName] = useState<string>('');
  const [userCpf, setUserCpf] = useState<string>('');
  const [userTelefone, setUserTelefone] = useState<string>('');
  const [userEndereco, setUserEndereco] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
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
      toast.show("Por favor, preencha todos os campos", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
    } else {
      const dataToSend = {
        userFullName,
        userCpf: getUnformattedCpf(userCpf),
        userTelefone,
        userEndereco,
        userEmail,
      };
      api.post('api/auth/register/avulso', dataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
          'Content-Type': 'application/json'
      }
      })
      .then(response => {
        toast.show("Usuário registrado com sucesso", {
          type: "success",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      })
      .catch(error => {
        if (!error.response)
        {
          toast.show("Falha no servidor", {
            type: "danger",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
          });
        }
        else{
          toast.show("CPF já existente.", {
            type: "warning",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
          });
        }
      })
    }
  }

  return (
    <View style={styles.container}>
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
