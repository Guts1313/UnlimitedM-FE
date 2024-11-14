import React, {useEffect, useState} from 'react';
import SideNav from "./SideNav";
import axios from "axios";
import {useAuth} from "./AuthContext";
import '../assets/MyListings.css'
import {Link} from "react-router-dom";
const MyListings = () => {
    const [userListings, setUserListings] = useState([]);
    const [statusFilter, setStatusFilter] = useState('ACTIVE');
    const userId = localStorage.getItem('userId'); // Assuming you have userId in your auth context

    useEffect(() => {
        const fetchUserListings = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                };
                //${process.env.REACT_APP_BACKEND_URL}
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/unlimitedmarketplace/products/mylistings`, {
                    params: { userId },
                    headers
                });
                if (response && response.data) {
                    setUserListings(response.data.productEntities); // Assuming the response structure
                } else {
                    console.log('Error fetching user listings');
                }
            } catch (err) {
                console.error('Error has occurred in the fetch:', err);
            }
        };

        fetchUserListings();
    }, [userId]);

    const filteredListings = userListings.filter(listing => listing.productStatus === statusFilter);

    return (
        <div className={"d-flex w-100 justify-content-center align-items-baseline border-top bg-transparent border-danger rounded-5 border-bottom"}>
            <div className={'cont w-25 border-1 border-danger'}>
                <SideNav />
            </div>
            <div className={"container-fluid justify-content-center w-100 me-5 border-1 border-danger"}>
                <div className={"d-flex justify-content-center"}>
                    <h1 className={"text-white pb-3 justify-content-center"}>My Listings</h1>
                </div>
                <div className="d-flex justify-content-center mb-3">
                    <label className="text-white me-2 pt-2">Sort by status:</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                            className="form-select w-25">
                        <option value="ACTIVE">Active</option>
                        <option value="SOLD">Sold</option>
                    </select>
                </div>
                <table
                    className="container-sm table table-responsive-sm table-borderless border-danger vh-100 overflow-hidden">
                    <thead className="table-active container-fluid w-100 rounded-5 table-responsive-sm justify-content-center">
                    <tr className={"table-responsive-sm border-bottom border-danger"}>
                        <th className="text-danger table-active">Product Name</th>
                        <th className="text-danger table-active">Product Price</th>
                        <th className="text-danger table-active">Date Added</th>
                        <th className="text-danger table-active"><i className={"fa fa-eye fs-5 fw-bold text-danger"}> Status</i></th>
                        <th className="text-danger table-active">Payment Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredListings.map(listing => (
                        <tr key={listing.id} className={"rows border-bottom border-danger"}>
                            <td className="fs-5">
                                <img src={listing.productUrl} height={100} width={100} className="rounded-3"
                                     alt={listing.productName}/> {listing.productName}
                            </td>
                            <td className="fs-5 align-content-center">{listing.productPrice}<i
                                className="fa fa-eur text-success fs-5"></i></td>
                            <td className="fs-5 align-content-center">{new Date(listing.productDateAdded).toLocaleString()}</td>
                            <td className="fs-5 align-content-center">{listing.productStatus}</td>
                            <td className="fs-5 align-content-center">{listing.paymentStatus}</td>
                            <td className="fs-5 align-content-center"><Link to={`/liveview/${listing.id}`}>
                                <button className={"btn"}><i
                                    className={"fa fa-eye fs-5 px-2 text-success fw-bold"}> Live view</i></button>
                            </Link></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyListings;
