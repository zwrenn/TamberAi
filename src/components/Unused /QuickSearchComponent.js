import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import './QuickSearchComponent.css';

const QuickSearchComponent = () => {
    const [song, setSong] = useState('');
    const [artist, setArtist] = useState('');

    return (
        <div className="quick-search">
            <Form.Group controlId="song">
                <Form.Label>Song:</Form.Label>
                <Form.Control
                    type="text"
                    value={song}
                    onChange={e => setSong(e.target.value)}
                    placeholder="Enter song name"
                />
            </Form.Group>

            <Form.Group controlId="artist">
                <Form.Label>Artist:</Form.Label>
                <Form.Control
                    type="text"
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                    placeholder="Enter artist name"
                />
            </Form.Group>
        </div>
    );
}

export default QuickSearchComponent;
