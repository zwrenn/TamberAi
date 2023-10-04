import React from "react";
import { Table } from "react-bootstrap";

const SearchSongsComponentPrompt = ({
  songs,
  keysignatures,
  genres,
  countries,
  camelot,
  onSongClick,
}) => {
  // Logging the props to see their values
  console.log("Songs:", songs);
  console.log("Keys:", keysignatures);
  console.log("Genres:", genres);
  const keynameMap = {};
  keysignatures.forEach((keysignature) => {
    keynameMap[keysignature.keysignatureid] = keysignature.keyname;
  });

  const genreNameMap = {};
  genres.forEach((genre) => {
    genreNameMap[genre.genre_id] = genre.genre_name;
  });

  const countryNameMap = {};
  countries.forEach((country) => {
    countryNameMap[country.country_id] = country.countryname;
  });

  const camelotNameMap = {};
  camelot.forEach((camelot) => {
    camelotNameMap[camelot.camelot_id] = camelot.camelot_name;
  });

  return (
    <div className="song-table">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Year</th>
            <th>Genre</th>
            <th>BPM</th>
            <th>Key</th>
            <th>Camelot</th>
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
            <th>Mood</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>
                {/* This will trigger the song change in the player when clicked */}
                <a
                  href={song["Spotify URL"]}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Direct click log for:", song.title);
                    onSongClick(song["Spotify URL"]);
                    console.log("Complete song object:", song);
                  }}
                >
                  {song.title}
                </a>
              </td>
              <td>{song.artist}</td>
              <td>{song.year}</td>
              <td>{genreNameMap[song.genre] || "Unknown"}</td>
              <td>{song.bpm}</td>
              <td>{keynameMap[song.key] || "Unknown"}</td>
              <td>{camelotNameMap[song.camelot] || "Unknown"}</td>
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
              <td>{countryNameMap[song.location] || "Unknown"}</td>
              <td>{song.era}</td>
              <td>{song.mood}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SearchSongsComponentPrompt;
