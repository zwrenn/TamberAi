import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import EraYearComponent from "../components/EraYearComponent";
import SpotifyPlayer from "../components/SpotifyPlayer";
import AssistantComponent from "../components/AssistantComponent"; // Step 1: Import AssistantComponent
import styled from "styled-components";
import "../components/theme/AdvancedSearchComponent.css";

export const StyledHeader = styled.h2`
  text-align: left;
  padding: 10px;
  font-weight: bolder;
  color: #000;
  margin-bottom: 0.5rem;
  font-size: 20px !important;
`;

const StyledSubtitle = styled.p`
  font-size: 1.4rem;
`;

const StyledRoundedDiv = styled.div`
  border-radius: 15px;
  padding: 4px;
`;

const StyledPlayer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #222;
  z-index: 1000;
  padding: 10px;
  box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.1);
`;

const convertUrlToURI = (url) => {
  return url
    ? url.replace("https://open.spotify.com/track/", "spotify:track:")
    : null;
};

const AdvancedSearchComponent = () => {
  const [currentTrackUri, setCurrentTrackUri] = React.useState(null);

  const handleTrackSelect = (url) => {
    setCurrentTrackUri(convertUrlToURI(url));
  };

  return (
    <>
      {/* AssistantComponent moved outside of Container */}
      <AssistantComponent setSelectedTrackUri={handleTrackSelect} />

      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={80}>
            <div className="text-center">
              <StyledHeader>Advanced Search</StyledHeader>
            </div>
            <StyledRoundedDiv>
              <EraYearComponent onTrackSelect={handleTrackSelect} />
            </StyledRoundedDiv>
          </Col>
        </Row>
      </Container>
      <StyledPlayer>
        <SpotifyPlayer trackUri={currentTrackUri} />
      </StyledPlayer>
    </>
  );
};

export default AdvancedSearchComponent;
