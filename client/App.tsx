import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/src/LoginPage/Login";
import Home from "./app/src/AplicativoCliente/HomePage/Home";
import Cart from "./app/src/AplicativoCliente/CartPage/Cart";
import Profile from "./app/src/AplicativoCliente/ProfilePage/Profile";
import Menu from "./app/src/AplicativoCliente/HomePage/MenuBarHome/MenuHome";
import PedidosCli from "./app/src/AplicativoCliente/ProfilePage/PedidosCliente/PedidosCli";
import SearchBar from "./app/src/AplicativoCliente/HomePage/BarraPesquisa/SearchBar";
import Pendencias from "./app/src/AplicativoCliente/HomePage/PendenciasUsuario/Pendencias";
import ChangeView from "./app/src/Balcao/ChangeView";
import MenuGarcom from "./app/src/Garcom/MenuGarcom";
import MenuCozinha from "./app/src/Cozinha/MenuCozinha";
import MenuBalcaoDePreparo from "./app/src/BalcaoDePreparo/MenuBalcaoDePreparo";
import { ToastProvider } from 'react-native-toast-notifications'

const Stack = createNativeStackNavigator();

export default function App()
{
  return(
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name="MenuProfile" component={Menu} options={{ headerShown: false }} />
          <Stack.Screen name="PedidosCliente" component={PedidosCli} options={{ headerShown: false }} />
          <Stack.Screen name="barra_de_pesquisa" component={SearchBar} options={{ headerShown: true }} />
          <Stack.Screen name="Pendencias" component={Pendencias} options={{ headerShown: false }} />
          <Stack.Screen name="ChangeView" component={ChangeView} options={{ headerShown: false }} />
          <Stack.Screen name="MenuGarcom" component={MenuGarcom} options={{ headerShown: false }} />
          <Stack.Screen name="MenuCozinha" component={MenuCozinha} options={{ headerShown: false }} />
          <Stack.Screen name="MenuBalcaoDePreparo" component={MenuBalcaoDePreparo} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}