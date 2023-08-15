import React, { useState, useEffect } from 'react';
import './GeographyComponent.css';

const GeographyComponent = () => {
    const [location, setLocation] = useState('');
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        async function fetchCountries() {
            try {
                const response = await fetch('http://localhost:5001/api/countries');
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        }
        
        fetchCountries();
    }, []);

    return (
        <div className="location-dropdown">
            <label htmlFor="location">Location: </label>
            <select 
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}>
                <option value="">--Select a location--</option>
                {countries.map(country => (
                    <option key={country.countryname} value={country.countryname}>
                        {country.countryname}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default GeographyComponent;
