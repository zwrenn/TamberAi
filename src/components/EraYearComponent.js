import React, { useState } from 'react';
import './EraYearComponent.css';
import SearchButton from './SearchButton'; // Adjust the path according to your folder structure
import ChartPositionComponent from './ChartPositionComponent'; 

const EraYearComponent = () => {
    const [era, setEra] = useState('');
    const [year, setYear] = useState(1958); // Setting default year as 1958
    const [songs, setSongs] = useState([]); // State to store fetched songs
    const [chartPos, setChartPos] = useState(''); 


    const updateYear = async (selectedYear) => {
        try {
            await fetch('http://localhost:5001/api/updateYear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ year: selectedYear })
            });

            // Handle the response if needed
        } catch (error) {
            console.error('Error updating year:', error);
        }
    };

    const handleEraChange = (e) => {
        const selectedEra = e.target.value;
        setEra(selectedEra);
    };

    return (
        <div className="era-year">
            <div className="era-dropdown">
                <label htmlFor="era">Era: </label>
                <select 
                    id="era"
                    value={era}
                    onChange={handleEraChange}>
                    <option value="">--Select an era--</option>
                    <option value="1950s">1950s</option>
                    <option value="1960s">1960s</option>
                    <option value="1970s">1970s</option>
                    <option value="1980s">1980s</option>
                    <option value="1990s">1990s</option>
                    <option value="2000s">2000s</option>
                    <option value="2010s">2010s</option>
                    <option value="2020s">2020s</option>
                    {/* Add more eras as needed */}
                </select>
            </div>
            
            <div className="year-slider">
                <label htmlFor="year">Year: {year}</label>
                <input 
                    type="range" 
                    id="year" 
                    name="year" 
                    min="1958" 
                    max="2023" 
                    value={year}
                    onChange={e => {
                        const selectedYear = e.target.value;
                        setYear(selectedYear);
                        updateYear(selectedYear); // Call the API to update the year
                    }}
                />
            </div>

            <ChartPositionComponent position={chartPos} setPosition={setChartPos} />

            {/* SearchButton component */}
            <SearchButton era={era} chartPos={chartPos} onSearchResults={setSongs} />

            
            <div className="song-results">
                <ul>
                    {songs.map(song => (
                        <li key={song.id}>{song.title} by {song.artist}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default EraYearComponent;
