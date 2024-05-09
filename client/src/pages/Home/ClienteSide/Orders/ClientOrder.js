import React, {useEffect, useState} from "react";
import {useNavigate, Link} from 'react-router-dom';
import Cookies from 'universal-cookie';
import api from "../../../../services/api";

export default function ClientOrder()
{
    const navigate = useNavigate ();
    const cookies = new Cookies();
    const [pedidos, setPedidos] = ([]);

    useEffect(() => {
        async function getOrdersByUser()
        {
            const getToken = cookies.get('SessionId')
            if (getToken)
            {
                api.post('http://localhost:8080/api/pedidos/get-by-user', getToken)
                .then(response => {
                    setPedidos(response.data);
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

    return (
        <div>
            {
                pedidos.lenght > 0 ? (
                    <div>
                    </div>
                ) : (
                    <div>
                    </div>
                )
            }
        </div>
    );
}