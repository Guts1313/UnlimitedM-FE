import React from 'react';
import {Link} from "react-router-dom";

const SideNav = () => {
    return (
        <div
            className={'side-navigation container-fluid vh-100 justify-content-start d-flex flex-column bg-transparent p-0 rounded-5 border-1 border-danger'}>
            <div className={"navigator-btns rounded-5 container d-flex flex-column mw-100 w-100 justify-content-start"}>

                <div className='mb-0 mb-3 rounded-4 border-0 border-danger text-center bg-transparent'>
                    <Link to={'/'}>
                        <button
                            className="btn btn-outline-danger border-0 border-0 fw-bold w-100 h-100 rounded-4 mx-0">
                            <i
                                className={"fa fa-th-list text-danger px-2 fw-bold fs-5 text-white"}></i>My listings
                        </button>
                    </Link>
                </div>
                <div className='mb-0 mb-3 rounded-4 border-0 justify-content-end text-center bg-transparent'>
                    <Link to={'/my-bids'}>
                        <button
                            className="btn btn-outline-danger border-0 fw-bold w-100 h-100 rounded-4">
                            <i
                                className={"fa fa-angellist px-2 fw-bold fs-4 text-white"}></i>My bids
                        </button>
                    </Link>
                </div>
                <div className='mb-0  mb-3 rounded-4 border-0 text-center bg-transparent'>
                    <Link to={'/user-security'}>
                        <button
                            className="btn btn-outline-danger border-0  fw-bold w-100 h-100 rounded-4">
                            <i
                                className={"fa fa-shield fw-bold fs-4 fw-bold text-white px-2"}></i> Security
                        </button>
                    </Link>

                </div>
                <div className='mb-0 mb-3 rounded-4 border-0 border-top-0 rounded-4 text-center bg-transparent'>
                    <Link to={'/payment-panel'}>
                        <button
                            className="btn btn-outline-danger border-0  fw-bold w-100 h-100 rounded-4">
                            <i className={"fa fa-credit-card-alt px-2 text-white fs-5"}></i>Payment
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SideNav;