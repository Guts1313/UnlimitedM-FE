import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../assets/ProductDetail.css';
import {useNotifications} from "./NotificationContext";
import async from "async";
import {useAuth} from "./AuthContext";

function ProductDetail() {
    const [product, setProduct] = useState({});
    const [latestBid, setLatestBid] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();
    const [bidAmount, setBidAmount] = useState('');
    const {isConnected, setNotifications, subscribeToChannel, clientRef, connectWebSocket} = useNotifications();
    const [isSubscribedToOutbid, setIsSubscribedToOutbid] = useState(false);
    const [isSubscribedToUpdates, setIsSubscribedToUpdates] = useState(false);
    const {isSubbedToUpdates} = useAuth();

    useEffect(() => {
        if (clientRef.current && !isSubscribedToUpdates) {
            subscribeToProductUpdates();
            setIsSubscribedToUpdates(true);
            fetchProductAndLatestBid();
        } else {
            console.log("Already subscribed to updates")
        }
    }, [clientRef.current]);


    const subscribeToProductUpdates = () => {
        subscribeToChannel(`/topic/product${id}`, (message) => {
            const bidData = JSON.parse(message.body);
            setLatestBid(bidData.bidAmount);
        });
    };

    const subscribeToNotifications = () => {
        try {
            if (!isSubscribedToOutbid && !isSubbedToUpdates) {
                subscribeToChannel(`/user/queue/outbid${id}`, (message) => {
                    const notification = JSON.parse(message.body);
                    setNotifications((prevNotifications) => [...prevNotifications, notification]);
                });
                setIsSubscribedToOutbid(true);
            }
        }catch (err){
            console.log('Error in subscribing to queue channel')
        }

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

        const tokenPayload = localStorage.getItem('refreshToken')
        const headers = {
            refreshToken: tokenPayload
        }
        try {
            if (!isConnected) {
                const response = await axios.post('http://localhost:8080/unlimitedmarketplace/auth/refresh-token', {headers});
                if (response.data && response) {
                    console.log('Refresh func hit')
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    console.log('Successfully setting new access token....', response.data.accessToken)
                    console.log('Successfully setting new access token....', response.data.refreshToken)
                    console.log('Successfully refreshed tokens....')

                    try {
                        setTimeout(() => {
                            connectWebSocket(response.data.accessToken);
                            console.log('Attempting to re-connect to web-socket....')
                        }, 3000)

                    } catch (err) {
                        console.log('Error in re-connection', err)
                    }


                } else {
                    console.log('Error has occurred.', response.data)
                }
            } else {
                console.log('Socket is active :). No re-connect attempts will be made')
            }

        } catch
            (error) {
            console.log("Error in refreshing...", error)
        }


    }
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
            subscribeToNotifications();  // Subscribe to notifications after placing a bid
        } else {
            console.error("WebSocket connection is not active or bid amount is empty.");
        }
    };

    return (
        <div className="product-detail-container container-fluid vh-100 m-0 p-0 d-flex flex-nowrap">
            <div className="product-info-card w-100 mx-0 d-flex">
                <div className="product-img-container">
                    <img src={product.productUrl} height="580px" alt={product.productName}/>
                </div>
                <div className="product-description mx-2 text-white bg-dark d-flex flex-column">
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
        </div>
    );
}

export default ProductDetail;


