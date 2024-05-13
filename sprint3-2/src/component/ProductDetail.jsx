import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from "react-router";
import '../assets/ProductDetail.css'

function ProductDetail() {
    const [product, setProduct] = useState({});
    const {id} = useParams(); // This extracts "id" from the route parameter

    useEffect(() => {
        const fetchProduct = async () => {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`
            };

            try {
                const response = await axios.get(`http://localhost:8080/unlimitedmarketplace/products/${id}`, {headers});
                setProduct(response.data.productEntity);  // Adjusted here to access productEntity
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProduct();
    }, [id]);


    return (
        <div className="product-detail-container container-fluid vh-100 m-0 p-0 d-flex flex-nowrap">
            <div className="product-info-card h-50 w-100 mx-2 d-flex">
                <img src={product.productUrl} height="580px" alt={product.productName}/>
                <div className="product-description my-3 mx-2 text-white bg-dark w-25 d-flex flex-column">
                    <div
                        className="product-description-text d-flex flex-column justify-content-end align-items-baseline mx-4">
                        <h1>Product name: {product.productName}</h1>
                        <p>Price: {product.productPrice}</p>
                        <p>Date Added: {product.productDateAdded}</p>
                    </div>
                    <div className="product-description-secondary d-flex justify-content-evenly align-items-start my-2">
                        <button className="btn bid btn-outline-light bg-black">
                            <i className="fa fa-adn text-warning m-1"/> Bid
                        </button>
                        <button className="btn buy btn-outline-light bg-black">
                            <i className="fa fa-cart-plus text-success m-1"/> Buy now
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );

}

export default ProductDetail;