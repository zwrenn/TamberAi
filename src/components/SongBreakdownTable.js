import React from 'react';
import './SongBreakdownTable.css';

const SongBreakdownTable = () => {
    // Sample data for the table. Replace with your data or API fetch.
    const tableData = [
        {
            key: 'C',
            camelot: '8A',
            bpm: 120,
            introLength: '16 bars',
            introInstrumentation: 'Piano',
            // ... add other fields here
        },
        // Add other rows here
    ];

    return (
        <div className="song-breakdown-table">
            <h2>Song Breakdown</h2>
            <table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Camelot</th>
                        <th>BPM</th>
                        <th>Intro Length</th>
                        <th>Intro Instrumentation</th>
                        {/* Add other headers here */}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.key}</td>
                            <td>{row.camelot}</td>
                            <td>{row.bpm}</td>
                            <td>{row.introLength}</td>
                            <td>{row.introInstrumentation}</td>
                            {/* Add other cells here */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SongBreakdownTable;
