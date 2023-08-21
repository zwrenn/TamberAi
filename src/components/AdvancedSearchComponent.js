import React from 'react';
import EraYearComponent from './EraYearComponent';
import QuickSearchComponent from './QuickSearchComponent';


const AdvancedSearchComponent = () => {

    return (
        <div className="advanced-search">
            <EraYearComponent />
            <QuickSearchComponent />
        </div>
    );
}

export default AdvancedSearchComponent;