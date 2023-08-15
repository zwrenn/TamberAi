import React, { useState } from 'react';
import './SongsComponent.css';

const SongsComponent = () => {
    const [song1, setSong1] = useState('');
    const [song2, setSong2] = useState('');
    const [influence1, setInfluence1] = useState(50); // Initializing to 50 (midpoint).
    const [influence2, setInfluence2] = useState(50); // Initializing to 50 (midpoint).

    return (
        <div className="songs">
            <h2>Songs</h2>

            <div>
                <label htmlFor="song1">Song 1: </label>
                <input 
                    id="song1"
                    type="text"
                    value={song1}
                    onChange={e => setSong1(e.target.value)}
                />
                <label htmlFor="influence1">Influence: {influence1}</label>
                <input 
                    id="influence1"
                    type="range"
                    min="1"
                    max="100"
                    value={influence1}
                    onChange={e => setInfluence1(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="song2">Song 2: </label>
                <input 
                    id="song2"
                    type="text"
                    value={song2}
                    onChange={e => setSong2(e.target.value)}
                />
                <label htmlFor="influence2">Influence: {influence2}</label>
                <input 
                    id="influence2"
                    type="range"
                    min="1"
                    max="100"
                    value={influence2}
                    onChange={e => setInfluence2(e.target.value)}
                />
            </div>
        </div>
    );
}

export default SongsComponent;
