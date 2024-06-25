import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { refreshAccessToken } from './TokenUtils';
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [productIds, setProductIds] = useState([]);
    const navigate = useNavigate();
    const [alreadySubscribedChannels, setAlreadySubscribedChannels] = useState(new Set());
    const[isSubbedToUpdates,setIsSubbedToUpdates] = useState(false);

    const isTokenValid = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp > currentTime;
        } catch (error) {
            return false;
        }
    };

    const checkAuthStatus = useCallback(async () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && isTokenValid(accessToken)) {
            setIsAuthenticated(true);
        } else if (refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(refreshToken);
                if (newAccessToken) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Token refresh failed:", error);
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const handleLogout = async () => {
        try {
            //${process.env.REACT_APP_BACKEND_URL}
            await axios.post(`http://localhost:8080/unlimitedmarketplace/auth/logout`, {
                refreshToken: localStorage.getItem('refreshToken')
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            setIsAuthenticated(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, alreadySubscribedChannels,productIds, setAlreadySubscribedChannels,isSubbedToUpdates,setIsSubbedToUpdates, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
