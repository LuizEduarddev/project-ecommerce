import { Image, Modal, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';

const MenuCadastraProduto = () => {
  const toast = useToast();
  const [categorias, setCategorias] = useState<string[]>();
  const [nomeProduto, setNomeProduto] = useState<string>('');
  const [precoProd, setPrecoProd] = useState<string>('');
  const [promoProd, setPromoProd] = useState<boolean>(false);
  const [categoriaProd, setCategoriaProd] = useState(null);
  const [precoPromocao, setPrecoPromocao] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(true);
  const [imagemProduto, setImagemProduto] = useState<string>('');

  const toggleSwitchPromocao = () => setPromoProd(previousState => !previousState);
  const toggleSwitchVisible = () => setVisible(previousState => !previousState);

  useEffect(() => {
    const token = localStorage.getItem('session-token');
    if (token !== null)
    {
      api.get('api/empresas/categorias/get-by-empresa', {
        params:{
          token:token
        }
      })
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        toast.show("Erro ao tentar buscar as categorias.", {
          type: "warning",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      });
    }
    else{
      window.location.reload();
    }
  }, []);



  const validateForm = () => {
    const preco = parseFloat(precoProd.replace(/[^\d,]/g, '').replace(',', '.'));
    const promocao = parseFloat(precoPromocao.replace(/[^\d,]/g, '').replace(',', '.'));

    if (!nomeProduto || !precoProd || categoriaProd === null ||(promoProd && !precoPromocao)) {
      toast.show("Por favor, preencha todos os campos", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
      return false;
    }

    if (promoProd && promocao >= preco) {
      toast.show("O preço da promoção deve ser menor do que o preço original.", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    apiCriarProduto();
  };

  async function apiCriarProduto() {
    const token = localStorage.getItem('session-token');
    if (token === null) window.location.reload();
    const formData = new FormData();
    formData.append('nomeProd', nomeProduto);
    formData.append('precoProd', precoProd.toString());
    formData.append('promoProd', promoProd.toString());
    formData.append('categoriaProd', categoriaProd.toString());
    formData.append('precoPromocao', precoPromocao ? precoPromocao.toString() : '0');
    formData.append('visible', visible.toString());
    formData.append('token', token);
    if (imagemProduto) {
      try {
        const response = await fetch(imagemProduto);
        const blob = await response.blob();
    
        const mimeType = blob.type;
    
        const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/jpeg' ? 'jpg' : '';
    
        if (extension) {
          formData.append('file', blob, `${nomeProduto}.${extension}`);
        } else {
          throw new Error('Unsupported image type');
        }
      } catch (error) {
        toast.show("Erro ao tentar converter a imagem", {
          type: "danger",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      }
    }
    
    api
      .post('api/products/add', formData)
      .then(response => {
        toast.show("Produto adicionado com sucesso", {
          type: "success",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      })
      .catch(error => {
        toast.show("Falha ao tentar adicionar o produto", {
          type: "danger",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      });
  }

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        toast.show("Erro ao tentar pegar a imagem.", {
          type: "warning",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      } else {
        setImagemProduto(response.assets[0].uri);
      }
    });
  };

  const renderCategories = () => {
    if (categorias && categorias.length > 0) {
        const dropdownData = categorias.map(categoria => ({
            label: categoria, 
            value: categoria  
        }));

        return (
            <View>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholder}
                    selectedTextStyle={styles.selectedText}
                    inputSearchStyle={styles.inputSearch}
                    iconStyle={styles.icon}
                    data={dropdownData} 
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Escolha uma categoria"
                    value={categoriaProd}
                    onChange={(item) => {
                        setCategoriaProd(item.value);
                    }}
                />
            </View>
        );
    } else {
        return (
            <Text>As categorias não foram carregadas corretamente, tente novamente mais tarde.</Text>
        );
    }
  };


  return (
    <View style={{padding: 16}}>
      <TextInput 
        placeholder="Nome do produto" 
        onChangeText={setNomeProduto} 
        style={styles.input}
      />
      <TextInput
        keyboardType="numeric"
        placeholder="Preço do produto"
        value={precoProd}
        onChangeText={setPrecoProd}
        maxLength={15}
        style={styles.input}
      />
      <Text>Promoção</Text>
      <Switch
        value={promoProd}
        onValueChange={toggleSwitchPromocao}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={promoProd ? '#f5dd4b' : '#f4f3f4'}
      />
      {promoProd && (
        <TextInput
          keyboardType="numeric"
          placeholder="Preço na promoção"
          value={precoPromocao}
          onChangeText={setPrecoPromocao}
          maxLength={15}
          style={styles.input}
        />
      )}
      <Text>Produto visível</Text>
      <Switch
        value={visible}
        onValueChange={toggleSwitchVisible}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={visible ? '#f5dd4b' : '#f4f3f4'}
      />
      {renderCategories()}
      <Pressable onPress={handleImagePick} style={styles.imageButton}>
        <Text>Anexar uma imagem</Text>
      </Pressable>
      {imagemProduto && (
        <View>
          <Image source={{ uri: imagemProduto }} style={styles.image} />
        </View>
      )}
      <Pressable
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={{ color: 'white', alignSelf: 'center' }}>Cadastrar produto</Text>
      </Pressable>
    </View>
  );
};

export default MenuCadastraProduto;

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
  input: {
    backgroundColor: '#fff',
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dropdown: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  submitButton: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  selectedText: {
    fontSize: 16,
  },
  inputSearch: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },
  imageButton: {
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center'
  },
});
