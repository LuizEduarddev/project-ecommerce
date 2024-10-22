import {StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import MenuBalcao from './MenuBalcao/MenuBalcao';
import MenuMesa from './MenuMesas/MenuMesa';
import MenuProdutos from './MenuProdutos/MenuProdutos';
import api from '../../ApiConfigs/ApiRoute';
import { colors } from '../assets/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useToast } from 'react-native-toast-notifications';
import MenuAdministrador from './MenuAdministrador/MenuAdministrador';
import Empregados from '../MenuEmpregados/Empregados';

const ChangeView = ({ navigation }) => {
    const toast = useToast();
    const [view, setView] = useState('Mesas');

    useEffect(() => {
        async function initialization() {
            const token = await localStorage.getItem('session-token'); 
            if (token == null) {
                navigation.navigate('Login');
            } else {
                api.get('api/auth/autorization',{
                    params: {
                        token: token,
                    },
                })
                .then(response => {
                    toast.show("Login efetuado com sucesso.", {
                        type: "success",
                        placement: "top",
                        duration: 2000,
                        animationType: "slide-in",
                    });
                })
                .catch (error => {
                    toast.show("Erro ao checar o token.", {
                        type: "danger",
                        placement: "top",
                        duration: 2000,
                        animationType: "slide-in",
                        });
                    navigation.navigate('Login'); 
                }) 
            }
        }
        initialization();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.menu}>
                {/* essa logo de preferencia uma imagem sem fundo mesmo */}
                <Image source={require('./assets/logo.png')} style={{width: 90, height: 90}}/>
                <TouchableOpacity style={styles.itemMenu} onPress={() => setView('Mesas')}>
                    <Icon name="table-chair" color="white" size={40}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemMenu} onPress={() => setView('Balcão')}>
                    <Icon name="cash-register" color="white" size={40}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemMenu} onPress={() => setView('Menu Produtos')}>
                    <Icon name="dropbox" color="white" size={40}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemMenu} onPress={() => setView('Menu Administrador')}>
                    <Icon name="store" color="white" size={40}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemMenu} onPress={() => setView('Menu Empregados')}>
                    <IconMaterialIcons name="person" color="white" size={40}/>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, padding: 30, paddingTop: 10, overflow: 'scroll'}}>
                <Text style={styles.tituloPagina}>{view}</Text>
                {
                    view === 'Mesas' ? (
                        <MenuMesa/>
                    ) : view === 'Balcão' ? (
                        <MenuBalcao/> 
                    ) : view === 'Menu Produtos' ? (
                        <MenuProdutos/>
                    ) : view === 'Menu Administrador' ? (
                        <MenuAdministrador/>
                    ) : view === 'Menu Empregados' ? (
                        <Empregados/>
                    ) :
                    (<Text>Nada para mostrar no momento.</Text>)
                }
            </View>
        </View>
  )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1
    },
    menu: {
        height: '100%',
        width: 90,
        backgroundColor: colors['bright-blue']
    },
    itemMenu: {
        display: 'flex',
        alignItems: 'center',
        padding: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    tituloPagina: {
        fontSize: 40,
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        color: colors['bright-blue']
    }
})

export default ChangeView;
