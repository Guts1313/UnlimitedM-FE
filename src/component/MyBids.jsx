import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import '../assets/MyBids.css';
import SideNav from "./SideNav";
import Pagination from '@mui/material/Pagination';
import {Modal, Form, Button} from "react-bootstrap";
import {Paper, Table, TableContainer, FormControl} from "@mui/material";

const MyBids = () => {
    const [bidProducts, setBidProducts] = useState([]);
    const [filteredBids, setFilteredBids] = useState([]);
    const [sortOption, setSortOption] = useState('dateDesc');
    const [statusFilter, setStatusFilter] = useState('');
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedBid, setSelectedBid] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [totalBidAmount, setTotalBidAmount] = useState(0);
    const navigate = useNavigate();

    const fetchUserBids = async () => {
        const userId = localStorage.getItem('userId');
        const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
        try {
            const response = await axios.get(`http://localhost:8080/bids/user-bids/${userId}`, { headers });
            setBidProducts(response.data.userBidProducts || []);
            setTotalBidAmount(response.data.totalBidAmount || 0);
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
    }, [bidProducts, sortOption, statusFilter]);

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

        if (statusFilter) {
            sortedBids = sortedBids.filter(bid => bid.bidStatus === statusFilter);
        }

        setFilteredBids(sortedBids);
    };

    const handlePay = (bid) => {
        setSelectedBid(bid);
        fetchPaymentMethods();
        setShowPayModal(true);
    };

    const fetchPaymentMethods = async () => {
        const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
        try {
            const response = await axios.get('http://localhost:8080/payments/listpaymentoptions', { headers });
            setPaymentMethods(response.data || []);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    };

    const processPayment = async () => {
        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        const paymentMethod = paymentMethods.find(card => card.id.toString() === selectedPaymentMethod);
        if (!paymentMethod) {
            alert('Selected payment method not found.');
            return;
        }

        const paymentRequest = {
            productId: selectedBid.product.id,
            userId: localStorage.getItem('userId'),
            cardNumber: paymentMethod.cardNumber,
            cardName: paymentMethod.cardName,
            cardType: paymentMethod.cardType,
            amount: selectedBid.amount
        };

        try {
            await axios.post('http://localhost:8080/payments/process', paymentRequest, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            alert('Payment successful!');
            fetchUserBids(); // Refresh the bids
            setShowPayModal(false);
        } catch (error) {
            alert('Payment failed: ' + error.message);
        }
    };

    return (
        <div className="container-fluid vh-100 w-100 mh-100 rounded-5 border-top border-danger overflow-hidden d-flex">
            <SideNav />
            <div className="vh-100 w-100 rounded-5 border-danger px-5 py-0 overflow-scroll">
                <h2 className="text-white d-flex justify-content-center bg-black rounded-4 mb-0 fw-bold">
                    <i className={"fa fa-table py-1 px-3 text-success"}></i>
                    User {localStorage.getItem('userId')}'s bids
                </h2>
                <div className="d-flex justify-content-between my-3">
                    <div>
                        <label className="text-white me-2">Sort By:</label>
                        <Form.Group className="w-auto d-inline-block">
                            <Form.Control
                                as="select"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="form-control text-white bg-dark"
                            >
                                <option value="dateDesc">Date (Newest First)</option>
                                <option value="dateAsc">Date (Oldest First)</option>
                                <option value="amountDesc">Amount (Highest First)</option>
                                <option value="amountAsc">Amount (Lowest First)</option>
                                <option value="productNameAsc">Product Name (A-Z)</option>
                                <option value="productNameDesc">Product Name (Z-A)</option>
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div>
                        <label className="text-white me-2">Filter By Status:</label>
                        <Form.Group className="w-auto d-inline-block">
                            <Form.Control
                                as="select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="form-control text-white bg-dark"
                            >
                                <option value="">All</option>
                                <option value="SENT">Sent</option>
                                <option value="ACCEPTED">Accepted</option>
                            </Form.Control>
                        </Form.Group>
                    </div>
                </div>

                <TableContainer component={Paper} className="table-container bg-transparent text-white">
                    <Table aria-label="user bids table" className="transparent-table">
                        <thead>
                        <tr>
                            <th className="text-danger">Product Name</th>
                            <th className="text-danger">Bid Amount</th>
                            <th className="text-danger">Status</th>
                            <th className="text-danger">Date</th>
                            <th className="text-danger">Bid Result</th>
                            <th className="text-danger">Action</th>
                        </tr>
                        </thead>
                        <tbody className="text-white">
                        {filteredBids.map((bid) => (
                            <tr key={bid.id} className="text-white">
                                <td className="text-white">
                                    <img
                                        src={bid.product.productUrl}
                                        height={100}
                                        width={100}
                                        className="rounded-3 text-white px-1"
                                        alt={bid.product.productName}
                                    />
                                    {bid.product.productName}
                                </td>
                                <td className="text-white">
                                    {bid.amount}
                                    <i className="fa fa-eur text-success fs-6"></i>
                                </td>
                                <td className="text-white">
                                    <i className="fa fa-dot-circle-o bg-black bg-gradient text-success fs-3 rounded-5"></i>
                                    {bid.status}
                                </td>
                                <td className="text-white">{new Date(bid.bidTime).toLocaleString()}</td>
                                <td className="text-white">
                                    <i className="fa fa-ticket fw-bold text-success fs-6">{bid.bidStatus}</i>
                                </td>
                                <td className="text-white">
                                    {bid.bidStatus === 'ACCEPTED' && bid.user.id.toString() === localStorage.getItem('userId') ? (
                                        bid.product.paymentStatus === 'PAID' ? (
                                            <Button
                                                variant="success"
                                                onClick={() => alert('Arrange shipment functionality not implemented')}
                                            >
                                                Arrange Shipment
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="primary"
                                                onClick={() => handlePay(bid)}
                                            >
                                                Pay
                                            </Button>
                                        )
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </TableContainer>
                {/* Display Total Bid Amount */}
                <div className="total-bid-amount mt-3">
                    <h4 className="text-white">
                        Total Amount of Bids placed: <i className="fa fa-eur text-success"></i> {totalBidAmount.toFixed(2)}
                    </h4>
                </div>

                <div className="d-flex tableFooter">
                    <p>showing <b>12</b> of <b>60</b> results</p>
                    <Pagination count={10} color="primary" className="pagination" showFirstButton showLastButton/>
                </div>

                {/* Payment Modal */}
                <Modal show={showPayModal} onHide={() => setShowPayModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Payment Method</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {paymentMethods.length > 0 ? (
                            <Form>
                                <Form.Group controlId="formPaymentMethod">
                                    <Form.Label>Payment Methods</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedPaymentMethod}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        required
                                    >
                                        <option value="">Select payment method...</option>
                                        {paymentMethods.map((method) => (
                                            <option key={method.id} value={method.id}>
                                                {method.cardType.toUpperCase()} - {method.cardNumber}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="primary" onClick={processPayment} className="mt-3">
                                    Pay
                                </Button>
                            </Form>
                        ) : (
                            <p>No payment methods available. Please add a payment method first.</p>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}
export default MyBids;
