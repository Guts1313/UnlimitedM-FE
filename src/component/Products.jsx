import React from 'react';
import '../assets/Products.css'
import {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";

function Products(props) {
    const [products, setProducts] = useState([]); // Initializes the products state to an empty array
    const navigate = useNavigate();

    useEffect(() => {
        // Fetches products from the backend when the component mounts
        const headers = {Authorization: `Bearer ${localStorage.getItem('accessToken')}`};

        //${process.env.REACT_APP_BACKEND_URL}
        axios.get(`http://localhost:8080/unlimitedmarketplace/products`, {headers})
            .then(response => {
                setProducts(response.data.productEntities);
            })
            .catch(error => {
                console.error('There was an error fetching the products:', error);
                if (error.response && error.response.status === 401) {
                    console.log(error.response)
                    console.log("Errorresponse status:" + error.response.status);
                    setTimeout(() => {
                        navigate('/login');
                    }, 10);
                } else {
                    console.error('Network or other error:', error);
                }
            });
    }, [navigate]); // Include navigate in the dependency array
    // The empty array as a second argument ensures this effect runs once after initial render

    useEffect(() => {
        document.body.classList.add('bg-products')
        return () => {
            document.body.classList.remove('bg-products')
        }

    }, []);


    return (

        <div className="carousel-container w-100 vh-100">
            <div id="carouselExampleIndicators" className="carousel slide rounded-4" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner container-fluid rounded-4 opacity-75 bg-opacity-100 d-flex mb-2 gx-0 mw-100 mw-100 flex-shrink-1 rounded-4">
                    <div className="carousel-item active d-flex h-25 flex-shrink-1">
                        <img
                            src="https://www.oneills.com/media/wysiwyg/cms-category-landing/sale-subcat/gen-sale-landing-d.jpg"
                            height="600px" className="flex-shrink-0" alt="First slide"/>
                        <img
                            src="https://www.oneills.com/media/wysiwyg/cms-category-landing/sale-subcat/gen-sale-landing-d.jpg"
                            height="640px"
                            className="flex-fill" alt="Second slide"/>
                    </div>
                    <div className="carousel-item d-flex h-25 flex-shrink-0">
                        <img
                            src="https://www.oneills.com/media/wysiwyg/cms-category-landing/sale-subcat/gen-sale-landing-d.jpg"
                            className="flex-shrink-0"
                            height="640px" alt="Third slide"/>
                        <img src="https://i.ytimg.com/vi/TTSwOcCOjDM/maxresdefault.jpg" height="640px"
                             className="flex-fill"
                             alt="Fourth slide"/>
                    </div>
                    {/* Add more .carousel-item divs as needed */}
                </div>

                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
            <div className="container-fluid m-0 p-0 w-100">
                <div className="row">
                    <div className="col-md-6">
                        <Link to={'/listing'}
                              className={"btn btn-outline-danger w-100 bg-black fw-bolder fs-2 my-3"}
                              style={{height: 100}}><i
                            className="fa fa-plus-circle text-success shadow-lg border-0 my-4 fa-spin"></i> List an item
                        </Link>
                    </div>
                    <div className="col-md-6">
                        <Link
                            className={"btn btn-outline-danger w-100 bg-white text-bg-info fw-bolder fs-2 my-3"}
                            style={{height: 100}}><i className="fa fa-cart-arrow-down my-4 text-danger fa-spin"></i> Shop all
                        </Link>
                    </div>
                </div>
            </div>
            <div className="products-container d-grid text-decoration-none container-fluid justify-content-center">
                <div className="row row-cols-md-3 py-0 text-decoration-none justify-content-center">
                    {products.map((product) => (
                        <div className="d-flex justify-content-center text-decoration-none mb-4 mx-5 my-5"
                             key={product.id}>
                            <Link to={`/product/${product.id}`} className="card border-0">
                                <img src={product.productUrl} className="card-img-top" alt={product.productName}/>
                                <div
                                    className="card-body bg-transparent shadow-lg p-3 mb-5 bg-body-tertiary bg-opacity-10 text-decoration-none d-flex flex-column text-black mx-0 my-0 px-1 w-100">
                                    <h5 className="card-title">{product.productName}</h5>
                                    <div className="d-flex flex-column justify-content-evenly">
                                        {/*<text*/}
                                        {/*    className="fs-5 mb-1 d-flex text-black fw-bold text-center text-decoration-none">Price:{product.productPrice}*/}
                                        {/*    <i className="fa fa-eur"></i>*/}
                                        {/*</text>*/}
                                        <div
                                            className="container-buttons w-100 py-3 bg-black d-flex justify-content-around">
                                            <button id="buy-now"
                                                    className="buy-btn border-2 border-end border-light w-50 bg-black text-white border-0 fw-bold">
                                                <i className="fa d-inline-flex fa-cart-plus text-success"></i>Buy
                                                now
                                            </button>
                                            <button id="bid-now"
                                                    className="bid-btn w-50 bg-black border-0 text-white fw-bold">
                                                <i className="fa d-inline-flex fa-adn text-danger"></i> Place
                                                bid
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </Link>

                        </div>
                    ))}
                </div>
            </div>
            )
            ;
        </div>


    )
        ;
}

export default Products;