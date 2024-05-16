// src/App.js
import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from "./component/Navbar";
import Home from "./page/Home";
import Login from "./component/Login";
import Products from "./component/Products";
import ProductDetail from "./component/ProductDetail"; // Corrected the import path here
import history from './History';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
function isTokenExpired(token) {
    const decodedToken = jwtDecode(token);  // `jwt-decode` is a small library to decode JWTs
    const currentTime = Date.now() / 1000;  // Get current time in seconds
    return decodedToken.exp < currentTime;
}

function App() {
    useEffect(() => {
        axios.interceptors.request.use(
            config => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            error => {
                console.error('Request error:', error);
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    if (isTokenExpired(localStorage.getItem('accessToken'))) {
                        originalRequest._retry = true;
                        try {
                            const refreshToken = localStorage.getItem('refreshToken');
                            if (isTokenExpired(refreshToken)) {
                                console.error('Refresh token is expired');
                                // Redirect to login or clear session
                                localStorage.clear();
                                history.push('/login');
                                return Promise.reject(error);
                            }
                            console.log('Attempting to refresh your access token...');
                            const res = await axios.post('http://localhost:8080/unlimitedmarketplace/auth/refresh-token',
                                JSON.stringify({ refreshToken }),
                                { headers: { 'Content-Type': 'application/json' } }
                            );
                            if (res.status === 200) {
                                localStorage.setItem('accessToken', res.data.accessToken);
                                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
                                return axios(originalRequest);
                            }
                        } catch (refreshError) {
                            console.error('Unable to refresh token:', refreshError);
                            // Handle token refresh errors
                            localStorage.clear();
                            history.push('/login');
                            return Promise.reject(refreshError);
                        }
                    }
                }
                return Promise.reject(error);
            }
        );

    }, [history]); // Ensure stable reference



    return (
        <Router history={history}>
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