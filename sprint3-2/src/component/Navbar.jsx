import React, {useEffect, useState} from 'react';
import '../Sidebar.css'
import {Link} from "react-router-dom";
import {useNotifications} from './NotificationContext';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications } = useNotifications();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Filter out duplicate notifications based on a unique property
    const filterNotifications = (notifications) => {
        return [...new Set(notifications)];
    };
    const filteredNotifications = filterNotifications(notifications);

    console.log(notifications);

    return (
        <div className={"nav-bg"}>
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-nav">
                    <button className="navbar-toggler my-1" type="button" onClick={toggleSidebar}>
                        <img src='/logo.png' height='50px' alt='logo'/>
                        <span className="fa fa-bars text-white mx-4 border-white"></span>
                    </button>
                    <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
                        <button className="close-btn" onClick={toggleSidebar}>Close</button>
                        <h1 className="px-4 mx-5">Menu</h1>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <div className='logo-container d-flex'>
                            <img className="nav-logo mx-3" src="/logo.png" height='45px' alt='logo'/>
                        </div>
                        <ul className="navbar-nav mx-md-auto mx-sm-4 flex-shrink-0 d-flex">
                            <li className="nav-item d-flex fs-5 fw-lighter text-danger-emphasis gap-4 gap-sm-0 gap-xl-5 gap-xxl-5 mb-5">
                                <Link to='/' className="nav-link text-white fw-bold" aria-current="page"><i
                                    className={"fa fa-home text-danger"}></i> Home</Link>
                                <Link to='/products' className="nav-link text-white fw-bold" href="/products"><i
                                    className={"fa fa-cart-arrow-down text-danger"}></i> Products</Link>
                                <Link to={'/profile'} className="nav-link text-white fw-bold" href="#"><i
                                    className="fa fa-user-o px-2 text-danger fs-5"></i>Profile</Link>
                                <a className="nav-link text-white" href="#"><i
                                    className={"fa fa-send text-danger"}></i> Contact us</a>
                            </li>
                        </ul>
                        <form className="search d-flex mx-2">
                            <input className="form-control h-25 my-3" type="search" placeholder="Search"
                                   aria-label="Search">
                            </input>
                            <button href="" className="btn search btn-outline-light text-center m-2 p-0"
                                    type="submit">Search
                            </button>
                        </form>
                        <div className="btns mx-2 my-3 mx-xl-5">
                            <div className="notification-container border-0">
                                <div className="fa bell-icon">
                                    <i className="fa fa-bell p-1"></i>
                                    {filteredNotifications.length > 0 &&
                                        <span className="notification-count">{filteredNotifications.length}</span>}
                                </div>
                                <div className="notification-list bg-black my-5 mx-auto border-white border-2">
                                    {filteredNotifications.map((notification, index) => (
                                        <div key={index}
                                             className="notification-item text-wrap text-center bg-black rounded-5 mb-1 w-100 my-2 border-white text-wrap">
                                            <i className="fa fa-warning text-danger"></i><span
                                            className="text-white text-wrap"> You
                                        were
                                        outbid !
                                    </span>
                                            <br></br>
                                            <span className="text-white text-wrap">Highest bid: </span>{notification}<i
                                            className="fa fa-dollar text-bg-black rounded-1 fs-6 p-1"></i>
                                        </div>
                                    ))}
                                </div>

                            </div>
                            <Link to="/login" className="btn text-white fw-bold " type="submit">
                                <i className="fa fa-sign-in text-danger p-1"></i>Login
                            </Link>
                            <Link to="/login" className="btn text-white fw-bold" type="submit"><i
                                className="fa fa-user-plus text-danger p-1"></i>Register</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
