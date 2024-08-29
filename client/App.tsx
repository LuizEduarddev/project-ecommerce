import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./app/src/LoginPage/Login";
import Home from "./app/src/HomePage/Home";
import Cart from "./app/src/CartPage/Cart";
import Profile from "./app/src/ProfilePage/Profile";
import Menu from "./app/src/HomePage/MenuBarHome/MenuHome";
import PedidosCli from "./app/src/ProfilePage/PedidosCliente/PedidosCli";
import SearchBar from "./app/src/HomePage/BarraPesquisa/SearchBar";
import Pendencias from "./app/src/HomePage/PendenciasUsuario/Pendencias";
import ChangeView from "./app/src/Balcao/MenuMesas/ChangeView";

const Stack = createNativeStackNavigator();

export default function App()
{
  return(
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}