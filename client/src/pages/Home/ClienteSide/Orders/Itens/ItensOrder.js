import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import api from "../../../../../services/api";
import { FaArrowLeft as Back } from "react-icons/fa";

export default function ItensOrder() {
    const [pedidos, setPedidos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function getItensOrder() {
            const orderId = localStorage.getItem('OrderId');
            if (orderId) {
                try {
                    const response = await api.post('http://localhost:8080/api/pedidos/get-by-id', orderId);
                    if (response.data) {
                        setPedidos(response.data);
                        setIsLoading(false);
                    } else {
                        setError("Pedido não encontrado.");
                        setIsLoading(false);
                    }
                } catch (error) {
                    setError("Ocorreu um erro ao buscar o pedido.");
                    setIsLoading(false);
                }
            } else {
                setError("Nenhum ID de pedido encontrado.");
                setIsLoading(false);
            }
        }

        getItensOrder();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <button onClick={() => navigate('/pedidos')}>
                    Retornar para pedidos
                </button>   
            </div>
        );
    }

    if (!pedidos) {
        return (
            <div>
                <p>Pedido não encontrado.</p>
                <button onClick={() => navigate('/pedidos')}>
                    Retornar para pedidos
                </button>
            </div>
        );
    }

    return (
        <div>
            <div>
                <button>
                    <Link to='/pedidos'>
                        <Back />
                        <h3>Voltar para pedidos</h3>
                    </Link>
                </button>
            </div>
            {pedidos.dataPedido}
            <br></br>
            {pedidos.horaPedido}
            <br></br>
            {pedidos.pedidoPronto === true ? (
                <>
                    O pedido está pronto!
                </>
            ) : (
                <>
                    O pedido está sendo preparado e jajá irá para a sua mesa!
                </>
            )}
            <br></br>
            {pedidos.pedidoPago === false ? (
                <>
                    O pagamento ainda está pendente
                </>
            ) : (
                <>
                    Pagamento aprovado e efetuado com sucesso!
                </>
            )}
            <br></br>
            <ul>
                {pedidos.produtos.map(produto => (
                    <li key={produto.idProd}>
                        {produto.nomeProd}
                        {produto.precoProd}
                    </li>
                ))}
            </ul>
            {pedidos.totalPedido}
        </div>
    );
}
