import React, { useState } from 'react';
import './SectionDetailsComponent.css';

const SectionDetailsComponent = () => {
    const [activeTab, setActiveTab] = useState('Verse');  // Default to 'Verse' tab

    // Sample data for demonstration purposes
    const sampleData = {
        'Verse': {
            mostCommon: 'Guitar',
            mostCommonCombo: 'Guitar, Drums',
            instrumentPresence: {
                'Guitar': 50,
                'Piano': 30,
                'Drums': 20
            },
            combinations: [
                { combo: 'Guitar, Drums', count: 10 },
                { combo: 'Piano, Vocals', count: 5 }
            ]
        },
        'Pre-Chorus': {
            mostCommon: 'Piano',
            mostCommonCombo: 'Piano, Vocals',
            instrumentPresence: {
                'Piano': 60,
                'Vocals': 25,
                'Guitar': 15
            },
            combinations: [
                { combo: 'Piano, Vocals', count: 12 },
                { combo: 'Guitar, Piano', count: 4 }
            ]
        },
        'Chorus': {
            mostCommon: 'Drums',
            mostCommonCombo: 'Drums, Guitar',
            instrumentPresence: {
                'Drums': 55,
                'Guitar': 35,
                'Piano': 10
            },
            combinations: [
                { combo: 'Drums, Guitar', count: 11 },
                { combo: 'Piano, Vocals', count: 3 }
            ]
        },
        'Bridge': {
            mostCommon: 'Violin',
            mostCommonCombo: 'Violin, Flute',
            instrumentPresence: {
                'Violin': 45,
                'Flute': 40,
                'Piano': 15
            },
            combinations: [
                { combo: 'Violin, Flute', count: 9 },
                { combo: 'Piano, Violin', count: 4 }
            ]
        },
        'Outro': {
            mostCommon: 'Flute',
            mostCommonCombo: 'Flute, Piano',
            instrumentPresence: {
                'Flute': 65,
                'Piano': 25,
                'Drums': 10
            },
            combinations: [
                { combo: 'Flute, Piano', count: 7 },
                { combo: 'Drums, Flute', count: 5 }
            ]
        }
    };

    return (
        <div className="section-details">
            <div className="tabs">
                {['Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Outro'].map(tab => (
                    <button 
                        key={tab}
                        className={activeTab === tab ? 'active' : ''}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content for active tab */}
            <div className="tab-content">
                <p><strong>Most Common:</strong> {sampleData[activeTab].mostCommon}</p>
                <p><strong>Most Common Instrument Combination:</strong> {sampleData[activeTab].mostCommonCombo}</p>

                {/* Bar Chart */}
                <div className="bar-chart">
                    {Object.keys(sampleData[activeTab].instrumentPresence).map(instrument => (
                        <div 
                            key={instrument}
                            className="bar" 
                            style={{height: `${sampleData[activeTab].instrumentPresence[instrument]}%`}}
                        >
                            {instrument}
                        </div>
                    ))}
                </div>

                {/* Combination Table */}
                <table className="combo-table">
                    <thead>
                        <tr>
                            <th>Instrument Combination</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleData[activeTab].combinations.map((combo, index) => (
                            <tr key={index}>
                                <td>{combo.combo}</td>
                                <td>{combo.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SectionDetailsComponent;
