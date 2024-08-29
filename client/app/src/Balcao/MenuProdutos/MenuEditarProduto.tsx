import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Product = {
	idProd:string,
	nomeProd:string,
	precoProd:number,
  promoProd:boolean,
	categoriaProd:string,
  precoPromocao:number,
  imagemProduto:string,
  visible:boolean
}

const MenuEditarProduto = ({produto}:{produto: Product}) => {
  return (
    <View>
      <Text>MenuEditarProduto</Text>
    </View>
  )
}

export default MenuEditarProduto

const styles = StyleSheet.create({})