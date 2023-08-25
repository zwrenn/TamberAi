import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

const ArtistsComponent = () => {
    const [artist, setArtist] = useState('');
    const [influence, setInfluence] = useState(50); // Set to the middle of the range as a default

    return (
        <Container className="artist-container">
            <h2>Artists</h2>

            <Row className="align-items-center">
                <Col md={3}>
                    <Form.Label htmlFor="artist">Artist:</Form.Label>
                </Col>
                <Col md={3}>
                    <Form.Control 
                        id="artist"
                        type="text"
                        value={artist}
                        onChange={e => setArtist(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label htmlFor="influence">Influence: {influence}</Form.Label>
                </Col>
                <Col md={3}>
                    <Form.Control 
                        id="influence"
                        type="range"
                        min="1"
                        max="100"
                        value={influence}
                        onChange={e => setInfluence(e.target.value)}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default ArtistsComponent;
