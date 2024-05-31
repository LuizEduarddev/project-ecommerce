import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import api from '../../../../services/api';
import React, {useEffect, useState} from "react";
import Title from './Title';
import Cookies from 'universal-cookie';
import {useNavigate} from 'react-router-dom';

function createData(time, amount) {
  return { time, amount: amount ?? null };
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

  function instaciateData(pedido)
  {
    try{
      createData(pedido.horaPedido, pedido.totalPedido);
      if (data.length <= 0)
      {
        setData({});
        let datas = {
          horaPedido: pedido.horaPedido,
          totalPedido: pedido.totalPedido
        }
        setData([...datas]);
        console.log(data);
      }
      else{
        let datas = {
          horaPedido: pedido.horaPedido,
          totalPedido: pedido.totalPedido
        }
        setData([...datas]);
        console.log(data);
      }
    }
    catch(error)
    {
      alert('Falha ao tentar instanciar o gráfico de pedidos.');
      console.log(error);
    }
  }

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
            instaciateData(pedidoPago.horaPedido, valorPedido);
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