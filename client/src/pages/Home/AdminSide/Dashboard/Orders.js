import React, { useEffect, useState } from "react";
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

export default function Orders() {

  const cookie = new Cookies();
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    const session = cookie.get('SessionId');
    
    if (session)
    {
      async function getData(token) {
        try {
          const response = await api.post('http://localhost:8080/api/pedidos/get-all-admin', token);
          const payment = response.data.pedidosList.filter(prod => prod.pedidoPago === true);
          setAllOrders(payment);
          setLoading(false);
        } catch (error) {
          alert(error.response.data.message);
          navigate('/login');
        }
      }

      getData(session);
    }
    else{
      alert('É necessário estar logado para realizar esta ação.');
      navigate('/login');
    }
  }, []);

  if (loading) {
    return (
      <div>
        Carregando.....
      </div>
    ); 
  }

  function transformMoeda(valor) {
    const formattedTotal = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
    return formattedTotal;
  }

  function preventDefault(event) {
    event.preventDefault();
  }

  function printName(order)
  {
    console.log(order);
  }

  return (
    <React.Fragment>
      <Title>Pedidos recentes</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Hora do pedido</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell align="right">Total pedido</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allOrders.map((order) => (
            <TableRow key={order.idPedido}>
              <TableCell>{order.dataPedido}</TableCell>
              <TableCell>{order.horaPedido}</TableCell>
              <TableCell>{order.users.username}</TableCell>
              <TableCell align="right">{transformMoeda(order.totalPedido)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        Ver mais pedidos
      </Link>
    </React.Fragment>
  );
}
