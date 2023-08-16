import React, { useState, useEffect } from 'react';
import SearchButton from './SearchButton';
import ChartPositionComponent from './ChartPositionComponent';
import Select from 'react-select';
import SearchSongsComponent from './SearchSongsComponent';
import './InfluencerComponent.css';

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
    const [instruments, setInstruments] = useState([]);
    const [selectedInstruments, setSelectedInstruments] = useState([]);
    const [chords, setChords] = useState([]);
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
        <div className="influencer-component">
            <div className="top-row">
            <div className="era-dropdown">
                <label htmlFor="era">Era: </label>
                <select 
                    id="era"
                    value={era}
                    onChange={handleEraChange}>
                    <option value="">--Select an era--</option>
                    <option value="1950s">1950s</option>
                    <option value="1960s">1960s</option>
                    <option value="1970s">1970s</option>
                    <option value="1980s">1980s</option>
                    <option value="1990s">1990s</option>
                    <option value="2000s">2000s</option>
                    <option value="2010s">2010s</option>
                    <option value="2020s">2020s</option>
                </select>
            </div>
            
            <div className="instrument-dropdown">
                <label htmlFor="instruments">Instruments: </label>
                <Select 
                    id="instruments"
                    isMulti
                    options={instruments.map(instrument => ({ value: instrument.instrument_id, label: instrument.instrument_name }))}
                    onChange={selectedOptions => {
                        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                        setSelectedInstruments(selectedValues);
                    }}
                />
            </div>

            <div className="chord-input">
                <label htmlFor="chords">Chords: </label>
                <input
                    type="text"
                    id="chords"
                    value={selectedChords.join(', ')} // Convert array to comma-separated string
                    onChange={e => {
                        const inputText = e.target.value;
                        const chordsArray = inputText.split(',').map(chord => chord.trim());
                        setSelectedChords(chordsArray);
                    }}
                />
            </div>

            <div className="search-text-input">
                <label htmlFor="searchText">Search Text: </label>
                <input 
                    type="text" 
                    id="searchText" 
                    value={searchText}
                    onChange={handleSearchTextChange}
                    placeholder="Enter artist or song"
                />
            </div>

            <div className="year-slider">
                <label htmlFor="year">Year: {year}</label>
                <input 
                    type="range" 
                    id="year" 
                    name="year" 
                    min="1958" 
                    max="2023" 
                    value={year}
                    onChange={e => {
                        const selectedYear = e.target.value;
                        setYear(selectedYear);
                        updateYear(selectedYear); // Call the API to update the year
                    }}
                />
            </div>
            </div>
    
            <div className="bottom-row">
            <ChartPositionComponent position={chartPos} setPosition={setChartPos} />
    
            <div className="location-dropdown">
                <label htmlFor="location">Location: </label>
                <select value={location} onChange={e => setLocation(e.target.value)}>
                    <option value="">--Select a Country--</option>
                    {countries.map(country => (
                        <option key={country.country_id} value={country.country_id}>
                            {country.countryname}
                        </option>
                    ))}
                </select>
            </div>
    
            <div className="key-dropdown">
                <label htmlFor="key">Key: </label>
                <select value={selectedKey} onChange={e => setSelectedKey(e.target.value)}>
                    <option value="">--Select a Key--</option>
                    {keys.map(key => (
                        <option key={key.keysignatureid} value={key.keysignatureid}>
                            {key.keyname}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bpm-input">
                <label htmlFor="bpm">BPM: </label>
                <input 
                    type="number" 
                    id="bpm" 
                    value={bpm}
                    onChange={e => setBpm(e.target.value)}
                    placeholder="Enter BPM"
                />
            </div>

            <div className="genre-dropdown">
                <label htmlFor="genre">Genre: </label>
                <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">--Select a Genre--</option>
                    {genres.map(genre => (
                        <option key={genre.genre_id} value={genre.genre_id}>
                            {genre.genre_name}
                        </option>
                    ))}
                </select>
                </div>
            </div>
    
            <SearchButton 
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
            <SearchSongsComponent songs={songs} />
        </div>
    );    
}

export default InfluencerComponent;
