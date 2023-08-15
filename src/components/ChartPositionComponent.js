import React, { useState } from 'react';
import './ChartPositionComponent.css';


const ChartPositionComponent = () => {
    const [position, setPosition] = useState(''); // Initial value as an empty string

    return (
        <div className="chart-position">
            <label htmlFor="position">Chart Position: </label>
            <input 
                type="number" 
                id="position" 
                name="position" 
                value={position}
                onChange={e => setPosition(e.target.value)}
                placeholder="Enter chart position"
            />
        </div>
    );
}

export default ChartPositionComponent;
