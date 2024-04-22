import React, {useState} from 'react';
import Lottie from "lottie-react";
import testanimation from '../assets/testanimation.json';
import loginsuccessanimation from '../assets/loginsuccessanimation.json';
import axios from 'axios'; // First, ensure Axios is imported at the top of your file
import {useNavigate} from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const navigate = useNavigate();

    const [isRegistered, setIsRegistered] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [showLoginSuccessAnimation, setShowLoginSuccessAnimation] = useState(false);
    const [showRegistrationSuccessAnimation, setShowRegistrationSuccessAnimation] = useState(false);
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
        background: 'linear-gradient(to right, #5c6bc0, #512da8)',
        left:'-100%',
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
        backdropFilter:'blur(10px)'
    };

    const formStyleSignIn = {
        background: 'linear-gradient(to right, rgb(92, 107, 192), rgba(81, 45, 168, 0))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '0 40px',
        height: '100%',
    };
    const formStyle = {
        background: 'linear-gradient(to left, rgb(92, 107, 192), rgba(81, 45, 168, 0))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '0 40px',
        height: '100%',
    };
    const inputStyle = {
        backgroundColor: '#eee',
        border: 'none',
        margin: '8px 0',
        padding: '10px 15px',
        fontSize: '13px',
        borderRadius: '8px',
        width: '100%',
        outline: 'none',
    };
    const handleToggleActive = () => {
        setIsActive(!isActive); // Toggle the active state to switch forms
    };
    const buttonStyle = {
        backgroundColor: '#1a0059',
        color: '#fff',
        fontSize: '12px',
        padding: '10px 45px',
        border: '1px solid transparent',
        borderRadius: '8px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        marginTop: '10px',
        cursor: 'pointer',
    };
    const buttonStyleGhost = {
        backgroundColor: '#1a0059',
        color: '#fff',
        fontSize: '12px',
        padding: '10px 45px',
        border: '1px solid transparent',
        borderRadius: '8px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transform:'translateX(110%)'
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await onLogin(username, password);
            setShowLoginSuccessAnimation(true);
            setTimeout(() => setShowLoginSuccessAnimation(false), 5000);
        } catch (error) {
            setError('Failed to login: ' + (error.response?.data?.message || error.message));
            setShowLoginSuccessAnimation(false);
        }
    };

    const onLogin = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/unlimitedmarketplace/auth/login', {
                username:username,
                passwordHash:password
            });
            if (response && response.data) {
                console.log('Login successful', response.data);
                localStorage.setItem('token', response.data.token);
                setShowLoginSuccessAnimation(true); // Ensure this is set here
                setTimeout(() => {
                    setShowLoginSuccessAnimation(false);
                    navigate('/');  // Redirect to Home page after animation
                }, 3000);  // Duration of the animation
            } else {
                throw new Error('Invalid server response');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Failed to login: ' + (error.response?.data?.message || error.message));
            setShowLoginSuccessAnimation(false);
        }

    };
    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/unlimitedmarketplace', {
                userName: name,
                email: email,
                passwordHash: signupPassword
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


    return (
        <div style={containerStyle} className={"container"} id="container">
            {showRegistrationSuccessAnimation && (
                <div style={{
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
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
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle}/>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}/>
                    <input type="password" placeholder="Password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} style={inputStyle}/>
                    <button type="submit" style={buttonStyle}>Sign Up</button>
                </form>
            </div>

            <div style={formContainerStyle(isActive, 'left')}>
                <form style={formStyleSignIn} onSubmit={handleSubmit}>
                    <h1>Sign In</h1>
                    <div className="social-icons">
                    </div>
                    <span>or use your email password</span>
                    <input type="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
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
