import React, {useEffect, useState} from "react";
import api from '../../../services/api'
import Cookies from 'universal-cookie';
import { CiShoppingCart as Carrinho} from "react-icons/ci";
import {useNavigate, Link} from 'react-router-dom';

export default function ClientPage()
{
  const navigate = useNavigate ();
  const [carrinho, setCarrinho] = useState([]);
  const cookies = new Cookies();
  const [username, setUsername] = useState(''); 
  const [products, setProducts] = useState([]);

  const [quantidade, setQuantidade] = useState(1);
  const increcrementQuantidade = () => setQuantidade(quantidade + 1);
  let decrementQuantidade = () => setQuantidade(quantidade - 1);
  if (quantidade <=1){
      decrementQuantidade = () => setQuantidade(1);
  }

  function addToCart(produto, quantidade) {

    let existCart = localStorage.getItem('cart')
    try{
        let cartItens = JSON.parse(existCart);
        let produtoExistente = cartItens.find(item => item.idProduto === produto.idProduto);
    
        if (produtoExistente) {
            if (produtoExistente.quantidade !== quantidade) {
                produtoExistente.quantidade = quantidade;
                produtoExistente.valorTotalIten = produto.precoProduto * quantidade;
                localStorage.setItem('cart', JSON.stringify(cartItens));
                setCarrinho([...cartItens]);
            }
        } else {
            cartItens.push({
                nomeProduto: produto.nomeProd,
                idProduto: produto.idProd,
                quantidade: quantidade,
                valorUnitarioItem: produto.precoProd,
                valorTotalIten: produto.precoProd * quantidade
            });
            localStorage.setItem('cart', JSON.stringify(cartItens));
            setCarrinho([...cartItens]);
        }
    }
    catch(error)
    {
        const cartItens = [{
          nomeProduto: produto.nomeProd,
          idProduto: produto.idProd,
          quantidade: quantidade,
          valorUnitarioItem: produto.precoProd,
          valorTotalIten: produto.precoProd * quantidade
        }];
        localStorage.setItem('cart', JSON.stringify(cartItens));
        setCarrinho([...cartItens]);
    }
}

  useEffect(() => {
    async function getUserData() {
      api.post('http://localhost:8080/api/auth/get-username', cookies.get('SessionId'))
      .then(response => {
        setUsername(response.data)
      })
      .catch(error => {
        const errorMessage = error.response.data.message;
        console.log(error.response.data);
      })
    }

    async function getProductsData()
    {
      api.get('http://localhost:8080/api/products/get-all')
      .then(response =>{
        setProducts(response.data)
      })
      .catch(error => {
        const errorMessage = error.response.data.message;
        console.log(error.response.data);
      })
    }

    getProductsData();
    getUserData();
  }, [])

  return (
    <div>
      <h1>Bem-vindo, {username}</h1>

      <hr/>
        <div>
            <button>
                <Link to = '/cart'>
                    <h3>
                        <Carrinho/>
                        | Ir para o carrinho
                    </h3>
                </Link>
            </button>
        </div>
      <div>
        <h1><strong>!PROMOCOES DO DIA!</strong></h1>
        <ul>
          {products.map(promocao =>
                          promocao.promoProd === true && (
                              <li key={promocao.idProd}>
                                  <p><strong>{promocao.nomeProd}</strong></p>
                                  <p>{promocao.precoProd}</p>
                              </li>
                          )
          )}
        </ul>
      </div>

      <hr/>

      <div>
        <h1><strong>!NOSSOS PRODUTOS!</strong></h1>

        <ul>
          {products.map(product =>
                <li key={product.idProd}>
                    <p><strong>{product.nomeProd}</strong></p>
                    <p>{product.precoProd}</p>
                    <button onClick={() => addToCart(product, quantidade)}>
                        <Carrinho/>|
                        Adicionar ao carrinho
                    </button>
                    <div>
                        <button onClick={decrementQuantidade}>
                            -
                        </button>
                        <p>{quantidade}</p>
                        <button onClick={increcrementQuantidade }>
                            +
                        </button>
                    </div>
                </li>                   
          )}
        </ul>
      </div>
    </div>
  );
}