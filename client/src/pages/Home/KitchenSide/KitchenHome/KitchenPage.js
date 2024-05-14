import React, {useState, useEffect} from "react";
import {useNavigate, Link} from 'react-router-dom';
import { FaCheck as Check} from "react-icons/fa";
import { MdOutlinePayments as Cash,  MdOutlineCleaningServices as Clean, MdHome as Home, MdTableBar as Table} from "react-icons/md";
import Cookies from 'universal-cookie';
import api from "../../../../services/api";
import { cookies } from "next/headers";
import Box from '@mui/material/Box';

export default function KitchenPage()
{
    const [pedidos, setPedidos] = useState([]);
    const navigate = useNavigate ();
    const cookies = new Cookies();

    useEffect(() => {
        const token = cookies.get('SessionId')
        if (token)
        {
            getOrders(token)
        }
        else{
            alert('É necessário estar logado para esta operação.');
            navigate('/login');
        }

        async function getOrders(token)
        {
            api.post('http://localhost:8080/api/pedidos/get-all', token)
            .then(response => {
                console.log(response.data);
                setPedidos(response.data);
            })
            .catch(error => {
                alert(error.response.data.message);
                // navigate('/home');
            })
        }
    }, [])
    return (
        <div>
            {
                pedidos.length > 0 ? 
                (
                    pedidos.pedidoPronto === 'false' ? 
                    (
                        <div>
                            <ul>
                            {
                                pedidos.map(pedido => 
                                    <li key={pedido.idPedido}>
                                        <Box>
                                            {pedido.dataPedido}
                                            <br></br>
                                            {pedido.horaPedido}
                                            <br></br>
                                            <ul>
                                                {pedido.produtos.map(produto => (
                                                    <li key={produto.idProd}>
                                                        {produto.nomeProd}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Box>
                                    </li>
                                )
                            }
                        </ul>
                        </div>
                    )
                    :
                    (
                        <div>
                            <strong>PEDIDOS ANTERIORES</strong>
                            <ul>
                            {
                                pedidos.map(pedido => 
                                    <li key={pedido.idPedido}>
                                        <Box>
                                            {pedido.dataPedido}
                                            <br></br>
                                            {pedido.horaPedido}
                                            <br></br>
                                            <ul>
                                                {pedido.produtos.map(produto => (
                                                    <li key={produto.idProd}>
                                                        {produto.nomeProd}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Box>
                                    </li>
                                )
                            }
                        </ul>
                        </div>
                    )
                )
                :
                (
                    <div>
                        nenhum pedido por equato
                    </div>
                )
            }
        </div>
    );
}