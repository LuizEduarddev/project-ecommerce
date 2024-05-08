import React, {useState, useEffect} from "react";
import {useNavigate, Link} from 'react-router-dom';
import { FaCheck as Check} from "react-icons/fa";
import { MdOutlinePayments as Cash,  MdOutlineCleaningServices as Clean, MdHome as Home, MdTableBar as Table} from "react-icons/md";
import api from '../../services/api.js'
import Cookies from 'universal-cookie';

export default function CartPage()
{
    
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate ();
    const pagamento = 1000;
    const cookies = new Cookies();

    useEffect(() => {
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
    }, [cart])

    const decreaseQuantity = (id) => {
        const updatedCart = cart.map(item => {
            if (item.idProduto === id && item.quantidade > 1) {
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
            if (item.idProduto === id) {
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
        cartItens = cartItens.filter(item => item.idProduto !== id);
        localStorage.setItem('cart', JSON.stringify(cartItens));
        setCart([...cartItens]);
    }

    function CleanCart()
    {
        const cleanCart = [];
        localStorage.setItem('cart', cleanCart);
        setCart([...cleanCart]);
        setTotal(0);
    }

    async function sendOrder()
    {
        const getMesa = localStorage.getItem('mesaToken')
        if (getMesa)
        {

        }
        else
        {
            api.post('http://localhost:8080/api/pedidos/add/' + cookies.ge)
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
                            <button onClick={CleanCart}>
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
                        <li key={item.idProduto}>
                            <div>
                                <h1>{item.nomeProduto}</h1>
                                <div>
                                    <h1>quantidade: 
                                        <button onClick={() => decreaseQuantity(item.idProduto)}>-</button> 
                                        {item.quantidade} 
                                        <button onClick={() => increaseQuantity(item.idProduto)}>+</button>
                                    </h1>
                                </div>
                                <h1>valor: {item.valorTotalIten.toFixed(2)}</h1>
                                <button onClick={() => deleteItenById(item.idProduto)}>
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
                        <button onClick={sendOrder}>
                            Fazer pedido
                        </button>
                    </div>
                )}
            </h2>
            <hr/>
        </div>
    );
}

