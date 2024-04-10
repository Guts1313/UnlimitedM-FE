import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import '../styling/index.module.css'
const NavigationBar = () => {
    return (
        // eslint-disable-next-line no-undef
        <Navbar className="navbar-container" bg="light" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                        <Nav.Link href="#disabled" disabled>Disabled</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
