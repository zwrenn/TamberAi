import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EraYearComponent from './EraYearComponent';
import './AdvancedSearchComponent.css';

const AdvancedSearchComponent = () => {
    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col lg={10}>
                    <div className="text-center mb-5">
                        <h2 className="display-4">Discover with Advanced Search</h2>
                        <p className="lead mt-3">
                            Find what you're looking for quickly and effortlessly.
                        </p>
                    </div>
                    <div className="rounded p-5 shadow">
                        <EraYearComponent />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default AdvancedSearchComponent;
