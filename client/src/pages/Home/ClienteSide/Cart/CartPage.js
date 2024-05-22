import React, {useState, useEffect} from "react";
import {useNavigate, Link} from 'react-router-dom';
import { FaCheck as Check} from "react-icons/fa";
import { MdOutlinePayments as Cash,  MdOutlineCleaningServices as Clean, MdHome as Home, MdTableBar as Table} from "react-icons/md";
import api from '../../../../services/api.js'
import Cookies from 'universal-cookie';

export default function CartPage()
{
    
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate ();
    const cookies = new Cookies();

    useEffect(() => {
        async function startCart()
        {
            const getCarrinho = localStorage.getItem('cart');
            if (getCarrinho)
            {
                const savedCart = JSON.parse(getCarrinho);
                setCart(savedCart);
                let totalAtualizado = 0;
                savedCart.map(item => {
                    totalAtualizado += item.valorTotalIten;
                })
                if (totalAtualizado <= 0)
                {
                    setTotal(0);
                }
                else{
                    setTotal(totalAtualizado);
                }
            }
            else{
                setTotal(0)
            }
        }

        startCart()
    }, [])

    const decreaseQuantity = (id) => {
        const updatedCart = cart.map(item => {
            if (item.idProd === id && item.quantidade > 1) {
                let totalItem = item.valorTotalIten - item.valorUnitarioItem; 
                if (totalItem <= 0)
                {
                    totalItem = 0;
                }
                return { ...item, quantidade: item.quantidade - 1, valorTotalIten: totalItem};
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const increaseQuantity = (id) => {
        const updatedCart = cart.map(item => {
            if (item.idProd === id) {
                return { ...item, quantidade: item.quantidade + 1, valorTotalIten:  item.valorTotalIten + item.valorUnitarioItem};
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    function deleteItenById(id)
    {
        let cartItens = JSON.parse(localStorage.getItem('cart'));
        cartItens = cartItens.filter(item => item.idProd !== id);
        localStorage.setItem('cart', JSON.stringify(cartItens));
        setCart([...cartItens]);
    }

    function cleanCart()
    {
        const emptyCart = [];
        localStorage.setItem('cart', emptyCart);
        setCart([...emptyCart]);
        setTotal(0);
    }

    function verifyCartNull()
    {
        const getCarrinho = localStorage.getItem('cart');
        if (getCarrinho)
        {
            const savedCart = JSON.parse(getCarrinho);
            const filterIdNull = savedCart.filter(item => item.idProd === null)
            if (savedCart.length > 0)
            {
                return false;
            }
            else{
                return true;
            }          
        }
        else{
            alert('Erro interno do servidor. Redirecionando para a página princiapal');
            navigate('/home')
        }
    }

    async function orderDelivery()
    {
        const userToken = cookies.get('SessionId');
        if (userToken)
        {
            api.post('http://localhost:8080/api/pedidos/add/' + cookies.get('SessionId'), cart)
            .then(response => {
                alert('Pedido criado com sucesso! Redirecionando para a página principal');
                cleanCart()
                navigate('/home')
            })
            .catch(error => {
                console.log(error.response.data.message);
            })
        }
        else{
            alert('Para fazer um pedido é necessário estar logado, redirecionando.')
            navigate('/login')
        }
    }

    async function sendOrder()
    {
        const verifyCart = verifyCartNull();
        if (verifyCart === true) {alert("Não é possível fazer um pedido com carrinho vazio.");}
        else{
            const getMesa = localStorage.getItem('mesaToken')
            if (getMesa)
            {
                console.log('pegou a mesa')
            }
            else
            {
                orderDelivery();
            }
        }
    } 
    

    return(
        <div>
            
            <div>
                {total === 0 ? (
                    <div>
                    </div>
                ) : (
                    <div>
                        <div>
                            <button onClick={cleanCart}>
                                <h3>
                                    <Clean/>
                                    | Limpar Carrinho
                                </h3>
                            </button>
                        </div>

                        <div>
                            <button>
                                <h3>
                                    <Link to = "/home">
                                        <Home/>
                                        | Ir para a página inicial
                                    </Link>
                                </h3>
                            </button>
                        </div>                       
                    </div>
                )
            }
            </div>
            <ul>
                {cart.map(item => (
                        <li key={item.idProd}>
                            <div>
                                <h1>{item.nomeProd}</h1>
                                <div>
                                    <h1>quantidade: 
                                        <button onClick={() => decreaseQuantity(item.idProd)}>-</button> 
                                        {item.quantidade} 
                                        <button onClick={() => increaseQuantity(item.idProd)}>+</button>
                                    </h1>
                                </div>
                                <h1>valor: {item.valorTotalIten.toFixed(2)}</h1>
                                <button onClick={() => deleteItenById(item.idProd)}>
                                    <h3>Remover item</h3>
                                </button>
                            </div>
                            <hr />
                        </li>
                    ))
                }
            </ul>
            <hr/>
            <h2>
            {total === 0 ? (
                    <div>
                        <h3>Nada por enquanto...</h3>
                        <h3>Adicione produtos ao carrinho para aparecerem aqui!</h3>
                        <h4><Link to = "/home">Voltar para a página inicial.</Link></h4>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => sendOrder()}>
                            Fazer pedido
                        </button>
                    </div>
                )}
            </h2>
            <hr/>
        </div>
    );
}

