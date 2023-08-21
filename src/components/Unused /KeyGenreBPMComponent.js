import React, { useState, useEffect } from 'react';  
import './KeyGenreBPMComponent.css';

const KeyGenreBPMComponent = () => {
    const [key, setKey] = useState('');
    const [genre, setGenre] = useState('');
    const [bpm, setBpm] = useState('');
    const [keySignatures, setKeySignatures] = useState([]);
    const [genres, setGenres] = useState([]);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        async function fetchKeySignatures() {
            try {
                const response = await fetch('http://localhost:5001/api/keysignatures');
                const data = await response.json();
                console.log('Key Signatures Data:', data); // Add this line
                setKeySignatures(data);
            } catch (error) {
                console.error('Error fetching keysignatures:', error);
            }
        }
        
        async function fetchGenres() {
            try {
                const response = await fetch('http://localhost:5001/api/genres');
                const data = await response.json();
                console.log('Genres Data:', data); // Add this line
                setGenres(data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        }        
        
        fetchKeySignatures();
        fetchGenres();
    }, []);

    const handleSearch = async () => {
        try {
            let url = 'http://localhost:5001/api/search-songs?';
    
            if (key && key !== '0') {
                url += `key=${key}&`;
            }
            if (genre && genre !== '24') {
                url += `genre=${genre}&`;
            }
            if (bpm) {
                url += `bpm=${bpm}`;
            }
    
            if (url.endsWith('&')) {
                url = url.slice(0, -1);
            }
            
            // Log the URL before sending the request
            console.log("Fetching URL:", url);
    
            const response = await fetch(url);
            const songsResult = await response.json();
            setSongs(songsResult);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    return (
        <div className="key-genre-bpm">
            <div className="key-dropdown">
                <label htmlFor="key">Key: </label>
                <select 
                    id="key"
                    value={key}
                    onChange={e => setKey(e.target.value)}>
                    <option key="unknownKey" value="0">Unknown</option>
                    {keySignatures.filter(ks => ks.id !== 0).map(keySignature => (
                        <option key={keySignature.id} value={keySignature.id}>
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
                    <option key="unknownGenre" value="24">Unknown</option>
                    {genres.filter(g => g.id !== 24).map(genreItem => (
                        <option key={genreItem.id} value={genreItem.id}>
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
