import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({navigation})
{
    const storage = AsyncStorage
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    async function storeData(token)
    {
        try
        {
            const response = await axios.post('http://192.168.105.26:8080/api/auth/get-username', token)
            if (response != null)
            {
                await AsyncStorage.setItem('username', response.data);
            }
            await AsyncStorage.setItem('session-token', token);
            navigation.navigate('Home');
        }
        catch(error)
        {
            console.log(error);
        }
    }

    async function tryLogin()
    {
        const dataLogin = {
            login: username,
            password: password
        }

        axios.post('http://192.168.105.26:8080/api/auth/login', dataLogin)
        .then(response => {
            storeData(response.data.token)
        })
        .catch(error => {
            console.log(error);
        })
    }

    return(
        <SafeAreaView>
            <View>
                
                <TextInput
                placeholder="Digite seu CPF"
                value={username}
                onChangeText={setUsername}
                />
                
                <TextInput
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                />
                
                <Button
                title="Entrar"
                onPress={() => tryLogin()}
                />
            </View>
        </SafeAreaView>
    );
}