import React, { useState, useEffect } from 'react';
import './InstrumentComponent.css';

const InstrumentComponent = () => {
    
    const [selectedInstruments, setSelectedInstruments] = useState([]);
    const [instruments, setInstruments] = useState([]);

    useEffect(() => {
        async function fetchInstruments() {
            try {
                const response = await fetch('http://localhost:5001/api/instruments');
                const data = await response.json();
                setInstruments(data);
                console.log("Fetched Instruments:", data);  // <-- Add this line
            } catch (error) {
                console.error('Error fetching instruments:', error);
            }
        }
        
        fetchInstruments();
    }, []);

    const handleInstrumentChange = (event) => {
        const selectedOptions = event.target.selectedOptions;
        const selected = Array.from(selectedOptions).map(option => option.value);
        setSelectedInstruments(selected);
    };    

    return (
        <div className="instruments">
            <label htmlFor="instruments">Instruments: </label>
            <select 
                id="instruments" 
                value={selectedInstruments}
                onChange={handleInstrumentChange}
                multiple>
                {instruments.map(instrument => (
                    <option key={instrument.instrument_id} value={instrument.instrument_name}>
                        {instrument.instrument_name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default InstrumentComponent;
