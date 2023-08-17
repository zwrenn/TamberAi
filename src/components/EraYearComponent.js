import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Button as BootstrapButton } from 'react-bootstrap';
import SearchButton from './SearchButton';
import ChartPositionComponent from './ChartPositionComponent';
import Select from 'react-select';
import SearchSongsComponent from './SearchSongsComponent';
import './EraYearComponent.css';

const EraYearComponent = () => {
    const [era, setEra] = useState('');
    const [year, setYear] = useState(1958); // Setting default year as 1958
    const [songs, setSongs] = useState([]); // State to store fetched songs
    const [chartPos, setChartPos] = useState('');
    const [countries, setCountries] = useState([]);
    const [location, setLocation] = useState('');
    const [keys, setKeys] = useState([]);
    const [selectedKey, setSelectedKey] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [bpm, setBpm] = useState('');
    const [instruments, setInstruments] = useState([]);
    const [selectedInstruments, setSelectedInstruments] = useState([]);
    const [chords, setChords] = useState([]); // New state for selected chords
    const [selectedChords, setSelectedChords] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchChords = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/chords');
                const data = await response.json();
                setChords(data);
            } catch (error) {
                console.error("Error fetching chord options:", error);
            }
        };

        fetchChords();
    }, []);

    useEffect(() => {
        const fetchInstruments = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/instruments');
                const data = await response.json();
                setInstruments(data);
            } catch (error) {
                console.error("Error fetching instruments:", error);
            }
        };

        fetchInstruments();
    }, []);

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

    const handleSearchTextChange = (e) => {
        const newText = e.target.value;
        setSearchText(newText);
    };

    return (
        <Container className="mt-4">
            <h2> Advanced Search </h2>

            <Row>
                <Col md={4}>
                    <Form.Group controlId="era">
                        <Form.Label>Era:</Form.Label>
                        <Form.Control as="select" value={era} onChange={handleEraChange}>
                            <option value="">--Select an era--</option>
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
            
                <Col md={4}>
                    <Form.Group controlId="instruments">
                        <Form.Label>Instruments:</Form.Label>
                        <Select 
                            isMulti
                            options={instruments.map(instrument => ({ value: instrument.instrument_id, label: instrument.instrument_name }))}
                            onChange={selectedOptions => {
                                const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                setSelectedInstruments(selectedValues);
                            }}
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group controlId="chords">
                        <Form.Label>Chords:</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={selectedChords.join(', ')} 
                            onChange={e => {
                                const inputText = e.target.value;
                                const chordsArray = inputText.split(',').map(chord => chord.trim());
                                setSelectedChords(chordsArray);
                            }}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Form.Group controlId="searchText">
                        <Form.Label>Search Text:</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={searchText}
                            onChange={handleSearchTextChange}
                            placeholder="Enter artist or song"
                        />
                    </Form.Group>
                </Col>

                <Col md={4}>
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
            </Row>

            <Row>
                <Col md={4}>
                    <Form.Group controlId="location">
                        <Form.Label>Location:</Form.Label>
                        <Form.Control as="select" value={location} onChange={e => setLocation(e.target.value)}>
                            <option value="">--Select a Country--</option>
                            {countries.map(country => (
                                <option key={country.country_id} value={country.country_id}>
                                    {country.countryname}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group controlId="key">
                        <Form.Label>Key:</Form.Label>
                        <Form.Control as="select" value={selectedKey} onChange={e => setSelectedKey(e.target.value)}>
                            <option value="">--Select a Key--</option>
                            {keys.map(key => (
                                <option key={key.keysignatureid} value={key.keysignatureid}>
                                    {key.keyname}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col md={4}>
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
            </Row>

            <Row>
                <Col md={4}>
                    <Form.Group controlId="genre">
                        <Form.Label>Genre:</Form.Label>
                        <Form.Control as="select" value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                            <option value="">--Select a Genre--</option>
                            {genres.map(genre => (
                                <option key={genre.genre_id} value={genre.genre_id}>
                                    {genre.genre_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <ChartPositionComponent position={chartPos} setPosition={setChartPos} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <SearchButton 
                        variant="primary"
                        era={era} 
                        chartPos={chartPos} 
                        location={location} 
                        selectedKey={selectedKey} 
                        selectedGenre={selectedGenre} 
                        bpm={bpm}
                        selectedChords={selectedChords} 
                        selectedInstruments={selectedInstruments}
                        searchText={searchText} 
                        onSearchResults={setSongs} 
                    />
                </Col>
            </Row>

            <SearchSongsComponent songs={songs} />

            </Container>
    );    
}

export default EraYearComponent;
