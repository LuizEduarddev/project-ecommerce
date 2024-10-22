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
import { colors } from '../../assets/colors';
import { useToast } from 'react-native-toast-notifications';

const MenuEditarProduto = ({ id }: { id: string }) => {
  const toast = useToast();
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoProd, setPrecoProd] = useState('');
  const [promoProd, setPromoProd] = useState(false);
  const [categoriaProd, setCategoriaProd] = useState('');
  const [precoPromocao, setPrecoPromocao] = useState('');
  const [visible, setVisible] = useState(false);
  const [imagemProduto, setImagemProduto] = useState('');
  const [categorias, setCategorias] = useState<string[]>();
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  const convertImage = (imagemProduto) => {
    const base64ImageString = imagemProduto;
    let imageType = '';
    if (base64ImageString.startsWith('/9j/')) {
      imageType = 'jpeg';
    } else if (base64ImageString.startsWith('iVBORw0KGgo')) {
      imageType = 'png';
    } else if (base64ImageString.startsWith('R0lGOD')) {
      imageType = 'gif';
    } else if (base64ImageString.startsWith('Qk')) {
      imageType = 'bmp';
    } else if (base64ImageString.startsWith('UklGR')) {
      imageType = 'webp';
    } else {
      throw new Error('Unknown image format');
    }

    const base64Image = `data:image/${imageType};base64,${base64ImageString}`;
    return base64Image;
  }

  useEffect(() => {
    const token = localStorage.getItem('session-token');
    if (token === null) window.location.reload();
    async function fetchProductData() {
      try {
        const response = await api.post('api/products/get-by-id', null, {
          params: {
            idProduto: id,
            token:token
          },
        });
        const product = response.data;
        setNomeProduto(product.nomeProd);
        setPrecoProd(product.precoProd.toString());
        setPromoProd(product.promoProd);
        setCategoriaProd(product.categoria);
        setPrecoPromocao(product.precoPromocao.toString());
        setVisible(product.visible);

        setImagemProduto(convertImage(product.imagemProduto));
      } catch (error) {
        toast.show('Erro ao tentar buscar o produto', {
          type: 'danger',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        });
      }
    }

    fetchProductData();
  }, [id]);

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

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        console.log(response.assets[0].uri);
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
      toast.show('Por favor, preencha todos os campos', {
        type: 'warning',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
      return false;
    }

    if (promoProd && promocao >= preco) {
      toast.show(
        'O preço da promoção deve ser menor do que o preço original.',
        {
          type: 'warning',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        }
      );
      return false;
    }
    return true;
  };

  async function deletarProduto() {
    setModalDeleteVisible(false);
    const token = localStorage.getItem('session-token');
    if (token === null) window.location.reload();
    try {
      await api.delete('api/products/delete', {
        params: {
          idProduto: id,
          token:token
        },
      });
      toast.show('Produto deletado com sucesso', {
        type: 'success',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    } catch (error) {
      toast.show('Erro ao tentar deletar o produto', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    }
  }

  async function apiEditarProduto() {
    const token = localStorage.getItem('session-token');
    if (token === null) window.location.reload();
    const formData = new FormData();
    formData.append('idProd', id);
    formData.append('nomeProd', nomeProduto);
    formData.append('precoProd', precoProd);
    formData.append('promoProd', promoProd.toString());
    formData.append('categoriaProd', categoriaProd.toString());
    formData.append('precoPromocao', precoPromocao.toString());
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
      .put('api/products/editar', formData)
      .then((response) => {
        toast.show('Produto editado com sucesso', {
          type: 'success',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        });
      })
      .catch((error) => {
        toast.show('Falha ao tentar editar o produto.', {
          type: 'danger',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        });
      });
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    apiEditarProduto();
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>Editar Produto</Text>
      </View>

      <View style={styles.productContainer}>
        <View style={styles.imageSection}>
          {imagemProduto ? (
            <>
              <Image
                source={{ uri: imagemProduto }}
                style={styles.image}
              />
              <Pressable onPress={handleImagePick} style={styles.imageButton}>
                <Text style={styles.imageButtonText}>Alterar Imagem</Text>
              </Pressable>
            </>
          ) : (
            <Pressable onPress={handleImagePick} style={styles.imageButton}>
              <Text style={styles.imageButtonText}>Escolher Imagem</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.detailsSection}>
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

          <View style={styles.promoContainer}>
            <Text style={styles.label}>Promoção</Text>
            <Switch
              value={promoProd}
              onValueChange={setPromoProd}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={promoProd ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

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

          <Text style={styles.label}>Produto visível</Text>
          <Switch
            value={visible}
            onValueChange={setVisible}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={visible ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      {renderCategories()}

      <View style={styles.buttonContainer}>
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Salvar Alterações</Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() => setModalDeleteVisible(true)}
        >
          <Text style={styles.deleteButtonText}>Deletar Produto</Text>
        </Pressable>
      </View>
    </ScrollView>

      {/* Delete confirmation modal */}
      <Modal
        visible={modalDeleteVisible}
        transparent
        onRequestClose={() => setModalDeleteVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Tem certeza que deseja deletar o produto?
            </Text>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={styles.modalButton}
                onPress={() => setModalDeleteVisible(false)}
              >
                <Text>Cancelar</Text>
              </Pressable>
              <Pressable
                style={styles.modalButtonDelete}
                onPress={deletarProduto}
              >
                <Text style={{ color: 'white' }}>Deletar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageSection: {
    flex: 1,
    marginRight: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imageButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  detailsSection: {
    flex: 2,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    padding: 15,
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    padding: 15,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdown: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.cinza,
    borderRadius: 5,
  },
  placeholder: {
    color: '#333',
    fontSize: 16,
  },
  selectedText: {
    color: '#333',
    fontSize: 16,
  },
  inputSearch: {
    color: '#333',
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    backgroundColor: '#DDD',
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  modalButtonDelete: {
    padding: 12,
    backgroundColor: '#FF5722',
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
});

/*
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.branco,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.cinza,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.verdeEscuro,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.branco,
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.vermelho,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.branco,
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdown: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.cinza,
    borderRadius: 5,
  },
  placeholder: {
    color: '#333',
    fontSize: 16,
  },
  selectedText: {
    color: '#333',
    fontSize: 16,
  },
  inputSearch: {
    color: '#333',
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  imageButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#DDD',
    borderRadius: 5,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    backgroundColor: '#DDD',
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  modalButtonDelete: {
    padding: 12,
    backgroundColor: '#FF5722',
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
});
*/
export default MenuEditarProduto;
