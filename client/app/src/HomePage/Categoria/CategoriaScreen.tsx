import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const categorias: string[] = ['esportivo', 'casual', 'esportivo/casual']

const RenderCategoria = ({categorias}: {categorias: string}) => {
    if (categorias === 'esportivo')
    {
      return(
        <TouchableOpacity style={stylesCategorias.listCategorias}>
          <Image style={stylesCategorias.categoriaImage} source={require('../assets/porsche-911.png')} />
          <Text>{categorias}</Text>
        </TouchableOpacity>
      );
    }
    else if (categorias === 'esportivo/casual')
    {
      return(
        <TouchableOpacity style={stylesCategorias.listCategorias}>
          <Image style={stylesCategorias.categoriaImage} source={require('../assets/porsche-panamera.png')} />
          <Text>{categorias}</Text>
        </TouchableOpacity>
      );
    }
    else if (categorias === 'casual')
    {
      return(
        <TouchableOpacity style={stylesCategorias.listCategorias}>
          <Image style={stylesCategorias.categoriaImage} source={require('../assets/jetta.png')} />
          <Text>{categorias}</Text>
        </TouchableOpacity>
      );
    }
  }
  
  const CategoriaScreen: React.FC = () => {
    return (
      <View style={stylesCategorias.categoriaScreen}>
        <Text>Categorias Populares</Text>
        <FlatList
          style={stylesCategorias.categoriaBox}
          horizontal={true}
          data={categorias}
          keyExtractor={(categoria) => categoria}
          renderItem={({ item }) => <RenderCategoria categorias={item} />}
        />
      </View>
    );
  };

export default CategoriaScreen

const stylesCategorias = StyleSheet.create({
    categoriaScreen:{
      marginTop:'10%'
    },
    listCategorias:{
      alignItems:'center',
      textAlign:'center'
    },
    categoriaBox:{
      marginTop:'5%'
    },
    categoriaImage:{
      width: 100,
      height: 100,
      marginHorizontal: 10,
      borderRadius: 50,
    }
  })