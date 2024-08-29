import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MenuCadastroUsuario from './MenuCadastroUsuario';
import MenuPesquisarUsuario from './MenuPesquisarUsuario';

const MenuUsuario = () => {
    
    const [view, setView] = useState<string>();
  
    return (
    <View>
      <Pressable style={{borderColor: 'blue', borderWidth:2}} onPress={() => setView('pesquisar-usuario')}>
        <Text>Pesquisar usuário</Text>
      </Pressable>
      <Pressable style={{borderColor: 'blue', borderWidth:2}} onPress={() => setView('cadastrar-usuario')}>
        <Text>Cadastrar usuário</Text>
      </Pressable>

      {
        view === 'pesquisar-usuario' ? (<MenuPesquisarUsuario/>) : 
        view === 'cadastrar-usuario' ? (<MenuCadastroUsuario/>) 
        : (<Text></Text>)}
    </View>
  )
}

export default MenuUsuario

const styles = StyleSheet.create({})