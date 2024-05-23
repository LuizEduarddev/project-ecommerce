import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import React, {useEffect, useState} from "react";
import api from '../../../../services/api';
import Cookies from 'universal-cookie';
import { CiShoppingCart as Carrinho} from "react-icons/ci";
import {useNavigate, Link} from 'react-router-dom';

const cookie = new Cookies();
const navigate = useNavigate();
const [session, setSession] = useState();

useEffect(() => {

    async function getUser()
    {
        const session = cookie.get('SessionId');
        if (session)
        {
            checkAutority(session);
        }
        else{
            alert('É ncessário estar logado para acessar está página.');
            navigate('/login');
        }
    }

    async function g

    getUser();
}, [])

function checkAutority(token)
{
    api.post('http://localhost:8080/api/auth/send-route', token)
    .then(response => {
        const adminLogin = response.data.filter(permissions => permissions.authority === "ROLE_ADMIN");
        if (adminLogin !== null) {
            setSession(token);
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

function preventDefault(event) {
  event.preventDefault();
}



export default function Deposits() {
  return (
    <React.Fragment>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
        $3,024.00
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 15 March, 2019
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}