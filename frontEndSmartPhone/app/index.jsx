import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import Constants from 'expo-constants'
import axios from 'axios';

async function login(username, password) {
  const data = {
    login: username,
    password: password
  }
  try {
    const response = await axios.post('http://192.168.0.111:8080/api/auth/login', data);
    Alert.alert('Success'); 
  } catch (error) {
    Alert.alert('Erro', error.message);
  }
}

export default function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.boxLogin}>
          <TextInput
          onChangeText={setUsername}
          placeholder='Digite seu cpf'
          />

          <TextInput
          onChangeText={setPassword}
          placeholder='Digite sua senha'
          secureTextEntry={true}
          />

          <Button
          title='Entrar'
          onPress={() => login(username, password)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boxLogin: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Constants.statusBarHeight
  }
})