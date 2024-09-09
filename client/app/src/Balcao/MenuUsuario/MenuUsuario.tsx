import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MenuCadastroUsuario from './MenuCadastroUsuario';
import MenuPesquisarUsuario from './MenuPesquisarUsuario';
import { colors } from '../../assets/colors';

const MenuUsuario = () => {
    
    const [view, setView] = useState<string>();
  
    return (
    <View>
      <View style={styles.containerBotoes}>
        <Pressable style={styles.botaoNavegar} onPress={() => setView('pesquisar-usuario')}>
          <Text style={styles.textoBotao}>Pesquisar usuário</Text>
        </Pressable>
        <Pressable style={styles.botaoNavegar} onPress={() => setView('cadastrar-usuario')}>
          <Text style={styles.textoBotao}>Cadastrar usuário</Text>
        </Pressable>
      </View>
      {
        view === 'pesquisar-usuario' ? (<MenuPesquisarUsuario/>) : 
        view === 'cadastrar-usuario' ? (<MenuCadastroUsuario/>) 
        : (<Text></Text>)}
    </View>
  )
}

export default MenuUsuario

const styles = StyleSheet.create({
  botaoNavegar: {
    backgroundColor: colors['bright-blue'],
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  textoBotao: {
      color: colors['white'],
      fontWeight: 'semibold',
  },
  containerBotoes: {
      flexDirection: 'row',
      gap: 10,
      width: '100%',
      paddingHorizontal: 20,
  }
})