import {StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import MenuBalcao from './MenuBalcao/MenuBalcao';
import MenuMesa from './MenuMesas/MenuMesa';
import MenuUsuario from './MenuUsuario/MenuUsuario';
import MenuProdutos from './MenuProdutos/MenuProdutos';
import { colors } from '../assets/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChangeView = () => {
  
    const [view, setView] = useState('Mesas');

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
                <TouchableOpacity style={styles.itemMenu} onPress={() => setView('Menu Usuário')}>
                    <Icon name="account-plus" color="white" size={40}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemMenu} onPress={() => setView('Menu Produtos')}>
                    <Icon name="store" color="white" size={40}/>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, padding: 30, paddingTop: 10, overflow: 'scroll'}}>
                <Text style={styles.tituloPagina}>{view}</Text>
                {
                    view === 'Mesas' ? (
                        <MenuMesa/>
                    ) : view === 'Balcão' ? (
                        <MenuBalcao/> 
                    ) : view === 'Menu Usuário' ? (
                        <MenuUsuario/>
                    ) : view === 'Menu Produtos' ? (
                        <MenuProdutos/>
                    ) :
                    (<Text>Nada para mostrar no momento.</Text>)
                }
            </View>
        </View>
  )
}

export default ChangeView

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