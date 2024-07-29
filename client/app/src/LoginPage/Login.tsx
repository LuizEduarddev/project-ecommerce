import { Text, TextInput, View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function storeData(token) {
        try {
            const response = await axios.post('http://192.168.105.26:8080/api/auth/get-username', token);
            if (response != null) {
                await AsyncStorage.setItem('username', response.data);
            }
            await AsyncStorage.setItem('session-token', token);
            navigation.navigate('Home');
        } catch (error) {
            console.log(error);
        }
    }

    async function tryLogin() {
        const dataLogin = {
            login: username,
            password: password
        };

        axios.post('http://192.168.105.26:8080/api/auth/login', dataLogin)
            .then(response => {
                storeData(response.data.token);
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBlue} />
            <View style={styles.middleContainer}>
                <View style={styles.box}>
                    <TextInput
                        style={styles.field}
                        placeholder="Digite seu CPF"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.field}
                        placeholder="Digite sua senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        style={styles.buttonLogin}
                        onPress={() => tryLogin()}
                    >
                        <Text style={styles.textButtonLogin}>Entrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomWhite} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBlue: {
        flex: 1,
        backgroundColor: 'blue',
    },
    middleContainer: {
        position: 'absolute',
        top: '30%', // Adjust this value as needed
        left: '10%',
        right: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    box: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    bottomWhite: {
        flex: 1,
        backgroundColor: 'white',
    },
    field: {
        textAlign: "center",
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10,
        padding: 10,
        fontSize: 15,
    },
    buttonLogin: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 20,
    },
    textButtonLogin: {
        textAlign: "center",
        fontSize: 15,
    },
});
