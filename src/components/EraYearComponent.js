import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Table } from 'react-bootstrap';
import SearchButton from './SearchButton';
import ChartPositionComponent from './ChartPositionComponent';
import Select from 'react-select';
import SearchSongsComponent from './SearchSongsComponent';
import './EraYearComponent.css';

const darkThemeStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: '#3b3b3b',
        borderColor: state.isFocused ? '#61dafb' : '#282c34',
        boxShadow: state.isFocused ? '0 0 0 1px #61dafb' : null,
        "&:hover": {
            borderColor: '#61dafb'
        }
    }),
    menu: base => ({
        ...base,
        backgroundColor: '#282c34',
        color: '#eee'
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#3b3b3b' : null,
        color: state.isFocused ? '#eee' : base.color
    }),
    singleValue: base => ({
        ...base,
        color: '#eee'
    }),
    multiValue: base => ({
        ...base,
        backgroundColor: '#3b3b3b',
        color: '#eee'
    }),
    multiValueLabel: base => ({
        ...base,
        color: '#eee'
    }),
    multiValueRemove: base => ({
        ...base,
        color: '#eee',
        "&:hover": {
            backgroundColor: '#61dafb',
            color: '#1a1a1a'
        }
    })
};

const EraYearComponent = (props) => {
    // This function is triggered when a song is clicked.
    const onSongClick = (uri) => {
        console.log("Song URI received in EraYearComponent:", uri);
        props.onTrackSelect(uri); // Notify the parent
    };    
    const [era, setEra] = useState('');
    const [year, setYear] = useState(1958); // Setting default year as 1958
    const [songs, setSongs] = useState([]); // State to store fetched songs
    const [chartPos, setChartPos] = useState('');
    const [countries, setCountries] = useState([]);
    const [location, setLocation] = useState('');
    const [keys, setKeys] = useState([]);
    const [selectedKey, setSelectedKey] = useState({ id: "", name: "" });
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [bpm, setBpm] = useState('');
    const [instruments, setInstruments] = useState([]);
    const [selectedInstruments, setSelectedInstruments] = useState([]);
    const [chords, setChords] = useState([]); // New state for selected chords
    const [selectedChords, setSelectedChords] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [commonInstruments, setCommonInstruments] = useState([]);
    const [popularParams, setPopularParams] = useState({});
    const [camelot, setCamelot] = useState([]);
    const [selectedCamelotId, setSelectedCamelotId] = useState('');

    

   // Initialize the filtered songs state with all songs
    const [filteredSongs, setFilteredSongs] = useState(songs);

    // Filter songs based on the search text
    useEffect(() => {
        const lowerSearchText = searchText.toLowerCase();
        const filtered = songs.filter(song => (
            song.title.toLowerCase().includes(lowerSearchText) ||
            song.artist.toLowerCase().includes(lowerSearchText) ||
            searchText === ''
        ));
        console.log("Filtered songs:", filtered); // Add this line
        setFilteredSongs(filtered);
    }, [songs, searchText]);
    
    
    const fetchPopularParams = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/popular-params?era=${era}&country=${location}&genre=${selectedGenre}&key=${selectedKey.value}`);
            
            const data = await response.json();
            console.log("Fetched popular parameters:", data);
            setPopularParams(data);
    
        } catch (error) {
            console.error("Error fetching popular parameters:", error);
        }
    };
    
    if (era && location && selectedGenre && selectedKey.value) {
        fetchPopularParams();
    }
    

    const handleEraChange = (e) => {
        const selectedEra = e.target.value;
        setEra(selectedEra);
    };

    const handleSearchTextChange = (e) => {
        const newText = e.target.value;
        setSearchText(newText);
        console.log("Updated search text:", newText); // Add this line
    };

    useEffect(() => {
        const fetchCamelotValues = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/camelot');
                const data = await response.json();
                setCamelot(data);
            } catch (error) {
                console.error('Error fetching Camelot values:', error);
            }
        };

        fetchCamelotValues();
    }, []);

    useEffect(() => {
        const fetchCommonInstruments = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/popular-instruments?era=${era}&genre=${selectedGenre}`);
                const data = await response.json();
                setCommonInstruments(data);
            } catch (error) {
                console.error("Error fetching common instruments:", error);
            }
        };

        if (era && selectedGenre) {
            fetchCommonInstruments();
        }
    }, [era, selectedGenre]);

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
                console.log("Fetched keys:", data);
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

    useEffect(() => {
        const fetchPopularParams = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/popular-params?era=${era}&country=${location}&genre=${selectedGenre}`);
                
                const data = await response.json();
                console.log("Fetched popular parameters:", data);  // This line logs the fetched data
                setPopularParams(data);
    
            } catch (error) {
                console.error("Error fetching popular parameters:", error);
            }
        };
    
        if (era && location && selectedGenre) {
            fetchPopularParams();
        }
    }, [era, location, selectedGenre]);
    
    useEffect(() => {
        console.log("Popular Parameters State:", popularParams);
    }, [popularParams]);
    

    return (
        <Container className="mt-4 shadow">
            <h2 className="text-center mb-4">Advanced Search</h2>
    
            {/* First Row */}
            <Row className="mb-3">
                <Col md={3}>
                    <Form.Group controlId="era">
                        <Form.Label>Era:</Form.Label>
                        <Form.Control as="select" value={era} onChange={handleEraChange}>
                            <option value="">Select an Era</option>
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

                <Col md={3}>
                    <Form.Group controlId="key">
                        <Form.Label>Key:</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={selectedKey.value} 
                            onChange={e => {
                                const selectedKeyName = e.target.value;
                                const selectedKeyId = keys.find(key => key.keyname === selectedKeyName)?.keysignatureid || "";
                                setSelectedKey({ value: selectedKeyName, id: selectedKeyId });
                            }}
                        >
                            <option value="">Select a Key</option>
                            {keys.map(key => (
                                <option key={key.keysignatureid} value={key.keyname}>
                                    {key.keyname}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col md={3}>
                    <Form.Group controlId="location">
                        <Form.Label>Location:</Form.Label>
                        <Form.Control as="select" value={location} onChange={e => setLocation(e.target.value)}>
                            <option value="">Select a Location</option>
                            {countries.map(country => (
                                <option key={country.country_id} value={country.country_id}>
                                    {country.countryname}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col md={3}>
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
                
                <Col md={3}>
                <Form.Group controlId="instruments">
                    <Form.Label>Instruments:</Form.Label>
                    <Select 
                        isMulti
                        options={instruments.map(instrument => ({ value: instrument.instrument_id, label: instrument.instrument_name }))}
                        onChange={selectedOptions => {
                            const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                            setSelectedInstruments(selectedValues);
                        }}
                        styles={darkThemeStyles}  // Apply the custom styles here
                    />
                </Form.Group>
                </Col>

                <Col md={3}>
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
    
                <Col md={3}>
                    <ChartPositionComponent position={chartPos} setPosition={setChartPos} />
                </Col>

                <Col md={3}>
                    <Form.Group controlId="camelot">
                        <Form.Label>Camelot:</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={selectedCamelotId.value} 
                            onChange={e => {
                                const selectedCamelotName = e.target.value;
                                const selectedCamelotId = camelot.find(camelot => camelot.camelot_name === selectedCamelotName)?.camelot_id || "";
                                setSelectedCamelotId({ value: selectedCamelotName, id: selectedCamelotId });
                            }}
                        >
                            <option value="">Select a Camelot</option>
                            {camelot.map(camelotItem => (
                                <option camelot={camelotItem.camelot_id} value={camelotItem.camelot_name}>
                                    {camelotItem.camelot_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            
          <Row className="mb-3">
    
          <Col md={6}>
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

                <Col md={6}>
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
            </Row>
    
            <Row className="mt-4 mb-4">
                <Col className="text-center">
                    <SearchButton 
                        className="custom-btn" // Apply the custom class
                        era={era} 
                        chartPos={chartPos} 
                        location={location} 
                        selectedKey={selectedKey} 
                        selectedGenre={selectedGenre} 
                        bpm={bpm}
                        selectedCamelotId={selectedCamelotId}
                        selectedChords={selectedChords} 
                        selectedInstruments={selectedInstruments}
                        searchText={searchText} 
                        onSearchResults={setSongs} 
                        onPopularParams={setPopularParams} 
                    />
                </Col>
            </Row>
            <SearchSongsComponent onSongClick={onSongClick} songs={filteredSongs} keysignatures={keys} genres={genres} countries={countries} camelot={camelot} />
        </Container>
    );
}

export default EraYearComponent;