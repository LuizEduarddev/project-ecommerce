import { Pressable, StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import api from '../../../ApiConfigs/ApiRoute';
import MenuEditarProduto from './MenuEditarProduto';
import debounce from 'lodash.debounce'
import { useToast } from 'react-native-toast-notifications';

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
  const toast = useToast();
  const [viewMenuEditarProduto, setViewMenuEditarProduto] = useState<boolean>(false);
  const [buscaProduto, setBuscaProduto] = useState<string>('');
  const [produtoResponse, setProdutoResponse] = useState<Product[]>([]);
  const [produtoEditar, setProdutoEditar] = useState<Product | null>(null);

  const handleClose = () => {
    setViewMenuEditarProduto(false);
    setProdutoEditar(null); 
  };

  async function findProduto(query: string) {
    const token = localStorage.getItem('session-token');
    if (token === null) window.location.reload();
    if (query === '') {
      return;
    } else {
      const dto = {
        pesquisa:query,
        token: token
      }
      api.post('api/products/search/balcao', dto)
      .then((response) => {
        if (response.data === null) {
          toast.show("Produto não encontrado", {
            type: "warning",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
          });
        } else {
          setProdutoResponse(response.data);
        }
      })
      .catch((error) => {
        toast.show("Falha no servidor.", {
          type: "danger",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      });
    }
  }
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length > 2) { 
        findProduto(query);
      } else {
        setProdutoResponse([]); 
      }
    }, 600),
    []
  );
  useEffect(() => {
    debouncedSearch(buscaProduto);
    return () => {
      debouncedSearch.cancel();
    };
  }, [buscaProduto]);
  
  const screenEditarProduto = (produto: Product) => {
    setProdutoEditar(produto);
    setViewMenuEditarProduto(true);
  }

  const renderItem = ({ item }) => (
      <Pressable onPress={() => screenEditarProduto(item)} style={styles.item}>
          <Text>{item.nomeProd}</Text>
          <Text>{formatToReais(item.precoProd)}</Text>
      </Pressable>
  );

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={buscaProduto}
          placeholder="Busque por um produto"
          onChangeText={setBuscaProduto}
        />
        {produtoResponse?.length > 0 &&
          <FlatList
            data={produtoResponse}
            renderItem={renderItem}
            keyExtractor={item => item.value}
            style={styles.dropdown}
          />
        }
      </View>
    </>
  );
};

export default MenuPesquisaProduto;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
});