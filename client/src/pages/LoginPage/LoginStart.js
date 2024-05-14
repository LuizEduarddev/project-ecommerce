import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import imageMA from './templates/maimage.jpg'
import api from '../../services/api'
import Cookies from 'universal-cookie';
import { Alert } from '@mui/material';
import {useNavigate} from 'react-router-dom';


const cookies = new Cookies();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © Maria Amelia Doces 2016'}
      <Link color="inherit" href="https://mui.com/">
      </Link>{' '}
      {'.'}
    </Typography>
  );
}

function sendRoute(authority, navigate)
{
  
  if (authority.find(authoritys => authoritys.authority === "ROLE_ADMIN"))
  {
    navigate('/dashboard');
  }
  else if (authority.find(authoritys => authoritys.authority === "ROLE_USER"))
  {
    navigate('/home');
  }
  else if(authority.find(authoritys => authoritys.authority === "ROLE_COZINHA-CAFE"))
  {
    navigate('/kitchen');
  }
}

async function getAuthority(token, navigate)
{
  api.post('http://localhost:8080/api/auth/send-route', token)
  .then(response => {
      cookies.set('SessionId', token);
      sendRoute(response.data, navigate)
    })
  .catch(error => {
    console.log(error.response.data.message);
  })
}

async function tryLogin(data, navigate)
{
  console.log(data);
  api.post('http://localhost:8080/api/auth/login', data)
  .then(response => {
    getAuthority(response.data.token, navigate);
    /*
    navigate("/home");
    */
  })
  .catch(error => {
    const errorMessage = error.response.data.message;
    alert(errorMessage);
  })
}

const defaultTheme = createTheme();

export default function LoginStart() {
  const navigate = useNavigate ();
  const handleSubmit = (event) => {
    event.preventDefault();
    const itens = new FormData(event.currentTarget);
    const data = {
      "login": itens.get('email'),
      "password": itens.get('password')
    }
    tryLogin(data, navigate)
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${imageMA})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Entrar
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Nome de usuario"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Lembrar de mim"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Acessar
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Esqueceu a senha?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Ainda não tem uma conta? Registre-se"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}