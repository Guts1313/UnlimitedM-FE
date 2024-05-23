import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import axios from "axios";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);
const isTokenValid = (token) => {
    return true;
};
const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post('http://localhost:8080/unlimitedmarketplace/auth/refresh-token', { refreshToken });
        if (response.status === 200) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken',response.data.refreshToken)
            return response.data.accessToken;
        }
    } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
    }
};
export const NotificationProvider = ({children}) => {
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [subscribedChannels, setSubscribedChannels] = useState(new Set());
    const clientRef = useRef(null);

    const connectWebSocket = useCallback(async (token) => {
        if (!isTokenValid(token)) {
            console.log("Attempting to refresh token before connecting...");
            token = await refreshAccessToken(localStorage.getItem('refreshToken'));
        }
        const socket = new SockJS(`http://localhost:8080/websocket-sockjs-stomp?access_token=${encodeURIComponent(token)}`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket server');
                setIsConnected(true);
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket server');
                setIsConnected(false);
            },
            onStompError: (error) => {
                console.error('WebSocket Error:', error.headers['message']);
                reconnectWebSocket().catch(console.error);
            },
        });

        stompClient.activate();
        clientRef.current = stompClient;
    }, []);

    const reconnectWebSocket = useCallback(async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(refreshToken);
                await connectWebSocket(newAccessToken);
            } catch (error) {
                console.error("Reconnection failed:", error);
            }
        } else {
            console.log("No refresh token available.");
        }
    }, [connectWebSocket]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token && isTokenValid(token)) {
            connectWebSocket(token).catch(console.error);
        } else {
            console.log("Token is invalid or not present. WebSocket connection will not be established.");
        }
    }, [connectWebSocket]);




    const subscribeToChannel = (destination, callback) => {
        try {
            if (clientRef.current && isConnected && !subscribedChannels.has(destination)) {
                clientRef.current.subscribe(destination, callback);
                setSubscribedChannels(prev => new Set(prev).add(destination));
            }
        } catch (error) {
            console.log("Subscription failed", error.message)
            reconnectWebSocket().catch(console.error);
        }


    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            clientRef,
            setNotifications,
            isConnected,
            connectWebSocket,
            reconnectWebSocket,
            subscribeToChannel
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
// const NotificationContext = createContext();
//
// export const useNotifications = () => useContext(NotificationContext);
//
// const isTokenValid = (token) => {
//     if (!token) return false;
//
//     try {
//         const { exp } = jwtDecode(token);
//         return (exp * 1000) > new Date().getTime();
//     } catch (error) {
//         console.error("Failed to decode token:", error);
//         return false;
//     }
// };
//
// export const NotificationProvider = ({ children }) => {
//     const [notifications, setNotifications] = useState([]);
//     const [isConnected, setIsConnected] = useState(false);
//     const clientRef = useRef(null);
//
//     const connectWebSocket = useCallback((token) => {
//         if (!isTokenValid(token)) {
//             console.log("Token is invalid or not present. WebSocket connection will not be established.");
//             return;
//         }
//
//         const socket = new SockJS(`http://localhost:8080/websocket-sockjs-stomp?access_token=${encodeURIComponent(token)}`);
//         console.log("Token in websocket header:", token)
//         const stompClient = new Client({
//             webSocketFactory: () => socket,
//             onConnect: () => {
//                 console.log('Connected to WebSocket server');
//                 setIsConnected(true);
//             },
//             onDisconnect: () => {
//                 console.log('Disconnected from WebSocket server');
//                 setIsConnected(false);
//             },
//             onStompError: (error) => console.error('WebSocket Error:', error.headers['message']),
//         });
//
//         stompClient.activate();
//         clientRef.current = stompClient;
//     }, []);
//
//     useEffect(() => {
//         const token = localStorage.getItem('accessToken');
//         console.log("Token in websocket useEffect:", token)
//
//         if (token && isTokenValid(token)) {
//             connectWebSocket(token);
//         }
//     }, [connectWebSocket]);
//
//     return (
//         <NotificationContext.Provider value={{ notifications,isTokenValid ,isConnected, connectWebSocket }}>
//             {children}
//         </NotificationContext.Provider>
//     );
// };
