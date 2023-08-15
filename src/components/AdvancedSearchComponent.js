import React from 'react';
import GeographyComponent from './GeographyComponent';
import EraYearComponent from './EraYearComponent';
import ChartPositionComponent from './ChartPositionComponent';
import KeyGenreBPMComponent from './KeyGenreBPMComponent';
import ChordsComponent from './ChordsComponent';
import InstrumentComponent from './InstrumentComponent';
import QuickSearchComponent from './QuickSearchComponent';
import ResultsTable from './ResultsTable';



const AdvancedSearchComponent = () => {

    // This is just dummy data for illustration
    const advancedSearchResults = [
        { song: "Song A", artist: "Artist A" },
        { song: "Song B", artist: "Artist B" }
    ];

    const quickSearchResults = [
        { song: "Song X", artist: "Artist X" },
        { song: "Song Y", artist: "Artist Y" }
    ];

    return (
        <div className="advanced-search">
            <GeographyComponent />
            <EraYearComponent />
            <ChartPositionComponent />
            <KeyGenreBPMComponent />
            <ChordsComponent />
            <InstrumentComponent />
            <QuickSearchComponent /> 
            <ResultsTable results={advancedSearchResults} title="Advanced Search Results" />
            <ResultsTable results={quickSearchResults} title="Quick Search Results" />
        </div>
    );
}

export default AdvancedSearchComponent;