import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginStart from "./pages/LoginPage/LoginStart";
import ClientPage from "./pages/Home/ClienteSide/ClientPage";
import CartPage from "./pages/Cart/CartPage";
import ClientOrder from "./pages/Home/ClienteSide/Orders/ClientOrder";

export default function Rotas(){
    return(
        <Router>
            <Routes> 
                <Route path="/login" Component={LoginStart} />
                <Route path="/home" Component={ClientPage} />
                <Route path="/cart" Component={CartPage} />
                <Route path="/pedidos" Component={ClientOrder} />
            </Routes>
        </Router>
    );
}