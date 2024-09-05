import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MenuBalcao from './MenuBalcao/MenuBalcao';
import MenuMesa from './MenuMesas/MenuMesa';
import MenuUsuario from './MenuUsuario/MenuUsuario';
import MenuProdutos from './MenuProdutos/MenuProdutos';

const ChangeView = () => {
  
    const [view, setView] = useState('mesas');

    return (
        <View>
            <Button title="Mesas" onPress={() => setView('mesas')} />
            <Button title="Balcão" onPress={() => setView('balcao')} />
            <Button title="Menu Usuários" onPress={() => setView('menu-usuario')} />
            <Button title="Produtos" onPress={() => setView('menu-produtos')} />
            {
                view === 'mesas' ? (
                    <MenuMesa/>
                ) : view === 'balcao' ? (
                    <MenuBalcao/> 
                ) : view === 'menu-usuario' ? (
                    <MenuUsuario/>
                ) : view === 'menu-produtos' ? (
                    <MenuProdutos/>
                ) :
                (<Text>Nada para mostrar no momento.</Text>)
            }
        </View>
  )
}

export default ChangeView

const styles = StyleSheet.create({})