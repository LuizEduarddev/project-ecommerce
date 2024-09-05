import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
import api from '../../../ApiConfigs/ApiRoute';
import MenuEditarProduto from './MenuEditarProduto';

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

const formatToReais = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const MenuPesquisaProduto = () => {
  
  const [viewMenuEditarProduto, setViewMenuEditarProduto] = useState<boolean>(false);
  const [buscaProduto, setBuscaProduto] = useState<string>('');
  const [produtoResponse, setProdutoResponse] = useState<Product[] | null>(null);
  const [produtoEditar, setProdutoEditar] = useState<Product | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClose = () => {
    setViewMenuEditarProduto(false);
    setProdutoEditar(null); 
  };

  const handleSearchInputChange = (text: string) => {
    setBuscaProduto(text);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      findProduto(buscaProduto); 
    }, 600);
  };

  async function findProduto(query: string) {
    if (query === '') {
      return;
    } else {
      api.post('api/products/search/balcao', query)
      .then((response) => {
        if (response.data === null) {
          console.log('Produto não encontrado no sistema.');
        } else {
          setProdutoResponse(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
  
  const screenEditarProduto = (produto: Product) => {
    setProdutoEditar(produto);
    setViewMenuEditarProduto(true);
  }

  const renderPesquisa = () => {
    if (produtoResponse && produtoResponse.length > 0) {
        return produtoResponse.map(produto => (
            <View 
                key={produto.idProd}
                style={{borderColor: 'black', borderWidth: 1}}
            >
                <Pressable onPress={() => screenEditarProduto(produto)}>
                    <Text>{produto.nomeProd}</Text>
                    <Text>{formatToReais(produto.precoProd)}</Text>
                </Pressable>
            </View>
        ));
    } else {
        return <Text>Nenhum produto encontrado</Text>;
    }
};

  return (
    <View>
      {viewMenuEditarProduto === true ? (
        <MenuEditarProduto id={produtoEditar.idProd} onClose={handleClose}/>
      ) : (
        <View style={styles.modalView}>
          <TextInput
            style={{ borderColor: 'gray', borderWidth: 1 }}
            placeholder="Busque por um produto"
            onChangeText={handleSearchInputChange}
            value={buscaProduto}
          />
          {renderPesquisa()}
        </View>
      )}
    </View>
  )
}

export default MenuPesquisaProduto

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})