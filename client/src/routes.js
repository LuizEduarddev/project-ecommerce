import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginStart from "./pages/LoginPage/LoginStart";
import ClientPage from "./pages/Home/ClienteSide/Home/ClientPage";
import CartPage from "./pages/Home/ClienteSide/Cart/CartPage";
import ClientOrder from "./pages/Home/ClienteSide/Orders/ClientOrder";
import ItensOrder from "./pages/Home/ClienteSide/Orders/Itens/ItensOrder";
import KitchenPage from "./pages/Home/KitchenSide/KitchenHome/KitchenPage";
import DashboardPage from "./pages/Home/AdminSide/Dashboard/DashboardPage";
import KitchenOrderIndex from "./pages/Home/KitchenSide/KitchenOrder/KitchenOrderIndex";
import CustomerHome from "./pages/CustomerSide/Home/CustomerHome";
import CustomerOrder from "./pages/CustomerSide/Order/CustomerOrder";
import ClienteMesa from "./pages/Home/ClienteSide/ClienteMesa/ClienteMesa";

export default function Rotas(){
    return(
        <Router>
            <Routes> 
                <Route path="/login" Component={LoginStart} />
                <Route path="/login/:id?" Component={LoginStart} />
                <Route path="/home" Component={ClientPage} />
                <Route path="/cart" Component={CartPage} />
                <Route path="/pedidos" Component={ClientOrder} />
                <Route path="/pedidos/itens" Component={ItensOrder} />
                <Route path="/kitchen" Component={KitchenPage} />
                <Route path="/kitchen/pedido" Component={KitchenOrderIndex} />
                <Route path="/dashboard" Component={DashboardPage} />
                <Route path="/customer/home" Component={CustomerHome} />
                <Route path="/cliente/mesa" Component={ClienteMesa} />
            </Routes>
        </Router>
    );
}