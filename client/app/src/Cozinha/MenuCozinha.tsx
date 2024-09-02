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

const MenuCozinha = () => {
  const [pedidosProntos, setPedidosProntos] = useState<PedidoCozinhaDTO[]>([]);
  const [pedidosNaoProntos, setPedidosNaoProntos] = useState<PedidoCozinhaDTO[]>([]);
  const [allPedidos, setAllPedidos] = useState<PedidoCozinhaDTO[]>([]);
  const [modalVisualizarPedido, setModalVisualizarPedido] = useState<boolean>(false);
  const [modalConfirmarPedidoPronto, setModalConfirmarPedidoPronto] = useState<boolean>(false);

  useEffect(() => {
    const fetchPedidos = async () => {
      api.get('api/pedidos/get-for-cozinha')
      .then(response => {
        setAllPedidos(response.data)
        
        const pedidosProntos = allPedidos.filter(pedido => pedido.pedidoPronto === true);
        const pedidosNaoProntos = allPedidos.filter(pedido => pedido.pedidoPronto === false);
        
        setPedidosProntos(pedidosProntos);
        setPedidosNaoProntos(pedidosNaoProntos);
      })
      .catch(error => {
        console.log(error as string);
      })
    };
    
    fetchPedidos();

    const interval = setInterval(fetchPedidos, 60000); 

    return () => clearInterval(interval);
  }, []);

  async function confirmarPedidoPronto(pedido:PedidoCozinhaDTO)
  {
    api.post('api/pedidos/pronto', null, {
      params:{
        idPedido: pedido.idPedido
      }
    })
    .then(response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error as string);
    })
  }

  const calculateBackgroundColor = (horaPedido: string) => {
    try {
      const [hours, minutes] = horaPedido.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid time format:', horaPedido);
        return 'gray'; 
      }
      
      const pedidoDate = new Date();
      pedidoDate.setHours(hours, minutes, 0, 0); 
  
      const currentTime = new Date();
      const diffInMinutes = (currentTime.getTime() - pedidoDate.getTime()) / (1000 * 60);
  
      if (diffInMinutes > 10) {
        return 'red';
      } else if (diffInMinutes > 5) {
        return 'yellow';
      } else {
        return 'green';
      }
    } catch (error) {
      console.error('Error calculating background color:', error);
      return 'gray'; 
    }
  }
  
  const renderProdutosPedidos = ({ item }: { item: PedidoCozinhaProdutosDTO }) => {
    return (
      <View>
        <Text>{item.nomeProd} - X ({item.quantidadeProduto})</Text>
      </View>
    );
  }

  const renderModalConfirmarPedidoPronto = (pedido:PedidoCozinhaDTO) => {
    return(
      <View style={styles.modalView}>
        <Text>Confirmar pedido pronto?</Text>
        <Pressable onPress={() => confirmarPedidoPronto(pedido)} style={{backgroundColor:'green', borderColor:'black', borderWidth:1}}>
          <Text style={{color:'white'}}>SIM</Text>  
        </Pressable>
        <Pressable onPress={() => setModalConfirmarPedidoPronto(false)} style={{backgroundColor:'red', borderColor:'black', borderWidth:1}}>
          <Text style={{color:'white'}}>NÃO</Text>
        </Pressable>
      </View>
    );
  }

  const renderModalVisualizarPedido = (pedido:PedidoCozinhaDTO) => {
    const backgroundColor = calculateBackgroundColor(pedido.horaPedido);
    return(
      <View style={styles.modalView}>
        {pedido.pedidoPronto === true ? (
          <Text style={[styles.pedidoContainer, { backgroundColor:'green' }]}>pronto ás: {pedido.horaPronto}</Text>
        ):(
          <Text style={[styles.pedidoContainer, { backgroundColor }]}>{pedido.horaPedido}</Text>
        )}
        <FlatList
          data={pedido.produtos}
          renderItem={renderProdutosPedidos}
          keyExtractor={(produto) => produto.idProduto}
        />
        {
          pedido.pedidoPronto ? (
            <View>
              <Pressable onPress={() => setModalVisualizarPedido(false)} style={{backgroundColor:'green', borderColor:'black', borderWidth:1}}>
                <Text>Pronto</Text>
              </Pressable>
            </View>
          ):(
            <View style={{backgroundColor:'green'}}>
              <Text style={{color:'white'}}>Pedido pronto!</Text>
            </View>
          )
        }
        
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
  }

  const renderPedidos = ({ item }: { item: PedidoCozinhaDTO }) => {
    const backgroundColor = calculateBackgroundColor(item.horaPedido);
    if (item.pedidoPronto === true)
    {
      return (
        <View>
          <Pressable onPress={() => setModalVisualizarPedido(true)}>
            <Text>Pronto ás: {item.horaPronto}</Text>
            <FlatList
              data={item.produtos}
              renderItem={renderProdutosPedidos}
              keyExtractor={(produto) => produto.idProduto}
            />
          </Pressable>
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisualizarPedido}
              onRequestClose={() => setModalVisualizarPedido(false)}
          >
              {renderModalVisualizarPedido(item)}
          </Modal>
        </View>
      );
    }
    else{
      return (
        <View>
          <Pressable onPress={() => setModalVisualizarPedido(true)}>
            <Text style={[styles.pedidoContainer, { backgroundColor }]}>{item.horaPedido}</Text>
            <FlatList
              data={item.produtos}
              renderItem={renderProdutosPedidos}
              keyExtractor={(produto) => produto.idProduto}
            />
          </Pressable>
          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisualizarPedido}
              onRequestClose={() => setModalVisualizarPedido(false)}
          >
              {renderModalVisualizarPedido(item)}
          </Modal>
        </View>
      );
    }
  }

  const renderMenu = () => {
    if (allPedidos.length > 0 && allPedidos)
    {
      if ((pedidosNaoProntos.length > 0 && pedidosNaoProntos) && (pedidosProntos.length > 0 && pedidosProntos))
      {
        return(
          <View>
            <Text>Pedidos em preparo</Text>
            <FlatList
              data={pedidosNaoProntos}
              renderItem={renderPedidos}
              keyExtractor={(item) => item.idPedido}
            />
            <Text>Pedidos prontos</Text>
            <FlatList
              data={pedidosProntos}
              renderItem={renderPedidos}
              keyExtractor={(item) => item.idPedido}
            />
          </View>
        );
      }
      else if (pedidosNaoProntos.length > 0 && pedidosNaoProntos)
      {
        return(
          <View>
            <Text>Pedidos em preparo</Text>
            <FlatList
              data={pedidosNaoProntos}
              renderItem={renderPedidos}
              keyExtractor={(item) => item.idPedido}
            />
          </View>
        );
      }
      else if (pedidosProntos.length > 0 && pedidosProntos)
      {
        return(
          <View>
            <Text>Pedidos prontos</Text>
            <FlatList
              data={pedidosProntos}
              renderItem={renderPedidos}
              keyExtractor={(item) => item.idPedido}
            />
          </View>
        );
      }  
    } else {
      return (
        <View>
          <Text>Por enquanto está tudo tranquilo, tome uma água.....</Text>
        </View>
      );
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        {renderMenu()}
      </ScrollView>
    </SafeAreaView>
  )
}

export default MenuCozinha

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
})