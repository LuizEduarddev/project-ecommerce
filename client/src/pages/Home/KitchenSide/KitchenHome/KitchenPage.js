import React, { useState, useEffect } from "react";
import {useNavigate, Link} from 'react-router-dom';
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
                const response = await api.post('http://localhost:8080/api/pedidos/get-all', token);
                setPedidos(response.data);
            } catch (error) {
                alert(error.response.data.message);
                navigate('/login');
            } finally {
                setPedidoCarregado(true);
            }
        }
    },[pedidos]);

    function pedidoNull() {
        return (
            <div>
                Por enquanto está tudo calmo, beba uma água, quando um pedido aparecer, um alerta sonoro soará
            </div>
        );
    }

    function getPedido(idPedido)
    {
        localStorage.setItem('idPedido', idPedido);
        navigate('pedido')
    }   

    function printPedido(pedido)
    {
        return (
            <div>
                <h2>
                    <button onClick ={() => getPedido(pedido.idPedido)} >
                        <li key={pedido.idPedido}>
                            <Box>
                                {pedido.users.username}
                                <br/>
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
                    </button>
                </h2>
            </div>
        );
    }

    function pedidoPendente()
    {
        const pedidosPendentes = pedidos.filter(pedido => pedido.pedidoPronto === false)
        if (pedidosPendentes.length > 0)
        {
            return (
                <div>
                    <h1>Pedidos pendentes</h1>
                            {
                                pedidos.map(pedido => (
                                    pedido.pedidoPronto === false ?
                                    (
                                        printPedido(pedido)
                                    )                 
                                    :
                                    (
                                        null
                                    )
                                ))                 
                            }
                </div>
            );
        }
        else{
            return(
                null
            );
        }
    }

    function pedidoPronto()
    {
        const pedidosAnteriores = pedidos.filter(pedido => pedido.pedidoPronto === true)
        if (pedidosAnteriores.length > 0)
        {
            return (
                <div>
                    <h1>Pedidos anteriores</h1>
                            {
                                pedidos.map(pedido => (
                                    pedido.pedidoPronto === true ?
                                    (
                                        printPedido(pedido)
                                    )                 
                                    :
                                    (
                                        null
                                    )
                                ))                 
                            }
                </div>
            );
        }
        else{
            return(
                null
            );
        }
    }

    function pedidosMap() {
        return (
            <div>     
                <div>
                {
                    pedidoPendente()
                }
                </div>
                <div>
                {
                    pedidoPronto()
                }
                </div>
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
