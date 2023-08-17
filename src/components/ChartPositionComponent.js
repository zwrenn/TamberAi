import React from 'react';
import { Form } from 'react-bootstrap';

const ChartPositionComponent = ({ position, setPosition }) => {
    return (
        <Form.Group controlId="position" className="chart-position">
            <Form.Label>Chart Position:</Form.Label>
            <Form.Control 
                type="number" 
                value={position}
                onChange={e => setPosition(e.target.value)}
                placeholder="Enter chart position"
            />
        </Form.Group>
    );
}

export default ChartPositionComponent;
