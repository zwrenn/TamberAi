import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Button as BootstrapButton, Table } from 'react-bootstrap';

const InfluencerComponent = () => {
    const [era, setEra] = useState('');
    const [year, setYear] = useState(1958);
    const [songs, setSongs] = useState([]);
    const [countries, setCountries] = useState([]);
    const [location, setLocation] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [commonInstruments, setCommonInstruments] = useState([]);
    const [commonKeys, setCommonKeys] = useState([]);
    const [commonBPMs, setCommonBPMs] = useState([]);
    const [commonCamelots, setCommonCamelots] = useState([]);
    const [commonVerseLengths, setCommonVerseLengths] = useState([]);
    const [commonIntroLengths, setCommonIntroLengths] = useState([]);
    const [commonChorusLengths, setCommonChorusLengths] = useState([]);
    const [commonBridgeLengths, setCommonBridgeLengths] = useState([]);
    const [commonOutroLengths, setCommonOutroLengths] = useState([]);
    const [commonIntroInstrumentations, setCommonIntroInstrumentations] = useState([]);
    const [commonVerseInstrumentations, setCommonVerseInstrumentations] = useState([]);
    const [commonChorusInstrumentations, setCommonChorusInstrumentations] = useState([]);
    const [commonBridgeInstrumentations, setCommonBridgeInstrumentations] = useState([]);
    const [commonOutroInstrumentations, setCommonOutroInstrumentations] = useState([]);
    const [commonIntroChords, setCommonIntroChords] = useState([]);
    const [commonVerseChords, setCommonVerseChords] = useState([]);
    const [commonChorusChords, setCommonChorusChords] = useState([]);
    const [commonBridgeChords, setCommonBridgeChords] = useState([]);
    const [commonOutroChords, setCommonOutroChords] = useState([]);
    const [isEraDisabled, setIsEraDisabled] = useState(false);
    const [isYearDisabled, setIsYearDisabled] = useState(false);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/genres');
                const data = await response.json();
                setGenres(data);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };
    
        fetchGenres();
    }, []);
    
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/countries');
                const data = await response.json();
                console.log("Fetched countries:", data);  // Log the fetched data
                setCountries(data);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
    
        fetchCountries();
    }, []);

    const updateYear = async (selectedYear) => {
        try {
            const response = await fetch('http://localhost:5001/api/updateYear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ year: selectedYear })
            });
    
            const songsByYear = await response.json();
            setSongs(songsByYear);  // Assuming you have a state variable to store the songs
        } catch (error) {
            console.error('Error updating year:', error);
        }
    };

    const handleEraChange = (e) => {
        const selectedEra = e.target.value;
        setEra(selectedEra);
        if (selectedEra === "") { // If the user selects the default "Select an era" option
            setIsYearDisabled(false); // Enable year slider
        } else {
            setIsYearDisabled(true); // Disable year slider
            setIsEraDisabled(false); // Ensure era dropdown is enabled
        }
    };
    
    const fetchCommonData = async () => {
        console.log("era:", era);
        console.log("selectedGenre:", selectedGenre);
        console.log("location:", location);
        
        try {
            let apiUrl = `http://localhost:5001/api/popular-instruments?`;
    
            if (era) {
                apiUrl += `era=${era}`;
            }
    
            if (selectedGenre) {
                if (era) {
                    apiUrl += `&`;
                }
                apiUrl += `genre=${selectedGenre}`;
            }
    
            if (location) {
                if (era || selectedGenre) {
                    apiUrl += `&`;
                }
                apiUrl += `location=${location}`;
            }
    
            const response = await fetch(apiUrl);
            const data = await response.json();

            setCommonKeys(data.keys);
            setCommonBPMs(data.bpms);
            setCommonCamelots(data.camelots);
            setCommonVerseLengths(data.verse_lengths);
            setCommonIntroLengths(data.intro_lengths);
            setCommonChorusLengths(data.chorus_lengths);
            setCommonBridgeLengths(data.bridge_lengths);
            setCommonOutroLengths(data.outro_lengths);
            setCommonIntroInstrumentations(data.intro_combinations);
            setCommonVerseInstrumentations(data.verse_combinations);
            setCommonChorusInstrumentations(data.chorus_combinations);
            setCommonBridgeInstrumentations(data.bridge_combinations);
            setCommonOutroInstrumentations(data.outro_combinations);
            setCommonInstruments(data.instruments);  
            setCommonIntroChords(data.intro_chords);
            setCommonVerseChords(data.verse_chords);
            setCommonChorusChords(data.chorus_chords);
            setCommonBridgeChords(data.bridge_chords);
            setCommonOutroChords(data.outro_chords);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    
    return (
        <Container className="mt-4 influencer-component">
            <Row className="top-row">
                <Col md={3}>
                    <Form.Group controlId="era">
                        <Form.Label>Era:</Form.Label>
                        <Form.Control as="select" value={era} onChange={handleEraChange} disabled={isEraDisabled}>
                            <option value="">Select an era</option>
                            <option value="1950s">1950s</option>
                            <option value="1960s">1960s</option>
                            <option value="1970s">1970s</option>
                            <option value="1980s">1980s</option>
                            <option value="1990s">1990s</option>
                            <option value="2000s">2000s</option>
                            <option value="2010s">2010s</option>
                            <option value="2020s">2020s</option>
                            </Form.Control>
                    </Form.Group>
                </Col>
            
                <Col md={2}>
                    <Form.Group controlId="year">
                        <Form.Label>Year: {year}</Form.Label>
                        <Form.Control 
                            type="range" 
                            min="1958" 
                            max="2023" 
                            value={year}
                            disabled={isYearDisabled}
                            onChange={e => {
                                const selectedYear = e.target.value;
                                setYear(selectedYear);
                                updateYear(selectedYear); // Call the API to update the year
                                if (selectedYear === "1958") { // Replace with your default year if different
                                    setIsEraDisabled(false); // Enable era dropdown
                                } else {
                                    setIsEraDisabled(true); // Disable era dropdown
                                    setIsYearDisabled(false); // Ensure year slider is enabled
                                }
                            }}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="bottom-row">
                <Col md={2}>
                    <Form.Group controlId="location">
                        <Form.Label>Location:</Form.Label>
                        <Form.Control as="select" value={location} onChange={e => setLocation(e.target.value)}>
                            <option value="">--Select a Country</option>
                            {countries.map(country => (
                                <option key={country.country_id} value={country.country_id}>
                                    {country.countryname}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col md={2}>
                    <Form.Group controlId="genre">
                        <Form.Label>Genre:</Form.Label>
                        <Form.Control as="select" value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                            <option value="">Select a Genre</option>
                            {genres.map(genre => (
                                <option key={genre.genre_id} value={genre.genre_id}>
                                    {genre.genre_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Row style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <Col>
                <BootstrapButton onClick={fetchCommonData}>Search Common Data</BootstrapButton>
                </Col>
            </Row>

            <div className="common-table">
            <h3>Most Common</h3>
            <Table striped bordered hover responsive key={Math.random()}>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Camelot</th>
                        <th>BPM</th>
                        <th>Verse Length</th>
                        <th>Intro Length</th>
                        <th>Chorus Length</th>
                        <th>Bridge Length</th>
                        <th>Outro Length</th>
                        <th>Intro Instrumentation</th>
                        <th>Verse Instrumentation</th>
                        <th>Chorus Instrumentation</th>
                        <th>Bridge Instrumentation</th>
                        <th>Outro Instrumentation</th>
                        <th>Top Instrument</th>
                        <th>Intro Chords</th>
                        <th>Verse Chords</th>
                        <th>Chorus Chords</th>
                        <th>Bridge Chords</th>
                        <th>Outro Chords</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        // Separate and filter top 3 instruments, keys, and BPMs
                        const topKeys = commonKeys
                            .filter(item => item.type === "key" && item.name !== "Unknown" && item.name !== "0")
                            .slice(0, 1);
                        const topBPMs = commonBPMs.filter(item => item.type === "bpm").slice(0, 1);
                        const topCamelots = commonCamelots.filter(item => item.type === "camelot").slice(0, 1);
                        const topVerseLengths = commonVerseLengths.filter(item => item.type === "verse_length").slice(0, 1);
                        const topIntroLengths = commonIntroLengths.filter(item => item.type === "intro_length").slice(0, 1);
                        const topChorusLengths = commonChorusLengths.filter(item => item.type === "chorus_length").slice(0, 1);
                        const topBridgeLengths = commonBridgeLengths.filter(item => item.type === "bridge_length").slice(0, 1);
                        const topOutroLengths = commonOutroLengths.filter(item => item.type === "outro_length").slice(0, 1);
                        const topIntroInstrumentations = commonIntroInstrumentations && commonIntroInstrumentations.length ? 
                        commonIntroInstrumentations.filter(item => item.type === "intro_combination").slice(0, 1) : [];
                        const topVerseInstrumentations = commonVerseInstrumentations && commonVerseInstrumentations.length ? 
                        commonVerseInstrumentations.filter(item => item.type === "verse_combination").slice(0, 1) : [];
                        const topChorusInstrumentations = commonChorusInstrumentations && commonChorusInstrumentations.length ? 
                        commonChorusInstrumentations.filter(item => item.type === "chorus_combination").slice(0, 1) : [];
                        const topBridgeInstrumentations = commonBridgeInstrumentations && commonBridgeInstrumentations.length ?
                        commonBridgeInstrumentations.filter(item => item.type === "bridge_combination").slice(0, 1) : [];
                        const topOutroInstrumentations = commonOutroInstrumentations && commonOutroInstrumentations.length ?
                        commonOutroInstrumentations.filter(item => item.type === "outro_combination").slice(0, 1) : [];
                        const topInstruments = commonInstruments.filter(item => item.type === "instrument" && item.name !== "Unknown" && item.name !== "0").slice(0, 1);
                        const topIntroChords = commonIntroChords && commonIntroChords.length ?
                        commonIntroChords.filter(item => item.type === "intro_chord").slice(0, 1) : [];
                        const topVerseChords = commonVerseChords && commonVerseChords.length ?
                        commonVerseChords.filter(item => item.type === "verse_chord").slice(0, 1) : [];
                        const topChorusChords = commonChorusChords && commonChorusChords.length ?
                        commonChorusChords.filter(item => item.type === "chorus_chord").slice(0, 1) : [];
                        const topBridgeChords = commonBridgeChords && commonBridgeChords.length ?
                        commonBridgeChords.filter(item => item.type === "bridge_chord").slice(0, 1) : [];
                        const topOutroChords = commonOutroChords && commonOutroChords.length ?
                        commonOutroChords.filter(item => item.type === "outro_chord").slice(0, 1) : [];




                        // Determine the maximum rows required (it would be 3 in our case)
                        const rows = Math.max(topInstruments.length, topKeys.length, topBPMs.length, topCamelots.length);

                        // Create table rows
                            const tableRows = [];
                            for (let i = 0; i < rows; i++) {
                                if (
                                    (topInstruments[i] && topInstruments[i].name && topInstruments[i].name !== "Unknown" && topInstruments[i].name !== "0") ||
                                    (topKeys[i] && topKeys[i].name && topKeys[i].name !== "Unknown" && topKeys[i].name !== "0") ||
                                    (topCamelots[i] && topCamelots[i].name && topCamelots[i].name !== "Unknown" && topCamelots[i].name !== "0") ||
                                    (topVerseLengths[i] && topVerseLengths[i].name && topVerseLengths[i].name !== "Unknown" && topVerseLengths[i].name !== "0") ||
                                    (topIntroLengths[i] && topIntroLengths[i].name && topIntroLengths[i].name !== "Unknown" && topInstruments[i].name !== "0") ||
                                    (topChorusLengths[i] && topChorusLengths[i].name && topChorusLengths[i].name !== "Unknown" && topChorusLengths[i].name !== "0") ||
                                    (topBridgeLengths[i] && topBridgeLengths[i].name && topBridgeLengths[i].name !== "Unknown" && topBridgeLengths[i].name !== "0") ||
                                    (topOutroLengths[i] && topOutroLengths[i].name && topOutroLengths[i].name !== "Unknown" && topOutroLengths[i].name !== "0") ||
                                    (topIntroInstrumentations[i] && topIntroInstrumentations[i].name && topIntroInstrumentations[i].name !== "Unknown" && topIntroInstrumentations[i].name !== "0") ||
                                    (topVerseInstrumentations[i] && topVerseInstrumentations[i].name && topVerseInstrumentations[i].name !== "Unknown" && topVerseInstrumentations[i].name !== "0") ||
                                    (topChorusInstrumentations[i] && topChorusInstrumentations[i].name && topChorusInstrumentations[i].name !== "Unknown" && topChorusInstrumentations[i].name !== "0") ||
                                    (topBridgeInstrumentations[i] && topBridgeInstrumentations[i].name && topBridgeInstrumentations[i].name !== "Unknown" && topBridgeInstrumentations[i].name !== "0") ||
                                    (topOutroInstrumentations[i] && topOutroInstrumentations[i].name && topOutroInstrumentations[i].name !== "Unknown" && topOutroInstrumentations[i].name !== "0") ||
                                    (topIntroChords[i] && topIntroChords[i].name && topIntroChords[i].name !== "Unknown" && topIntroChords[i].name !== "0") ||
                                    (topVerseChords[i] && topVerseChords[i].name && topVerseChords[i].name !== "Unknown" && topVerseChords[i].name !== "0") ||
                                    (topChorusChords[i] && topChorusChords[i].name && topChorusChords[i].name !== "Unknown" && topChorusChords[i].name !== "0") ||
                                    (topBridgeChords[i] && topBridgeChords[i].name && topBridgeChords[i].name !== "Unknown" && topBridgeChords[i].name !== "0") ||
                                    (topOutroChords[i] && topOutroChords[i].name && topOutroChords[i].name !== "Unknown" && topOutroChords[i].name !== "0") 

                                    // ... add similar conditions for other columns ...
                                ) {
                                    tableRows.push(
                                        <tr key={"common-" + i}>
                                            <td>{topKeys[i] ? topKeys[i].name : null}</td>
                                            <td>{topCamelots[i] ? topCamelots[i].name : null}</td>
                                            <td>{topBPMs[i] ? topBPMs[i].name : null}</td>
                                            <td>{topVerseLengths[i] ? topVerseLengths[i].name : null}</td>
                                            <td>{topIntroLengths[i] ? topIntroLengths[i].name : null}</td>
                                            <td>{topChorusLengths[i] ? topChorusLengths[i].name : null}</td>
                                            <td>{topBridgeLengths[i] ? topBridgeLengths[i].name : null}</td>
                                            <td>{topOutroLengths[i] ? topOutroLengths[i].name : null}</td>
                                            <td>{topIntroInstrumentations[i] ? topIntroInstrumentations[i].name : null}</td>
                                            <td>{topVerseInstrumentations[i] ? topVerseInstrumentations[i].name : null}</td>
                                            <td>{topChorusInstrumentations[i] ? topChorusInstrumentations[i].name : null}</td> 
                                            <td>{topBridgeInstrumentations[i] ? topBridgeInstrumentations[i].name : null}</td>
                                            <td>{topOutroInstrumentations[i] ? topOutroInstrumentations[i].name : null}</td>
                                            <td>{topInstruments[i] ? topInstruments[i].name : null}</td>
                                            <td>{topIntroChords[i] ? topIntroChords[i].name : null}</td>
                                            <td>{topVerseChords[i] ? topVerseChords[i].name : null}</td>
                                            <td>{topChorusChords[i] ? topChorusChords[i].name : null}</td>
                                            <td>{topBridgeChords[i] ? topBridgeChords[i].name : null}</td>
                                            <td>{topOutroChords[i] ? topOutroChords[i].name : null}</td>
                                        </tr>
                                    );
                                }
                            }
                        return tableRows;
                    })()}
                </tbody>
            </Table>
            </div>
        </Container>
    );
}

export default InfluencerComponent;