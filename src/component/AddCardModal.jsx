import React, {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';


const AddCardModal = ({show, handleClose, handleAddCard}) => {
    const [cardType, setCardType] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddCard(cardType, cardNumber, cardName, expirationDate, cvv);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className={'bg-black text-white'}>
                <Modal.Title className={'text-danger text-center w-100'}>Add New Card</Modal.Title>
            </Modal.Header>
            <Modal.Body className={'bg-black text-white'}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formCardType">
                        <Form.Label>Card Type</Form.Label>
                        <Form.Control
                            as="select"
                            value={cardType}
                            onChange={(e) => setCardType(e.target.value)}
                            required
                        >
                            <option value="">Select card type...</option>
                            <option value="visa">Visa</option>
                            <option value="mastercard">MasterCard</option>
                            <option value="maestro">Maestro</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formCardNumber">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formCardName">
                        <Form.Label>Card Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formExpirationDate">
                        <Form.Label>Expiration Date</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="MM/YY"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formCvv">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className={'btn-outline-danger bg-black my-3 '}>
                        Add Card
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCardModal;

