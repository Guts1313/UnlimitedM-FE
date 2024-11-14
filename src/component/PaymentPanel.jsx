import React, {useEffect, useState} from 'react';
import SideNav from "./SideNav";
import maestro from '../assets/maestro.png';
import Swiper from "./Swiper";
import visaLogo from '../assets/visa.png';
import mastercardLogo from '../assets/mastercard.jpg';
import CustomSwiper from './Swiper'; // Adjust the import if the path is different
import AddCardModal from './AddCardModal';
import axios from "axios";

const PaymentOptions = () => {
    const [cardList, setCardList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/payments/listpaymentoptions`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(response => {
                setCardList(response.data);
                const newSlides = response.data.map(card => {
                    const brandLogos = {
                        visa: visaLogo,
                        mastercard: mastercardLogo,
                        maestro: maestro,
                        unknown: null,
                    };
                    return (
                        <div className="card-slide text-white" key={card.id}>
                            <img src={brandLogos[card.cardType]} alt={card.cardType} className="card-logo" />
                            <p className="card-number text-white">{card.cardNumber}</p>
                            <p className="card-name text-white">{card.cardName}</p>
                        </div>
                    );
                });
                setSlides(newSlides);
            })
            .catch(error => {
                console.error('Error fetching payment methods:', error);
            });
    }, []);

    const handleAddCard = (cardType, cardNumber, cardName, expirationDate, cvv) => {
        const lastFourDigits = cardNumber.slice(-4);
        const formattedNumber = '**** **** **** ' + lastFourDigits;

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/payments/add`, {
            cardType,
            cardNumber: formattedNumber,
            cardName,
            expirationDate,
            cvv
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(response => {
                const newCard = response.data;
                setCardList([...cardList, newCard]);
                const brandLogos = {
                    visa: visaLogo,
                    mastercard: mastercardLogo,
                    maestro: maestro,
                    unknown: null,
                };
                const newSlide = (
                    <div className="card-slide text-white" key={newCard.id}>
                        <img src={brandLogos[newCard.cardType]} alt={newCard.cardType} className="card-logo" />
                        <p className="card-number text-white">{newCard.cardNumber}</p>
                        <p className="card-name text-white">{newCard.cardName}</p>
                    </div>
                );
                setSlides([...slides, newSlide]);
            })
            .catch(error => {
                console.error('Error adding payment method:', error);
            });
    };


    return (
        <div className="container-fluid vh-100 w-100 bg-gradient rounded-5 d-flex border-top justify-content-center border-danger overflow-hidden">
            <SideNav />
            <div className="container-fluid mw-100 d-flex flex-column justify-content-center align-self-baseline h-100">
                <h1 className="text-center text-white">
                    My payment methods <i className={"fa fa-cc-mastercard"}></i><i className={"fa fa-cc-visa px-1 text-success"}></i><i
                    className={"fa fa-cc-amex text-danger"}></i><i className={""}><img src={maestro} height={'100'} alt={"maestro"} className={"pb-2"}></img></i>
                </h1>
                <div className={""}>
                    <CustomSwiper slides={slides} />
                </div>

                <div
                    className="container-fluid mw-100 h-100 d-flex flex-column justify-content-center mx-1 h-100 align-content-center my-1 p-5 align-items-center align-self-center">
                    <h1 className="w-50 h-25 d-flex justify-content-center text-white"><i className={"fa fa-credit-card text-white"}></i>
                        Add new payment method
                    </h1>
                    <div className="container-fluid rounded-4 bg-dark  w-50  h-25 d-flex flex-row align-items-center align-self-center justify-content-center">
                        <i className="fa fa-plus-circle text-danger" onClick={() => setShowModal(true)}>Add</i>
                    </div>
                </div>
            </div>
            <AddCardModal show={showModal} handleClose={() => setShowModal(false)} handleAddCard={handleAddCard} />
        </div>
    );
};

export default PaymentOptions;
