require("dotenv").config();

const express = require("express");
const app = express();
const { exec, spawn } = require("child_process");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const { Pool, Client } = require("pg");
const axios = require("axios");
const fastcsv = require("fast-csv");
const fs = require("fs");
const { Translate } = require("@google-cloud/translate").v2;
const translate = new Translate({
  projectId: "tambertranslate",
  key: process.env.API_KEY, // Assuming you have API_KEY in your .env file
});

// Use environment variables for sensitive information
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = 5001;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Set up CORS
app.use(
  cors({
    origin: "*", // Consider narrowing this down in production
    methods: ["GET", "POST"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/search-mood", async (req, res) => {
  const moodsFromGPT = req.body.moodsFromGPT;

  if (!moodsFromGPT || moodsFromGPT.length === 0) {
    return res.json([]);
  }

  // Remove bullet points and trim spaces
  const processedMoods = moodsFromGPT.map((mood) =>
    mood.replace("•", "").trim()
  );

  // Split the input string into individual mood names
  const individualMoods = processedMoods.filter((mood) => mood !== "");

  // Construct mood conditions for each individual mood
  const moodConditions = individualMoods
    .map((mood) => `mood LIKE '%${mood.replace("'", "''")}%'`)
    .join(" OR ");

  if (!moodConditions) {
    console.error("No valid moods provided.");
    return res.json([]);
  }

  try {
    const query = `SELECT * FROM songs WHERE ${moodConditions} LIMIT 10`;
    console.log("Constructed SQL Query:", query);
    const result = await pool.query(query);
    res.json(result.rows);
    console.log("Retrieved Results:", result.rows);
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Middleware for file uploads using multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }); // Initializing multer with the storage configuration

const columnMapping = {
  Year: "year",
  Location: "location",
  Artist: "artist",
  "Issue Date": "Issue Date",
  Week: "week",
  Title: "title",
  Key: "key",
  Camelot: "camelot",
  BPM: "bpm",
  Duration: "duration",
  "Chart Pos": "Chart Pos",
  "Spotify Link": "Spotify Link",
  "Spotify URL": "Spotify URL",
  "Time Signature": "Time Signature",
  "Intro Length": "Intro Length",
  "Intro Instrumentation": "Intro Instrumentation",
  "Intro Chords": "Intro Chords",
  "Verse Length": "Verse Length",
  "Verse Instrumentation": "Verse Instrumentation",
  "Verse Chords": "Verse Chords",
  "Pre-Chorus Length": "Pre-Chorus Length",
  "Pre-Chorus Instrumentation": "Pre-Chorus Instrumentation",
  "Pre-Chorus Chords": "Pre-Chorus Chords",
  "Chorus Length": "Chorus Length",
  "Chorus Instrumentation": "Chorus Instrumentation",
  "Chorus Chords": "Chorus Chords",
  "Bridge Length": "Bridge Length",
  "Bridge Instrumentation": "Bridge Instrumentation",
  "Bridge Chords": "Bridge Chords",
  "Outro Length": "Outro Length",
  "Outro Instrumentation": "Outro Instrumentation",
  "Outro Chords": "Outro Chords",
  Genre: "genre",
  "Intro InstrumentationJSON": "Intro InstrumentationJSON",
  "Verse InstrumentationJSON": "Verse InstrumentationJSON",
  "Pre-Chorus InstrumentationJSON": "Pre-Chorus InstrumentationJSON",
  "Chorus InstrumentationJSON": "Chorus InstrumentationJSON",
  "Bridge InstrumentationJSON": "Bridge InstrumentationJSON",
  "Outro InstrumentationJSON": "Outro InstrumentationJSON",
  "Secondary Genre": "Secondary Genre",
  Era: "era",
  "Intro ChordsJSON": "Intro ChordsJSON",
  "Verse ChordsJSON": "Verse ChordsJSON",
  "Pre-Chorus ChordsJSON": "Pre-Chorus ChordsJSON",
  "Chorus ChordsJSON": "Chorus ChordsJSON",
  "Bridge ChordsJSON": "Bridge ChordsJSON",
  "Outro ChordsJSON": "Outro ChordsJSON",
  Mood: "mood",
};

// CSV Uploader
app.post("/api/upload-csv", upload.array("csv"), async (req, res) => {
  console.log("Received POST request to /api/upload-csv");

  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  for (const file of req.files) {
    console.log("Processing file:", file.filename);

    const csvFilePath = file.path;
    const songsArray = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(fastcsv.parse({ headers: true }))
        .on("data", (row) => {
          const mappedRow = {};
          for (const csvColumnName in row) {
            if (columnMapping[csvColumnName]) {
              mappedRow[columnMapping[csvColumnName]] = row[csvColumnName];
            }
          }
          songsArray.push(mappedRow);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    const client = new Client(pool.options);

    try {
      await client.connect();

      for (let song of songsArray) {
        // Determine available columns in this song data
        let dbColumns = Object.keys(song);
        let placeholders = dbColumns.map((_, index) => `$${index + 1}`);

        // Construct the INSERT statement
        const query = `
                    INSERT INTO songs (${dbColumns
                      .map((col) => '"' + col + '"')
                      .join(", ")})
                    VALUES (${placeholders.join(", ")})
                `;

        // Extract values based on the available columns
        const values = dbColumns.map((col) => song[col]);
        await client.query(query, values);
      }

      console.log(`Data from file ${file.filename} inserted successfully.`);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error storing CSV data.");
    } finally {
      await client.end();
    }
  }

  res.send("All CSV files processed and data stored.");
});

// songs
app.get("/api/songs", async (req, res) => {
  let query = "SELECT * FROM songs"; // Initialize the base query here
  try {
    console.log("Received query parameters:", req.query); // Log all received query parameters

    // Instead of destructuring, get the parameters directly
    const era = req.query.era;
    const year = req.query.year;
    const chartPos = req.query.chartPos;
    const key = req.query.key;
    const genre = req.query.genre;
    const bpm = req.query.bpm;
    const instruments = req.query.instruments;
    const chords = req.query.chords;
    const location = req.query.location;
    const camelot = req.query.camelot; // Get the location parameter directly

    let values = [];

    if (era) {
      query += " WHERE era = $1";
      values.push(era);
    }

    if (year) {
      // Check if year parameter is provided
      if (values.length) {
        query += " AND year = $" + (values.length + 1); // Modify the query for year
      } else {
        query += " WHERE year = $1";
      }
      values.push(year);
    }
    if (chartPos) {
      if (values.length) {
        query += ' AND "Chart Pos" = $' + (values.length + 1);
      } else {
        query += ' WHERE "Chart Pos" = $1';
      }
      values.push(chartPos);
    }
    if (key) {
      query +=
        (values.length ? " AND" : " WHERE") + " key = $" + (values.length + 1);
      values.push(key);
    }
    if (camelot) {
      query +=
        (values.length ? " AND" : " WHERE") +
        " camelot = $" +
        (values.length + 1);
      values.push(camelot);
    }
    if (genre) {
      query +=
        (values.length ? " AND" : " WHERE") +
        " genre = $" +
        (values.length + 1);
      values.push(genre);
    }
    if (bpm) {
      const minBpm = Number(bpm) - 5;
      const maxBpm = Number(bpm) + 5;
      query +=
        (values.length ? " AND" : " WHERE") +
        " bpm BETWEEN $" +
        (values.length + 1) +
        " AND $" +
        (values.length + 2);
      values.push(minBpm, maxBpm);
    }

    if (location) {
      query +=
        (values.length ? " AND" : " WHERE") +
        " location = $" +
        (values.length + 1);
      values.push(location);
    }

    if (instruments) {
      let parsedInstruments = JSON.parse(instruments); // Convert the string back to an array
      let instrumentConditions = [];

      if (parsedInstruments.length > 0) {
        parsedInstruments.forEach((instrumentId) => {
          let condition = `("Chorus InstrumentationJSON" LIKE '%${instrumentId}%' OR 
                                      "Verse InstrumentationJSON" LIKE '%${instrumentId}%')`;
          instrumentConditions.push(condition);
        });

        let allInstrumentConditions = instrumentConditions.join(" AND ");

        if (values.length) {
          query += " AND (" + allInstrumentConditions + ")";
        } else {
          query += " WHERE (" + allInstrumentConditions + ")";
        }
      }
    }

    if (chords) {
      let parsedChords = chords.split(",").map((chord) => chord.trim()); // Convert the comma-separated string to an array
      let chordConditions = [];

      if (parsedChords.length > 0) {
        parsedChords.forEach((chordId) => {
          let condition = `("Chorus ChordsJSON" LIKE '%${chordId}%' OR 
                                      "Verse ChordsJSON" LIKE '%${chordId}%')`;
          chordConditions.push(condition);
        });

        let allChordConditions = chordConditions.join(" AND ");

        if (values.length) {
          query += " AND (" + allChordConditions + ")";
        } else {
          query += " WHERE (" + allChordConditions + ")";
        }
      }
    }

    console.log("All query parameters:", req.query);

    // query += ' LIMIT 100';

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(
      "Error during the query execution:",
      err.message,
      "Executed query:",
      query
    );
    res.status(500).send("Server error");
  }
});

// songs id
app.get("/api/songs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM songs WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Song not found");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

async function getGPT3Response(prompt) {
  const response = await axios.post(
    "https://api.openai.com/v1/engines/text-davinci-003/completions",
    {
      prompt: prompt,
      max_tokens: 50,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );
  return response.data.choices[0].text.trim();
}

app.options("/generateLyrics", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

app.post("/generateLyrics", (req, res) => {
  console.log("Backend Received Request Body:", req.body);

  const maxTokens = req.body.maxTokens || 200;
  const highlightedLines = req.body.highlightedLines || {};
  // console.log("Debug: Received highlighted lines from frontend:", highlightedLines);
  const existingLyrics = Object.values(highlightedLines).join("\n");
  const abstractionLevel = req.body.abstractionLevel || 0;
  const selectedGenreName = req.body.selectedGenreName;

  // Debug lines
  // console.log("Debug: Existing Lyrics from Frontend:", existingLyrics);
  // console.log("Debug: Highlighted Lines from Frontend:", highlightedLines);

  const payload = {
    prompt: req.body.prompt,
    highlightedLines: highlightedLines,
    existingLyrics: existingLyrics,
  };

  console.log("Frontend Highlighted Lines:", highlightedLines);
  console.log("Frontend Payload:", payload);

  // Declare pythonArgs before logging it & Add a new argument for song structure
  const pythonArgs = [
    req.body.prompt,
    maxTokens,
    JSON.stringify(highlightedLines),
    existingLyrics,
    abstractionLevel,
    selectedGenreName,
    JSON.stringify([
      "Verse 1",
      "Chorus",
      "Verse 2",
      "Chorus",
      "Bridge",
      "Chorus",
    ]), // new argument
  ];

  // Now log pythonArgs
  console.log("Sending to Python script:", pythonArgs); // Debug line to print payload

  console.log(
    "Debug: Sending highlighted lines to Python script:",
    highlightedLines
  );
  const pythonProcess = highlightedLines
    ? spawn("python", ["generate_lyrics.py", ...pythonArgs])
    : spawn("python", ["generate_lyrics.py", req.body.prompt]);

  let responseSent = false; // Initialize the flag here

  pythonProcess.stdout.on("data", (data) => {
    console.log("Received from Python: ", data.toString());
    if (!responseSent) {
      // Check the flag before sending a response
      res.json({ lyrics: data.toString() });
      responseSent = true; // Set the flag to true after sending a response
    }
    // ... (your existing code for handling stdout)
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    if (!responseSent) {
      // Check the flag before sending a response
      res.status(500).send(data.toString());
      responseSent = true; // Set the flag to true after sending a response
    }
  });
});

async function getGenreIDFromName(genreName) {
  if (genreName === "not specified") return null;

  // Use pool.query() to get results from the database
  let result = await pool.query(
    `SELECT genre_id FROM genres WHERE LOWER(genre_name) = LOWER($1)`,
    [genreName]
  );

  // Log the result to check if we're getting the expected output
  console.log("Database result:", result.rows);

  return result.rows[0] ? result.rows[0].genre_id : null;
}

async function getKeySignatureIDFromName(keySignatureName) {
  if (!keySignatureName) return null;

  // Use pool.query() to get results from the database
  let result = await pool.query(
    `SELECT keysignatureid FROM keysignatures WHERE keyname ILIKE $1`,
    [keySignatureName]
  );

  // Log the result to check if we're getting the expected output
  console.log("Database result:", result.rows);

  return result.rows[0] ? result.rows[0].keysignatureid : null;
}

async function getCamelotIDFromName(camelotName) {
  if (camelotName === "not specified") return null;

  // Use pool.query() to get results from the database
  let result = await pool.query(
    `SELECT camelot_id FROM camelot WHERE LOWER(camelot_name) = LOWER($1)`,
    [camelotName]
  );

  // Log the input camelotName and the query result to check if we're getting the expected output
  console.log("Input camelotName:", camelotName);
  console.log("Database result:", result.rows);

  if (result.rows.length === 0) {
    throw new Error(
      `Camelot value "${camelotName}" not found in the database.`
    );
  }

  return result.rows[0].camelot_id;
}

app.post("/get-gpt3-response", async (req, res) => {
  try {
    const userQuery = req.body.query;

    // Identify the era
    const eraPrompt = `Given the user's request: "${userQuery}", if the user is asking about common song attributes of a specific era, please identify and state the era in the format "Era: [Era Name]". If no era is mentioned, respond with "Era: Not Mentioned".`;
    const eraResponse = await getGPT3Response(eraPrompt);
    const eraMatch = eraResponse.match(/Era: (\d{4}s|Not Mentioned)/);
    const userEra =
      eraMatch && eraMatch[1] && eraMatch[1].toLowerCase() !== "not mentioned"
        ? eraMatch[1].toLowerCase()
        : null;

    // Identify the genre
    const genrePrompt = `Given the user's request: "${userQuery}", if a musical genre is mentioned, please identify and state it in the format "Genre: [Genre Name]". If no genre is mentioned, respond with "Genre: Not Specified".`;
    const genreResponse = await getGPT3Response(genrePrompt);
    const genreMatch = genreResponse.match(/Genre: (\w+)/i);
    let userGenre =
      genreMatch && genreMatch[1] ? genreMatch[1].toLowerCase() : null;

    // If there's no genre mentioned, set userGenre to null
    if (genreMatch && genreMatch[1].toLowerCase() === "not") {
      userGenre = null;
    }

    // Ask GPT-3 for the key.
    const keyPrompt = `Given the user's request: "${userQuery}", if a musical key is mentioned, please identify and state it in the format "Key: [Key Name]". If no key is mentioned, respond with "Key: Not Mentioned".`;
    const keyResponse = await getGPT3Response(keyPrompt);
    const keyMatch = keyResponse.match(/Key: (\w+ \w+|Not Mentioned)/);

    let userQueryKey;
    if (
      keyMatch &&
      keyMatch[1] &&
      keyMatch[1].toLowerCase() !== "not mentioned"
    ) {
      userQueryKey = keyMatch[1].trim().toLowerCase();
    } else {
      userQueryKey = null;
    }

    // Process the Camelot response from GPT-3
    let userQueryCamelot = null; // Initialize the variable to null

    // Check if the user's query includes a request for Camelot values
    if (userQuery.includes("Camelot")) {
      const camelotPrompt = `Given the user's request: "${userQuery}", if a Camelot value like "10B" or "8A" is mentioned, please identify and state it in the format "Camelot: [Value]". If no Camelot value is mentioned, respond with "Camelot: Not Mentioned".`;
      const camelotResponse = await getGPT3Response(camelotPrompt);
      console.log("Camelot Response:", camelotResponse);

      // Extract Camelot value from the response
      const camelotValueIndex =
        camelotResponse.indexOf("Camelot:") + "Camelot:".length;
      userQueryCamelot = camelotResponse.substring(camelotValueIndex).trim();

      // Handle "Not Mentioned"
      if (userQueryCamelot.toLowerCase() === "not mentioned") {
        userQueryCamelot = null;
      }

      // Get Camelot ID from the database if a Camelot value is provided
      if (userQueryCamelot) {
        userCamelotID = await getCamelotIDFromName(userQueryCamelot);
      }
    }
    // Get genre ID
    let userGenreID = userGenre ? await getGenreIDFromName(userGenre) : null;

    // Get key signature ID
    let userKeySignatureID = userQueryKey
      ? await getKeySignatureIDFromName(userQueryKey)
      : null;

    // Case: Both era and genre are mentioned
    if (userEra && userGenre) {
      const attributesResponse = await axios.get(
        "http://localhost:5001/api/popular-instruments",
        {
          params: { era: userEra, genre: userGenreID },
        }
      );

      const attributesMessage = attributesResponse.data;
      let paragraph = `Here are some of the most popular attributes for ${userGenre} songs from the ${userEra}:\n\n`;

      function getMostPopularName(attributeArray) {
        return attributeArray && attributeArray.length > 0
          ? attributeArray[0].name
          : "Not Specified";
      }

      const mostPopularKey = getMostPopularName(attributesMessage.keys);
      const mostPopularBPM = getMostPopularName(attributesMessage.bpms);
      const mostPopularIntroInstrumentation = getMostPopularName(
        attributesMessage.intro_combinations
      );
      const mostPopularIntroChords = getMostPopularName(
        attributesMessage.intro_chords
      );
      const mostPopularIntroLength = getMostPopularName(
        attributesMessage.intro_lengths
      );
      const mostPopularVerseLength = getMostPopularName(
        attributesMessage.verse_lengths
      );
      const mostPopularChorusLength = getMostPopularName(
        attributesMessage.chorus_lengths
      );
      const mostPopularBridgeLength = getMostPopularName(
        attributesMessage.bridge_lengths
      );
      const mostPopularOutroLength = getMostPopularName(
        attributesMessage.outro_lengths
      );

      paragraph += `- The most popular key signature was ${mostPopularKey}, with a BPM range of ${mostPopularBPM}.\n`;
      paragraph += `- The most popular intro instrumentation was ${mostPopularIntroInstrumentation}, with an intro length of ${mostPopularIntroLength} bars.\n`;
      paragraph += `- The most popular into chords were ${mostPopularIntroChords}.\n`;
      paragraph += `- The most popular verse length was ${mostPopularVerseLength} bars.\n`;
      paragraph += `- The most popular chorus length was ${mostPopularChorusLength} bars.\n`;
      paragraph += `- The most popular bridge length was ${mostPopularBridgeLength} bars.\n`;
      paragraph += `- The most popular outro length was ${mostPopularOutroLength} bars.\n`;

      const mostPopularVerseInstrumentation = getMostPopularName(
        attributesMessage.verse_combinations
      );
      const mostPopularVerseChords = getMostPopularName(
        attributesMessage.verse_chords
      );

      paragraph += `- The most popular verse instrumentation was ${mostPopularVerseInstrumentation}.\n`;
      paragraph += `- The most popular verse chords were ${mostPopularVerseChords}.\n`;

      const mostPopularChorusInstrumentation = getMostPopularName(
        attributesMessage.chorus_combinations
      );
      const mostPopularChorusChords = getMostPopularName(
        attributesMessage.chorus_chords
      );

      paragraph += `- The most popular chorus instrumentation was ${mostPopularChorusInstrumentation}.\n`;
      paragraph += `- The most popular chorus chords were ${mostPopularChorusChords}.\n`;

      const mostPopularBridgeInstrumentation = getMostPopularName(
        attributesMessage.bridge_combinations
      );
      const mostPopularBridgeChords = getMostPopularName(
        attributesMessage.bridge_chords
      );

      paragraph += `- The most popular bridge instrumentation was ${mostPopularBridgeInstrumentation}.\n`;
      paragraph += `- The most popular bridge chords were ${mostPopularBridgeChords}.\n`;

      const mostPopularOutroInstrumentation = getMostPopularName(
        attributesMessage.outro_combinations
      );
      const mostPopularOutroChords = getMostPopularName(
        attributesMessage.outro_chords
      );

      paragraph += `- The most popular outro instrumentation was ${mostPopularOutroInstrumentation}.\n`;
      paragraph += `- The most popular outro chords were ${mostPopularOutroChords}.\n`;

      // Modify the response to include the paragraph
      const eraResponseParagraph = `Era: ${userEra}\n\n${paragraph}`;
      res.json({ response: eraResponseParagraph });
      return;
    }

    // Case: Only key is mentioned
    if (!userEra && !userGenre && userKeySignatureID) {
      let keyQuery = `
                SELECT s.title, s.artist
                FROM songs s 
                WHERE s.key = $1
                LIMIT 10;
            `;
      console.log("Executing SQL:", keyQuery);
      console.log("With Params:", [userKeySignatureID]);
      const keySongs = await pool.query(keyQuery, [userKeySignatureID]);

      let keyResponseText = "";
      if (keySongs.rows.length > 0) {
        const songStrings = keySongs.rows.map(
          (song) => `- ${song.title} by ${song.artist}`
        );
        keyResponseText =
          `Here are some songs in the key signature of ${userQueryKey}:\n` +
          songStrings.join("\n");
      } else {
        keyResponseText = `Sorry, I couldn't find any songs in the key signature of ${userQueryKey} matching your criteria.`;
      }

      res.json({ response: keyResponseText });
      return;
    }

    // Case: Only genre is mentioned
    if (!userEra && userGenre && !userKeySignatureID) {
      let genreQuery = `
                SELECT s.title, s.artist
                FROM songs s 
                JOIN genres g ON s.genre = g.genre_id 
                WHERE g.genre_name ILIKE $1
                LIMIT 10;
            `;
      console.log("Executing SQL:", genreQuery);
      console.log("With Params:", [userGenre]);

      // Add this log statement
      console.log("Genre Query Params:", [userGenre]);

      const genreSongs = await pool.query(genreQuery, [userGenre]);

      let genreResponseText = "";
      if (genreSongs.rows.length > 0) {
        const songStrings = genreSongs.rows.map(
          (song) => `- ${song.title} by ${song.artist}`
        );
        genreResponseText =
          `Here are some songs from the ${userGenre} genre:\n` +
          songStrings.join("\n");
      } else {
        genreResponseText = `Sorry, I couldn't find any ${userGenre} songs matching your criteria.`;
      }

      res.json({ response: genreResponseText });
      return;
    }

    // Case: Only Camelot is mentioned
    if (
      !userEra &&
      !userGenre &&
      !userKeySignatureID &&
      userCamelotID !== null
    ) {
      let camelotQuery = `
                SELECT s.title, s.artist
                FROM songs s 
                WHERE s.camelot = $1
                LIMIT 10;
            `;
      console.log("Executing SQL:", camelotQuery);
      console.log("With Params:", [userCamelotID]);

      const camelotSongs = await pool.query(camelotQuery, [userCamelotID]);

      let camelotResponseText = "";
      if (camelotSongs.rows.length > 0) {
        const songStrings = camelotSongs.rows.map(
          (song) => `- ${song.title} by ${song.artist}`
        );
        camelotResponseText =
          `Here are some songs in the Camelot value of ${userQueryCamelot}:\n` +
          songStrings.join("\n");
      } else {
        camelotResponseText = `Sorry, I couldn't find any songs in the Camelot value of ${userQueryCamelot} matching your criteria.`;
      }

      res.json({ response: camelotResponseText });
      return;
    }

    console.log("GPT-3 Era Response:", eraResponse);
    console.log("GPT-3 Genre Response:", genreResponse);

    // Ask GPT-3 for BPM.
    const bpmPrompt = `Given the user's request: "${userQuery}", if a BPM or BPM range is mentioned, please identify and state it in the format "BPM: [Value or Range]". If no BPM is mentioned, respond with "BPM: Not Mentioned".`;
    const bpmResponse = await getGPT3Response(bpmPrompt);
    const bpmMatch = bpmResponse.match(/BPM: (\d+-\d+|\d+|Not Mentioned)/);

    let userQueryBPM;
    let isBpmRange = false;
    if (
      bpmMatch &&
      bpmMatch[1] &&
      bpmMatch[1].toLowerCase() !== "not mentioned"
    ) {
      if (bpmMatch[1].includes("-")) {
        isBpmRange = true;
      }
      userQueryBPM = bpmMatch[1];
    }

    if (
      eraMatch &&
      eraMatch[1] &&
      eraMatch[1].toLowerCase() !== "not mentioned"
    ) {
      const era = eraMatch[1];

      // Fetch popular attributes for the era
      const attributesResponse = await axios.get(
        "http://localhost:5001/api/popular-instruments",
        {
          params: { era: era },
        }
      );

      const attributesMessage = attributesResponse.data;

      // Construct a response object with the parsed era information and attributes
      const eraResponse = {
        era: era, // Parsed era information
        attributes: attributesMessage, // Popular attributes for the era
      };

      res.json({ response: eraResponse });
      return; // Exit early as the user's query was specifically about the era's attributes
    }

    console.log("User's genre:", userGenre);
    console.log("User's key:", userQueryKey);
    console.log("User's BPM:", userQueryBPM);
    console.log("User's Camelot:", userQueryCamelot);

    let query = `
        SELECT s.title, s.artist
        FROM songs s 
        JOIN genres g ON s.genre = g.genre_id 
    `;

    let queryParams = [];
    let paramCounter = 1;
    let whereAdded = false;

    if (userGenre) {
      // Change from userQueryGenre to userGenre
      query += whereAdded ? ` AND` : ` WHERE`;
      query += ` g.genre_name ILIKE $${paramCounter}`;
      queryParams.push(userGenre); // Change from userQueryGenre to userGenre
      paramCounter++;
      whereAdded = true;
    }

    if (userQueryKey) {
      // No change needed here, as you're using the correct variable name
      query += whereAdded ? ` AND` : ` WHERE`;
      query += ` s.key IN (SELECT keysignatureid FROM keysignatures WHERE keyname ILIKE $${paramCounter})`;
      queryParams.push("%" + userQueryKey + "%");
      paramCounter++;
      whereAdded = true;
    }

    if (userQueryCamelot && userQueryCamelot.toLowerCase() !== "not") {
      query += whereAdded ? ` AND` : ` WHERE`;
      query += ` s.camelot IN (SELECT camelot_id FROM camelot WHERE camelot_name ILIKE $${paramCounter})`;
      queryParams.push(userQueryCamelot);
      paramCounter++;
      whereAdded = true;
    }

    if (userQueryBPM) {
      query += whereAdded ? ` AND` : ` WHERE`;
      if (isBpmRange) {
        const [minBPM, maxBPM] = userQueryBPM.split("-").map(Number);
        query += ` s.bpm BETWEEN $${paramCounter} AND $${paramCounter + 1}`;
        queryParams.push(minBPM, maxBPM);
        paramCounter += 2;
      } else {
        query += ` s.bpm = $${paramCounter}`;
        queryParams.push(Number(userQueryBPM));
        paramCounter++;
      }
      whereAdded = true;
    }

    query += ` LIMIT 10;`;

    console.log("Executing query:", query);
    console.log("With parameters:", queryParams);

    const songs = await pool.query(query, queryParams);

    let responseText = "";
    if (songs.rows.length > 0) {
      const songStrings = songs.rows.map(
        (song) => `- ${song.title} by ${song.artist}`
      );
      responseText =
        `Here are some songs based on your criteria:\n` +
        songStrings.join("\n");
    } else {
      responseText = `Sorry, I couldn't find any songs matching your criteria.`;
    }

    res.json({ response: responseText });
  } catch (error) {
    if (error.response && error.response.data) {
      res.status(500).json({
        error: "Error from GPT-3: " + error.response.data.error.message,
      });
    } else {
      console.error("Error detail:", error); // Log the detailed error
      res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
  }
});

app.post("/translate", async (req, res) => {
  const text = req.body.text;

  if (!text) {
    return res
      .status(400)
      .send({ error: "Text to be translated not provided" });
  }

  console.log("Text to be translated:", text);
  const targetLanguage = "en"; // English

  try {
    let [translations] = await translate.translate(text, targetLanguage);
    translations = Array.isArray(translations) ? translations : [translations];
    res.json({ translation: translations[0] });
  } catch (error) {
    console.error("Translation Service Error:", error); // Log the specific error
    res.status(500).send({ error: "Translation failed" });
  }
});

// Assuming you're using a database library like knex or sequelize
const fetchCamelotValuesFromDatabase = async () => {
  try {
    // Use your database library to perform the query
    const camelotValues = await db
      .select("camelot_id", "camelot_name")
      .from("camelot");
    return camelotValues;
  } catch (error) {
    throw error;
  }
};

const keyMapping = {
  C: 0,
  G: 1,
  D: 2,
  A: 3,
  E: 4,
  B: 5,
  "F#": 6,
  Db: 7,
  Ab: 8,
  Eb: 9,
  Bb: 10,
  F: 11,
};

const numberToKey = Object.keys(keyMapping).reduce((acc, key) => {
  acc[keyMapping[key]] = key;
  return acc;
}, {});

const adjustKey = (songKey, eraKey, influence) => {
  let songNumber = songKey;
  if (typeof songKey === "string") {
    songNumber = keyMapping[songKey];
  }

  // Strip "Major" or any other designation from eraKey
  const eraNote = eraKey.split(" ")[0];
  const eraNumber = keyMapping[eraNote];

  console.log("Song number:", songNumber);
  console.log("Era number:", eraNumber);
  console.log("Influence:", influence);

  let distance = (eraNumber - songNumber + 12) % 12;
  if (distance > 6) {
    distance -= 12; // Adjust to get the shortest path on the circle
  }

  const adjustedNumber = (eraNumber - distance * (influence / 100) + 12) % 12;
  console.log("Calculated adjustedNumber:", adjustedNumber);

  return numberToKey[Math.round(adjustedNumber)];
};

// Test the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err.stack);
  } else {
    console.log("Connected to the database", res.rows[0]);
  }
});

app.get("/api/test", (req, res) => {
  res.send("Test route works!");
});

// Popular instruments for given era and genre
app.get("/api/popular-instruments", async (req, res) => {
  const { era, genre, location, song, influence, year } = req.query;

  // Log the received song and influence values
  console.log("Received song:", song);
  console.log("Received influence:", influence);

  let songProperties = {};
  let songResult;

  if (song) {
    try {
      songResult = await pool.query(
        'SELECT "key", bpm, "Verse Length", "Chorus Length", "Bridge Length", "Outro Length", "Intro Length", "Intro Instrumentation", "Verse Instrumentation", "Chorus Instrumentation", "Bridge Instrumentation", "Outro Instrumentation", "Intro Chords", "Verse Chords", "Chorus Chords", "Bridge Chords", "Outro Chords" FROM songs WHERE id = $1',
        [song]
      );
      console.log("Fetched song properties:", songResult.rows);
      if (songResult.rows.length > 0) {
        songProperties = songResult.rows[0];
        // Add missing properties to songProperties
        songProperties["Intro Instrumentation"] =
          songProperties["Intro Instrumentation"];
        songProperties["Verse Instrumentation"] =
          songProperties["Verse Instrumentation"];
        songProperties["Chorus Instrumentation"] =
          songProperties["Chorus Instrumentation"];
        songProperties["Bridge Instrumentation"] =
          songProperties["Bridge Instrumentation"];
        songProperties["Outro Instrumentation"] =
          songProperties["Outro Instrumentation"];
        songProperties["Intro Chords"] = songProperties["Intro Chords"];
        songProperties["Verse Chords"] = songProperties["Verse Chords"];
        songProperties["Chorus Chords"] = songProperties["Chorus Chords"];
        songProperties["Bridge Chords"] = songProperties["Bridge Chords"];
        songProperties["Outro Chords"] = songProperties["Outro Chords"];
        songProperties["Outro Length"] = songProperties["Outro Length"];
      }
    } catch (err) {
      console.error("Error fetching song properties:", err.message);
      res.status(500).send("Server error");
      return;
    }
  }

  console.log("Era:", era);
  console.log("Year:", year);
  console.log("Genre:", genre);
  console.log("Location:", location);
  console.log("Song:", song);
  console.log("Influence:", influence);

  // Initialize the WHERE clause and values array
  let whereConditions = [];
  let values = [];

  if (era) {
    whereConditions.push(`s.era = $${values.length + 1}`);
    values.push(era);
  }

  if (year) {
    whereConditions.push(`s.year = $${values.length + 1}`);
    values.push(year);
  }

  if (genre) {
    whereConditions.push(`s.genre = $${values.length + 1}`);
    values.push(genre);
  }

  if (location) {
    whereConditions.push(`s.location = $${values.length + 1}`);
    values.push(location);
  }

  // If a song ID is provided, we might want to add conditions or join other tables based on song attributes.
  if (song) {
    // If necessary, add valid logic here. Otherwise, leave it empty.
  }

  const whereClause = whereConditions.length
    ? `WHERE ${whereConditions.join(" AND ")}`
    : "";

  // Now, incorporate this dynamic WHERE clause into your SQL query
  const query = `
    WITH filtered_songs AS (
        SELECT 
            "Chorus InstrumentationJSON", 
            "key", 
            bpm, 
            "camelot", 
            "Verse Length", 
            "Intro Length",
            "Chorus Length",
            "Bridge Length",
            "Outro Length",
            "Intro Instrumentation",
            "Verse Instrumentation",
            "Chorus Instrumentation",
            "Bridge Instrumentation",
            "Outro Instrumentation",
            "Intro Chords",
            "Verse Chords", 
            "Chorus Chords", 
            "Bridge Chords", 
            "Outro Chords"
        FROM songs s
        JOIN genres g ON s.genre = g.genre_id
        ${whereClause}
    ),

    keys_aggregated AS (
        SELECT "key" AS key_id
        FROM filtered_songs
    ),

    counted_keys AS (
        SELECT key_id, COUNT(*) AS frequency
        FROM keys_aggregated
        GROUP BY key_id
        ORDER BY frequency DESC
        LIMIT 5
    ),
    
    bpm_aggregated AS (
        SELECT bpm, COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY bpm
        ORDER BY frequency DESC
        LIMIT 3
    ),
    
    instruments_aggregated AS (
        SELECT 
        (regexp_matches("Chorus InstrumentationJSON", '(\\d+)'))[1]::integer AS instrument_id
        FROM filtered_songs
    ),
    
    counted_instruments AS (
        SELECT instrument_id, COUNT(*) AS frequency
        FROM instruments_aggregated
        GROUP BY instrument_id
        ORDER BY frequency DESC
        LIMIT 5
    ),
    
    camelots_aggregated AS (
        SELECT "camelot" AS camelot_id
        FROM filtered_songs
    ),
    
    counted_camelots AS (
        SELECT camelot_id, COUNT(*) AS frequency
        FROM camelots_aggregated
        GROUP BY camelot_id
        ORDER BY frequency DESC
        LIMIT 5
    ), 

    verse_length_aggregated AS (
        SELECT "Verse Length" AS length, COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Verse Length"
        ORDER BY frequency DESC
        LIMIT 1
    ),    
    
    intro_length_aggregated AS (
        SELECT "Intro Length" AS length, COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Intro Length"
        ORDER BY frequency DESC
        LIMIT 1
    ),

    chorus_length_aggregated AS (
        SELECT "Chorus Length" AS length, COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Chorus Length"
        ORDER BY frequency DESC
        LIMIT 1
    ),    
    
    bridge_length_aggregated AS (
        SELECT "Bridge Length" AS length, COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Bridge Length"
        ORDER BY frequency DESC
        LIMIT 1
    ),

    outro_length_aggregated AS (
        SELECT "Outro Length" AS length, COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Outro Length"
        ORDER BY frequency DESC
        LIMIT 1
    ),

    intro_instrument_combinations AS (
        SELECT 
            "Intro Instrumentation", 
            COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Intro Instrumentation"
        ORDER BY frequency DESC
        LIMIT 5
    ),

    verse_instrument_combinations AS (
        SELECT 
            "Verse Instrumentation", 
            COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Verse Instrumentation"
        ORDER BY frequency DESC
        LIMIT 5
    ),

    chorus_instrument_combinations AS (
        SELECT 
            "Chorus Instrumentation", 
            COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Chorus Instrumentation"
        ORDER BY frequency DESC
        LIMIT 5
    ),

    Bridge_instrument_combinations AS (
        SELECT 
            "Bridge Instrumentation", 
            COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Bridge Instrumentation"
        ORDER BY frequency DESC
        LIMIT 5
    ),

    outro_instrument_combinations AS (
        SELECT 
            "Outro Instrumentation", 
            COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Outro Instrumentation"
        ORDER BY frequency DESC
        LIMIT 5
    ), 

    intro_chords AS (
        SELECT 
            "Intro Chords", 
            COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Intro Chords"
        ORDER BY frequency DESC
        LIMIT 5
    ),

    verse_chords AS (
        SELECT 
            "Verse Chords", 
            COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Verse Chords"
        ORDER BY frequency DESC
        LIMIT 5
    ), 

    chorus_chords AS (
        SELECT 
            "Chorus Chords", 
            COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Chorus Chords"
        ORDER BY frequency DESC
        LIMIT 5
    ),

    bridge_chords AS (
        SELECT 
            "Bridge Chords", 
            COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Bridge Chords"
        ORDER BY frequency DESC
        LIMIT 5
    ),

    outro_chords AS (
        SELECT 
            "Outro Chords", 
            COUNT(*) AS frequency
        FROM filtered_songs
        GROUP BY "Outro Chords"
        ORDER BY frequency DESC
        LIMIT 5
    )

    SELECT 
    i.instrument_name::varchar AS name, ci.frequency, 'instrument' AS type
FROM counted_instruments ci
JOIN instruments i ON ci.instrument_id = i.instrument_id

UNION ALL --

SELECT 
    ino."Intro Instrumentation" AS name, 
    ino.frequency, 
    'intro_combination' AS type
FROM intro_instrument_combinations ino

UNION ALL

SELECT 
    ver."Verse Instrumentation" AS name, 
    ver.frequency, 
    'verse_combination' AS type
FROM verse_instrument_combinations ver

UNION ALL

SELECT 
    cic."Chorus Instrumentation" AS name, 
    cic.frequency, 
    'chorus_combination' AS type
FROM chorus_instrument_combinations cic

UNION ALL

SELECT 
    br."Bridge Instrumentation" AS name, 
    br.frequency, 
    'bridge_combination' AS type
FROM bridge_instrument_combinations br

UNION ALL

SELECT 
    ot."Outro Instrumentation" AS name, 
    ot.frequency, 
    'outro_combination' AS type
FROM outro_instrument_combinations ot

UNION ALL

SELECT 
    ic."Intro Chords" AS name, 
    ic.frequency, 
    'intro_chord' AS type
FROM intro_chords ic

UNION ALL

SELECT 
    vr."Verse Chords" AS name, 
    vr.frequency, 
    'verse_chord' AS type
FROM verse_chords vr

UNION ALL

SELECT 
    chch."Chorus Chords" AS name, 
    chch.frequency, 
    'chorus_chord' AS type
FROM chorus_chords chch

UNION ALL

SELECT 
    brch."Bridge Chords" AS name, 
    brch.frequency, 
    'bridge_chord' AS type
FROM bridge_chords brch

UNION ALL

SELECT 
    otch."Outro Chords" AS name, 
    otch.frequency, 
    'outro_chord' AS type
FROM outro_chords otch

UNION ALL

SELECT 
    k.keyname AS name, ck.frequency, 'key' AS type
FROM counted_keys ck
JOIN keysignatures k ON ck.key_id = k.keysignatureid

UNION ALL

SELECT 
    m.camelot_name AS name, mc.frequency, 'camelot' AS type
FROM counted_camelots mc
JOIN camelot m ON mc.camelot_id = m.camelot_id
    UNION ALL
    
    SELECT 
        bpm::text AS name, frequency, 'bpm' AS type
    FROM bpm_aggregated

    UNION ALL

    SELECT 
    vl.length::text AS name, vl.frequency, 'verse_length' AS type
    FROM verse_length_aggregated vl
    
    UNION ALL

    SELECT 
    il.length::text AS name, il.frequency, 'intro_length' AS type
    FROM intro_length_aggregated il

    UNION ALL

    SELECT 
    hl.length::text AS name, hl.frequency, 'chorus_length' AS type
    FROM chorus_length_aggregated hl
    
    UNION ALL

    SELECT 
    bl.length::text AS name, bl.frequency, 'bridge_length' AS type
    FROM bridge_length_aggregated bl

    UNION ALL

    SELECT 
    ol.length::text AS name, ol.frequency, 'outro_length' AS type
    FROM outro_length_aggregated ol

    ORDER BY frequency DESC;    
    `;

  console.log("Executing SQL:", query);

  try {
    const { rows } = await pool.query(query, values);

    const instruments = rows.filter((row) => row.type === "instrument");
    const keys = rows.filter((row) => row.type === "key");
    const bpms = rows.filter((row) => row.type === "bpm");
    const camelots = rows.filter((row) => row.type === "camelot");
    const verse_lengths = rows.filter((row) => row.type === "verse_length");
    const intro_lengths = rows.filter((row) => row.type === "intro_length");
    const chorus_lengths = rows.filter((row) => row.type === "chorus_length");
    const bridge_lengths = rows.filter((row) => row.type === "bridge_length");
    const outro_lengths = rows.filter((row) => row.type === "outro_length");
    const intro_combinations = rows.filter(
      (row) => row.type === "intro_combination"
    );
    const verse_combinations = rows.filter(
      (row) => row.type === "verse_combination"
    );
    const chorus_combinations = rows.filter(
      (row) => row.type === "chorus_combination"
    );
    const bridge_combinations = rows.filter(
      (row) => row.type === "bridge_combination"
    );
    const outro_combinations = rows.filter(
      (row) => row.type === "outro_combination"
    );
    const intro_chords = rows.filter((row) => row.type === "intro_chord");
    const verse_chords = rows.filter((row) => row.type === "verse_chord");
    const chorus_chords = rows.filter((row) => row.type === "chorus_chord");
    const bridge_chords = rows.filter((row) => row.type === "bridge_chord");
    const outro_chords = rows.filter((row) => row.type === "outro_chord");
    // Add filtering and storage for intro instrumentations

    if (song && song !== "None" && influence) {
      console.log("Influence logic triggered");
      const songAttributes = songProperties;

      if (!songAttributes.bpm || !songAttributes.key) {
        console.log(
          "Song attributes missing. Skipping influence calculations."
        );
        return; // Skip the rest of the influence logic
      }

      console.log("Retrieved song attributes:", songAttributes);

      // Adjust BPM
      if (bpms.length > 0) {
        const weightedAvgBPM =
          songAttributes.bpm * (influence / 100) +
          parseInt(bpms[0].name) * (1 - influence / 100);
        bpms[0].name = Math.round(weightedAvgBPM).toString();
      } else {
        console.log("No BPMs found in the result.");
      }

      // Intro Instrumentation
      if (
        intro_combinations.length > 0 &&
        songProperties["Intro Instrumentation"]
      ) {
        const weightedAvgIntroInstr =
          songProperties["Intro Instrumentation"] * ((influence * 50) / 100) +
          parseInt(intro_combinations[0].intro_combinations) *
            (1 - influence / 100);
        intro_combinations[0].intro_combinations = Math.round(
          weightedAvgIntroInstr
        ).toString();
      } else {
        console.log(
          "No intro instrumentations found in the result or song attributes."
        );
      }

      // Verse Instrumentation
      if (
        verse_combinations.length > 0 &&
        songProperties["Verse Instrumentation"]
      ) {
        const weightedAvgVerseInstr =
          songProperties["Verse Instrumentation"] * ((influence * 50) / 100) +
          parseInt(verse_combinations[0].verse_combinations) *
            (1 - influence / 100);
        verse_combinations[0].verse_combinations = Math.round(
          weightedAvgVerseInstr
        ).toString();
      } else {
        console.log(
          "No verse instrumentations found in the result or song attributes."
        );
      }

      // Chorus Instrumentation
      if (
        chorus_combinations.length > 0 &&
        songProperties["Chorus Instrumentation"]
      ) {
        const weightedAvgChorusInstr =
          songProperties["Chorus Instrumentation"] * ((influence * 50) / 100) +
          parseInt(chorus_combinations[0].chorus_combinations) *
            (1 - influence / 100);
        chorus_combinations[0].chorus_combinations = Math.round(
          weightedAvgChorusInstr
        ).toString();
      } else {
        console.log(
          "No chorus instrumentations found in the result or song attributes."
        );
      }

      // Pre-Chorus Instrumentation
      // Similar logic can be applied if you have data for pre-chorus

      // Bridge Instrumentation
      if (
        bridge_combinations.length > 0 &&
        songProperties["Bridge Instrumentation"]
      ) {
        const weightedAvgBridgeInstr =
          songProperties["Bridge Instrumentation"] * ((influence * 50) / 100) +
          parseInt(bridge_combinations[0].bridge_combinations) *
            (1 - influence / 100);
        bridge_combinations[0].bridge_combinations = Math.round(
          weightedAvgBridgeInstr
        ).toString();
      } else {
        console.log(
          "No bridge instrumentations found in the result or song attributes."
        );
      }

      // Outro Instrumentation
      if (
        outro_combinations.length > 0 &&
        songProperties["Outro Instrumentation"]
      ) {
        const weightedAvgOutroInstr =
          songProperties["Outro Instrumentation"] * ((influence * 50) / 100) +
          parseInt(outro_combinations[0].outro_combinations) *
            (1 - influence / 100);
        outro_combinations[0].outro_combinations = Math.round(
          weightedAvgOutroInstr
        ).toString();
      } else {
        console.log(
          "No outro instrumentations found in the result or song attributes."
        );
      }

      // Intro Chords
      if (intro_chords.length > 0 && songProperties["Intro Chords"]) {
        const weightedAvgIntroChrds =
          songProperties["Intro Chords"] * ((influence * 50) / 100) +
          parseInt(intro_chords[0].intro_chords) * (1 - influence / 100);
        intro_chords[0].intro_chords = Math.round(
          weightedAvgIntroChrds
        ).toString();
      } else {
        console.log("No intro chords found in the result or song attributes.");
      }

      // Verse Chords
      if (verse_chords.length > 0 && songProperties["Verse Chords"]) {
        const weightedAvgVerseChrds =
          songProperties["Verse Chords"] * ((influence * 50) / 100) +
          parseInt(verse_chords[0].verse_chords) * (1 - influence / 100);
        verse_chords[0].verse_chords = Math.round(
          weightedAvgVerseChrds
        ).toString();
      } else {
        console.log("No intro chords found in the result or song attributes.");
      }

      // Chorus Chords
      if (chorus_chords.length > 0 && songProperties["Chorus Chords"]) {
        const weightedAvgChorusChrds =
          songProperties["Chorus Chords"] * ((influence * 50) / 100) +
          parseInt(chorus_chords[0].chorus_chords) * (1 - influence / 100);
        chorus_chords[0].chorus_chords = Math.round(
          weightedAvgChorusChrds
        ).toString();
      } else {
        console.log("No intro chords found in the result or song attributes.");
      }

      // Bridge Chords
      if (bridge_chords.length > 0 && songProperties["Bridge Chords"]) {
        const weightedAvgBridgeChrds =
          songProperties["Bridge Chords"] * ((influence * 50) / 100) +
          parseInt(bridge_chords[0].bridge_chords) * (1 - influence / 100);
        bridge_chords[0].bridge_chords = Math.round(
          weightedAvgBridgeChrds
        ).toString();
      } else {
        console.log("No intro chords found in the result or song attributes.");
      }

      // Outro Chords
      if (outro_chords.length > 0 && songProperties["Outro Chords"]) {
        const weightedAvgOutroChrds =
          songProperties["Outro Chords"] * ((influence * 50) / 100) +
          parseInt(outro_chords[0].outro_chords) * (1 - influence / 100);
        outro_chords[0].outro_chords = Math.round(
          weightedAvgOutroChrds
        ).toString();
      } else {
        console.log("No intro chords found in the result or song attributes.");
      }

      // Outro Lengths - WORK ON
      if (outro_lengths.length > 0 && songProperties.outro_length) {
        console.log("Original outro length:", songProperties.outro_length);
        console.log("Influence:", influence);

        const weightedAvgOutroLength =
          songProperties.outro_length * (influence / 100) +
          parseInt(outro_lengths[0].name) * (1 - influence / 100);
        console.log("Weighted average:", weightedAvgOutroLength);

        outro_lengths[0].name = Math.round(weightedAvgOutroLength).toString();
        console.log("Adjusted outro length:", outro_lengths[0].name);
      } else {
        console.log("No outro lengths found in the result or song attributes.");
      }

      // Adjust Key
      if (keys.length > 0 && keys[0].name) {
        console.log("Era Key before adjustment:", keys[0].name);
        const adjustedKey = adjustKey(
          songAttributes.key,
          keys[0].name,
          influence
        );

        if (adjustedKey && adjustedKey !== "0" && adjustedKey !== "Unknown") {
          keys[0].name = adjustedKey;
        } else {
          console.log(
            `Adjusted key '${adjustedKey}' is invalid. Skipping key adjustment.`
          );
        }
      } else {
        console.log("No valid keys found in the result.");
      }
    }

    console.log("Response data:", {
      instruments,
      keys,
      bpms,
      camelots,
      verse_lengths,
      intro_lengths,
      chorus_lengths,
      bridge_lengths,
      outro_lengths,
      intro_combinations,
      verse_combinations,
      chorus_combinations,
      bridge_combinations,
      outro_combinations,
      intro_chords,
      verse_chords,
      chorus_chords,
      bridge_chords,
      outro_chords,
    });

    res.json({
      instruments,
      keys,
      bpms,
      camelots,
      verse_lengths,
      intro_lengths,
      chorus_lengths,
      bridge_lengths,
      outro_lengths,
      intro_combinations,
      verse_combinations,
      chorus_combinations,
      bridge_combinations,
      outro_combinations,
      intro_chords,
      verse_chords,
      chorus_chords,
      bridge_chords,
      outro_chords,

      // ... Include the other song sections ...
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// search
app.get("/api/search", async (req, res) => {
  try {
    const songName = req.query.songName || "";
    const artistName = req.query.artistName || "";

    const query = `
            SELECT *
            FROM songs
            JOIN genres ON songs.genre = genres.genre_id
            JOIN keysignatures ON songs.key = keysignatures.KeySignatureId
            JOIN countries ON songs.location = countries.country_id
            WHERE 
                (LOWER(songs.title) LIKE $1)
                AND
                (LOWER(songs.artist) LIKE $2)
        `;

    const values = [
      `%${songName.toLowerCase()}%`,
      `%${artistName.toLowerCase()}%`,
    ];

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// advanced search
app.get("/api/advanced-search", async (req, res) => {
  const {
    genreSwitch,
    genreDropdown,
    locationSwitch,
    locationDropdown,
    keySwitch,
    keyDropdown,
    eraSwitch,
    eraDropdown,
    yearSwitch,
    bpmSwitch,
    bpmInput,
    chartPosSwitch,
    chartPosInput,
    chordInput,
    instrumentSwitch,
    instrumentMultiselect,
  } = req.query;

  const values = [];
  let query = `
    SELECT *
    FROM songs
    JOIN genres ON songs.genre = genres.genre_id
    JOIN keysignatures ON songs.key = keysignatures.KeySignatureId
    JOIN countries ON songs.location = countries.country_id
    WHERE 1=1 
`;

  // Genre condition
  if (
    genreSwitch === "true" &&
    genreDropdown &&
    genreDropdown !== "Select an option"
  ) {
    query += `AND genres.genre_name = $${values.length + 1} `;
    values.push(genreDropdown);
  }

  // Location condition
  if (
    locationSwitch === "true" &&
    locationDropdown &&
    locationDropdown !== "Select an option"
  ) {
    query += `AND countries.CountryName = $${values.length + 1} `;
    values.push(locationDropdown);
  }

  // Key condition
  if (
    keySwitch === "true" &&
    keyDropdown &&
    keyDropdown !== "Select an option"
  ) {
    query += `AND keysignatures.KeyName = $${values.length + 1} `;
    values.push(keyDropdown);
  }

  // Era condition
  if (
    eraSwitch === "true" &&
    eraDropdown &&
    eraDropdown !== "Select an option"
  ) {
    query += `AND songs.Era = $${values.length + 1} `;
    values.push(eraDropdown);
  }

  query += `LIMIT 50`; // Limiting the results to 50 songs

  // Now, after building the query, execute it:
  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// key signature mapping
app.get("/api/keysignatures", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT keysignatureid, keyname FROM keysignatures"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// instrument mapping
app.get("/api/instruments", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM instruments WHERE instrument_id != $1",
      ["0"]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Define the Camelot endpoint
app.get("/api/camelot", async (req, res) => {
  try {
    const query = "SELECT camelot_id, camelot_name FROM camelot";
    const result = await pool.query(query);
    const camelotValues = result.rows;
    res.json(camelotValues);
  } catch (error) {
    console.error("Error fetching Camelot values:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// genre mapping
app.get("/api/genres", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT genre_id, genre_name FROM genres WHERE genre_id != $1",
      ["32"]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// song mapping (fetch)
app.get("/api/fetch-songs", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT title AS "Song", artist FROM songs'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// artist mapping (fetch)
app.get("/api/fetch-artists", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT artist FROM songs ORDER BY artist"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// country mapping (fetch)
app.get("/api/countries", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT country_id, CountryName FROM countries ORDER BY CountryName"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Endpoint to update the era in the songs table
app.post("/api/updateEra", async (req, res) => {
  try {
    const { era } = req.body;

    if (!era) {
      return res.status(400).json({ message: "Era is required." });
    }

    const query = `
            UPDATE songs
            SET era = $1
            WHERE some_condition;  -- Define your condition here
        `;

    const result = await pool.query(query, [era]);
    res.json({ message: "Era updated successfully." });
  } catch (error) {
    console.error("Error updating era:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to update the year in the songs table
app.post("/api/updateYear", async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ message: "Year is required." });
    }

    const query = `
            UPDATE songs
            SET year = $1
            WHERE some_condition;  -- Define your condition here
        `;

    const result = await pool.query(query, [year]);
    res.json({ message: "Year updated successfully." });
  } catch (error) {
    console.error("Error updating year:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// search songs (key, genre, bpm)
app.get("/api/search-songs", async (req, res) => {
  let { key, genre, bpm } = req.query;
  let query = "SELECT * FROM songs WHERE 1=1"; // Base query
  let values = [];
  if (key) {
    query += ` AND keysignatureid = $${values.length + 1}`;
    values.push(key);
  }
  if (genre) {
    query += ` AND genre_id = $${values.length + 1}`;
    values.push(genre);
  }
  if (bpm) {
    query += ` AND bpm = $${values.length + 1}`;
    values.push(bpm);
  }
  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Run Apple Logic Script
app.get("/run-script", (req, res) => {
  // Combined destructuring of all needed query params
  const {
    introLength,
    verseLength,
    chorusLength,
    bridgeLength,
    outroLength,
    instruments,
  } = req.query;

  // Parsing the lengths to integers
  const introLengthValue = parseInt(introLength[0]?.name || 0, 10);
  const verseLengthValue = parseInt(verseLength[0]?.name || 0, 10);
  const chorusLengthValue = parseInt(chorusLength[0]?.name || 0, 10);
  const bridgeLengthValue = parseInt(bridgeLength[0]?.name || 0, 10);
  const outroLengthValue = parseInt(outroLength[0]?.name || 0, 10);

  // Debugging logs to check received parameters
  console.log(
    "Extracted lengths:",
    introLengthValue,
    verseLengthValue,
    chorusLengthValue,
    bridgeLengthValue,
    outroLengthValue
  );

  // Debugging log for instruments
  console.log("Extracted instruments:", instruments);

  // Fix the space between the parameters
  const appleScriptCommand = `osascript /Users/ZoesComputer/Desktop/TamberLogic2.scpt ${introLengthValue} ${verseLengthValue} ${chorusLengthValue} ${bridgeLengthValue} ${outroLengthValue}`;

  // Log for debugging
  console.log("AppleScript Command:", appleScriptCommand);

  exec(appleScriptCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.sendStatus(500);
    }
    res.send("Script executed");
  });
});

// popualar aspects
app.get("/api/popular-aspects", async (req, res) => {
  console.log(req.query);
  const {
    countryInput,
    genreInput,
    eraSwitch,
    eraInput,
    dropdown_searchValue,
    songValue,
  } = req.query;

  const values = [
    countryInput,
    genreInput,
    eraSwitch === "true",
    eraInput,
    dropdown_searchValue,
    songValue,
  ];

  const query = `
    WITH conditions AS (
        SELECT songs.*
        FROM songs
        LEFT JOIN genres ON songs.genre = genres.genre_id
        JOIN countries ON songs.location = countries.country_id
        WHERE 
          countries.countryname = $1
          AND 
          (
            genres.genre_name = $2 
            OR 
            NOT EXISTS (SELECT 1 FROM genres WHERE genre_name = $2)
          )
          AND
          (
            $3 = true AND (COALESCE($4, '') = '' OR songs.era = $4)
            OR
            $3 = false
          )
      ),
      
      specific_song AS (
        SELECT key
        FROM songs
        WHERE title || ' - ' || artist = $5
      ),
      
      influenced_keys AS (
        SELECT 
          keysignatures.keyname, 
          COUNT(*) 
          + CAST($6 AS FLOAT) * CASE 
              WHEN keysignatures.keyname = (SELECT keyname FROM specific_song JOIN keysignatures ON specific_song.key = keysignatures.keysignatureid) THEN 
                  0.06 * COUNT(*) 
              ELSE 0 
            END AS influenced_count
        FROM conditions 
        JOIN keysignatures ON conditions.key = keysignatures.keysignatureid
        WHERE keysignatures.keyname != 'Unknown'
        GROUP BY keysignatures.keyname
      )
      
      SELECT 
       (SELECT keyname FROM influenced_keys ORDER BY influenced_count DESC LIMIT 1) AS influenced_key_by_first_song;
`;

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${process.env.PORT || 5001}`);
});
