import React, { useState } from 'react';

const AddCardModal = ({ show, handleClose, handleAddCard }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardType, setCardType] = useState('unknown');

    const handleCardNumberChange = (e) => {
        const number = e.target.value;
        setCardNumber(number);
        setCardType(getCardBrand(number));
    };

    const getCardBrand = (number) => {
        const regexPatterns = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/,
            maestro: /^(5018|5020|5038|6304|6759|676[1-3])/,
        };
        for (const [brand, regex] of Object.entries(regexPatterns)) {
            if (regex.test(number)) {
                return brand;
            }
        }
        return 'unknown';
    };

    const handleSubmit = () => {
        if (cardNumber && cardName) {
            handleAddCard(cardType, cardNumber, cardName);
            setCardNumber('');
            setCardName('');
            setCardType('unknown');
            handleClose();
        }
    };

    return (
        <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Card</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Name on Card"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            className="form-control mb-2"
                        />
                        <p>Card Type: {cardType}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Add Card</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCardModal;
