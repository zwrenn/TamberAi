import React, { useState, useEffect } from 'react';

function SongDataComponent() {
    const [songData, setSongData] = useState(null);
    const [genre, setGenre] = useState('pop');
    const [era, setEra] = useState('1950s');
    const [year, setYear] = useState('1955');
    
    // Fetch data whenever genre, era, or year changes
    useEffect(() => {
        fetch(`/api/fetch-song-data?genre=${genre}&era=${era}&year=${year}`)
            .then(response => response.json())
            .then(data => setSongData(data))
            .catch(error => console.error('Error fetching song data:', error));
    }, [genre, era, year]);

    // Render the data
    return (
        <div>
            {songData ? (
                <>
                    <p>Popular Intro Instrumentation: {songData.popular_intro_instrumentation}</p>
                    {/* Render other song data similarly */}
                </>
            ) : (
                <p>Loading...</p> // Show a loading message or spinner while data is being fetched
            )}
        </div>
    );
}

export default SongDataComponent;
