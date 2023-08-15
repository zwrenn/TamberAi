import React, { useState, useEffect } from 'react';

function SongList() {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/songs')
            .then(response => {
                console.log('Response:', response);
                return response.json();
            })
            .then(data => {
                console.log('Fetched Data:', data);
                setSongs(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);    

    return (
        <div>
            {songs.map(song => (
                <div key={song.id}>
                    {song.title} by {song.artist}
                </div>
            ))}
        </div>
    );
}

export default SongList;
