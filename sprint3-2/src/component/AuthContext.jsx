import React, { createContext, useState, useContext } from 'react';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [productIds, setProductIds] = useState([]);

    const setAlreadySubscribedChannels = (channelsSet) => {
        const channels = Array.from(channelsSet);
        const productChannels = channels.filter(channel => channel.startsWith('/topic/product'));
        const ids = productChannels.map(channel => channel.replace('/topic/product', ''));
        setProductIds(ids);
        localStorage.setItem('subbedChannels', JSON.stringify(channels));
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, productIds, setAlreadySubscribedChannels }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
