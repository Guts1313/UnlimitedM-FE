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
                    <a className="navbar-brand fw-bold fs-4 text-white mx-3" href="#">Unlimited Marketplace</a>
                    <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
                        <button className="close-btn" onClick={toggleSidebar}>Close</button>
                        <h1 className="px-4 mx-5">Menu</h1>
                    </div>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav mx-auto d-flex">
                                <li className="nav-item d-flex fs-5 text-decoration-underline text-danger-emphasis mx-0">
                                    <a className="nav-link" aria-current="page" href="/public">Home</a>

                                    <a className="nav-link" href="/products">Products</a>

                                    <a className="nav-link" href="#">About</a>

                                    <a className="nav-link" href="#">Contact</a>
                                </li>
                            </ul>
                            <form className="d-flex mx-2">
                                <input className="form-control ms-lg-4" type="search" placeholder="Search"
                                       aria-label="Search">
                                </input>
                                <a href="" className="btn btn-outline-light" type="submit">Search</a>

                            </form>
                            <div className="btns">
                                <Link to="/login" className="btn btn-outline-light" type="submit">
                                    <i className="fa fa-sign-in me-1 text-danger"></i>Login
                                </Link>
                                <Link to="/login" className="btn btn-outline-light" type="submit"><i
                                    className="fa fa-user-plus  me-1 text-danger"></i>Register</Link>
                                <Link to="/public" className="btn btn-outline-light" type="submit"><i
                                    className="fa fa-cart-plus  me-1 text-danger"></i>Cart (0)</Link>
                            </div>
                        </div>
                    </div>
            </nav>
        </div>
);
}

export default Navbar;