import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import EraYearComponent from "./EraYearComponent";
import "./AdvancedSearchComponent.css";
import SpotifyPlayer from "./SpotifyPlayer";

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
            {" "}
            {/* Adjusted the column size */}
            <div className="text-center mb-5">
              {/* Add any content you want above the EraYearComponent */}
            </div>
            <div className="rounded p-4 shadow my-4">
              {" "}
              {/* Adjusted padding and margin */}
              <EraYearComponent onTrackSelect={handleTrackSelect} />
            </div>
            {/* Add any content you want below the EraYearComponent */}
          </Col>
        </Row>
      </Container>
      <div className="spotify-sticky-footer">
        <SpotifyPlayer trackUri={currentTrackUri} />
      </div>
    </>
  );
};

export default AdvancedSearchComponent;
