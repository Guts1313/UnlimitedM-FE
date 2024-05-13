// src/App.js
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from "./component/Navbar";
import Home from "./page/Home";
import Login from "./component/Login";
import Products from "./component/Products";
import ProductDetail from "./component/ProductDetail"; // Corrected the import path here

function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/products" element={<Products/>}/>
                <Route path="/product/:id" element={<ProductDetail/>}/>

            </Routes>
        </Router>
    );
}

export default App;