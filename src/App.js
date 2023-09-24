import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import AdvancedSearchComponent from "./components/AdvancedSearchComponent";
import CreateComponent from "./components/CreateComponent";
import CSVUpload from "./components/CSVUpload";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useGlobalVoiceCommands } from "./components/VoiceCommandManager";
import AssistantComponent from "./components/AssistantComponent";
import { faSearch, faMusic, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const VerticalNavbar = styled(Navbar)`
  flex-direction: column;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100px;

  background: rgba(255, 255, 255, 0.2) !important; // Adjusted opacity
  backdrop-filter: blur(
    15px
  ) !important; // Increased blur for a more pronounced effect
  border-right: 1px solid rgba(255, 255, 255, 0.3) !important; // Slight adjustment to border
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important; // Added box shadow

  /* Gradient to give the navbar a more three-dimensional look */
  border-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0)
  );
  border-image-slice: 1;

  /* Ensuring text and icons have a slight shadow for better readability */
  * {
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.2) !important;
  }
`;

// Flex container for main App layout
const FlexContainer = styled.div`
  display: flex;
  height: 100vh;
`;

// Main content container styled to fit next to VerticalNavbar
const MainContent = styled.div`
  flex: 1;
  margin-left: 100px;
  width: calc(
    100% - 100px
  ); // Adjusting the width to take up the remaining space after the navbar
  padding: 0 15px; // Add padding as needed
`;

function App() {
  useGlobalVoiceCommands();

  return (
    <Router>
      <FlexContainer className="App">
        {/* Assistant component */}
        <AssistantComponent />

        {/* Vertical Navbar on the left */}
        <VerticalNavbar bg="dark" variant="dark">
          <Navbar.Brand href="#">Tamber</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto flex-column">
              <Nav.Link as={Link} to="/">
                <div className="icon-text-container">
                  <img
                    src={process.env.PUBLIC_URL + "/shape-88.png"}
                    alt="Search"
                    className="navbar-icon"
                  />
                  <svg
                    width="80"
                    height="80"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id="curvePath"
                      className="text-path"
                      d="M5 85 Q40 -10 85 70"
                    />
                    <text width="80" font-size="12px" fill="#fff">
                      <textPath xlinkHref="#curvePath" startOffset="50%">
                        Search
                      </textPath>
                    </text>
                  </svg>
                </div>
              </Nav.Link>
              <Nav.Link as={Link} to="/create">
                <div className="icon-text-container">
                  <img
                    src={process.env.PUBLIC_URL + "/shape-78.png"}
                    alt="Search"
                    className="navbar-icon2"
                  />
                  <svg
                    width="80"
                    height="80"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id="curvePath"
                      className="text-path"
                      d="M5 85 Q40 -10 85 70"
                    />
                    <text width="80" font-size="12px" fill="#fff">
                      <textPath xlinkHref="#curvePath" startOffset="50%">
                        Create
                      </textPath>
                    </text>
                  </svg>
                </div>
              </Nav.Link>
              <Nav.Link as={Link} to="/upload">
                <div className="icon-text-container">
                  <img
                    src={process.env.PUBLIC_URL + "/shape-63.png"}
                    alt="Search"
                    className="navbar-icon3"
                  />
                  <svg
                    width="80"
                    height="80"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id="curvePath"
                      className="text-path"
                      d="M5 85 Q40 -10 85 70"
                    />
                    <text width="80" font-size="12px" fill="#fff">
                      <textPath xlinkHref="#curvePath" startOffset="50%">
                        Upload
                      </textPath>
                    </text>
                  </svg>
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </VerticalNavbar>

        {/* Main content offset to the right of the navbar */}
        <MainContent className="mt-4">
          <Routes>
            <Route path="/" element={<AdvancedSearchComponent />} />
            <Route path="/create" element={<CreateComponent />} />
            <Route path="/upload" element={<CSVUploadPage />} />
          </Routes>
        </MainContent>
      </FlexContainer>
    </Router>
  );
}

function CSVUploadPage() {
  return (
    <div>
      <h2>Upload Songs CSV</h2>
      <CSVUpload />
    </div>
  );
}

export default App;
