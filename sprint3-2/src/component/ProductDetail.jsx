import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../assets/ProductDetail.css';
import {useNotifications} from "./NotificationContext";
import async from "async";
import {useAuth} from "./AuthContext";
import {refreshAccessToken} from './TokenUtils';
import Lottie from "lottie-react";
import auctionwinner from '../assets/auctionwinner.json'

function ProductDetail() {
    const [product, setProduct] = useState({});
    const [latestBid, setLatestBid] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();
    const [bidAmount, setBidAmount] = useState('');
    const {
        isConnected,
        setNotifications,
        subscribeToChannel,
        clientRef,
        connectWebSocket,
        winnerNotification,
        setWinnerNotification
    } = useNotifications();
    const {isSubbedToUpdates, setIsSubbedToUpdates} = useAuth();
    const [showWinnerAnimation, setShowWinnerAnimation] = useState(false);

    useEffect(() => {
        if (isConnected) {
            fetchProductAndLatestBid();
            subscribeToProductUpdates();
        }
    }, [isConnected, isSubbedToUpdates]);

    const subscribeToAllChannels = () => {
        setIsSubbedToUpdates(true);
        setTimeout(() => {
            subscribeToNotifications()
            subscribeToWinnersQueue()
        }, 3500);
    };

    const subscribeToProductUpdates = () => {
        subscribeToChannel(`/topic/product${id}`, (message) => {
            const bidData = JSON.parse(message.body);
            setLatestBid(bidData.bidAmount);
            localStorage.setItem(`subscribedToProductUpdates${id}`, 'true');
        });
    };
    const subscribeToWinnersQueue = () => {
        subscribeToChannel(`/user/queue/winner${id}`, (message) => {
            const notification = JSON.parse(message.body);
            setWinnerNotification(notification);
            setTimeout(() => {
                setShowWinnerAnimation(true);
                setTimeout(() => {
                    setShowWinnerAnimation(false);
                }, 5000); // Hide the animation after 5 seconds
            }, 3000); // Show the animation after 3 seconds
        });
    };


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: auctionwinner,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const subscribeToNotifications = () => {
        subscribeToChannel(`/user/queue/outbid${id}`, (message) => {
            const notification = JSON.parse(message.body);
            setNotifications((prevNotifications) => {
                const notificationExists = prevNotifications.some(
                    (notif) => notif === notification
                );
                if (!notificationExists) {
                    return [...prevNotifications, notification];
                }
                return prevNotifications;
            });
        });
    };

    const fetchProductAndLatestBid = async () => {
        await refreshAccess();
        const headers = {Authorization: `Bearer ${localStorage.getItem('accessToken')}`};
        try {
            const productResponse = await axios.get(`http://localhost:8080/unlimitedmarketplace/products/${id}`, {headers});
            setProduct(productResponse.data.productEntity);
            const bidResponse = await axios.get(`http://localhost:8080/bids/latest/${id}`, {headers});
            setLatestBid(bidResponse.data.bidAmount);
        } catch (error) {
            console.error('Error fetching product details or latest bid:', error);
            navigate('/login');
        }
    };

    const refreshAccess = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken && !isSubbedToUpdates) {
            subscribeToAllChannels();
        }
    };

    const handleBid = async (e) => {
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
            await fetchProductAndLatestBid(); // Fetch the latest bid after placing a bid
        } else {
            console.error("WebSocket connection is not active or bid amount is empty.");
        }
    };


    return (
        <div className="product-detail-container container-fluid vh-100 m-0 p-0 d-flex flex-nowrap">
            <div className="product-info-card w-100 mx-0 d-flex">
                <div className="product-img-container">
                    <img className={"container-fluid justify-content-center"} src={product.productUrl} height="420px"
                         style={{borderRadius: 15}} alt={product.productName}/>
                </div>
                <div className="product-description mx-2 text-white bg-dark d-flex flex-column" style={{height: 430}}>
                    <div
                        className="product-description-text d-flex flex-column justify-content-center align-items-center mx-4">
                        <h1>{product.productName}</h1>
                    </div>
                    <div className={"container-fluid d-flex text-danger justify-content-center w-100"}>
                        {(latestBid && latestBid > 0) ? (
                            <span className="fw-lighter fs-3 fw-medium text-white">Highest Bid: <span
                                className={"text-success"}>${latestBid}</span><i
                                className={"fa fa-euro px-2 text-warning"}></i></span>
                        ) : (
                            <h2>Price: ${product.productPrice}</h2>
                        )}
                    </div>
                    <form onSubmit={handleBid}
                          className="product-description-secondary d-flex justify-content-evenly align-items-start my-2">
                        <input type="number" placeholder="Your bid" value={bidAmount}
                               onChange={e => setBidAmount(e.target.value)} required/>
                    </form>
                    <div
                        className="details-buttons container-fluid d-flex justify-content-around text-decoration-none w-100 bg-black rounded-2">
                        <button type="submit"
                                className="btn bid-now text-white my-3 w-50 shadow-none text-center fw-bold"
                                onClick={handleBid}>
                            <i className="bid-text fa fa-adn text-warning"/><span className="span-buy">Bid</span>
                        </button>
                        <button
                            className="btn buy-now text-white d-inline-flex w-50 border-0 m-5 shadow-none my-3 fw-bold">
                            <i className="buy-text fa fa-cart-arrow-down text-success"/><span
                            className="span-buy border-0 text-decoration-none">Buy now</span>
                        </button>
                    </div>
                </div>
            </div>
            {showWinnerAnimation && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '300px',
                    height: '300px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: '9999'
                }}>
                    <Lottie animationData={auctionwinner} loop={false} />
                </div>
            )}
        </div>
    );
}

export default ProductDetail;
