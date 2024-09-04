import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import api from '../../../ApiConfigs/ApiRoute';

type UserDTO = {
  userFullName: string,
  userCpf: string,
  userTelefone: string,
  userEmail: string,
  userEndereco: string,
};

const MenuEditarUsuario = ({ user }: { user: UserDTO }) => {
  const [userFullName, setUserFullName] = useState<string>(user.userFullName);
  const [userCpf, setUserCpf] = useState<string>(user.userCpf);
  const [userTelefone, setUserTelefone] = useState<string>(user.userTelefone);
  const [userEndereco, setUserEndereco] = useState<string>(user.userEndereco);
  const [userEmail, setUserEmail] = useState<string>(user.userEmail);
  const [modalBlankVisible, setModalBlankVisible] = useState<boolean>(false);
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

  const renderModalBlank = () => {
    return (
      <View style={styles.modalView}>
        <Text>Nenhum campo pode ficar em branco</Text>
        <Button title="X" onPress={() => setModalBlankVisible(false)} />
      </View>
    );
  };

  const renderModalCpf = () => {
    return (
      <View style={styles.modalView}>
        <Text>Cpf tem que ter no mínimo 11 dígitos.</Text>
        <Button title="X" onPress={() => setModalCpfVisible(false)} />
      </View>
    );
  };

  async function cadastrarUsuario() {
    if (
      (!userFullName.trim() && !user.userFullName.trim()) ||
      (!userCpf.trim() && !user.userCpf.trim()) ||
      (!userTelefone.trim() && !user.userTelefone.trim()) ||
      (!userEndereco.trim() && !user.userEndereco.trim()) ||
      (!userEmail.trim() && !user.userEmail.trim())
    ) {
      setModalBlankVisible(true);
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
            console.log(response.data);
          })
          .catch(error => {
            console.log(error.response.data);
          });
      } else {
        setModalCpfVisible(true);
      }
    }
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalBlankVisible}
        onRequestClose={() => setModalBlankVisible(false)}
      >
        {renderModalBlank()}
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCpfVisible}
        onRequestClose={() => setModalCpfVisible(false)}
      >
        {renderModalCpf()}
      </Modal>
      <TextInput
        placeholder={user.userFullName}
        value={userFullName}
        onChangeText={setUserFullName}
      />
      <Text>{formatCpfAsync(user.userCpf)}</Text>
      <TextInput
        placeholder={user.userEndereco}
        value={userEndereco}
        onChangeText={setUserEndereco}
      />
      <TextInput
        placeholder={user.userEmail}
        value={userEmail}
        onChangeText={setUserEmail}
      />
      <TextInput
        placeholder={user.userTelefone}
        value={userTelefone}
        onChangeText={setUserTelefone}
      />
      <Button title="Alterar usuário" onPress={cadastrarUsuario} />
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
});
