import React, { useState } from 'react';

const SongsComponent = () => {
    const [song1, setSong1] = useState('');
    const [song2, setSong2] = useState('');
    const [influence1, setInfluence1] = useState(50); // Initializing to 50 (midpoint).
    const [influence2, setInfluence2] = useState(50); // Initializing to 50 (midpoint).

    return (
        <div className="p-4 border rounded shadow-sm">
            <h2>Songs</h2>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="song1" className="form-label">Song 1: </label>
                    <input 
                        id="song1"
                        type="text"
                        className="form-control"
                        value={song1}
                        onChange={e => setSong1(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="influence1" className="form-label">Influence: {influence1}</label>
                    <input 
                        id="influence1"
                        type="range"
                        className="form-range"
                        min="1"
                        max="100"
                        value={influence1}
                        onChange={e => setInfluence1(e.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="song2" className="form-label">Song 2: </label>
                    <input 
                        id="song2"
                        type="text"
                        className="form-control"
                        value={song2}
                        onChange={e => setSong2(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="influence2" className="form-label">Influence: {influence2}</label>
                    <input 
                        id="influence2"
                        type="range"
                        className="form-range"
                        min="1"
                        max="100"
                        value={influence2}
                        onChange={e => setInfluence2(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default SongsComponent;
