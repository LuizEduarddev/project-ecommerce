import { Image, Modal, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';

const categories = [
  { label: 'Bombom', value: 'bombom' },
  { label: 'Docinho', value: 'docinho' },
  { label: 'Bolo', value: 'bolo' },
];

const MenuCadastraProduto = () => {
  const [modalBlankVisible, setModalBlankVisible] = useState<boolean>(false);
  const [nomeProduto, setNomeProduto] = useState<string>('');
  const [precoProd, setPrecoProd] = useState<string>('');
  const [promoProd, setPromoProd] = useState<boolean>(false);
  const [categoriaProd, setCategoriaProd] = useState<string>('');
  const [precoPromocao, setPrecoPromocao] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [imagemProduto, setImagemProduto] = useState<string>('');

  const toggleSwitchPromocao = () => setPromoProd(previousState => !previousState);
  const toggleSwitchVisible = () => setVisible(previousState => !previousState);

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

  const renderModalBlank = () => (
    <View style={styles.modalView}>
      <Text>Nenhum campo pode ficar em branco</Text>
      <Pressable onPress={() => setModalBlankVisible(false)} >
        <Text>X</Text>
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
        // Display the selected image
        setImagemProduto(response.assets[0].uri);
      }
    });
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
        keyboardType='numeric'
        placeholder="Preço do produto"
        value={precoProd}
        onChangeText={handleTextChange}
        maxLength={15} 
      />
      <Switch
        value={promoProd}
        onValueChange={toggleSwitchPromocao}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={promoProd ? '#f5dd4b' : '#f4f3f4'}
      />
      <Switch
        value={visible}
        onValueChange={toggleSwitchVisible}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={visible ? '#f5dd4b' : '#f4f3f4'}
      />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        inputSearchStyle={styles.inputSearch}
        iconStyle={styles.icon}
        data={categories}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select category"
        value={categoriaProd}
        onChange={(item) => setCategoriaProd(item.value)}
      />
      <TextInput
        keyboardType='numeric'
        placeholder="Preço na promoçao"
        value={precoPromocao}
        onChangeText={handleTextChangePromocao}
        maxLength={15} 
      />
      <Pressable onPress={handleImagePick} style={styles.imageButton}>
        <Text>Anexar uma imagem</Text>
      </Pressable>
      {imagemProduto && (
        <Image source={{ uri: imagemProduto }} style={styles.image} />
      )}
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
