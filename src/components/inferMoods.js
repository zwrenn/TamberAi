const axios = require("axios");
const { Pool } = require("pg");

// Your provided constants
// Use environment variables for sensitive information
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const PORT = 5001;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function getSongsByPosition(offset, limit) {
  const res = await pool.query(
    "SELECT * FROM songs ORDER BY id OFFSET $1 LIMIT $2",
    [offset, limit]
  );
  return res.rows;
}

async function processQueryWithGPT4(query) {
  const response = await axios.post(
    "https://api.openai.com/v1/engines/text-davinci-003/completions",
    {
      prompt: query,
      max_tokens: 150,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0].text.trim();
}

async function updateSongMood(songId, mood) {
  await pool.query(`UPDATE songs SET mood = $1 WHERE id = $2`, [mood, songId]);
}

async function inferMoodForSongs(offset, limit) {
  const songs = await getSongsByPosition(offset, limit);

  for (const song of songs) {
    const gptQuery = `Given the song "${song.title}" by ${song.artist} with genre ${song.genre} and chords ${song["Intro Chords"]}, what are 5-6 mood descriptors for the song?`;
    const fullResponse = await processQueryWithGPT4(gptQuery);

    const moodMatch = fullResponse
      .split("\n")
      .map((mood) => mood.split(". ")[1])
      .join(", ");
    const inferredMood = moodMatch ? moodMatch : "Unknown";

    console.log(`Song: "${song.title}" by ${song.artist}.`);
    console.log(`Inferred Mood: ${inferredMood}`);
    console.log(`Full Response: ${fullResponse}\n`);

    await updateSongMood(song.id, inferredMood);
  }
}

// Example usage:
// This will infer the mood for the next 10 songs starting from the 20th position in the database.
inferMoodForSongs(123, 2000)
  .then(() => {
    console.log("\nMood inference process completed.");
    pool.end(); // Close the database connection
  })
  .catch((error) => {
    console.error("\nAn error occurred:", error);
    pool.end(); // Close the database connection
  });
