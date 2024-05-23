import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from "./component/Navbar";
import Home from "./page/Home";
import Login from "./component/Login";
import Products from "./component/Products";
import ProductDetail from "./component/ProductDetail"; // Corrected the import path here
import history from './History';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import AddListing from "./component/AddListing";
import UserProfile from "./component/UserProfile";
import MyBids from "./component/MyBids";
import SecurityPage from "./component/SecurityPage";



function App() {
    function isTokenExpired(token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    }

    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });

        failedQueue = [];
    };

    axios.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                if (isTokenExpired(localStorage.getItem('accessToken'))) {
                    originalRequest._retry = true;
                    if (!isRefreshing) {
                        isRefreshing = true;
                        const refreshToken = localStorage.getItem('refreshToken');
                        try {
                            const res = await axios.post('http://localhost:8080/unlimitedmarketplace/auth/refresh-token', { refreshToken });
                            if (res.status === 200) {
                                localStorage.setItem('accessToken', res.data.accessToken);
                                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
                                isRefreshing = false;
                                processQueue(null, res.data.accessToken);
                                console.log("Refresh success...happy shopping")
                                return axios(originalRequest);
                            }
                        } catch (refreshError) {
                            processQueue(refreshError, null);
                            isRefreshing = false;
                            localStorage.clear();
                            history.push('/login');
                            return Promise.reject(refreshError);
                        }
                    }
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return axios(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }
            }
            return Promise.reject(error);
        }
    );



    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/products" element={<Products/>}/>
                <Route path="/product/:id" element={<ProductDetail/>}/>
                <Route path="/listing" element={<AddListing/>}/>
                <Route path="/profile" element={<UserProfile/>}/>
                <Route path="/my-bids" element={<MyBids/>}/> {/* Add this line */}
                <Route path="/user-security" element={<SecurityPage/>}/> {/* Add this line */}

            </Routes>
        </Router>
    );
}


export default App;

