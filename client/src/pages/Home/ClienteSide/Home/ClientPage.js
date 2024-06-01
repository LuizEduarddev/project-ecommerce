import React, {useEffect, useState} from "react";
import api from '../../../../services/api'
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
        let produtoExistente = cartItens.find(item => item.idProd === produto.idProd);
    
        if (produtoExistente) {
            if (produtoExistente.quantidade !== quantidade) {
                produtoExistente.quantidade = quantidade;
                produtoExistente.valorTotalIten = produto.precoProd * quantidade;
                produtoExistente.valorUnitarioItem = produto.precoProd
                localStorage.setItem('cart', JSON.stringify(cartItens));
                setCarrinho([...cartItens]);
            }
        } else {
            cartItens.push({
                idProd: produto.idProd,
                nomeProd: produto.nomeProd,
                quantidade: quantidade,
                valorTotalIten: produto.precoProd * quantidade,
                valorUnitarioItem: produto.precoProd
            });
            localStorage.setItem('cart', JSON.stringify(cartItens));
            setCarrinho([...cartItens]);
        }
    }
    catch(error)
    {
        const cartItens = [{
          idProd: produto.idProd,
          nomeProd: produto.nomeProd,
          quantidade: quantidade,
          valorTotalIten: produto.precoProd * quantidade,
          valorUnitarioItem: produto.precoProd
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

    const getTokenUser = cookies.get('SessionId');
    if (getTokenUser)
    {
      getUserData();
    }
    else{
      setUsername(null);  
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
  }, [])

  return (
    <div>
      {
        username ? (
          <div>
            <h1>Bem-vindo, {username}</h1>
            <hr/>
          </div>
        ) : (
          <div>
            <h1>

            Bem-vindo
            </h1>
          </div>
        )
      }
      <div>
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
          <button>
            <Link to = '/pedidos'>
              <h3>

              Meus pedidos
              </h3>
            </Link>
          </button>
        </div>
        <div>
          <button>
            <Link to = '/cliente/mesa'>
              <h3>
                Mesa
              </h3>
            </Link>
          </button>
        </div>
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