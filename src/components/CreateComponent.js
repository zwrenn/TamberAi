import React from 'react';
import styled from 'styled-components';
import NewInfluencerComponent from './NewInfluencerComponent';
import ChatWidget from './ChatWidget';
import ChordPlayer from './ChordPlayer'; // Import the ChordPlayer component

const StyledCreateComponent = styled.div`
  background-color: #111;
  color: #fff;
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Ensure it takes up the full viewport height */
  padding: 20px; /* Add padding all around the component */
`;

const CreateComponent = () => {
  return (
    <StyledCreateComponent>
      <NewInfluencerComponent style={{ marginBottom: '20px' }} />
      <ChatWidget style={{ marginBottom: '20px' }} />
      <ChordPlayer /> {/* Integrate the ChordPlayer component */}
    </StyledCreateComponent>
  );
}

export default CreateComponent;
