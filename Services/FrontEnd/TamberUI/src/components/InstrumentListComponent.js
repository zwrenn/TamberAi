import React from "react";

const InstrumentListComponent = ({ commonInstruments }) => {
  return (
    <div>
      <h3>Most Common Instruments for the Chorus:</h3>
      <ul>
        {commonInstruments.map((instrument, index) => (
          <li key={index}>
            Instrument ID: {instrument.instrument_id}, Frequency:{" "}
            {instrument.frequency}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstrumentListComponent;
