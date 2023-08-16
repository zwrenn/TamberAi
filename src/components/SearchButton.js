import React from 'react';

const SearchButton = ({ era, chartPos, onSearchResults }) => {
    const handleSearch = async () => {
        // Check if era or chart position is selected before making the API call
        if (!era && !chartPos) {
            alert('Please select an era or a chart position before searching.');
            return;
        }

        let url = 'http://localhost:5001/api/songs?';
        if (era) {
            url += `era=${era}`;
        }
        if (chartPos) {
            if (era) {
                url += '&';
            }
            url += `chartPos=${chartPos}`;
        }

        try {
            const response = await fetch(url);
            const songsData = await response.json();
            onSearchResults(songsData);  // send the results back to the parent component
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    return (
        <button onClick={handleSearch}>Search</button>
    );
}

export default SearchButton;
