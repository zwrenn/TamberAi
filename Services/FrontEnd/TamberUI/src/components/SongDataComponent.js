import React, { useState } from "react";

function SongDataComponent() {
  const [songData, setSongData] = useState(null);
  const [genre, setGenre] = useState("pop");
  const [era, setEra] = useState("1950s");
  const [year, setYear] = useState("1955");

  // Handler to fetch data
  const fetchData = () => {
    fetch(`/api/fetch-song-data?genre=${genre}&era=${era}&year=${year}`)
      .then((response) => response.json())
      .then((data) => setSongData(data))
      .catch((error) => console.error("Error fetching song data:", error));
  };

  // Render the data
  return (
    <div>
      <button onClick={fetchData}>Fetch Song Data</button>
      {songData ? (
        <>
          <p>
            Popular Intro Instrumentation:{" "}
            {songData.popular_intro_instrumentation}
          </p>
          {/* Render other song data similarly */}
        </>
      ) : (
        <p>Click the button to load data...</p>
      )}
    </div>
  );
}

export default SongDataComponent;
