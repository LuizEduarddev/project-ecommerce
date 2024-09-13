import { Button, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';

type UserDTO = {
  userFullName: string,
  userCpf: string,
  userTelefone: string,
  userEmail: string,
  userEndereco: string,
};

const MenuEditarUsuario = ({ user }: { user: UserDTO }) => {
  const toast = useToast();
  const [userFullName, setUserFullName] = useState<string>(user.userFullName);
  const [userCpf, setUserCpf] = useState<string>(user.userCpf);
  const [userTelefone, setUserTelefone] = useState<string>(user.userTelefone);
  const [userEndereco, setUserEndereco] = useState<string>(user.userEndereco);
  const [userEmail, setUserEmail] = useState<string>(user.userEmail);
  const [modalCpfVisible, setModalCpfVisible] = useState<boolean>(false);

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

  function formatCpfAsync(text: string)
  {
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
  }

  const getUnformattedCpf = (cpf: string) => cpf.replace(/\D/g, '');

  async function cadastrarUsuario() {
    if (
      (!userFullName.trim() && !user.userFullName.trim()) ||
      (!userCpf.trim() && !user.userCpf.trim()) ||
      (!userTelefone.trim() && !user.userTelefone.trim()) ||
      (!userEndereco.trim() && !user.userEndereco.trim()) ||
      (!userEmail.trim() && !user.userEmail.trim())
    ) {
      toast.show("Preencha todos os campos", {
        type: "danger",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
    } else {
      if (getUnformattedCpf(userCpf).length === 11) {
        const dataToSend = {
          userFullName: userFullName.trim() || user.userFullName,
          userCpf: getUnformattedCpf(userCpf),
          userTelefone: userTelefone.trim() || user.userTelefone,
          userEndereco: userEndereco.trim() || user.userEndereco,
          userEmail: userEmail.trim() || user.userEmail,
        };
        api.post('api/auth/alter/avulso', dataToSend, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
            'Content-Type': 'application/json'
        }
        })
          .then(response => {
            toast.show("Usuário alterado com sucesso.", {
              type: "success",
              placement: "top",
              duration: 4000,
              animationType: "slide-in",
            });
          })
          .catch(error => {
            toast.show("Erro ao editar o usuário", {
              type: "danger",
              placement: "top",
              duration: 4000,
              animationType: "slide-in",
            });
          });
      } else {
        toast.show("CPF precisa ter 11 digitos.", {
          type: "warning",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      }
    }
  }

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          placeholder={user.userFullName}
          value={userFullName}
          onChangeText={setUserFullName}
          style={styles.input}
        />
        <Text style={styles.input}>{formatCpfAsync(user.userCpf)}</Text>
        <TextInput
          placeholder={user.userEndereco}
          value={userEndereco}
          onChangeText={setUserEndereco}
          style={styles.input}
        />
        <TextInput
          placeholder={user.userEmail}
          value={userEmail}
          onChangeText={setUserEmail}
          style={styles.input}
        />
        <TextInput
          placeholder={user.userTelefone}
          value={userTelefone}
          onChangeText={setUserTelefone}
          style={styles.input}
        />
        <Pressable style={styles.submitButton} onPress={cadastrarUsuario}>
        <Text style={styles.submitButtonText}>Alterar usuario</Text>
      </Pressable>
      </View>
    </View>
  );
};

export default MenuEditarUsuario;

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
  container: {
    padding: 16
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
