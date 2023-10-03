import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import SearchButton from "./SearchButton";
import ChartPositionComponent from "./ChartPositionComponent";
import Select from "react-select";
import SearchSongsComponent from "./SearchSongsComponent";
import "./EraYearComponent.css";
import { addVoiceCommand } from "./VoiceCommandManager";
import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// const IndentedSelect = styled(Form.Control)`
//   box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.6);
//   width: 100%;
// `;

const FullWidthLabel = styled(Form.Label)`
  display: block;
  width: 100%;
`;

const SelectStyled = styled(Select)`
  border-radius: 10px;
`;

// Change state of dropdown options
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: "black",
  }),
};

const EraYearComponent = (props) => {
  // This function is triggered when a song is clicked.
  const onSongClick = (uri) => {
    console.log("Song URI received in EraYearComponent:", uri);
    props.onTrackSelect(uri); // Notify the parent
  };
  const [era, setEra] = useState("");
  const [year, setYear] = useState(1958); // Setting default year as 1958
  const [songs, setSongs] = useState([]); // State to store fetched songs
  const [chartPos, setChartPos] = useState("");
  const [countries, setCountries] = useState([]);
  const [location, setLocation] = useState("");
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState({ id: "", name: "" });
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [instruments, setInstruments] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedChords, setSelectedChords] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [camelot, setCamelot] = useState([]);
  const [selectedCamelotId, setSelectedCamelotId] = useState("");
  const [showEra, setShowEra] = useState(true);
  // eslint-disable-next-line
  const [query, setQuery] = useState("");
  // eslint-disable-next-line
  const [results, setResults] = useState([]);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  // Add voice command to set Era
  useEffect(() => {
    addVoiceCommand("set era to", (voiceParams) => {
      const validEras = [
        "1950s",
        "1960s",
        "1970s",
        "1980s",
        "1990s",
        "2000s",
        "2010s",
        "2020s",
      ];
      if (validEras.includes(voiceParams)) {
        setEra(voiceParams);
      } else {
        console.warn(`Invalid era specified: ${voiceParams}`);
      }
    });
  }, []);

  const handleEraChange = (e) => {
    const selectedEra = e.target.value;
    setEra(selectedEra);
    setYear(null); // Clear the year when an era is selected
  };

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value);
    setYear(selectedYear);
    setEra(null); // Clear the era when a year is selected
  };

  const handleEraYearToggle = () => {
    setShowEra(!showEra);
    // Clear both era and year when toggling to avoid conflicts
    setEra(null);
    setYear(null);
  };

  // Initialize the filtered songs state with all songs
  const [filteredSongs, setFilteredSongs] = useState(songs);

  // Filter songs based on the search text
  useEffect(() => {
    const lowerSearchText = searchText.toLowerCase();
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowerSearchText) ||
        song.artist.toLowerCase().includes(lowerSearchText) ||
        searchText === ""
    );
    console.log("Filtered songs:", filtered); // Add this line
    setFilteredSongs(filtered);
  }, [songs, searchText]);

  // hnadle the change in search text
  const handleSearchTextChange = (e) => {
    const newText = e.target.value;
    setSearchText(newText);
    console.log("Updated search text:", newText); // Add this line
  };

  const processQueryWithGPT4 = async (query) => {
    try {
      const structuredPrompt = `Given the request '${query}', what are a few one word key musical descriptors?`;
      const response = await axios.post(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        {
          prompt: structuredPrompt,
          max_tokens: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.choices[0].text.trim().split("\n");
    } catch (error) {
      console.error("Error processing query with GPT-4:", error);
      return null;
    }
  };

  const searchDatabase = async (inferredMood) => {
    try {
      // Extract individual moods from the received string
      const processedMoods = inferredMood[0]
        .split(",")
        .map((mood) => mood.trim().replace("'", ""));

      const response = await axios.post(
        "http://localhost:5001/api/search-mood",
        { moodsFromGPT: processedMoods }
      );
      return response.data;
    } catch (error) {
      console.error("Error searching the database:", error);
      return [];
    }
  };

  // eslint-disable-next-line
  const handleSearch = async () => {
    try {
      console.log("Sending query to GPT-4:", query);
      const inferredMood = await processQueryWithGPT4(query);
      console.log("Received inferred mood from GPT-4:", inferredMood);

      const splitMoods = inferredMood[0].split(",").map((mood) => mood.trim());
      console.log("Processed moods for database search:", splitMoods);

      console.log("Sending inferred mood to backend:", splitMoods);
      const matchingSongs = await searchDatabase(splitMoods);
      console.log("Received song matches from backend:", matchingSongs);

      setResults(matchingSongs);
    } catch (err) {
      console.error("Error in handleSearch:", err);
      setError("Sorry, something went wrong. Please try again.");
    }
  };

  // used to populate camelot drop down
  useEffect(() => {
    const fetchCamelotValues = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/camelot");
        const data = await response.json();
        setCamelot(data);
      } catch (error) {
        console.error("Error fetching Camelot values:", error);
      }
    };

    fetchCamelotValues();
  }, []);

  // used to populate instrument drop down
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/instruments");
        const data = await response.json();
        setInstruments(data);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    fetchInstruments();
  }, []);

  // used to populate genre drop down
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/genres");
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // used to populate key drop down
  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/keysignatures");
        const data = await response.json();
        console.log("Fetched keys:", data);
        setKeys(data);
      } catch (error) {
        console.error("Error fetching keys:", error);
      }
    };

    fetchKeys();
  }, []);

  // used to populate location drop down
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/countries");
        const data = await response.json();
        console.log("Fetched countries:", data); // Log the fetched data
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // JSX (front end) visuals
  return (
    <Container>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group controlId="eraYearToggle" className="mb-2 form-align">
            <span
              style={{
                fontWeight: showEra ? "bold" : "normal",
                color: showEra ? "black" : "grey",
                cursor: "pointer",
                marginRight: "10px",
              }}
              onClick={() => handleEraYearToggle(true)}
            >
              {showEra ? "Era:" : "Era"}
            </span>
            <span
              style={{
                fontWeight: !showEra ? "bold" : "normal",
                color: !showEra ? "black" : "grey",
                cursor: "pointer",
              }}
              onClick={() => handleEraYearToggle(false)}
            >
              {!showEra ? "Year:" : "Year"}
            </span>
          </Form.Group>

          {showEra ? (
            <Form.Group controlId="era">
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
          ) : (
            <Form.Group controlId="year">
              <Form.Control
                type="range"
                min="1958"
                max="2023"
                value={year}
                onChange={handleYearChange}
              />
              <div>{year}</div>
            </Form.Group>
          )}
        </Col>

        <Col md={3}>
          <Form.Group controlId="key" className="form-align">
            <FullWidthLabel>Key:</FullWidthLabel>
            <Form.Control
              as="select"
              value={selectedKey.value}
              onChange={(e) => {
                const selectedKeyName = e.target.value;
                const selectedKeyId =
                  keys.find((key) => key.keyname === selectedKeyName)
                    ?.keysignatureid || "";
                setSelectedKey({ value: selectedKeyName, id: selectedKeyId });
              }}
            >
              <option value="">Select a Key</option>
              {keys
                .sort((a, b) => a.keyname.localeCompare(b.keyname))
                .map((key) => (
                  <option key={key.keysignatureid} value={key.keyname}>
                    {key.keyname}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group controlId="location" className="form-align">
            <Form.Label>Location:</Form.Label>
            <Form.Control
              as="select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select a Location</option>
              {countries.map((country) => (
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
              onChange={(e) => setBpm(e.target.value)}
              placeholder="Enter BPM"
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group controlId="instruments">
            <Form.Label>Instruments:</Form.Label>
            <SelectStyled
              isMulti
              options={instruments.map((instrument) => ({
                value: instrument.instrument_id,
                label: instrument.instrument_name,
              }))}
              styles={customStyles}
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : [];
                setSelectedInstruments(selectedValues);
              }}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group controlId="genre">
            <Form.Label>Genre:</Form.Label>
            <Form.Control
              as="select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">Select a Genre</option>
              {genres
                .sort((a, b) => a.genre_name.localeCompare(b.genre_name))
                .map((genre) => (
                  <option key={genre.genre_id} value={genre.genre_id}>
                    {genre.genre_name}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={3}>
          <ChartPositionComponent
            position={chartPos}
            setPosition={setChartPos}
          />
        </Col>

        <Col md={3}>
          <Form.Group controlId="camelot">
            <Form.Label>Camelot:</Form.Label>
            <Form.Control
              as="select"
              value={selectedCamelotId.value}
              onChange={(e) => {
                const selectedCamelotName = e.target.value;
                const selectedCamelotId =
                  camelot.find(
                    (camelot) => camelot.camelot_name === selectedCamelotName
                  )?.camelot_id || "";
                setSelectedCamelotId({
                  value: selectedCamelotName,
                  id: selectedCamelotId,
                });
              }}
            >
              <option value="">Select a Camelot</option>
              {camelot.map((camelotItem) => (
                <option
                  camelot={camelotItem.camelot_id}
                  value={camelotItem.camelot_name}
                >
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
              value={selectedChords.join(", ")}
              onChange={(e) => {
                const inputText = e.target.value;
                const chordsArray = inputText
                  .split(",")
                  .map((chord) => chord.trim());
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

      <Row>
        <Col className="text-center">
          <SearchButton
            className="btn-search" // Apply the custom class
            era={era}
            showEra={showEra}
            year={year}
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
          />
        </Col>
      </Row>
      <SearchSongsComponent
        onSongClick={onSongClick}
        songs={filteredSongs}
        keysignatures={keys}
        genres={genres}
        countries={countries}
        camelot={camelot}
      />
    </Container>
  );
};

export default EraYearComponent;
