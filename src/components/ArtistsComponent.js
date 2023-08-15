import React, { useState } from 'react';
import './ArtistsComponent.css';


const ArtistsComponent = () => {
    const [artist, setArtist] = useState('');
    const [influence, setInfluence] = useState(50); // Set to the middle of the range as a default

    return (
        <div className="artists">
            <h2>Artists</h2>

            <div>
                <label htmlFor="artist">Artist: </label>
                <input 
                    id="artist"
                    type="text"
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="influence">Influence: {influence}</label>
                <input 
                    id="influence"
                    type="range"
                    min="1"
                    max="100"
                    value={influence}
                    onChange={e => setInfluence(e.target.value)}
                />
            </div>
        </div>
    );
}

export default ArtistsComponent;
