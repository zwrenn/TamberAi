import React from 'react';
import { Button } from 'react-bootstrap';

const SearchButton = ({ era, chartPos, location, selectedKey, selectedGenre, bpm, selectedChords, selectedInstruments, onSearchResults, onPopularParams }) => {
    const handleSearch = async () => {
        if (!era && !chartPos && !location && !selectedKey && !selectedGenre && !bpm && (!selectedChords || selectedChords.length === 0) && (!selectedInstruments || selectedInstruments.length === 0)) {
            alert('Please select an era, a chart position, a location, a key, a genre, or a BPM before searching.');
            return;
        }
    
        let url = 'http://localhost:5001/api/songs?';
    
        if (era) {
            url += `era=${era}&`;
        }
        if (chartPos) {
            url += `chartPos=${chartPos}&`;
        }
        if (location) {
            url += `location=${location}&`;
        }
        if (selectedKey) {
            url += `key=${selectedKey}&`;
        }
        if (selectedGenre) {
            url += `genre=${selectedGenre}&`;
        }
        if (bpm) {
            url += `bpm=${bpm}&`;
        }
        if (selectedInstruments && selectedInstruments.length > 0) {
            url += `instruments=${JSON.stringify(selectedInstruments)}&`;
        }
        if (selectedChords && selectedChords.length > 0) {
            url += `chords=${selectedChords.join(',')}&`; // Convert array to comma-separated string
        }
    
        // Remove trailing '&' if it exists
        if (url.endsWith('&')) {
            url = url.slice(0, -1);
        }
    
        try {
            // Fetching songs data
            const response = await fetch(url);
            const songsData = await response.json();
            onSearchResults(songsData);

            // Fetching popular parameters
            const paramsUrl = `http://localhost:5001/api/popular-params?era=${era}&country=${location}&genre=${selectedGenre}`;
            const paramsResponse = await fetch(paramsUrl);
            const popularParamsData = await paramsResponse.json();
            onPopularParams(popularParamsData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <Button variant="primary" onClick={handleSearch}>
            Search
        </Button>
    );
}

export default SearchButton;
