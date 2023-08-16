import React from 'react';
// import GeographyComponent from './GeographyComponent';
import EraYearComponent from './EraYearComponent';
// import ChartPositionComponent from './ChartPositionComponent';
//import KeyGenreBPMComponent from './KeyGenreBPMComponent';
// import ChordsComponent from './ChordsComponent';
// import InstrumentComponent from './InstrumentComponent';
import QuickSearchComponent from './QuickSearchComponent';
// import ResultsTable from './ResultsTable';


const AdvancedSearchComponent = () => {

    return (
        <div className="advanced-search">
            <EraYearComponent />
            <QuickSearchComponent /> 
        </div>
    );
}

export default AdvancedSearchComponent;