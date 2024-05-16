import React from 'react';
import '../assets/Home.css'
import {Link} from "react-router-dom";

function Home(props) {
    return (
        <div>
            <div>
                <div className="card bg-dark text-white">
                    <img
                        src="https://images.wallpaperscraft.com/image/single/sneakers_spray_reflection_166141_1920x1080.jpg"
                        height="540px" width="200px" className="card-img" alt="..."/>
                    <div
                        className="card-img-overlay d-flex justify-content-start align-items-center flex-column align-self-end">
                        <h5 className="card-title text-bg-danger text-center rounded-2 bg-gradient fw-bold fs-1">Welcome
                            to the latest sneaker heaven!</h5>
                        <p className="card-text text-bg-light text-danger-emphasis text-center rounded-2 fw-bold fs-4 align-self-center">Buy
                            or Sell all the HOT sneaker models on even HOTTER prices</p>
                        <Link to="/login"
                              className='btn btn-outline-danger btn-dark text-danger fw-bold fs-4 text-white'><i
                            className="fa fa-user-plus mx-2"/>Join Now!</Link>
                    </div>
                </div>
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img
                                src="https://cdn.dribbble.com/users/1117956/screenshots/4532749/jordan_square_gif_042918.gif"
                                className="img-fluid rounded-start" alt="..."/>
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title-sec">Shop all the sneakers you can imagine</h5>
                                <p className="card-text">At UMX you can shop.</p>
                                <p className="card-text"><small>Last updated 3 mins ago</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Home;