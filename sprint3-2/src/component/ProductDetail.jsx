import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../assets/ProductDetail.css';

function ProductDetail() {
    const [product, setProduct] = useState({});
    const [latestBid, setLatestBid] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const clientRef = useRef(null);
    const [bidAmount, setBidAmount] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        connectWebSocket(token);
    }, [id]);

    useEffect(() => {
        if (clientRef.current) {
            fetchProductAndLatestBid();
        }
    }, [clientRef.current]);

    const connectWebSocket = (token) => {
        const socket = new SockJS(`http://localhost:8080/websocket-sockjs-stomp?access_token=${encodeURIComponent(token)}`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket server');
                subscribeToProductUpdates();
                subscribeToNotifications();  // Subscribe to notifications after placing a bid

            },
            onDisconnect: () => console.log('Disconnected from WebSocket server'),
            onStompError: (error) => console.error('WebSocket Error:', error.headers['message']),
        });

        stompClient.activate();
        clientRef.current = stompClient;
    };

    const subscribeToProductUpdates = () => {
        clientRef.current.subscribe(`/topic/product${id}`, (message) => {
            const bidData = JSON.parse(message.body);
            setLatestBid(bidData.bidAmount);
        });
    };

    const subscribeToNotifications = () => {
        // Make sure to subscribe to a user-specific endpoint
        clientRef.current.subscribe(`/user/queue/outbid${id}`, (message) => {
            const notification = JSON.parse(message.body);
            window.alert(`You have been outbid with ${notification}`);
        });
    };



    const fetchProductAndLatestBid = async () => {
        const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
        try {
            const productResponse = await axios.get(`http://localhost:8080/unlimitedmarketplace/products/${id}`, { headers });
            setProduct(productResponse.data.productEntity);
            const bidResponse = await axios.get(`http://localhost:8080/bids/latest/${id}`, { headers });
            setLatestBid(bidResponse.data.bidAmount);
        } catch (error) {
            console.error('Error fetching product details or latest bid:', error);
            navigate('/login');
        }
    };

    const handleBid = (e) => {
        e.preventDefault();
        if (clientRef.current && clientRef.current.connected && bidAmount) {
            const bidRequest = {
                productId: id,
                bidAmount: parseFloat(bidAmount),
                userId: localStorage.getItem('userId')
            };
            clientRef.current.publish({
                destination: '/app/placeBid',
                body: JSON.stringify(bidRequest),
                skipContentLengthHeader: true
            });
        } else {
            console.error("WebSocket connection is not active or bid amount is empty.");
        }
    };




    return (
        <div className="product-detail-container container-fluid vh-100 m-0 p-0 d-flex flex-nowrap">
            <div className="product-info-card h-50 w-100 mx-2 d-flex">
                <img src={product.productUrl} height="580px" alt={product.productName} />
                <div className="product-description my-4 mx-2 text-white bg-dark d-flex flex-column">
                    <div className="product-description-text d-flex flex-column justify-content-center align-items-center mx-4">
                        <h1>{product.productName}</h1>
                        {latestBid && (
                            <h2>Current Bid: ${latestBid}</h2>
                        )}
                    </div>
                    <form onSubmit={handleBid} className="product-description-secondary d-flex justify-content-evenly align-items-start my-2">
                        <input type="number" placeholder="Your bid" value={bidAmount} onChange={e => setBidAmount(e.target.value)} required />
                        <button type="submit" className="btn bid btn-outline-light">
                            <i className="fa fa-adn text-warning m-0"/> Bid
                        </button>
                    </form>
                    <button className="btn buy btn-outline-light">
                        <i className="fa fa-cart-plus text-danger m-1"/> Buy now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
