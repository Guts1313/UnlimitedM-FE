import React, {useEffect, useState} from 'react';
import SideNav from "./SideNav";
import axios from "axios";
import {useAuth} from "./AuthContext";
import '../assets/MyListings.css'
import {Link} from "react-router-dom";
const MyListings = () => {
    const [userListings, setUserListings] = useState([]);
    const userId  = localStorage.getItem('userId'); // Assuming you have userId in your auth context

    useEffect(() => {
        console.log(userId);
        const fetchUserListings = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                };
                const response = await axios.get('http://localhost:8080/unlimitedmarketplace/products/mylistings', {
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

    return (
        <div className={"d-flex w-100 justify-content-center align-items-baseline border-top bg-transparent border-danger rounded-5 border-bottom"}>
            <div className={'cont w-25 border-1 border-danger'}>
                <SideNav />
            </div>
            <div className={"container-fluid justify-content-center w-75 me-5 border-1 border-danger"}>
                <div className={"d-flex justify-content-center"}>
                    <h1 className={"text-white pb-3"}>My Listings</h1>
                </div>
                <table className="container-sm table table-responsive-sm table-borderless border-danger vh-100 overflow-hidden">
                    <thead className="table-active rounded-5 table-responsive-sm" >
                    <tr className={"table-responsive-sm border-bottom border-danger"}>
                        <th className="text-danger table-active ">Product Name</th>
                        <th className="text-danger table-active">Product Price</th>
                        <th className="text-danger table-active">Date Added</th>
                        <th className="text-danger table-active"><i className={"fa fa-eye text-white fs-4 px-5 mx-2"}></i></th>

                    </tr>
                    </thead>
                    <tbody>
                    {userListings.map(listing => (
                        <tr key={listing.id} className={"rows border-bottom border-danger"}>
                            <td className="fs-5">
                                <img src={listing.productUrl} height={100} width={100} className="rounded-3"
                                     alt={listing.productName}/> {listing.productName}
                            </td>
                            <td className="fs-5 align-content-center">{listing.productPrice}<i className="fa fa-eur text-success fs-5"></i>
                            </td>
                            <td className="fs- 5 align-content-center">{new Date(listing.productDateAdded).toLocaleString()}</td>
                            <td className="fs- 5 align-content-center"><Link to={`/liveview/${listing.id}`}><button className={"btn"}><i className={"fa fa-eye fs-5 px-2 text-success fw-bold"}> Live view</i></button></Link></td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyListings;
