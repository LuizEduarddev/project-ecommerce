import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginStart from "./pages/LoginPage/LoginStart";
import ClientPage from "./pages/ClienteSide/ClientPage";

export default function Rotas(){
    return(
        <Router>
            <Routes> 
                <Route path="/login" Component={LoginStart} />
                <Route path="/home" Component={ClientPage} />
            </Routes>
        </Router>
    );
}