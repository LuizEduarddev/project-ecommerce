import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";

export default function Rotas(){
    return(
        <Router>
            <Routes> 
                <Route path="/welcome" Component={Welcome} />
            </Routes>
        </Router>
    );
}