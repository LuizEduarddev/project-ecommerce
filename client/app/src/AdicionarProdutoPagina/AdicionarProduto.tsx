import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

const AddProduct = () => {
  const [nomeProd, setNomeProd] = useState('');
  const [precoProd, setPrecoProd] = useState('');
  const [promoProd, setPromoProd] = useState(false);
  const [categoriaProd, setCategoriaProd] = useState('');
  const [precoPromocao, setPrecoPromocao] = useState('');
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileData, setFileData] = useState<any>(null);

  const handleChoosePhoto = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setFileUri(asset.uri);
        setFileData({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName,
        });
      }
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nomeProd', nomeProd);
    formData.append('precoProd', precoProd);
    formData.append('promoProd', String(promoProd)); // Convert boolean to string
    formData.append('categoriaProd', categoriaProd);
    formData.append('precoPromocao', precoPromocao);
    formData.append('file', {
      uri: fileData.uri,
      type: fileData.type,
      name: fileData.name,
    } as unknown as Blob); // Explicitly type the object as Blob

    try {
      const response = await axios.post('http://192.168.105.26:8080/api/products/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add product.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Name:</Text>
      <TextInput style={styles.input} value={nomeProd} onChangeText={setNomeProd} />

      <Text style={styles.label}>Product Price:</Text>
      <TextInput style={styles.input} value={precoProd} onChangeText={setPrecoProd} keyboardType="numeric" />

      <Text style={styles.label}>Promo:</Text>
      <TextInput style={styles.input} value={String(promoProd)} onChangeText={(text) => setPromoProd(text === 'true')} />

      <Text style={styles.label}>Category:</Text>
      <TextInput style={styles.input} value={categoriaProd} onChangeText={setCategoriaProd} />

      <Text style={styles.label}>Promo Price:</Text>
      <TextInput style={styles.input} value={precoPromocao} onChangeText={setPrecoPromocao} />

      <Button title="Choose Photo" onPress={handleChoosePhoto} />
      {fileUri && <Image source={{ uri: fileUri }} style={styles.image} />}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 16,
  },
});

export default AddProduct;
