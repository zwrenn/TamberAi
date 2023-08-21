import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Button as BootstrapButton } from 'react-bootstrap';
import ChartPositionComponent from './ChartPositionComponent';
import { Table } from 'react-bootstrap';

const InfluencerComponent = () => {
    const [era, setEra] = useState('');
    const [year, setYear] = useState(1958);
    const [songs, setSongs] = useState([]);
    const [chartPos, setChartPos] = useState('');
    const [countries, setCountries] = useState([]);
    const [location, setLocation] = useState('');
    const [keys, setKeys] = useState([]);
    const [selectedKey, setSelectedKey] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [bpm, setBpm] = useState('');
    const [commonInstruments, setCommonInstruments] = useState([]);
    const [commonKeys, setCommonKeys] = useState([]);
    const [commonBPMs, setCommonBPMs] = useState([]);
    const [commonCamelots, setCommonCamelots] = useState([]);

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
        const fetchKeys = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/keysignatures');
                const data = await response.json();
                setKeys(data);
            } catch (error) {
                console.error("Error fetching keys:", error);
            }
        };

        fetchKeys();
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

    const handleEraChange = (e) => {
        const selectedEra = e.target.value;
        setEra(selectedEra);
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
    
            setCommonInstruments(data.instruments);  
            setCommonKeys(data.keys);
            setCommonBPMs(data.bpms);
            setCommonCamelots(data.camelots);
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
                        <Form.Control as="select" value={era} onChange={handleEraChange}>
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
                            onChange={e => {
                                const selectedYear = e.target.value;
                                setYear(selectedYear);
                                updateYear(selectedYear); // Call the API to update the year
                            }}
                        />
                    </Form.Group>
                </Col>

                <Col md={2}>
                    <ChartPositionComponent position={chartPos} setPosition={setChartPos} />
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
                    <Form.Group controlId="key">
                        <Form.Label>Key:</Form.Label>
                        <Form.Control as="select" value={selectedKey} onChange={e => setSelectedKey(e.target.value)}>
                            <option value="">Select a Key</option>
                            {keys.map(key => (
                                <option key={key.keysignatureid} value={key.keysignatureid}>
                                    {key.keyname}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col md={2}>
                    <Form.Group controlId="bpm">
                        <Form.Label>BPM:</Form.Label>
                        <Form.Control 
                            type="number" 
                            value={bpm}
                            onChange={e => setBpm(e.target.value)}
                            placeholder="Enter BPM"
                        />
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

            <h3>Most Common</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Instrument Name</th>
                        <th>Key</th>
                        <th>Camelot</th>
                        <th>BPM</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        // Separate and filter top 3 instruments, keys, and BPMs
                        const topInstruments = commonInstruments.filter(item => item.type === "instrument").slice(0, 3);
                        const topKeys = commonKeys.filter(item => item.type === "key").slice(0, 3);
                        const topBPMs = commonBPMs.filter(item => item.type === "bpm").slice(0, 3);
                        const topCamelots = commonCamelots.filter(item => item.type === "camelot").slice(0, 3);

                        // Determine the maximum rows required (it would be 3 in our case)
                        const rows = Math.max(topInstruments.length, topKeys.length, topBPMs.length, topCamelots.length);

                        // Create table rows
                        const tableRows = [];
                        for (let i = 0; i < rows; i++) {
                            tableRows.push(
                                <tr key={"common-" + i}>
                                    <td>{topInstruments[i] ? topInstruments[i].name : null}</td>
                                    <td>{topKeys[i] ? topKeys[i].name : null}</td>
                                    <td>{topCamelots[i] ? topCamelots[i].name : null}</td>
                                    <td>{topBPMs[i] ? topBPMs[i].name : null}</td>
                                </tr>
                            );
                        }
                        return tableRows;
                    })()}
                </tbody>
            </Table>
        </Container>
    );
}

export default InfluencerComponent;