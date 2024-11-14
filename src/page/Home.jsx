import React, {useEffect, useState} from 'react';
import '../assets/Home.css'
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useNotifications} from "../component/NotificationContext";
import {useAuth} from "../component/AuthContext";

const Home = () => {
    const { isAuthenticated, productIds } = useAuth();
    const { isConnected, subscribeToChannel, setNotifications } = useNotifications();
    const [latestBids, setLatestBids] = useState({});

    useEffect(() => {
        if (isAuthenticated && productIds && productIds.length > 0) {
            productIds.forEach(id => fetchProductAndLatestBid(id));
        }
    }, [isAuthenticated, productIds]);

    useEffect(() => {
        if (isConnected && productIds && productIds.length > 0) {
            productIds.forEach(id => subscribeToNotifications(id));
        }
    }, [isConnected, productIds]);

    const fetchProductAndLatestBid = async (id) => {
        const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
        try {
            await refreshAccess();
            const bidResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/bids/latest/${id}`, { headers });
            setLatestBids(prevBids => ({ ...prevBids, [id]: bidResponse.data.bidAmount }));
        } catch (error) {
            console.error('Error fetching product details or latest bid:', error);
        }
    };

    const subscribeToNotifications = (id) => {
        subscribeToChannel(`/user/queue/outbid${id}`, (message) => {
            const notification = JSON.parse(message.body);
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        });
    };

    const refreshAccess = async () => {
        const tokenPayload = localStorage.getItem('refreshToken');
        const headers = {
            refreshToken: tokenPayload
        };
        try {
            if (!isConnected) {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/unlimitedmarketplace/auth/refresh-token`, { headers });
                if (response.data && response) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                } else {
                    console.log('Error has occurred.', response.data);
                }
            } else {
                console.log('Socket is active :). No re-connect attempts will be made');
            }
        } catch (error) {
            console.log("Error in refreshing...", error);
        }
    };

    return (
        <div>
            <div>
                <div className="card text-white">
                    <img
                        src="https://images.wallpaperscraft.com/image/single/sneakers_spray_reflection_166141_1920x1080.jpg"
                        height="540px" width="200px" className="card-img" alt="..."/>
                    <div
                        className="card-img-overlay d-flex justify-content-start align-items-center flex-column align-self-end">
                        <h5 className="card-title text-bg-danger text-center rounded-2 bg-gradient fw-bold fs-1">Welcome
                            to the latest sneaker heaven!</h5>
                        <p className="card-text text-bg-light text-danger-emphasis text-center rounded-2 fw-bold fs-4 align-self-center">Buy
                            or Sell all the HOT sneaker models on even HOTTER prices</p>
                        <Link to="/login"
                              className='text-danger fw-bold fs-4 text-white text-decoration-none'>
                            <button className="btn btn-outline-danger bg-black"><i
                                className="fa fa-user-plus"/> Join Now!
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img
                                src="https://cdn.dribbble.com/users/1117956/screenshots/4532749/jordan_square_gif_042918.gif"
                                className="img-fluid rounded-start" alt="..."/>
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title-sec">Shop all the sneakers you can imagine</h5>
                                <p className="card-text">At UMX you can shop.</p>
                                <p className="card-text"><small>Last updated 3 mins ago</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
