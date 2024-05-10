import React, {useEffect, useState} from "react";
import {useNavigate, Link} from 'react-router-dom';
import Cookies from 'universal-cookie';
import api from "../../../../services/api";
import { FaArrowLeft as Back } from "react-icons/fa";

export default function ClientOrder()
{
    const navigate = useNavigate ();
    const cookies = new Cookies();
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        async function getOrdersByUser()
        {
            const getToken = cookies.get('SessionId')
            if (getToken)
            {
                api.post('http://localhost:8080/api/pedidos/get-by-user', getToken)
                .then(response => {
                    if (response.data.length > 0)
                    {
                        console.log(response.data);
                        setPedidos(response.data);
                    }
                })
                .catch(error => {
                    console.log(error.response.data.message);
                })
            }
            else{
                alert('Não é possível ver pedidos sem uma sessão. Direcionando para o login.');
                navigate('/login');
            }
        }
        getOrdersByUser();
    }, [])

    function getItens(idPedido)
    {
        localStorage.setItem('OrderId', idPedido);
        navigate('/pedidos/itens')
    }

    return (
        <div>
            <div>
                <button>
                    <Link to='/home'>
                        <Back />
                        <h3>Voltar para pedidos</h3>
                    </Link>
                </button>
            </div>
            {
                pedidos.length > 0 ? (
                    <div>
                        <ul>
                            {
                                pedidos.map(pedido => 
                                    <li key={pedido.idPedido}>
                                        <button onClick={() => getItens(pedido.idPedido)}>
                                        {pedido.dataPedido}
                                        <br></br>
                                        {pedido.horaPedido}
                                        <br></br>
                                        {pedido.pedidoPronto === true ? (
                                            <>
                                                O pedido está pronto!
                                            </>
                                        ):(
                                            <>
                                                O pedido está sendo preparado e jajá irá para a sua mesa!
                                            </>
                                        )}
                                        <br></br>
                                        {pedido.pedidoPago === false ? (
                                            <>
                                                O pagamento ainda está pendente
                                            </>
                                        ):(
                                            <>
                                                Pagamento aprovado e efetuado com sucesso!
                                            </>
                                        )}
                                        <br></br>
                                        <ul>
                                            {pedido.produtos.map(produto => (
                                                <li key={produto.idProd}>
                                                    {produto.nomeProd}
                                                    {produto.precoProd}
                                                </li>
                                            ))}
                                        </ul>
                                        {pedido.totalPedido}
                                        </button>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                ) : (
                    <div>
                        <h1>
                            Nenhum pedido ativo, faça um pedido e ele aparecerá aqui.
                            <Link to='/home'>
                                <h3>
                                    <button>
                                        Voltar para a página principal.
                                    </button>
                                </h3>
                            </Link>
                        </h1>
                    </div>
                )
            }
        </div>
    );
}