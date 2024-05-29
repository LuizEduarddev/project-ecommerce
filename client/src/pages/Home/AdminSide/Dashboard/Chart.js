import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import api from '../../../../services/api';
import React, {useEffect, useState} from "react";
import Title from './Title';
import Cookies from 'universal-cookie';
import {useNavigate} from 'react-router-dom';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount: amount ?? null };
}

const data = [
  createData('10', 3000);
]

function setData(pedidos)
{
  try
  {
    pedidos.map(pedido => {
      createData(pedido.horaPedido, pedido.totalPedido);
    })
  }
  catch(error) 
  {
    alert(error);
  }
}

function formattNumberInReal(total)
{
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total);
  return formattedTotal;
}

export default function Chart() {
  const theme = useTheme();
  const cookie = new Cookies();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {

    const session = cookie.get('SessionId');

    async function getData(token)
    {
      api.post('http://localhost:8080/api/pedidos/get-all-admin', token)
      .then(response => {
          let total = 0;
          const payed = response.data.pedidosList.filter(item => item.pedidoPago === true);
          const totalPedido = payed.map(pedidoPago => {
            total += pedidoPago.totalPedido
            let valorPedido = formattNumberInReal(pedidoPago.totalPedido);
            createData(pedidoPago.horaPedido, valorPedido);
          })
          formattNumberInReal(total);
  
          setTotalOrder(formattedTotal);
      })
      .catch(error => {
        try{
          alert(error.response.data.message);
          navigate('/login');
        }
        catch{
          alert(error);
          navigate('/login');
        }
      })
    }

    getData(session);
  }, [])

  return (
    <React.Fragment>
      <Title>Today</Title>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={data}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'time',
              tickNumber: 2,
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: 'Sales ($)',
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
              max: 2500,
              tickNumber: 3,
            },
          ]}
          series={[
            {
              dataKey: 'amount',
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}