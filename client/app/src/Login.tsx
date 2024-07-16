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
    
    async function storeData(token: any)
    {
        try
        {
            await AsyncStorage.setItem('userToken', token);
            navigation.navigate('Home');
        }
        catch(error)
        {
            console.log(error);
        }
    }

    async function tryLogin()
    {
        const data = {
            login: username,
            password: password
        }

        axios.post('http://192.168.0.111:8080/api/auth/login', data)
        .then(response => {
            storeData(response.data.token)
        })
        .catch(error => {
            Alert.alert(error);
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