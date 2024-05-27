import React, {useEffect, useState} from 'react';
import Lottie from "lottie-react";
import testanimation from '../assets/testanimation.json';
import loginsuccessanimation from '../assets/loginsuccessanimation.json';
import axios from 'axios'; // First, ensure Axios is imported at the top of your file
import {useNavigate, useParams} from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {useNotifications} from './NotificationContext';
import {useAuth} from './AuthContext';
import data from "bootstrap/js/src/dom/data";
import {jwtDecode} from 'jwt-decode';

// eslint-disable-next-line react-hooks/rules-of-hooks
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const navigate = useNavigate();
    const {connectWebSocket, subscribeToChannel, setNotifications} = useNotifications();
    const [isRegistered, setIsRegistered] = useState(false);
    const [showLoginSuccessAnimation, setShowLoginSuccessAnimation] = useState(false);
    const [showRegistrationSuccessAnimation, setShowRegistrationSuccessAnimation] = useState(false);
    const { setAlreadySubscribedChannels, setIsAuthenticated, alreadySubscribedChannels, setIsSubbedToUpdates } = useAuth();


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await onLogin(username, password);
            setShowLoginSuccessAnimation(true);
            setTimeout(() => {
                setShowLoginSuccessAnimation(false)
            }, 3000)
            setTimeout(() => {
                navigate('/')
            }, 3000);

            // setTimeout(() => setShowLoginSuccessAnimation(false), 5000);
        } catch (error) {
            setError('Failed to login: ' + (error.response?.data?.message || error.message));
            setShowLoginSuccessAnimation(false);

        }
    };


    const extractQueueIds = (channels) => {
        const queueRegex = /\/queue\/outbid(\d+)/;
        const extractedIds = new Set();

        channels.forEach(channel => {
            const match = channel.match(queueRegex);
            if (match && match[1]) {
                extractedIds.add(match[1]);
            }
        });

        return extractedIds;
    };

    const onLogin = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/unlimitedmarketplace/auth/login', {
                username,
                passwordHash: password
            });

            if (response && response.data) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('userId', response.data.userId);
                const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };

                const getSubscribedChannelsResponse = await axios.get(`http://localhost:8080/api/subscriptions/user/${response.data.userId}`, { headers });

                let channelsSet = new Set();
                if (getSubscribedChannelsResponse.data) {
                    const channels = getSubscribedChannelsResponse.data;
                    channelsSet = extractQueueIds(channels);
                    console.log('Channels received from server to resub to:', channelsSet);
                }

                connectWebSocket(response.data.accessToken);

                setTimeout(async () => {
                    await subscribeToNotifications(channelsSet);
                }, 5000);

                // Decode the token to get user roles
                const decodedToken = jwtDecode(response.data.accessToken);
                const roles = decodedToken.roles || [];
                const isAdmin = roles.includes('ROLE_ADMIN');

                setIsAuthenticated(true);

                if (isAdmin) {
                    setTimeout(() => {
                        navigate('/admin-panel');
                    }, 5500);
                } else {
                    console.log('Regular user login');
                }
            } else {
                throw new Error('Invalid server response');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Failed to login: ' + (error.response?.data?.message || error.message));
        }
    };

    const subscribeToNotifications = async (channelsSet) => {
        const alreadySubscribedChannelsCopy = new Set(alreadySubscribedChannels);
        channelsSet.forEach((id) => {
            const channel = `/user/queue/outbid${id}`;
            if (!alreadySubscribedChannelsCopy.has(channel)) {
                subscribeToChannel(channel, (message) => {
                    const notification = JSON.parse(message.body);
                    console.log('Notification received from server:', notification);
                    setNotifications((prevNotifications) => [...prevNotifications, notification]);
                });
                alreadySubscribedChannelsCopy.add(channel);
            }
        });
        setAlreadySubscribedChannels(alreadySubscribedChannelsCopy);
        setIsSubbedToUpdates(true);
    };



    // const onLogin = async (username, password) => {
    //     try {
    //         const response = await axios.post('http://localhost:8080/unlimitedmarketplace/auth/login', {
    //             username,
    //             passwordHash: password
    //         });
    //         if (response && response.data) {
    //             localStorage.setItem('accessToken', response.data.accessToken);
    //             localStorage.setItem('refreshToken', response.data.refreshToken);
    //             localStorage.setItem('userId', response.data.userId);
    //             const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
    //
    //             const getSubscribedChannelsResponse = await axios.get(`http://localhost:8080/api/subscriptions/user/${response.data.userId}`, { headers });
    //             console.log('sub response data:',data)
    //
    //             if (getSubscribedChannelsResponse.data) {
    //                 console.log('sub response data:',data)
    //                 const channels = getSubscribedChannelsResponse.data;
    //                 const channelsSet = new Set(channels);
    //                 setAlreadySubscribedChannels(channelsSet);
    //                 connectWebSocket(response.data.accessToken);
    //             } else {
    //                 connectWebSocket(response.data.accessToken);
    //             }
    //             setIsAuthenticated(true);
    //             setTimeout(()=>
    //             {
    //                 navigate('/')
    //             },3000)
    //         } else {
    //             throw new Error('Invalid server response');
    //         }
    //     } catch (error) {
    //         console.error('Login failed:', error);
    //         setError('Failed to login: ' + (error.response?.data?.message || error.message));
    //     }
    // };


    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/unlimitedmarketplace', {
                userName: name,
                email: email,
                passwordHash: signupPassword,
                role: "USER"
            });

            console.log("Respnse:", response.data)
            if (response.status === 201) {
                setShowRegistrationSuccessAnimation(true);
                setTimeout(() => setShowRegistrationSuccessAnimation(false), 5000);
            } else {
                const errorData = await response.json();
                setError('Failed to register: ' + errorData.message);
            }
        } catch (error) {
            setError('Failed to register: ' + error.message);
            setShowRegistrationSuccessAnimation(false);
        }
    };

    const togglePanelStyle = {
        position: 'absolute',
        width: '200%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '0 30px',
        textAlign: 'center',
        top: 0,
        transition: 'all 0.6s ease-in-out',
        background: 'linear-gradient(to right, rgb(255 255 255 / 0%), rgb(18 18 37 / 97%))',
        left: '-100%',
        transform: 'translateX(0)'

    };

    const toggleLeftStyle = (isActive) => ({
        ...togglePanelStyle,
        transform: isActive ? 'translateX(0)' : 'translateX(-200%)'
    });

    const toggleRightStyle = (isActive) => ({
        ...togglePanelStyle,
        right: 0,
        transform: isActive ? 'translateX(200%)' : 'translateX(0)'
    });
//dac7f759
    const containerStyle = {
        background: 'linear-gradient(45deg, #ffffff7a, #ffffff59)',
        borderRadius: '30px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        overflow: 'hidden',
        width: '768px',
        maxWidth: '100%',
        minHeight: '480px',
        backdropFilter: 'blur(10px)'
    };

    const formStyleSignIn = {
        background: 'linear-gradient(to right, rgb(6 6 6 / 47%), rgb(5 4 6 / 0%))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '0 40px',
        height: '100%',
    };
    const formStyle = {
        background: 'linear-gradient(to right, rgb(255 255 255 / 0%), rgb(18 18 37 / 97%))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '0 40px',
        height: '100%',
    };
    const inputStyle = {
        background: 'linear-gradient(45deg, rgb(0 0 0), rgb(0 3 39 / 54%))',
        border: 'none',
        margin: '8px 0',
        padding: '10px 15px',
        fontSize: '13px',
        borderRadius: '8px',
        width: '100%',
        outline: 'none',
        color: 'white'
    };
    const handleToggleActive = () => {
        setIsActive(!isActive); // Toggle the active state to switch forms
    };
    const buttonStyle = {
        background: 'linear-gradient(45deg, #000000, #000439)',
        color: '#fff',
        fontSize: '12px',
        padding: '10px 45px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        marginTop: '10px',
        cursor: 'pointer',
        border: '2px solid rgba(255, 255, 255, 0.59)',
        borderRadius: `15px`
    };
    const buttonStyleGhost = {
        background: 'linear-gradient(45deg, #000000, #000439)',
        color: '#fff',
        fontSize: '12px',
        padding: '10px 45px',
        borderRadius: '15px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transform: 'translateX(110%)',
        border: `2px solid rgba(255, 255, 255, 0.59)`
    };
    const formContainerStyle = (isActive, position) => ({
        position: 'absolute',
        top: 0,
        height: '100%',
        transition: 'all 0.6s ease-in-out',
        left: position === 'left' ? '0' : '50%',
        width: '50%',
        zIndex: position === 'left' ? 2 : 1,
        opacity: 1, // Assuming opacity should always be 1
        transform: position === 'left'
            ? (isActive ? 'translateX(-100%)' : 'none')
            : (isActive ? 'none' : 'translateX(100%)'),
    });


    const toggleContainerStyle = isActive => ({
        position: 'absolute',
        top: 0,
        left: '50%',
        width: '50%',
        height: '100%',
        overflow: 'hidden',
        transition: 'all 0.6s ease-in-out',
        borderRadius: isActive ? '0 150px 100px 0' : '150px 0 0 100px',
        zIndex: 1000,
        transform: isActive ? 'translateX(-100%)' : 'none',
    });


    return (
        <div style={containerStyle} className={"container"} id="container">
            {showRegistrationSuccessAnimation && (
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
                    <Lottie animationData={loginsuccessanimation} loop={false}/>
                </div>
            )}
            {showLoginSuccessAnimation && (
                <div style={{
                    width: '300px',
                    height: '300px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: '9999'
                }}>
                    <Lottie animationData={testanimation} loop={false}/>
                </div>
            )}

            <div style={formContainerStyle(isActive, 'right')}>
                <form style={formStyle} onSubmit={handleRegister}>
                    <h1>Create Account</h1>
                    <span>or use your email for registration</span>
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}
                           style={inputStyle}/>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                           style={inputStyle}/>
                    <input type="password" placeholder="Password" value={signupPassword}
                           onChange={e => setSignupPassword(e.target.value)} style={inputStyle}/>
                    <button type="submit" style={buttonStyle}>Sign Up</button>
                </form>
            </div>

            <div style={formContainerStyle(isActive, 'left')}>
                <form style={formStyleSignIn} onSubmit={handleSubmit}>
                    <h1>Sign In</h1>
                    <div className="social-icons">
                    </div>
                    <span>or use your email password</span>
                    <input type="username" placeholder="Username" value={username}
                           onChange={e => setUsername(e.target.value)}
                           style={inputStyle}/>
                    <input type="password" placeholder="Password" value={password}
                           onChange={e => setPassword(e.target.value)} style={inputStyle}/>
                    <a href="#"
                       style={{color: '#333', fontSize: '13px', textDecoration: 'none', margin: '15px 0 10px'}}>Forgot
                        Your Password?</a>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <button type="submit" style={buttonStyle}>Sign In</button>
                </form>
            </div>

            <div style={toggleContainerStyle(isActive)}>
                <div className="toggle">
                    <div style={toggleLeftStyle(isActive)} className="toggle-panel toggle-left">
                        <button className="ghost" onClick={handleToggleActive} style={buttonStyleGhost}>Sign In</button>
                    </div>
                    <div style={toggleRightStyle(isActive)} className="toggle-panel toggle-right">
                        <button className="ghost" onClick={handleToggleActive} style={buttonStyleGhost}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
