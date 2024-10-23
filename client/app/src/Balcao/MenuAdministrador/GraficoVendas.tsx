import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { useToast } from 'react-native-toast-notifications';
import api from '../../../ApiConfigs/ApiRoute';

type Vendas = {
  idPedido: string,
  cpf: string,
  dataPagamento: string,
  metodoPagamento: string,
  totalPagamento: number
}

const hours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00"
];

export default function PageViewsBarChart() {
  const theme = useTheme();
  const toast = useToast();
  const [vendas, setVendas] = useState<Vendas[]>([]);
  const [idVenda, setIdVenda] = useState('');
  const [modalVisualizarVenda, setModalVisualizarVenda] = useState(false);
  
  const colorPalette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ];
    
  const totalVendas = () => {
    return vendas.reduce((total, venda) => total + venda.totalPagamento, 0);
  }

  const formatToReais = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  useEffect(() => {
      const token = localStorage.getItem('session-token');
      if (token === null) window.location.reload();
      api.get('api/pagamentos/get-by-empresa', {
          params:{
              token:token
          }
      })
      .then(response => {
          setVendas(response.data);
      })
      .catch(error => {
          toast.show("Erro ao tentar buscar os dados da empresa", {
              type: "warning",
              placement: "top",
              duration: 4000,
              animationType: "slide-in",
          });
      })
  }, []);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {formatToReais(totalVendas())}
            </Typography>
            <Chip size="small" color="error" label="-8%" />
          </Stack>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={
            [
              {
                scaleType: 'band',
                categoryGapRatio: 0.5,
                data: hours,
              },
            ] as any
          }
          series={[
            {
              id: 'venda',
              data: vendas?.map(venda => venda.totalPagamento),
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}