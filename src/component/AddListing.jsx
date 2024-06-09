import React, {useEffect, useState} from 'react';
import '../assets/AddListing.css'
import axios from "axios";

const AddListing = () => {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productUrl, setProductUrl] = useState("");
    const [productDateCreated, setProductDateCreated] = useState("");


    const handleChangeName = (e) =>{
        setProductName(e.target.value);
    }
    const handleChangeUrl = (e) =>{
        setProductUrl(e.target.value);
    }
    const handleChangePrice = (e) =>{
        setProductPrice(e.target.value);
    }
    const handleChangeDateCreated = (e) =>{
        setProductDateCreated(e.target.value);
    }
    const token = localStorage.getItem('accessToken'); // Replace with your token retrieval method

    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            productName: productName,
            productPrice: parseFloat(productPrice),
            productUrl: productUrl,
            productDateCreated: productDateCreated,
            userId:localStorage.getItem('userId')
        };

        try {
            const response = await axios.post('http://localhost:8080/unlimitedmarketplace/products', data, {
                headers: headers
            });

            if (response.status === 201) {
                console.log("Product created successfully!");
                // Handle successful creation here (e.g., clear the form, display a success message)
            } else {
                console.error("Failed to create product");
                // Handle errors here
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle errors here
        }
    };


    useEffect(() => {
        setProductUrl(productUrl);
    }, [productUrl]);

    const containerStyle = {
        backgroundImage: `url(${productUrl})`,
        backgroundSize: 'cover', // Ensure the background covers the entire container
        backgroundPosition: 'center', // Center the background image
    };

    return (
            <div className="main-listing container-fluid w-100 m-0 p-0  d-flex justify-content-center">
                <div
                    className="image-placeholder-container h-50 w-50 bg-black d-inline-flex align-self-center justify-content-center flex-grow-1 flex-shrink-0" style={containerStyle}>
                    <i className="fa fa-cloud-upload text-white fs-3 align-content-center"><span
                        className="text-danger">Images go here</span></i>
                </div>

                <div
                    className="product-description-main container-fluid h-50 w-50 text-danger justify-content-center align-self-center pb-sm-5">
                    <div className="row justify-content-center my-5 text-center h-100 align-content-center">
                        <div className="col-12 col-md-6 rounded-3 my-5 bg-gradient">
                            <form>
                                <div className="mb-3 w-50">
                                    <label htmlFor="productName" className="form-label">Product Name:</label>
                                    <input type="text" className="form-control" id="productName" name="productName"
                                           placeholder="Enter product name" onChange={handleChangeName} required/>
                                </div>

                                <div className="mb-3 w-50">
                                    <label htmlFor="productPrice" className="form-label">Product Price:</label>
                                    <input type="number" className="form-control" id="productPrice" name="productPrice"
                                           placeholder="Enter product price" min="14" onChange={handleChangePrice}
                                           required/>
                                </div>

                                <div className="mb-3  w-50">
                                    <label htmlFor="productUrl" className="form-label">Product URL:</label>
                                    <input type="url" className="form-control" id="productUrl"
                                           onChange={handleChangeUrl} name="productUrl"
                                           placeholder="Enter product URL" required/>
                                </div>

                                <div className="mb-3 w-50">
                                    <label htmlFor="productDateCreated" className="form-label">Product Creation
                                        Date:</label>
                                    <input type="date" className="form-control" id="productDateCreated"
                                           name="productDateCreated" onChange={handleChangeDateCreated} required/>
                                </div>
                                <button type="submit" onClick={handleSubmit}
                                        className="btn btn-outline-danger bg-black mw-100 mw-100 my-sm-0 fw-bold text-white justify-content-center">
                                    <i className={"fa fa-send fa-send fa-spin text-success fw-bold px-1"}></i> Submit
                                </button>

                            </form>

                        </div>

                    </div>
                </div>
            </div>
    );
};

export default AddListing;