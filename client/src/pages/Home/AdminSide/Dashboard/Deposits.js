import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import React, {useEffect, useState} from "react";
import api from '../../../../services/api';
import Cookies from 'universal-cookie';
import { CiShoppingCart as Carrinho} from "react-icons/ci";
import {useNavigate} from 'react-router-dom';

export default function Deposits()
{
  const cookie = new Cookies();
  const navigate = useNavigate();
  const [totalOrder, setTotalOrder] = useState();
  const [allOrders, setAllOrders] = useState([]);
  const [session, setSession] = useState();

  useEffect(() => {

    const session = cookie.get('SessionId');

    async function getData(token)
    {
      api.post('http://localhost:8080/api/pedidos/get-all-admin', token)
      .then(response => {
          const total = response.data.total
          const formattedTotal = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(total);
  
          setAllOrders(response.data.pedidosList);
          setTotalOrder(formattedTotal);
      })
      .catch(error => {
        alert(error.response.data.message);
        navigate('/login');
      })
    }

    getData(session);
  }, [])

  function getCurrentDate() {
    const now = new Date();
    
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(now);
    
    return formattedDate;
  }


  function preventDefault(event) {
    event.preventDefault();
  }
  
  return (
    <React.Fragment>
      <Title>Depósitos Totais</Title>
      <Typography component="p" variant="h5">
        {totalOrder}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {getCurrentDate()}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
} 




