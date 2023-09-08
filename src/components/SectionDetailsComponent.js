import React, { useState } from "react";

const SectionDetailsComponent = () => {
  const [activeTab, setActiveTab] = useState("Verse"); // Default to 'Verse' tab

  // Sample data for demonstration purposes
  const sampleData = {
    Verse: {
      mostCommon: "Guitar",
      mostCommonCombo: "Guitar, Drums",
      instrumentPresence: {
        Guitar: 50,
        Piano: 30,
        Drums: 20,
      },
      combinations: [
        { combo: "Guitar, Drums", count: 10 },
        { combo: "Piano, Vocals", count: 5 },
      ],
    },
    "Pre-Chorus": {
      mostCommon: "Piano",
      mostCommonCombo: "Piano, Vocals",
      instrumentPresence: {
        Piano: 60,
        Vocals: 25,
        Guitar: 15,
      },
      combinations: [
        { combo: "Piano, Vocals", count: 12 },
        { combo: "Guitar, Piano", count: 4 },
      ],
    },
    Chorus: {
      mostCommon: "Drums",
      mostCommonCombo: "Drums, Guitar",
      instrumentPresence: {
        Drums: 55,
        Guitar: 35,
        Piano: 10,
      },
      combinations: [
        { combo: "Drums, Guitar", count: 11 },
        { combo: "Piano, Vocals", count: 3 },
      ],
    },
    Bridge: {
      mostCommon: "Violin",
      mostCommonCombo: "Violin, Flute",
      instrumentPresence: {
        Violin: 45,
        Flute: 40,
        Piano: 15,
      },
      combinations: [
        { combo: "Violin, Flute", count: 9 },
        { combo: "Piano, Violin", count: 4 },
      ],
    },
    Outro: {
      mostCommon: "Flute",
      mostCommonCombo: "Flute, Piano",
      instrumentPresence: {
        Flute: 65,
        Piano: 25,
        Drums: 10,
      },
      combinations: [
        { combo: "Flute, Piano", count: 7 },
        { combo: "Drums, Flute", count: 5 },
      ],
    },
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <div className="btn-group d-flex justify-content-between mb-3">
        {["Verse", "Pre-Chorus", "Chorus", "Bridge", "Outro"].map((tab) => (
          <button
            key={tab}
            className={`btn btn-${activeTab === tab ? "primary" : "secondary"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content for active tab */}
      <div>
        <p>
          <strong>Most Common:</strong> {sampleData[activeTab].mostCommon}
        </p>
        <p>
          <strong>Most Common Instrument Combination:</strong>{" "}
          {sampleData[activeTab].mostCommonCombo}
        </p>

        {/* Bar Chart */}
        <div className="d-flex justify-content-between align-items-end">
          {Object.keys(sampleData[activeTab].instrumentPresence).map(
            (instrument) => (
              <div
                key={instrument}
                className="bg-info text-white text-center p-1"
                style={{
                  height: `${sampleData[activeTab].instrumentPresence[instrument]}%`,
                  width: "18%",
                }}
              >
                {instrument}
              </div>
            )
          )}
        </div>

        {/* Combination Table */}
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Instrument Combination</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {sampleData[activeTab].combinations.map((combo, index) => (
              <tr key={index}>
                <td>{combo.combo}</td>
                <td>{combo.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionDetailsComponent;
