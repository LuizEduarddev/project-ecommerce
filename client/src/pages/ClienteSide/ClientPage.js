import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import api from '../../services/api'
import Cookies from 'universal-cookie';

export default function ClientPage()
{
  const cookies = new Cookies();
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState([]);

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
    </div>
  );
}