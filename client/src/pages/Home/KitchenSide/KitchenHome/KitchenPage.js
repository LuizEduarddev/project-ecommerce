import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaCheck as Check } from "react-icons/fa";
import { MdOutlinePayments as Cash, MdOutlineCleaningServices as Clean, MdHome as Home, MdTableBar as Table } from "react-icons/md";
import Cookies from 'universal-cookie';
import api from "../../../../services/api";
import Box from '@mui/material/Box';

export default function KitchenPage() {
    const [pedidos, setPedidos] = useState([]);
    const [pedidoCarregado, setPedidoCarregado] = useState(false);
    const navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() => {
        const token = cookies.get('SessionId');
        if (token) {
            getOrders(token);
        } else {
            alert('É necessário estar logado para esta operação.');
            navigate('/login');
        }

        async function getOrders(token) {
            try {
                const response = await api.post('http://localhost:8080/api/pedidos/get-all', { token });
                console.log(response.data);
                setPedidos(response.data);
            } catch (error) {
                alert(error.response.data.message);
                // navigate('/home');
            } finally {
                setPedidoCarregado(true);
            }
        }
    }, [navigate, cookies]);

    function pedidoNull() {
        return (
            <div>
                Por enquanto está tudo calmo, beba uma água, quando um pedido aparecer, um alerta sonoro soará
            </div>
        );
    }

    function pedidosMap() {
        return (
            <div>
                {
                    pedidos.map(pedido => (
                        <li key={pedido.idPedido}>
                            <Box>
                                {pedido.dataPedido}
                                <br />
                                {pedido.horaPedido}
                                <br />
                                <ul>
                                    {pedido.produtos.map(produto => (
                                        <li key={produto.idProd}>
                                            {produto.nomeProd}
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        </li>
                    ))
                }
            </div>
        );
    }

    if (!pedidoCarregado) {
        return (
            <div>
                Carregando...
            </div>
        );
    }

    return (
        <div>
            {pedidos.length === 0 ? pedidoNull() : pedidosMap()}
        </div>
    );
}
