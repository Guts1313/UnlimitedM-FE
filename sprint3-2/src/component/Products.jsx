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
        const token = localStorage.getItem('accessToken'); // Replace with your token retrieval method
        const headers = {
            'Authorization': `Bearer ${token}`,
            role:"USER"
        };

        axios.get('http://localhost:8080/unlimitedmarketplace/products', {headers})
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

        <div className="carousel-container container-fluid">
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div className="carousel-inner d-flex">
                    <div className="carousel-item active d-flex h-25">
                        <img
                            src="https://www.oneills.com/media/wysiwyg/cms-category-landing/sale-subcat/gen-sale-landing-d.jpg"
                            height="600px" className="flex-fill" alt="First slide"/>
                        <img
                            src="https://www.oneills.com/media/wysiwyg/cms-category-landing/sale-subcat/gen-sale-landing-d.jpg"
                            height="640px"
                            className="flex-fill" alt="Second slide"/>
                    </div>
                    <div className="carousel-item d-flex h-25">
                        <img
                            src="https://www.oneills.com/media/wysiwyg/cms-category-landing/sale-subcat/gen-sale-landing-d.jpg"
                            className="flex-fill"
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

            <div className="products-container d-grid">
                <div className="row row-cols-1 row-cols-md-3 g-1 py-5">
                    {products.map((product) => (
                        <div className="d-flex justify-content-center mb-4 mx-5 my-5" key={product.id}>
                            <Link to={`/product/${product.id}`} className="card border-white">
                                <img src={product.productUrl} className="card-img-top" alt={product.productName}/>
                                <div className="card-body d-flex flex-column text-black mx-0 my-0 px-1 w-100">
                                    <h5 className="card-title">{product.productName}</h5>
                                    <p className="card-text">Price: ${product.productPrice}</p>
                                    <p className="card-text">Added: {product.productDateAdded}</p>
                                    <div className="btn-container d-flex align-self-end px-3 gap-5">
                                        <button id="buy-btn" className="btn pb-0 mb-0"><i
                                            className="fa fa-cart-plus"> Buy
                                            Now</i></button>
                                        <button id="bid-btn" className="btn pb-0 mb-0 "><i
                                            className="fa fa-adn"> Place
                                            a
                                            Bid</i></button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            );
        </div>


    );
}

export default Products;