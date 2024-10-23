import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TabelaVendas from './TabelaVendas'
import GraficoVendas from './GraficoVendas'

const MenuAdministrador = () => {
  
  const currentDate = new Date();
  var date = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  const formattedDate = date + '/' + month + '/' + year;
  
  const hour =  currentDate.getHours();
  const minute = currentDate.getMinutes();
  const formattedHour = hour + ':' + minute

  return (
    <SafeAreaView>
      <ScrollView>
        <View>  
          <Text>{formattedDate}  {formattedHour}</Text>
          <GraficoVendas/>
          <TabelaVendas/>
        </View>  
      </ScrollView>
    </SafeAreaView>
  )
}

export default MenuAdministrador

const styles = StyleSheet.create({})