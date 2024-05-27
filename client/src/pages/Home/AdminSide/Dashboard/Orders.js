import React, {useEffect, useState} from "react";
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

  const session = cookie.get('SessionId');

  if (session === null)
  {
    alert('Um erro ocorreu ao tentar pegar o usuário.');
    navigate('/login');
  }

  useEffect(() => {

    async function getData(token)
    {
      api.post('http://localhost:8080/api/pedidos/get-all-admin', token)
      .then(response => {
        const payment = response.data.pedidosList.filter(prod => prod.pedidoPago === true);
        console.log(payment);  
        setAllOrders(payment);
        setLoading(false);
      })
      .catch(error => {
        alert(error.response.data.message);
        navigate('/login');
      })
    }
  
    getData(session);
  }, [])

  if (loading)
  {
    return (
      <div>
        Carregando.....
      </div>
    ); 
  }

  async function getUser(idUser)
  {
    const data = {
      id: idUser,
      token: session
    }
    api.post('http://localhost:8080/api/auth/get-by-id', data)
    .then(response => {
      console.log(response);
      return "João"
    })
    .catch(error => {
      console.log(error.response.data.message);
      return "null";
    })
  }

  function transformMoeda(valor)
  {
      const formattedTotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor);

      return formattedTotal;
  }

  function preventDefault(event) {
    event.preventDefault();
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
              <TableCell>{getUser(order.users.idUser)}</TableCell>
              <TableCell align="right">{`${transformMoeda(order.totalPedido)}`}</TableCell>
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