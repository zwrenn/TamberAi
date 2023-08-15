import React, { useState } from 'react';
import './QuickSearchComponent.css';

const QuickSearchComponent = () => {
    const [song, setSong] = useState('');
    const [artist, setArtist] = useState('');

    return (
        <div className="quick-search">
            <div className="song-input">
                <label htmlFor="song">Song: </label>
                <input 
                    type="text" 
                    id="song" 
                    name="song" 
                    value={song}
                    onChange={e => setSong(e.target.value)}
                    placeholder="Enter song name"
                />
            </div>

            <div className="artist-input">
                <label htmlFor="artist">Artist: </label>
                <input 
                    type="text" 
                    id="artist" 
                    name="artist" 
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                    placeholder="Enter artist name"
                />
            </div>
        </div>
    );
}

export default QuickSearchComponent;
