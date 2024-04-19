import Lottie from "lottie-react";
import testanimation from "./assets/testanimation.json";
import loginsuccessanimation from './assets/testanimation.json';
import styles from "../src/styling/index.module.css"
import axios from 'axios';

import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Home from './pages/Home';  // Assuming you have a Home component
import Login from './pages/Login';

function App() {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
        </Router>
    );


}

export default App;
