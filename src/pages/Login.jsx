import React, {useState} from 'react';
import Lottie from "lottie-react";
import testanimation from '../assets/testanimation.json';
import loginsuccessanimation from '../assets/loginsuccessanimation.json';
import axios from 'axios'; // First, ensure Axios is imported at the top of your file
import SocialIcons from "../components/SocialIcons";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    const [isRegistered, setIsRegistered] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [showLoginSuccessAnimation, setShowLoginSuccessAnimation] = useState(false);
    const [showRegistrationSuccessAnimation, setShowRegistrationSuccessAnimation] = useState(false);

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
            } else {
                throw new Error('Invalid server response');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error; // This will be caught in the Login component
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
        <div className={`container ${isActive ? 'active' : ''}`} id="container">
            {showRegistrationSuccessAnimation && (
                <div style={{
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


            <div className="form-container sign-up">
                <form onSubmit={handleRegister}>
                    <h1>Create Account</h1>
                    <SocialIcons/>

                    <span>or use your email for registration</span>
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" value={signupPassword}
                           onChange={e => setSignupPassword(e.target.value)}/>
                    <button type="submit">Sign Up</button>
                </form>

            </div>
            <div className="form-container sign-in">
                <form onSubmit={handleSubmit}>
                    <h1>Sign In</h1>
                    <div className="social-icons">
                        <SocialIcons/>
                    </div>
                    <span>or use your email password</span>
                    <div className={"input-username"}>
                        <input
                            type="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className={"input-password"}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <a href="#">Forgot Your Password?</a>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <button type="submit">Sign In</button>
                </form>
            </div>
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        {/* Content for returning users */}
                        <button className="ghost" id="login" onClick={() => setIsActive(false)}>Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        {/* Content for new users */}
                        <button className="ghost" id="register" onClick={() => setIsActive(true)}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Login;
