import React, { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function WebSocketComponent() {
    useEffect(() => {
        // Connect to the WebSocket server
        const socket = new SockJS('http://localhost:8080/websocket-sockjs-stomp');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected");

                client.subscribe('/topic/bids', (message) => {
                    // Handle incoming messages
                    console.log(JSON.parse(message.body));
                });
            },
            onDisconnect: () => {
                console.log("Disconnected");
            }
        });

        client.activate();

        return () => client.deactivate();
    }, []);

    return (
        <div>
            <h1>WebSocket Client</h1>
        </div>
    );
}

export default WebSocketComponent;
