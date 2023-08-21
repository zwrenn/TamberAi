import React, { useState } from 'react';
import './ChordsComponent.css';


const ChordsComponent = () => {
    const [chords, setChords] = useState('');

    return (
        <div className="chords">
            <label htmlFor="chords">Cords: </label>
            <input 
                type="text" 
                id="chords" 
                name="chords" 
                value={chords}
                onChange={e => setChords(e.target.value)}
                placeholder="Enter chords separated by commas"
            />
        </div>
    );
}

export default ChordsComponent;
