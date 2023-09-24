import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import EraYearComponent from "./EraYearComponent";
import SpotifyPlayer from "./SpotifyPlayer";
import styled from "styled-components";

const StyledHeader = styled.h2`
  font-weight: bolder;
  margin-bottom: 0.5rem;
`;

const StyledSubtitle = styled.p`
  font-size: 1.4rem;
`;

const StyledRoundedDiv = styled.div`
  border-radius: 15px;
  padding: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={80}>
            <div className="text-center mb-5">
              <StyledHeader className="display-4">Advanced Search</StyledHeader>
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
