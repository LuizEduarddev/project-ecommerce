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

  const session = cookie.get('SessionId');

  async function getData(token)
  {
    api.post('http://localhost:8080/api/pedidos/get-all-admin', token)
    .then(response => {
        return response.data.pedidosList;
    })
    .catch(error => {
      alert(error.response.data.message);
      navigate('/login');
    })
  }

  getData(session);

  function preventDefault(event) {
    event.preventDefault();
  }
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{`$${row.amount}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}