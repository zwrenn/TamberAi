import React from 'react';
import { Button } from 'react-bootstrap';

const SearchButton = ({
    searchText,
    era,
    year,
    showEra,
    chartPos,
    location,
    selectedKey,
    selectedGenre,
    bpm,
    selectedCamelotId,
    selectedChords,
    selectedInstruments,
    onSearchResults,
    onPopularParams,
    ...otherProps
}) => {
    const handleSearch = async () => {
        let url = 'http://localhost:5001/api/songs?';
    
        if (searchText) {
            url += `search=${searchText}&`;
        }

        console.log("Debug: Entering handleSearch");

        if (showEra && era) {
            console.log("Debug: Adding era");
            url += `era=${era}&`;
        } else if (!showEra && year) {
            console.log("Debug: Adding year");
            url += `year=${year}&`;
        } 
    
        if (chartPos) {
            url += `chartPos=${chartPos}&`;
        }
    
        if (location) {
            url += `location=${location}&`;
        }

        if (selectedKey && selectedKey.id) {
            url += `key=${selectedKey.id}&`;
        }               

        if (selectedGenre) {
            url += `genre=${selectedGenre}&`;
        }
    
        if (bpm) {
            url += `bpm=${bpm}&`;
        }

        if (selectedCamelotId) {
            url += `camelot=${selectedCamelotId.id}&`; // Assuming selectedCamelotId is an object with an "id" property
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
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };    

    return (
        <Button variant="primary" onClick={handleSearch} {...otherProps}>
            Search
        </Button>
    );
};

export default SearchButton;
