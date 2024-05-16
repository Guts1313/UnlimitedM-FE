import React, {useState} from 'react';
import '../Sidebar.css'
import {Link} from "react-router-dom";

function Navbar(props) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
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
                        <ul className="navbar-nav mx-auto d-flex">
                            <li className="nav-item d-flex fs-5 text-decoration-underline text-danger-emphasis mx-0">
                                <Link to='/' className="nav-link text-white" aria-current="page">Home</Link>

                                <a className="nav-link text-white" href="/products">Products</a>

                                <a className="nav-link text-white" href="#">About</a>

                                <a className="nav-link text-white" href="#">Contact</a>
                            </li>
                        </ul>
                        <form className="search d-flex mx-2">
                            <input className="form-control h-25 my-3" type="search" placeholder="Search"
                                   aria-label="Search">
                            </input>
                            <button href="" className="btn search btn-outline-light text-center m-2 p-0" type="submit">Search</button>

                        </form>
                        <div className="btns">
                            <Link to="/login" className="btn btn-outline-light" type="submit">
                                <i className="fa fa-sign-in me-1 text-danger"></i>Login
                            </Link>
                            <Link to="/login" className="btn btn-outline-light" type="submit"><i
                                className="fa fa-user-plus  me-1 text-danger"></i>Register</Link>
                            <Link to="/public" className="btn btn-outline-light" type="submit"><i
                                className="fa fa-cart-plus  me-1 text-danger"></i>Cart(0)</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;