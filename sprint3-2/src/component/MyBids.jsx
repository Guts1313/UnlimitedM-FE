import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import '../assets/MyBids.css'
import SideNav from "./SideNav";

const MyBids = () => {
    const [bidProducts, setBidProducts] = useState([]);
    const [filteredBids, setFilteredBids] = useState([]);
    const [sortOption, setSortOption] = useState('dateDesc');
    const navigate = useNavigate();

    const fetchUserBids = async () => {
        const userId = localStorage.getItem('userId');
        const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
        try {
            const response = await axios.get(`http://localhost:8080/bids/user-bids/${userId}`, { headers });
            setBidProducts(response.data.userBidProducts || []);
        } catch (error) {
            console.error('Error fetching user bids:', error);
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchUserBids();
    }, []);

    useEffect(() => {
        handleSortAndFilter();
    }, [bidProducts, sortOption]);

    const handleSortAndFilter = () => {
        let sortedBids = [...bidProducts];

        switch (sortOption) {
            case 'dateAsc':
                sortedBids.sort((a, b) => new Date(a.bidTime) - new Date(b.bidTime));
                break;
            case 'dateDesc':
                sortedBids.sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime));
                break;
            case 'amountAsc':
                sortedBids.sort((a, b) => a.amount - b.amount);
                break;
            case 'amountDesc':
                sortedBids.sort((a, b) => b.amount - a.amount);
                break;
            case 'productNameAsc':
                sortedBids.sort((a, b) => a.product.productName.localeCompare(b.product.productName));
                break;
            case 'productNameDesc':
                sortedBids.sort((a, b) => b.product.productName.localeCompare(a.product.productName));
                break;
            default:
                break;
        }

        setFilteredBids(sortedBids);
    };

    return (
        <div className="container-fluid vh-100 w-100 mh-100 bg-gradient rounded-5 border-top border-danger  overflow-hidden d-flex">
            <SideNav />
            <div className="vh-100 w-100  rounded-5 border-danger px-5 py-0 overflow-scroll">
                <h2 className="text-white d-flex justify-content-center bg-black  rounded-4 mb-0 fw-bold"><i className={"fa fa-table py-1 px-3 text-success"}></i>My Bids</h2>
                <div className="d-flex justify-content-between my-3">
                    <div>
                        <label className="text-white me-2">Sort By:</label>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="form-select w-auto d-inline-block"
                        >
                            <option value="dateDesc">Date (Newest First)</option>
                            <option value="dateAsc">Date (Oldest First)</option>
                            <option value="amountDesc">Amount (Highest First)</option>
                            <option value="amountAsc">Amount (Lowest First)</option>
                            <option value="productNameAsc">Product Name (A-Z)</option>
                            <option value="productNameDesc">Product Name (Z-A)</option>
                        </select>
                    </div>
                </div>
                <table className="table table-responsive table-responsive-md  table-dark table-bordered border-danger vh-100 overflow-auto">
                    <thead className="table-active rounded-5">
                    <tr>
                        <th className="text-danger table-active">Product Name</th>
                        <th className="text-danger table-active">Bid Amount</th>
                        <th className="text-danger table-active">Status</th>
                        <th className="text-danger table-active">Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBids.map(bid => (
                        <tr key={bid.id}>
                            <td className="fs-5">
                                <img src={bid.product.productUrl} height={100} width={100} className="rounded-3" /> {bid.product.productName}
                            </td>
                            <td className="fs-5">{bid.amount}<i className="fa fa-eur text-success fs-5"></i></td>
                            <td className="fs-5"><i className="fa fa-dot-circle-o bg-black bg-gradient text-success fs-3 rounded-5"></i>{bid.status}</td>
                            <td className="fs-5">{new Date(bid.bidTime).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyBids;
