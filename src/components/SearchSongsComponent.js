import React from 'react';
import './SearchSongsComponent.css';

const SearchSongsComponent = ({ songs }) => {
    return (
        <div className="song-table">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Year</th>
                        <th>Genre</th>
                        <th>BPM</th>
                        <th>Key</th>
                        <th>Intro Chords</th>
                        <th>Intro Length</th>
                        <th>Intro Instrumentation</th>
                        <th>Verse Chords</th>
                        <th>Verse Length</th>
                        <th>Verse Instrumentation</th>
                        <th>Chorus Chords</th>
                        <th>Chorus Length</th>
                        <th>Chorus Instrumentation</th>
                        <th>Pre-Chorus Chords</th>
                        <th>Pre-Chorus Length</th>
                        <th>Pre-Chorus Instrumentation</th>
                        <th>Bridge Chords</th>
                        <th>Bridge Length</th>
                        <th>Bridge Instrumentation</th>
                        <th>Outro Chords</th>
                        <th>Outro Length</th>
                        <th>Outro Instrumentation</th>
                        <th>Chart Position</th>
                        <th>Country</th>
                        <th>Era</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map(song => (
                        <tr key={song.id}>
                            <td>{song.title}</td>
                            <td>{song.artist}</td>
                            <td>{song.year}</td>
                            <td>{song.genre}</td>
                            <td>{song.bpm}</td>
                            <td>{song.key}</td>
                            <td>{song["Intro Chords"]}</td>
                            <td>{song["Intro Length"]}</td>
                            <td>{song["Intro Instrumentation"]}</td>
                            <td>{song["Verse Chords"]}</td>
                            <td>{song["Verse Length"]}</td>
                            <td>{song["Verse Instrumentation"]}</td>
                            <td>{song["Chorus Chords"]}</td>
                            <td>{song["Chorus Length"]}</td>
                            <td>{song["Chorus Instrumentation"]}</td>
                            <td>{song["Pre-Chorus Chords"]}</td>
                            <td>{song["Pre-Chorus Length"]}</td>
                            <td>{song["Pre-Chorus Instrumentation"]}</td>
                            <td>{song["Bridge Chords"]}</td>
                            <td>{song["Bridge Length"]}</td>
                            <td>{song["Bridge Instrumentation"]}</td>
                            <td>{song["Outro Chords"]}</td>
                            <td>{song["Outro Length"]}</td>
                            <td>{song["Outro Instrumentation"]}</td>
                            <td>{song["Chart Pos"]}</td>
                            <td>{song.location}</td>
                            <td>{song.era}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SearchSongsComponent;
