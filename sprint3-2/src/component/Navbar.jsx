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
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-nav">
                    <a className="navbar-brand fw-bold fs-4" href="#">Unlimited Marketplace</a>
                    <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
                        <button className="close-btn" onClick={toggleSidebar}>Close</button>
                    </div>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav mx-auto d-flex">
                                <li className="nav-item d-flex ">
                                    <a className="nav-link" aria-current="page" href="/public">Home</a>

                                    <a className="nav-link" href="#">Products</a>

                                    <a className="nav-link" href="#">About</a>

                                    <a className="nav-link" href="#">Contact</a>
                                </li>
                            </ul>
                            <form className="d-flex">
                                <input className="form-control ms-lg-4" type="search" placeholder="Search"
                                       aria-label="Search">
                                </input>
                                <a href="" className="btn btn-outline-dark ms-2" type="submit">Search</a>

                            </form>
                            <div className="buttons d-flex">
                                <Link to="/login" className="btn btn-outline-dark ms-5">
                                    <i className="fa fa-sign-in mx-1 me-1"> Login</i>
                                </Link>

                                <a href="/public" className="btn btn-outline-dark ms-2" type="submit"><i
                                    className="fa fa-user-plus  me-1"></i>Register</a>
                                <a href="/public" className="btn btn-outline-dark ms-2" type="submit"><i
                                    className="fa fa-cart-plus  me-1"></i>Cart (0)</a>
                            </div>
                        </div>
                    </div>
            </nav>
        </div>
);
}

export default Navbar;