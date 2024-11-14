import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import axios from "axios";
import React, {createContext, useContext, useEffect, useRef, useState, useCallback} from 'react';
import {useAuth} from './AuthContext';
import { refreshAccessToken } from './TokenUtils';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const isTokenValid = (token) => {
    return true;
};

export const NotificationProvider = ({ children }) => {
    const { queueChannels } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [winnerNotification, setWinnerNotification] = useState();

    const [isConnected, setIsConnected] = useState(false);
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
                // Trigger subscriptions here
                if (queueChannels && queueChannels.length > 0) {
                    queueChannels.forEach(channel => subscribeToChannel(channel, handleQueueMessage));
                } else {
                    console.log('No queue channels to subscribe to.');
                }
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
    }, [queueChannels]);


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
            if (clientRef.current && isConnected) {
                clientRef.current.subscribe(destination, callback);
            }
        } catch (error) {
            console.log("Subscription failed", error.message);
            reconnectWebSocket().catch(console.error);
        }
    };

    const handleQueueMessage = (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prevNotifications) => {
            // Check if the notification already exists in the state
            const notificationExists = prevNotifications.some(
                (notif) => notif === notification
            );
            // Only add the notification if it does not already exist
            if (!notificationExists) {
                return [...prevNotifications, notification];
            }
            return prevNotifications;
        });
    };

    const clearNotifications = () => {
        setNotifications([]);
    };


    return (
        <NotificationContext.Provider value={{
            notifications,
            winnerNotification,setWinnerNotification,
            clientRef,
            setNotifications,
            isConnected,
            connectWebSocket,
            refreshAccessToken,
            reconnectWebSocket,
            clearNotifications,
            subscribeToChannel
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
