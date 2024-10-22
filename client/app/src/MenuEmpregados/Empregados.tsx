import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TabelaEmpregados from './TabelaEmpregados'
import PesquisaFuncionario from './PesquisaFuncionario'

const Empregados = () => {

    return (
    <SafeAreaView>
        <View>
            <PesquisaFuncionario/>
            <TabelaEmpregados/>
        </View>
    </SafeAreaView>
  )
}

export default Empregados

const styles = StyleSheet.create({})