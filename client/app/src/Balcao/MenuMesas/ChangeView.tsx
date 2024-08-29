import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MenuBalcao from './MenuBalcao';
import MenuMesa from './MenuMesa';
import MenuUsuario from './MenuUsuario';

const ChangeView = () => {
  
    const [view, setView] = useState('mesas');

    return (
        <View>
            <Button title="Mesas" onPress={() => setView('mesas')} />
            <Button title="Balcão" onPress={() => setView('balcao')} />
            <Button title="Menu Usuários" onPress={() => setView('menu-usuario')} />
            {
                view === 'mesas' ? (
                    <MenuMesa/>
                ) : view === 'balcao' ? (
                    <MenuBalcao/> 
                ) : view === 'menu-usuario' ? (
                    <MenuUsuario/>
                ) : (<Text>Nada para mostrar no momento.</Text>)
            }
        </View>
  )
}

export default ChangeView

const styles = StyleSheet.create({})