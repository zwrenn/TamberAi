import React, { useState } from 'react';
import './TargetGeographyComponent.css';

const TargetGeographyComponent = () => {
    const [continent, setContinent] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');

    // Sample data for dropdowns, you can replace these with your actual data
    const continents = ['North America', 'Europe'];
    const countries = {
        'North America': ['United States', 'Canada'],
        'Europe': ['France', 'Germany']
    };
    const states = {
        'United States': ['California', 'New York'],
        'Canada': ['Ontario', 'Quebec'],
        'France': ['Île-de-France', 'Occitanie'],
        'Germany': ['Bavaria', 'North Rhine-Westphalia']
    };
    
    const cities = {
        'California': ['Los Angeles', 'San Francisco'],
        'New York': ['New York City', 'Buffalo'],
        'Ontario': ['Toronto', 'Ottawa'],
        'Quebec': ['Montreal', 'Quebec City'],
        'Île-de-France': ['Paris'],
        'Occitanie': ['Toulouse'],
        'Bavaria': ['Munich'],
        'North Rhine-Westphalia': ['Cologne']
    };
    

    return (
        <div className="target-geography">
            <h2>Target Geography</h2>

            {/* Continent */}
            <div>
                <label htmlFor="continent">Continent: </label>
                <select 
                    id="continent" 
                    value={continent}
                    onChange={e => {
                        setContinent(e.target.value);
                        setCountry('');
                        setState('');
                        setCity('');
                    }}
                >
                    <option value="">Select a Continent</option>
                    {continents.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Country */}
            {continent && (
                <div>
                    <label htmlFor="country">Country: </label>
                    <select 
                        id="country" 
                        value={country}
                        onChange={e => {
                            setCountry(e.target.value);
                            setState('');
                            setCity('');
                        }}
                    >
                        <option value="">Select a Country</option>
                        {countries[continent].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            )}

            {/* State */}
            {country && states[country] && (
                <div>
                    <label htmlFor="state">State: </label>
                    <select 
                        id="state" 
                        value={state}
                        onChange={e => {
                            setState(e.target.value);
                            setCity('');
                        }}
                    >
                        <option value="">Select a State</option>
                        {states[country].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            )}

            {/* City */}
{state && cities[state] && (
    <div>
        <label htmlFor="city">City: </label>
        <select 
            id="city" 
            value={city}
            onChange={e => setCity(e.target.value)}
        >
            <option value="">Select a City</option>
            {cities[state].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
    </div>
)}

        </div>
    );
}

export default TargetGeographyComponent;
