import React from 'react';
import { Container } from 'react-bootstrap'; // Import Container from react-bootstrap
import EraYearComponent from './EraYearComponent';

const AdvancedSearchComponent = () => {
    return (
        <Container className="mt-4"> {/* Wrap the content inside Container */}
                <EraYearComponent />
        </Container>
    );
}

export default AdvancedSearchComponent;
