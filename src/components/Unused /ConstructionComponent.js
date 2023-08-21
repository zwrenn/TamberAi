import React, { useState } from 'react';
import './ConstructionComponent.css';

const ConstructionComponent = () => {
    const [keySignature, setKeySignature] = useState('');
    const [genre, setGenre] = useState('');
    const [bpm, setBpm] = useState('');
    const [camelot, setCamelot] = useState('');

    return (
        <div className="construction">
            <h2>Construction</h2>
            {/* Key Signature */}
            <div>
                <label htmlFor="keySignature">Key Signature: </label>
                <select 
                    id="keySignature" 
                    value={keySignature}
                    onChange={e => setKeySignature(e.target.value)}
                >
                    {/* Add your list of keys here */}
                    <option value="C">C</option>
                    <option value="D">D</option>
                    {/* ... */}
                </select>
            </div>

            {/* Camelot */}
            <div>
                <label htmlFor="camelot">Camelot: </label>
                <select 
                    id="camelot" 
                    value={camelot}
                    onChange={e => setCamelot(e.target.value)}
                >
                    {/* Add your list of camelots here */}
                    <option value="1A">1A</option>
                    <option value="1B">1B</option>
                    {/* ... */}
                </select>
            </div>

            {/* Genre */}
            <div>
                <label htmlFor="genre">Genre: </label>
                <select 
                    id="genre" 
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                >
                    {/* Add your list of genres here */}
                    <option value="pop">Pop</option>
                    <option value="rock">Rock</option>
                    {/* ... */}
                </select>
            </div>

            {/* BPM */}
            <div>
                <label htmlFor="bpm">BPM: </label>
                <input 
                    type="number" 
                    id="bpm" 
                    value={bpm}
                    onChange={e => setBpm(e.target.value)}
                />
            </div>
        </div>
    );
}

export default ConstructionComponent;
