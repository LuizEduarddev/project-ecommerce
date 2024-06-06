import React, {useEffect, useState} from "react";
import api from "../../../../services/api";
import Cookies from 'universal-cookie';
import {useNavigate, Link} from 'react-router-dom';
import './Styles.css';

export default function ClienteMesa()
{
    const cookie = new Cookies();
    const [pedidosMesa, setPedidosMesa] = useState([]);
    const [clientesMesa, setClientesMesa] = useState([]);
    const [numeroMesa, setNumeroMesa] = useState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function getData(token)
        {
            api.post('http://localhost:8080/api/mesa/get-by-id', token)
            .then(response => {
                const pedidos = response.data.pedidosAnteriores
                const clientes = response.data.nomeClientes
                setPedidosMesa(pedidos); 
                setClientesMesa(clientes);
                setNumeroMesa(response.data.numeroMesa);
                setLoading(false);
            })
            .catch(error => {
                try
                {
                    alert(error.response.data.message);
                }
                catch(error)
                {
                    alert(error);
                }
            })
        }

        const token = cookie.get('SessionId');
        if (token)
        {
            getData(token)     
        }
        else{
            alert('É necessário estar logado para acessar esta página.');
            navigate('/login');
        }
    }, [])

    function returnClientes()
    {
        if (clientesMesa.length > 0)
        {
            return(
                <div>
                    <h2>Integrantes da mesa</h2>
                    <ul>
                        {clientesMesa.map(cliente => (
                            <li key={cliente}>
                                <p>{cliente}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
        else{
            return(
                <h2>Parece que ninguem chegou ainda, aguarde mais um pouco e relaxa!</h2>
            );
        }
    }

    function returnPedidos()
    {
        if (pedidosMesa.length > 0)
        {
            return (
            <div>
                <h2>
                    Pedidos da mesa
                </h2>

                <div>
                    {pedidosMesa.map(pedido => (
                        <li key={pedido.idPedido}>
                            <p>{pedido.horaPedido}</p>
                            <p>{pedido.totalPedido}</p>
                        </li>
                    ))}
                </div>
            </div>
            );
        }
        else{
            return null;
        }
    }

    if (loading)
    {
        return (
            <div>
                <h3>
                    carregando....
                </h3>
            </div>
        );
    }
    else{     
        return(
            <div>
                <h1>Mesa {numeroMesa}</h1>
                
                {returnClientes()}

                {returnPedidos()}
            </div>
        );
    }

}