import React from "react";
import styled from "styled-components";
import NewInfluencerComponent from "./NewInfluencerComponent";
import ChatWidget from "./ChatWidget";
import ChordPlayer from "./ChordPlayer"; // Import the ChordPlayer component

const CreateComponent = () => {
  return (
    <>
      <NewInfluencerComponent style={{ marginBottom: "100px" }} />
      {/* <ChatWidget style={{ marginBottom: "20px" }} /> */}
      {/* <ChordPlayer />  */}
      {/* Integrate the ChordPlayer component */}
    </>
  );
};

export default CreateComponent;
