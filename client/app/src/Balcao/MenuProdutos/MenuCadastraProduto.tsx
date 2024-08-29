import { Image, Modal, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '../../../ApiConfigs/ApiRoute';

const MenuCadastraProduto = () => {
  const [modalBlankVisible, setModalBlankVisible] = useState<boolean>(false);
  const [categorias, setCategorias] = useState<string[]>();
  const [nomeProduto, setNomeProduto] = useState<string>('');
  const [precoProd, setPrecoProd] = useState<string>('');
  const [promoProd, setPromoProd] = useState<boolean>(false);
  const [categoriaProd, setCategoriaProd] = useState(null);
  const [precoPromocao, setPrecoPromocao] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [imagemProduto, setImagemProduto] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const toggleSwitchPromocao = () => setPromoProd(previousState => !previousState);
  const toggleSwitchVisible = () => setVisible(previousState => !previousState);

  useEffect(() => {
    async function getCategorias() {
      api.get('api/products/get-categories')
        .then(response => {
          const formattedCategories = response.data.map((category, index) => ({
            label: category,
            value: index,
          }));
          setCategorias(formattedCategories);
        })
        .catch(error => {
          console.log(error);
        });
    }

    getCategorias();
  }, []);

  const handleTextChange = (text: string) => {
    const numericValue = text.replace(/\D/g, '');
    const formattedValue = formatToReal(numericValue);
    setPrecoProd(formattedValue);
  };

  const handleTextChangePromocao = (text: string) => {
    const numericValue = text.replace(/\D/g, '');
    const formattedValue = formatToReal(numericValue);
    setPrecoPromocao(formattedValue);
  };

  const formatToReal = (value: string) => {
    if (!value) return '';

    const numberValue = parseFloat(value) / 100;

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numberValue);
  };

  const validateForm = () => {
    const preco = parseFloat(precoProd.replace(/[^\d,]/g, '').replace(',', '.'));
    const promocao = parseFloat(precoPromocao.replace(/[^\d,]/g, '').replace(',', '.'));

    if (!nomeProduto || !precoProd || categoriaProd === null || (promoProd && !precoPromocao)) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if (promoProd && promocao >= preco) {
      setErrorMessage('O preço da promoção deve ser menor que o preço original.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      setModalBlankVisible(true);
      return;
    }
    apiCriarProduto();
  };

  async function apiCriarProduto() {
    const formattedPrecoProd = parseFloat(precoProd.replace(/[^\d,]/g, '').replace(',', '.'));
    const formattedPrecoPromocao = promoProd
      ? parseFloat(precoPromocao.replace(/[^\d,]/g, '').replace(',', '.'))
      : null;
  
    const formData = new FormData();
    formData.append('nomeProd', nomeProduto);
    formData.append('precoProd', formattedPrecoProd.toString());
    formData.append('promoProd', promoProd.toString());
    formData.append('categoriaProd', categoriaProd.toString());
    formData.append('precoPromocao', formattedPrecoPromocao ? formattedPrecoPromocao.toString() : '');
    formData.append('visible', visible.toString());
  
    if (imagemProduto) {
      try {
        const response = await fetch(imagemProduto);
        const blob = await response.blob();
  
        formData.append('file', blob, 'product_image.jpg');
      } catch (error) {
        console.error('Error converting image to Blob:', error);
      }
    }
  
    api
      .post('api/products/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
  

  const renderModalBlank = () => (
    <View style={styles.modalView}>
      <Text>{errorMessage || 'Nenhum campo pode ficar em branco'}</Text>
      <Pressable style={{backgroundColor:'blue'}}onPress={() => setModalBlankVisible(false)}>
        <Text style={{color:'white'}}>X</Text>
      </Pressable>
    </View>
  );

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        setImagemProduto(response.assets[0].uri);
      }
    });
  };

  const renderCategories = () => {
    if (categorias) {
      return (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          inputSearchStyle={styles.inputSearch}
          iconStyle={styles.icon}
          data={categorias}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Escolha uma categorias"
          value={categoriaProd}
          onChange={(item) => {
            setCategoriaProd(item.value);
          }}
        />
      );
    } else {
      return (
        <Text>As categorias não foram carregadas corretamente, tente novamente mais tarde.</Text>
      );
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalBlankVisible}
        onRequestClose={() => setModalBlankVisible(false)}
      >
        {renderModalBlank()}
      </Modal>
      <TextInput placeholder="Nome do produto" onChangeText={setNomeProduto} />
      <TextInput
        keyboardType="numeric"
        placeholder="Preço do produto"
        value={precoProd}
        onChangeText={handleTextChange}
        maxLength={15}
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
          onChangeText={handleTextChangePromocao}
          maxLength={15}
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
          <Text>Imagem anexada com sucesso.</Text>
        </View>
      )}
      <Pressable
        style={{ backgroundColor: 'blue', borderWidth: 1 }}
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
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  selectedText: {
    fontSize: 16,
    marginTop: 10,
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
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
