import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import api from '../../../ApiConfigs/ApiRoute'

const Pagamento = () => {
  const [qrCodeBase64, setqrCodeBase64] = useState<string | null>(null);

  const tryPagamento = async () => {
    const dataToSend = {
      idPedido: '7',
      totalPedido: 130,
      userEmail: 'dududias321@outlook.com',
      userFullName: 'Luiz Eduardo',
      cpf: '57318433687',
    };

    try {
      const response = await api.post('api/pedidos/pagamento', dataToSend);
      setqrCodeBase64(response.data.pointOfInteraction.transactionData.qrCodeBase64);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView >
      <View >
        <Button title='Pagar' onPress={tryPagamento} />
        {qrCodeBase64 && (
          <View >
            <Text>QR Code:</Text>
            <Image
              source={{ uri: `data:image/jpeg;base64,${qrCodeBase64}` }}
              resizeMode="contain" 
              style={{width:250, height:250}}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};


export default Pagamento

const styles = StyleSheet.create({})