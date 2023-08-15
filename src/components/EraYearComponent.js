import React, { useState } from 'react';
import './EraYearComponent.css';

const EraYearComponent = () => {
    const [era, setEra] = useState('');
    const [year, setYear] = useState(1958); // Setting default year as 1958

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

    const handleEraChange = async (e) => {
        const selectedEra = e.target.value;
        setEra(selectedEra);

        // Assuming you have an API endpoint to send the selected era
        try {
            await fetch('http://localhost:5001/api/updateEra', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ era: selectedEra })
            });

            // Handle the response if needed
        } catch (error) {
            console.error('Error updating era:', error);
        }
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
        </div>
    );
}

export default EraYearComponent;
