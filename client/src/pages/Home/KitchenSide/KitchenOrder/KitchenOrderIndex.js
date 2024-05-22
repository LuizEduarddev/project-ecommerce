import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import api from "../../../../services/api";
import { FaArrowLeft as Back } from "react-icons/fa";

export default function KitchenOrderIndex() {
    const [pedidos, setPedidos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() => {
        const token = cookies.get('SessionId');
        
        if (token) {
            checkAutority(token);
        } else {
            alert('É necessário estar logado para esta operação.');
            navigate('/login');
        }

        async function getItensOrder() {
            const orderId = localStorage.getItem('idPedido');
            
            if (orderId) {
                try {
                    const response = await api.post('http://localhost:8080/api/pedidos/get-by-id', {
                        idPedido: orderId,
                        token: token
                    });
                    if (response.data) {
                        setPedidos(response.data);
                        setIsLoading(false);
                        localStorage.removeItem('idPedido');
                    } else {
                        setError("Pedido não encontrado.");
                        setIsLoading(false);
                    }
                } catch (error) {
                    setError("Ocorreu um erro ao buscar o pedido.");
                    setIsLoading(false);
                    localStorage.removeItem('idPedido');
                }
            } else {
                setError("Nenhum ID de pedido encontrado.");
                setIsLoading(false);
                localStorage.removeItem('idPedido');
            }
        }

        getItensOrder();
    }, []);

    function checkAutority(token)
    {
        api.post('http://localhost:8080/api/auth/send-route', token)
        .then(response => {
            const cozinhaLogin = response.data.filter(permissions => permissions.authority === "ROLE_COZINHA-CAFE");
            if (cozinhaLogin !== null) {
                return;
            }
            else{
                alert("É ncessária uma autoridade maior para executar esta acao.");
                navigate('/login');
            }
        })
        .catch(error => {
            alert(error.response.data.message);
        })
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <button onClick={() => navigate('/kitchen')}>
                    Retornar para pedidos
                </button>   
            </div>
        );
    }

    if (!pedidos) {
        return (
            <div>
                <p>Pedido não encontrado.</p>
                <button onClick={() => navigate('/kitchen')}>
                    Retornar para pedidos
                </button>
            </div>
        );
    }

    function pedidoPronto(idPedido)
    {
        api.post('http://localhost:8080/api/pedido')
    }

    return (
        <div>
            <div>
                <button>
                    <Link to='/kitchen'>
                        <Back />
                        <h3>Voltar para pedidos</h3>
                    </Link>
                </button>
            </div>
            {pedidos.dataPedido}
            <br></br>
            {pedidos.horaPedido}
            <br></br>
            <ul>
                {pedidos.produtos.map(produto => (
                    <li key={produto.idProd}>
                        {produto.nomeProd}
                        {produto.precoProd}
                    </li>
                ))}
            </ul>
            <button onClick={() => pedidoPronto(pedidos.idPedido)}>
                Finalizar pedido
            </button>
        </div>
    );
}
