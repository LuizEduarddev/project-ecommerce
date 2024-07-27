import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useIsFocused } from '@react-navigation/native'

type ProfileData = {
    loginUser: string |null
    nomeCompleto: string |null
    telefone: string |null
    cpf: string |null
    endereco: string |null
    email: string |null
}

async function profileRequires(setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>)
{
    const sessionToken = await AsyncStorage.getItem('session-token');
    axios.post('http://192.168.105.26:8080/api/auth/profile', sessionToken)
    .then(response => {
        setProfileData(response.data);
    })
    .catch(error => {
        Alert.alert(error as string);
    })
}

const RenderItem = ({ item, label, onChange }: { item: string | null, label: string, onChange: (text: string) => void }) => {
    return (
        <View>
            <Text>{label}</Text>
            <TextInput
                placeholder={item || label}
                value={item || ''}
                onChangeText={onChange}
            />
        </View>
    );
};

const RenderProfile = ({ profileProps, setProfileData }: { profileProps: ProfileData | null, setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>> }) => {

    const handleChange = (field: keyof ProfileData, value: string) => {
        setProfileData(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <View>
            <RenderItem item={profileProps?.nomeCompleto} label='Nome completo' onChange={(text) => handleChange('nomeCompleto', text)} />
            <RenderItem item={profileProps?.email} label='Email' onChange={(text) => handleChange('email', text)} />
            <RenderItem item={profileProps?.cpf} label='CPF' onChange={(text) => handleChange('cpf', text)} />
            <RenderItem item={profileProps?.telefone} label='Telefone' onChange={(text) => handleChange('telefone', text)} />
            <RenderItem item={profileProps?.loginUser} label='Nome de usuário' onChange={(text) => handleChange('loginUser', text)} />
            <RenderItem item={profileProps?.endereco} label='Endereço' onChange={(text) => handleChange('endereco', text)} />
            <Button
                title='Salvar alterações'
                onPress={() => alterarPerfil(profileProps)}
            />
        </View>
    );
};


async function alterarPerfil(profileData: ProfileData | null) {
    const sessionToken = await AsyncStorage.getItem('session-token');
    
    if (!profileData) {
        Alert.alert('Profile data is not available');
        return;
    }

    if (sessionToken === null) {
        Alert.alert('Falha ao tentar recuperar os dados de usuário, reinicie a sessão e tente novamente.');
    } else {
        const alterProfileData = {
            loginUser: profileData.loginUser,
            nomeCompleto: profileData.nomeCompleto,
            telefone: profileData.telefone,
            cpf: profileData.cpf,
            endereco: profileData.endereco,
            email: profileData.email,
            token: sessionToken
        };

        axios.post('http://192.168.105.26:8080/api/auth/alter-profile', alterProfileData)
        .then(response => {
            Alert.alert(response.data);
        })
        .catch(error => {
            Alert.alert(error.message);
        });
    }
}


const Profile = () => {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            profileRequires(setProfileData);
        }
    }, [isFocused]);

    return (
        <SafeAreaView>
            <RenderProfile profileProps={profileData} setProfileData={setProfileData} />
        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({})