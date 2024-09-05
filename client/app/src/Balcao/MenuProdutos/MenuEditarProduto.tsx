import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import api from '../../../ApiConfigs/ApiRoute';
import { SafeAreaView } from 'react-native-safe-area-context';

const MenuEditarProduto = ({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) => {
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoProd, setPrecoProd] = useState('');
  const [promoProd, setPromoProd] = useState(false);
  const [categoriaProd, setCategoriaProd] = useState('');
  const [precoPromocao, setPrecoPromocao] = useState('');
  const [visible, setVisible] = useState(false);
  const [imagemProduto, setImagemProduto] = useState('');
  const [categorias, setCategorias] = useState<
    { label: string; value: string }[]
  >([]);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [modalBlankVisible, setModalBlankVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    async function fetchProductData() {
      console.log(precoProd);
      try {
        const response = await api.post('api/products/get-by-id', null, {
          params:{
            idProduto:id
          },
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
            'Content-Type': 'application/json',
          }
        });
        const product = response.data;
        setNomeProduto(product.nomeProd);
        setPrecoProd(product.precoProd.toString()); // Adjusting for display
        setPromoProd(product.promoProd);
        setCategoriaProd(product.categoriaProd);
        setPrecoPromocao(product.precoPromocao.toString()); // Adjusting for display
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
        const response = await api.get('api/products/get-categories', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
            'Content-Type': 'application/json',
          }
        });
        const formattedCategories = response.data.map(
          (category: string, index: number) => ({
            label: category,
            value: index,
          })
        );
        setCategorias(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    getCategorias();
  }, []);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
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
    const preco = parseFloat(
      precoProd.replace(/[^\d,]/g, '').replace(',', '.')
    );
    const promocao = parseFloat(
      precoPromocao.replace(/[^\d,]/g, '').replace(',', '.')
    );

    if (
      !nomeProduto ||
      !precoProd ||
      categoriaProd === null ||
      (promoProd && !precoPromocao)
    ) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if (promoProd && promocao >= preco) {
      setErrorMessage(
        'O preço da promoção deve ser menor que o preço original.'
      );
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
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
      }
      });
      console.log('Delete successful');
      onClose(); // Close the page after successful delete
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  async function apiEditarProduto() {

    const formData = new FormData();
    formData.append('idProd', id);
    formData.append('nomeProd', nomeProduto);
    formData.append('precoProd', precoProd);
    formData.append('promoProd', promoProd.toString());
    formData.append('categoriaProd', categoriaProd.toString());
    formData.append('precoPromocao',precoPromocao.toString());
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
      .put('api/products/editar', formData, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session-token')}`,
          'Content-Type': 'multipart/form-data',
      }
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
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
          onChangeText={setPrecoProd}
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
            onChangeText={setPrecoPromocao}
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
        <Pressable
          style={styles.deleteButton}
          onPress={() => setModalDeleteVisible(true)}
        >
          <Text style={styles.deleteButtonText}>Deletar Produto</Text>
        </Pressable>
        <Modal
          visible={modalDeleteVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Tem certeza que deseja deletar {nomeProduto}?</Text>
              <View style={styles.modalButtonContainer}>
                <Pressable
                  onPress={() => setModalDeleteVisible(false)}
                  style={styles.modalButton}
                >
                  <Text>Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={() => deletarProduto()}
                  style={styles.modalButtonDelete}
                >
                  <Text>Deletar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={modalBlankVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>{errorMessage}</Text>
              <Pressable
                onPress={() => setModalBlankVisible(false)}
                style={styles.modalButton}
              >
                <Text>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MenuEditarProduto;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32, // Extra padding at the bottom
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
  input: {
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  submitButton: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#FF5722',
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdown: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imageButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#DDD',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#DDD',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonDelete: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FF5722',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
