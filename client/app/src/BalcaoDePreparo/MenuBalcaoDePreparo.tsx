import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import api from '../../ApiConfigs/ApiRoute'

type PedidoCozinhaProdutosDTO = {
  idProduto: string,
  nomeProd: string,
  quantidadeProduto: number
}

type PedidoCozinhaDTO = {
  idPedido: string,
  horaPedido: string,
  pedidoPronto: boolean,
  horaPronto: string,
  produtos: PedidoCozinhaProdutosDTO[]
}

const MenuBalcaoDePreparo = () => {
  const [pedidosProntos, setPedidosProntos] = useState<PedidoCozinhaDTO[]>([]);
  const [pedidosNaoProntos, setPedidosNaoProntos] = useState<PedidoCozinhaDTO[]>([]);
  const [allPedidos, setAllPedidos] = useState<PedidoCozinhaDTO[]>([]);
  const [modalPedidoId, setModalPedidoId] = useState<string | null>(null);
  const [modalConfirmarPedidoPronto, setModalConfirmarPedidoPronto] = useState<boolean>(false);

  const fetchPedidos = async () => {
    try {
      const response = await api.get('api/pedidos/get-for-balcao-preparo');
      const pedidos = response.data;

      const pedidosProntos = pedidos.filter(pedido => pedido.pedidoPronto === true);
      const pedidosNaoProntos = pedidos.filter(pedido => pedido.pedidoPronto === false);

      setAllPedidos(pedidos); 
      setPedidosProntos(pedidosProntos);
      setPedidosNaoProntos(pedidosNaoProntos);
    } catch (error) {
      console.log(error as string);
    }
  };

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 60000);
    return () => clearInterval(interval);
  }, []);

  async function confirmarPedidoPronto(pedido: PedidoCozinhaDTO) {
    try {
        const dataToSend = {
            idPedido: pedido.idPedido,
            local: "balcao-preparo"
        }
        const response = await api.post('api/pedidos/pronto', dataToSend, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        setModalConfirmarPedidoPronto(false);
        setModalPedidoId(null);
        fetchPedidos();
    } catch (error) {
      console.log(error as string);
    }
  }

  const calculateBackgroundColor = (horaPedido: string) => {
    const [hours, minutes] = horaPedido.split(':').map(Number);
    const pedidoDate = new Date();
    pedidoDate.setHours(hours, minutes, 0, 0);
    const currentTime = new Date();
    const diffInMinutes = (currentTime.getTime() - pedidoDate.getTime()) / (1000 * 60);

    if (diffInMinutes > 10) return 'red';
    if (diffInMinutes > 5) return 'yellow';
    return 'green';
  };

  const renderProdutosPedidos = ({ item }: { item: PedidoCozinhaProdutosDTO }) => (
    <View>
      <Text>{item.nomeProd} - X ({item.quantidadeProduto})</Text>
    </View>
  );

  const renderModalConfirmarPedidoPronto = (pedido: PedidoCozinhaDTO) => (
    <View style={styles.modalView}>
      <Text>Confirmar pedido pronto?</Text>
      <Pressable onPress={() => confirmarPedidoPronto(pedido)} style={{ backgroundColor: 'green', borderColor: 'black', borderWidth: 1 }}>
        <Text style={{ color: 'white' }}>SIM</Text>
      </Pressable>
      <Pressable onPress={() => setModalConfirmarPedidoPronto(false)} style={{ backgroundColor: 'red', borderColor: 'black', borderWidth: 1 }}>
        <Text style={{ color: 'white' }}>NÃO</Text>
      </Pressable>
    </View>
  );

  const renderModalVisualizarPedido = (pedido: PedidoCozinhaDTO) => {
    const backgroundColor = calculateBackgroundColor(pedido.horaPedido);
    return (
      <View style={styles.modalView}>
        {pedido.pedidoPronto ? (
          <Text style={[styles.pedidoContainer, { backgroundColor: 'green' }]}>Pronto às: {pedido.horaPronto}</Text>
        ) : (
          <Text style={[styles.pedidoContainer, { backgroundColor }]}>{pedido.horaPedido}</Text>
        )}
        <FlatList
          data={pedido.produtos}
          renderItem={renderProdutosPedidos}
          keyExtractor={(produto) => produto.idProduto}
        />
        {!pedido.pedidoPronto && (
          <Pressable onPress={() => setModalConfirmarPedidoPronto(true)} style={{ backgroundColor: 'green', borderColor: 'black', borderWidth: 1 }}>
            <Text>Pronto</Text>
          </Pressable>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalConfirmarPedidoPronto}
          onRequestClose={() => setModalConfirmarPedidoPronto(false)}
        >
          {renderModalConfirmarPedidoPronto(pedido)}
        </Modal>
      </View>
    );
  };

  const renderPedidos = ({ item }: { item: PedidoCozinhaDTO }) => {
    const backgroundColor = calculateBackgroundColor(item.horaPedido);
    return (
      <View>
        <Pressable onPress={() => setModalPedidoId(item.idPedido)}>
          {item.pedidoPronto ? (
            <Text>Pronto às: {item.horaPronto}</Text>
          ) : (
            <Text style={[styles.pedidoContainer, { backgroundColor }]}>{item.horaPedido}</Text>
          )}
          <FlatList
            data={item.produtos}
            renderItem={renderProdutosPedidos}
            keyExtractor={(produto) => produto.idProduto}
          />
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalPedidoId === item.idPedido}
          onRequestClose={() => setModalPedidoId(null)}
        >
          {renderModalVisualizarPedido(item)}
        </Modal>
      </View>
    );
  };

  const renderMenu = () => {
    if (allPedidos.length > 0) {
      return (
        <View>
          {pedidosNaoProntos.length > 0 && (
            <>
              <Text>Pedidos em preparo</Text>
              <FlatList
                data={pedidosNaoProntos}
                renderItem={renderPedidos}
                keyExtractor={(item) => item.idPedido}
              />
            </>
          )}
          {pedidosProntos.length > 0 && (
            <>
              <Text>Pedidos prontos</Text>
              <FlatList
                data={pedidosProntos}
                renderItem={renderPedidos}
                keyExtractor={(item) => item.idPedido}
              />
            </>
          )}
        </View>
      );
    } else {
      return (
        <View>
          <Text>Por enquanto está tudo tranquilo, tome uma água.....</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>{renderMenu()}</ScrollView>
    </SafeAreaView>
  );
};

export default MenuBalcaoDePreparo;

const styles = StyleSheet.create({
  pedidoContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
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
