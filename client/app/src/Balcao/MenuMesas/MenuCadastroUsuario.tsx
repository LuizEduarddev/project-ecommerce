import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import api from '../../../ApiConfigs/ApiRoute';

const MenuCadastroUsuario = () => {
  
    const [userFullName, setUserFullName] = useState<string>('');
    const [userCpf, setUserCpf] = useState<string>('');
    const [userTelefone, setUserTelefone] = useState<string>('');
    const [userEndereco, setUserEndereco] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [modalBlankVisible, setModalBlankVisible] = useState<boolean>(false);
    
    async function cadastrarUsuario()
    {
        if (!userFullName.trim() && !userFullName && !userFullName.trim() && !userFullName && !userFullName.trim() && !userFullName && !userFullName.trim() && !userFullName && !userFullName.trim() && !userFullName)
        {
            setModalBlankVisible(true);
        }
        else{
            const dataToSend = {
                userFullName:userFullName,
                userCpf:userCpf,
                userTelefone:userTelefone,
                userEndereco:userEndereco,
                userEmail:userEmail
            }
            console.log(userFullName + userCpf + userTelefone + userEndereco + userEmail)
            //api.post('', dataToSend)
        }
    }

    const renderModalBlank = () => {
        return(
            <View style={styles.modalView}>
                <Text>Nenhum campo pode ficar em branco</Text>
                <Button title='X' onPress={() => setModalBlankVisible(false)}/>
            </View>
        );
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
            <TextInput
                placeholder='Nome completo'
                onChangeText={setUserFullName}
                
            />
            <TextInput
                placeholder='Cpf'
                onChangeText={setUserCpf}
            />
            <TextInput
                placeholder='Endereco'
                onChangeText={setUserEndereco}
            />
            <TextInput
                placeholder='Email'
                onChangeText={setUserEmail}
            />
            <TextInput
                placeholder='Telefone'
                onChangeText={setUserTelefone}
            />
            <Button
                title='Cadastrar usuário'
                onPress={() => cadastrarUsuario()}
            />
        </View>
  )
}

export default MenuCadastroUsuario

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
})