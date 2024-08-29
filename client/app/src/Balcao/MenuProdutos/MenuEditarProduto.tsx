import { Image, Modal, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import api from '../../../ApiConfigs/ApiRoute';

const formatToReal = (value: string) => {
  if (!value) return '';
  const numberValue = parseFloat(value) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue);
};

const MenuEditarProduto = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoProd, setPrecoProd] = useState('');
  const [promoProd, setPromoProd] = useState(false);
  const [categoriaProd, setCategoriaProd] = useState('');
  const [precoPromocao, setPrecoPromocao] = useState('');
  const [visible, setVisible] = useState(false);
  const [imagemProduto, setImagemProduto] = useState('');
  const [categorias, setCategorias] = useState<{ label: string; value: string }[]>([]);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [modalBlankVisible, setModalBlankVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    async function fetchProductData() {
      console.log(precoProd)
      try {
        const response = await api.post('api/products/get-by-id', id);
        const product = response.data;
        setNomeProduto(product.nomeProd);
        setPrecoProd(formatToReal(product.precoProd.toString()));
        setPromoProd(product.promoProd);
        setCategoriaProd(product.categoriaProd);
        setPrecoPromocao(formatToReal(product.precoPromocao.toString()));
        setVisible(product.visible);
        setImagemProduto(product.imagemProduto);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    }

    fetchProductData();
  }, [id]);

  useEffect(() => {
    async function getCategorias() {
      try {
        const response = await api.get('api/products/get-categories');
        const formattedCategories = response.data.map((category: string, index: number) => ({
          label: category,
          value: index,
        }));
        setCategorias(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    getCategorias();
  }, []);

  const handleTextChange = (text: string) => {
    const numericValue = text.replace(/\D/g, '');
    setPrecoProd(formatToReal(numericValue));
  };

  const handleTextChangePromocao = (text: string) => {
    const numericValue = text.replace(/\D/g, '');
    setPrecoPromocao(formatToReal(numericValue));
  };

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

  async function deletarProduto() {
    setModalDeleteVisible(false);
    try {
      await api.delete('api/products/delete', {
        params: {
          idProduto: id,
        },
      });
      console.log('Delete successful');
      onClose(); // Close the page after successful delete
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  async function apiEditarProduto() {
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
  
        formData.append('file', blob, nomeProduto + '.png');
      } catch (error) {
        console.error('Error converting image to Blob:', error);
      }
    }
    api
      .post('api/products/editar', formData, {
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

  const handleSubmit = () => {
    if (!validateForm()) {
      setModalBlankVisible(true);
      return;
    }
    apiEditarProduto();
  };

  const renderCategories = () => {
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
        placeholder="Escolha uma categoria"
        value={categoriaProd}
        onChange={(item) => {
          setCategoriaProd(item.label);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text>Editar Produto</Text>
      <TextInput
        placeholder="Nome do produto"
        value={nomeProduto}
        onChangeText={setNomeProduto}
        style={styles.input}
      />
      <TextInput
        keyboardType="numeric"
        placeholder="Preço do produto"
        value={precoProd}
        onChangeText={handleTextChange}
        style={styles.input}
        maxLength={15}
      />
      <Text>Promoção</Text>
      <Switch
        value={promoProd}
        onValueChange={setPromoProd}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={promoProd ? '#f5dd4b' : '#f4f3f4'}
      />
      {promoProd && (
        <TextInput
          keyboardType="numeric"
          placeholder="Preço na promoção"
          value={precoPromocao}
          onChangeText={handleTextChangePromocao}
          style={styles.input}
          maxLength={15}
        />
      )}
      <Text>Produto visível</Text>
      <Switch
        value={visible}
        onValueChange={setVisible}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={visible ? '#f5dd4b' : '#f4f3f4'}
      />
      {renderCategories()}
      <View style={styles.imageContainer}>
        {imagemProduto ? (
          <>
            <Image source={{ uri: imagemProduto }} style={styles.image} />
            <Pressable onPress={handleImagePick} style={styles.imageButton}>
              <Text>Alterar Imagem</Text>
            </Pressable>
          </>
        ) : (
          <Pressable onPress={handleImagePick} style={styles.imageButton}>
            <Text>Adicionar Imagem</Text>
          </Pressable>
        )}
      </View>
      <Pressable style={styles.submitButton} onPress={() => handleSubmit()}>
        <Text style={styles.submitButtonText}>Salvar Alterações</Text>
      </Pressable>
      <Pressable style={styles.deleteButton} onPress={() => setModalDeleteVisible(true)}>
        <Text style={styles.deleteButtonText}>Deletar Produto</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalBlankVisible}
        onRequestClose={() => setModalBlankVisible(false)}
      >
        <View>
          <Text>Preencha todos os campos</Text>
        </View>
      </Modal>
      <Modal
        style={styles.modalView}
        animationType="slide"
        transparent={true}
        visible={modalDeleteVisible}
        onRequestClose={() => setModalDeleteVisible(false)}
      >
        <Text>Deseja mesmo deletar '{nomeProduto}?'</Text>
        <Pressable onPress={() => deletarProduto()}>
          <Text>Sim</Text>
        </Pressable>
        <Pressable onPress={() => setModalDeleteVisible(false)}>
          <Text>Nao</Text>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
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
  imageContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  imageButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: 'blue',
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
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
});

export default MenuEditarProduto;