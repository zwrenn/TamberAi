import React from 'react';
import './OutputTableComponent.css';

const OutputTableComponent = () => {
    // Sample data, you can replace this with actual data fetched from an API or state.
    const sampleData = [
        {
            key: 'C',
            camelot: '8B',
            bpm: 128,
            introLength: '16 bars',
            introInstrumentation: 'Drums, Bass',
            verseLength: '32 bars',
            verseInstrumentation: 'Drums, Bass, Synth',
            preChorusLength: '8 bars',
            preChorusInstrumentation: 'Drums, Vocals',
            chorusLength: '16 bars',
            chorusInstrumentation: 'Drums, Bass, Vocals, Synth',
            bridgeLength: '8 bars',
            bridgeInstrumentation: 'Synth, Vocals',
            outroLength: '16 bars',
            outroInstrumentation: 'Drums, Bass'
        },
        // ... More sample data as required
    ];

    return (
        <div className="output-table">
            <h2>Output Table</h2>
            <table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Camelot</th>
                        <th>BPM</th>
                        <th>Intro Length</th>
                        <th>Intro Instrumentation</th>
                        <th>Verse Length</th>
                        <th>Verse Instrumentation</th>
                        <th>Pre-Chorus Length</th>
                        <th>Pre-Chorus Instrumentation</th>
                        <th>Chorus Length</th>
                        <th>Chorus Instrumentation</th>
                        <th>Bridge Length</th>
                        <th>Bridge Instrumentation</th>
                        <th>Outro Length</th>
                        <th>Outro Instrumentation</th>
                    </tr>
                </thead>
                <tbody>
                    {sampleData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.key}</td>
                            <td>{row.camelot}</td>
                            <td>{row.bpm}</td>
                            <td>{row.introLength}</td>
                            <td>{row.introInstrumentation}</td>
                            <td>{row.verseLength}</td>
                            <td>{row.verseInstrumentation}</td>
                            <td>{row.preChorusLength}</td>
                            <td>{row.preChorusInstrumentation}</td>
                            <td>{row.chorusLength}</td>
                            <td>{row.chorusInstrumentation}</td>
                            <td>{row.bridgeLength}</td>
                            <td>{row.bridgeInstrumentation}</td>
                            <td>{row.outroLength}</td>
                            <td>{row.outroInstrumentation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OutputTableComponent;
