import React from 'react';
import '../assets/Home.css'
import {Link} from "react-router-dom";
function Home(props) {
    return (
        <div>
            <div>
                <div className="card bg-dark text-white">
                    <img src="https://images.wallpaperscraft.com/image/single/sneakers_spray_reflection_166141_1920x1080.jpg" height="540px" width="200px" className="card-img" alt="..."/>
                    <div className="card-img-overlay d-flex justify-content-start align-items-center flex-column align-self-end">
                        <h5 className="card-title text-bg-danger text-center rounded-2 bg-gradient fw-bold fs-1">Welcome to the latest sneaker heaven!</h5>
                        <p className="card-text text-bg-light text-danger text-center rounded-2 fw-bold fs-4 align-self-center">Buy or Sell all the HOT sneaker models on even HOTTER prices</p>
                        <Link to="/login" className='btn btn-outline-danger btn-dark text-danger fw-bold fs-4 text-white'><i className="fa fa-user-plus mx-2"/>Join Now!</Link>
                    </div>
                </div>

            </div>
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="" className="d-block w-100" alt="..."/>
                    </div>
                    <div className="carousel-item">
                        <img src="..." className="d-block w-100" alt="..."/>
                    </div>
                    <div className="carousel-item">
                        <img src="..." className="d-block w-100" alt="..."/>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"
                        data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"
                        data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}

export default Home;