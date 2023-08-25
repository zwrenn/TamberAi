import React from 'react';
import './ResultsTable.css';

const ResultsTable = ({ results, title }) => {
    return (
        <div className="results-table">
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Song</th>
                        <th>Artist</th>
                        {/* Add more columns as needed */}
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <tr key={index}>
                            <td>{result.song}</td>
                            <td>{result.artist}</td>
                            {/* Add more columns as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ResultsTable;
