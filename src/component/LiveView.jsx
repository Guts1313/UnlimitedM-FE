import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

function LiveView() {
    const [product, setProduct] = useState({});
    const [latestBid, setLatestBid] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const { isConnected, subscribeToChannel, connectWebSocket, clientRef } = useNotifications();
    const { isAuthenticated } = useAuth();
    const userId = localStorage.getItem('userId');
    const [showSoldSign, setSoldSign] = useState(false);


    useEffect(() => {
        if (isAuthenticated) {
            fetchProductAndVerifyOwner();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isConnected) {
            subscribeToProductUpdates();
        }
    }, [isConnected]);

    const fetchProductAndVerifyOwner = async () => {
        const token = localStorage.getItem('accessToken');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const response = await axios.get(`http://localhost:8080/unlimitedmarketplace/products/${id}`, { headers });
            const productData = response.data.productEntity;
            setProduct(productData);
            fetchLatestBid();
            connectWebSocket(token);
        } catch (error) {
            console.error('Error fetching product details:', error);
            navigate('/login');
        }
    };

    const fetchLatestBid = async () => {
        const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
        try {
            const response = await axios.get(`http://localhost:8080/bids/latest/${id}`, { headers });
            setLatestBid(response.data.bidAmount);
        } catch (error) {
            console.error('Error fetching latest bid:', error);
        }
    };

    const subscribeToProductUpdates = () => {
        subscribeToChannel(`/topic/product${id}`, (message) => {
            const bidData = JSON.parse(message.body);
            setLatestBid(bidData.bidAmount);
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                { ...bidData, message: `User ${bidData.userId} placed a bid of ${bidData.bidAmount} at ${new Date().toLocaleString()}` }
            ]);
        });
    };

    const acceptBid = async (bidAmount,userId) => {
        setSoldSign(true);
        const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
        console.log(notifications);
        try {
            const payload = {
                bidAmount: bidAmount,
                userId: userId
            };
            await clientRef.current.publish({
                destination: '/app/acceptBid',
                body: JSON.stringify(payload),
                skipContentLengthHeader: true
            });
        } catch (error) {
            console.error('Error accepting bid:', error);
        }
    };



    return (
        <div className="product-detail-container container-fluid vh-100 m-0 p-0 d-flex flex-nowrap">
            <div className="product-info-card w-100 mx-0 d-flex flex-column align-self-start">
                <div className="product-description-text d-flex text-white flex-column justify-content-center align-items-center mx-4">
                    <h1>{product.productName}</h1>
                </div>
                <div className="product-img-container d-flex justify-content-center rounded-4">
                    <img src={product.productUrl} height="340px" width="420" style={{ borderRadius: 50, marginBottom: 15 }} alt={product.productName} />
                </div>
                <div className="product-description mx-2 text-white bg-dark d-flex justify-content-center align-self-center flex-column h-100">
                    <div className="container-fluid text-danger justify-content-center text-center">
                        {latestBid ? (
                            <span className="fw-lighter fs-3 fw-medium text-white">Highest Bid: <span className="text-success">${latestBid}</span><i className="fa fa-euro px-2 text-warning"></i></span>
                        ) : (
                            <h2>Price: ${product.productPrice}</h2>
                        )}
                    </div>
                </div>
                <div className="notification-section container-fluid bg-black rounded-2 my-3 p-3 mh-100">
                    <h4 className="container-fluid text-danger text-bg-dark w-50 rounded-4 py-1 fw-bold text-center"><i className={"fa fa-bell mt-2"}></i> Live Updates</h4>
                    <div className="notifications d-flex flex-column text-center">
                        {notifications.map((notification, index) => (
                            <div key={index} className="item bg-transparent border-bottom h-100 border-danger w-100 align-self-center d-flex text-white p-2 mt-5 rounded mb-5">
                                <i className={"fa fa-money py-1 text-success px-3"}></i>{notification.message}
                                <div className={"d-flex mb-2 align-self-baseline align-items-baseline align-content-center justify-content-start h-100 w-25"} style={{ marginTop: -4 }}>
                                    <button className={"btn btn-outline-danger mb-2 mx-3 d-flex align-self-start"} onClick={() => acceptBid(notification.bidAmount,notification.userId)}>
                                        <i className={"fa fa-thumbs-up text-success"}><span className={"text-white fw-bold px-1"}>Accept offer</span></i>
                                    </button>
                                    <button className={"btn btn-outline-danger mb-2 mx-2 d-flex align-self-start"}>
                                        <i className={"fa fa-thumbs-down text-danger"}><span className={"text-white fw-bold px-1"}>Decline offer</span></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {showSoldSign && (
                    <div className={"sold container-fluid w-100 h-100"} style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '700px',
                        height: '700px',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: '9999',
                        backgroundImage: "url('https://fmlsstore.com/cdn/shop/products/1ce432a22cf586cef5ebe26ed9982411e01304c1.jpg?v=1476905941')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LiveView;

