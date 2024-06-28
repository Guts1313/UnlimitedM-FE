// import React, { useState, useEffect } from 'react';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
//
// const BidComponent = ({ productId, userId }) => {
//     const [bidAmount, setBidAmount] = useState('');
//     const [lastBid, setLastBid] = useState('');
//     const [client, setClient] = useState(null);
//
//     useEffect(() => {
//         const connectWebSocket = () => {
//             // Creating a SockJS client and wrapping it with STOMP
//             const socket = new SockJS('http://localhost:8080/websocket-sockjs-stomp');
//             const stompClient = new Client({
//                 webSocketFactory: () => socket,
//                 onConnect: () => {
//                     console.log('Connected to WebSocket');
//
//                     // Subscribe to responses
//                     stompClient.subscribe('/queue/responses', (message) => {
//                         const response = JSON.parse(message.body);
//                         setLastBid(`Last bid: ${response.bidAmount}`);
//                         console.log('Bid response received:', response);
//                     });
//
//                     // Subscribe to errors
//                     stompClient.subscribe('/queue/errors', (message) => {
//                         console.error('Error:', message.body);
//                     });
//                 },
//                 onStompError: (frame) => {
//                     console.error('Broker reported error:', frame.headers['message']);
//                     console.error('Additional details:', frame.body);
//                 },
//                 onDisconnect: () => {
//                     console.log('Disconnected from WebSocket');
//                 }
//             });
//
//             stompClient.activate();
//             setClient(stompClient);
//         };
//
//         connectWebSocket();
//
//         return () => {
//             if (client) {
//                 client.deactivate();
//             }
//         };
//     }, []);
//
//     const handleBid = (e) => {
//         e.preventDefault();
//         if (client && client.connected) {
//             const bid = {
//                 productId,
//                 userId,
//                 bidAmount: parseFloat(bidAmount)
//             };
//
//             // Sending the bid to the server
//             client.publish({
//                 destination: '/app/request',
//                 body: JSON.stringify(bid)
//             });
//         } else {
//             console.error("WebSocket connection is not active.");
//         }
//     };
//
//     return (
//         <div>
//             <h1>Bid on Product</h1>
//             <form onSubmit={handleBid}>
//                 <input
//                     type="number"
//                     value={bidAmount}
//                     onChange={(e) => setBidAmount(e.target.value)}
//                     placeholder="Enter your bid"
//                 />
//                 <button type="submit">Place Bid</button>
//             </form>
//             {lastBid && <p>{lastBid}</p>}
//         </div>
//     );
// };
//
// export default BidComponent;
