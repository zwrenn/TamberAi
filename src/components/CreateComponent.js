import React from 'react';
import styled from 'styled-components';
import NewInfluencerComponent from './NewInfluencerComponent';
import ChatWidget from './ChatWidget';
import ChordPlayer from './ChordPlayer'; // Import the ChordPlayer component
import AppleScriptButton from './AppleScriptButton';

const StyledCreateComponent = styled.div`
  background-color: #111;
  color: #fff;
  font-family: 'Roboto', sans-serif;
`;

const CreateComponent = () => {
  return (
    <StyledCreateComponent>
      <NewInfluencerComponent />
      <ChatWidget />
      <ChordPlayer /> {/* Integrate the ChordPlayer component */}
      <AppleScriptButton />
    </StyledCreateComponent>
  );
}

export default CreateComponent;
