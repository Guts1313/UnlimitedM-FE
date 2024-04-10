import React from 'react';
import {Link} from "react-router-dom";

const SideNav = () => {
    return (
        <div
            className={'side-navigation container-fluid vh-100 justify-content-start d-flex flex-column p-0 rounded-5 border-1 border-danger'}>
            <div className={"navigator-btns  flex-column justify-content-start align-content-start mw-100 vh-100 w-100 p-0"} style={{marginLeft:0.2}}>
                <div className='mb-0 border-0 text-center bg-transparent bg-opacity-10  bg-slate- align-content-center'
                     style={{width: 170, height: 140,borderTopRightRadius:25,borderTopLeftRadius:120,marginTop:10,marginLeft:6}}>
                    <Link to={'/my-listings'}>
                        <button
                            className="btn btn-outline-danger bg-gradient border-0 fw-bold p-2" style={{width:179,marginLeft:-10,borderRadius:20}}>
                            <i
                                className={"fa fa-th-list text-danger px-2 fw-bold fs-5 text-white"}></i>My listings
                        </button>
                    </Link>
                </div>
                <div className='mb-0 border-top border-danger rounded-0 text-center bg-transparent bg-opacity-10 align-content-center  bg-black'
                     style={{width: 179, height: 140,borderRadius:5}}>
                    <Link to={'/my-bids'}>
                        <button
                            className="btn btn-outline-danger border-0 fw-bold p-2"
                            style={{width: 179, marginLeft: -10, borderRadius: 20}}>
                            <i
                                className={"fa fa-angellist px-2 fw-bold fs-4 text-white"}></i>My bids
                        </button>
                    </Link>
                </div>
                <div className='mb-0 border-top border-danger rounded-0 text-center bg-transparent bg-opacity-10 align-content-center  bg-black'
                     style={{width: 179, height: 140,borderRadius:5}}>
                    <Link to={'/user-security'}>
                        <button
                            className="btn btn-outline-danger border-0 fw-bold p-2"
                            style={{width: 179, marginLeft: -10, borderRadius: 20}}>
                            <i
                                className={"fa fa-shield fw-bold fs-4 fw-bold text-white px-2"}></i> Security
                        </button>
                    </Link>

                </div>
                <div className='mb-0 border-top border-bottom border-danger rounded-0 text-center bg-transparent  bg-opacity-10 align-content-center'
                     style={{width: 179, height: 140,borderRadius:5}}>
                    <Link to={'/payment-panel'}>
                        <button
                            className="btn btn-outline-danger border-0 fw-bold p-2"
                            style={{width: 179, marginLeft: -10, borderRadius: 20}}>
                            <i className={"fa fa-credit-card-alt px-2 text-white fs-5"}></i>Payment
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SideNav;