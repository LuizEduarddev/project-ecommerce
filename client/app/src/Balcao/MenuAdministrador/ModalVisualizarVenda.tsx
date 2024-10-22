import { StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';

const { width, height } = Dimensions.get('window');

type ProductsMesaDTO = {
  idProd: string;
  nomeProd: string;
  precoProd: number;
  quantidadeProduto: number;
};

type PedidosMesaDTO = {
  idPedido: string;
  pedidoPronto: boolean;
  produtos: ProductsMesaDTO[];
  cpfClientePedido: string;
};

type MesaDTO = {
  pedidosMesa: PedidosMesaDTO[];
  valorTotal: number;
};

type PagamentoAdminDTO = {
  pedido: MesaDTO;
  idPagamento: string;
  cpfCliente: string;
  dataPagamento: string;
  metodoPagamento: string;
};

const ModalVisualizarVenda = ({ id }: { id: string }) => {
  const toast = useToast();
  const [pedidoCpf, setPedidoCpf] = useState<PagamentoAdminDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('session-token');
    if (token === null) window.location.reload();

    const dto = {
      token: token,
      idPagamento: id,
    };

    api
      .post('api/pagamentos/get-by-id', dto)
      .then((response) => {
        setPedidoCpf(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.show('Erro ao tentar buscar os dados do pedido', {
          type: 'warning',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        });
        setLoading(false);
      });
  }, [id]);

  return (
    <View style={styles.modalContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : pedidoCpf ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerText}>Detalhes da Venda</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>ID Pagamento:</Text>
            <Text style={styles.value}>{pedidoCpf.idPagamento}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>CPF Cliente:</Text>
            <Text style={styles.value}>{pedidoCpf.cpfCliente}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Data Pagamento:</Text>
            <Text style={styles.value}>{pedidoCpf.dataPagamento}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Método Pagamento:</Text>
            <Text style={styles.value}>{pedidoCpf.metodoPagamento}</Text>
          </View>

          <Text style={styles.sectionHeader}>Pedidos</Text>
          {pedidoCpf.pedido.pedidosMesa.map((pedido, index) => (
            <View key={index} style={styles.pedidoContainer}>
              <Text style={styles.pedidoText}>Pedido ID: {pedido.idPedido}</Text>
              <Text style={styles.pedidoText}>CPF Cliente: {pedido.cpfClientePedido}</Text>
              <Text style={styles.pedidoText}>Status: {pedido.pedidoPronto ? 'Pronto' : 'Em Preparo'}</Text>

              <Text style={styles.sectionHeader}>Produtos</Text>
              {pedido.produtos.map((produto, i) => (
                <View key={i} style={styles.produtoContainer}>
                  <Text style={styles.produtoText}>Nome: {produto.nomeProd}</Text>
                  <Text style={styles.produtoText}>Quantidade: {produto.quantidadeProduto}</Text>
                  <Text style={styles.produtoText}>Preço: R$ {produto.precoProd.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Valor Total: R$ {pedidoCpf.pedido.valorTotal.toFixed(2)}</Text>
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.errorText}>Não foi possível carregar os dados.</Text>
      )}
    </View>
  );
};

export default ModalVisualizarVenda;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 60,
    maxHeight: height * 0.8, // Limit the height to 80% of the screen height
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34495e',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2980b9',
    marginVertical: 10,
  },
  pedidoContainer: {
    backgroundColor: '#ecf0f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  pedidoText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
  },
  produtoContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    marginBottom: 10,
  },
  produtoText: {
    fontSize: 16,
    color: '#34495e',
  },
  totalContainer: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
