import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Menu = ({navigation}) => {
  return (
    <SafeAreaView>
        <View>
          <Button
            title='Ir para o perfil'
            onPress={() => navigation.navigate('Profile')}
          />
          <Button
            title='Ir para pedidos anteriores'
            onPress={() => navigation.navigate('PedidosCliente')}
          />
        </View>
    </SafeAreaView>
  )
}

export default Menu

const styles = StyleSheet.create({})