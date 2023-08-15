import React, { useState, useEffect } from 'react';  // Import useEffect
import './KeyGenreBPMComponent.css';

const KeyGenreBPMComponent = () => {
    const [key, setKey] = useState('');
    const [genre, setGenre] = useState('');
    const [bpm, setBpm] = useState('');
    const [keySignatures, setKeySignatures] = useState([]);
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        async function fetchKeySignatures() {
            try {
                const response = await fetch('http://localhost:5001/api/keysignatures');
                const data = await response.json();
                setKeySignatures(data);
            } catch (error) {
                console.error('Error fetching keysignatures:', error);
            }
        }

        async function fetchGenres() {
            try {
                const response = await fetch('http://localhost:5001/api/genres');
                const data = await response.json();
                setGenres(data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        }
        
        fetchKeySignatures();
        fetchGenres();
    }, []);

    return (
        <div className="key-genre-bpm">
            <div className="key-dropdown">
                <label htmlFor="key">Key: </label>
                <select 
                    id="key"
                    value={key}
                    onChange={e => setKey(e.target.value)}>
                    <option value="">--Select a key--</option>
                    {keySignatures.map(keySignature => (
                        <option key={keySignature.keyname} value={keySignature.keyname}>
                            {keySignature.keyname}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="genre-dropdown">
                <label htmlFor="genre">Genre: </label>
                <select 
                    id="genre"
                    value={genre}
                    onChange={e => setGenre(e.target.value)}>
                    <option value="">--Select a genre--</option>
                    {genres.map(genreItem => (
                        <option key={genreItem.genre_name} value={genreItem.genre_name}>
                            {genreItem.genre_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bpm-input">
                <label htmlFor="bpm">BPM: </label>
                <input 
                    type="number" 
                    id="bpm" 
                    name="bpm" 
                    value={bpm}
                    onChange={e => setBpm(e.target.value)}
                    placeholder="Enter BPM"
                />
            </div>
        </div>
    );
}

export default KeyGenreBPMComponent;
