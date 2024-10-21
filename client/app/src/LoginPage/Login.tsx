import { Text, TextInput, View, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useState } from "react";
import api from "../../ApiConfigs/ApiRoute";
import { useToast } from "react-native-toast-notifications";

export default function Login({ navigation }) {
    const toast = useToast();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function storeData(token) {
        try {
            await localStorage.setItem('session-token', token);
        } catch (error) {
            toast.show("Erro ao salvar o token. Poderá resultar em problemas.", {
                type: "danger",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
              });
        }
    }

    async function tryLogin() {
        if ((username === null || username === '')|| (password === null || password === ''))
        {
            toast.show("Preencha todos os campos", {
                type: "warning",
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
              });
        }
        else{
            const dataLogin = {
                login: username,
                password: password
            };
    
            try
            {
                api.post('/api/auth/login', dataLogin)
                .then(response => {
                    storeData(response.data.token);
                    navigation.navigate("ChangeView");
                })
                .catch(error => {
                    if (!error.response) {
                        toast.show("Falha ao tentar se conectar ao servidor.", {
                            type: "danger",
                            placement: "top",
                            duration: 4000,
                            animationType: "slide-in",
                        });
                    } else {
                        toast.show("Usuário ou senha incorretos", {
                            type: "warning",
                            placement: "top",
                            duration: 4000,
                            animationType: "slide-in",
                        });
                    }
                });
            }
            catch(error)
            {
                toast.show("Erro", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                });
            }
        }
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
                    
                    {
                        <TouchableOpacity
                            style={styles.buttonLogin}
                            onPress={() => navigation.navigate('MenuGarcom')}
                        >
                            <Text style={styles.textButtonLogin}>MenuGarcom</Text>
                        </TouchableOpacity>
                        /*
                        <TouchableOpacity
                        style={styles.buttonLogin}
                        onPress={() => navigation.navigate('ChangeView')}
                        >
                            <Text style={styles.textButtonLogin}>ChangeView</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonLogin}
                            onPress={() => navigation.navigate('MenuBalcaoDePreparo')}
                        >
                            <Text style={styles.textButtonLogin}>MenuBalcaoDePreparo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonLogin}
                            onPress={() => navigation.navigate('MenuCozinha')}
                        >
                            <Text style={styles.textButtonLogin}>MenuCozinha</Text>
                        </TouchableOpacity>
                        */
                    }
                    
                </View>
            </View>
            <View style={styles.bottomWhite} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'scroll'
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
