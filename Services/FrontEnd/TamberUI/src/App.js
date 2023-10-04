import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import AdvancedSearchComponent, {
  StyledHeader,
} from "./pages/AdvancedSearchComponent";
import CreateComponent from "./pages/CreateComponent";
import CSVUpload from "./pages/CSVUpload";
import { Navbar, Nav } from "react-bootstrap";
import { useGlobalVoiceCommands } from "./components/VoiceCommandManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faSearch,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

const VerticalNavbar = styled(Navbar)`
  flex-direction: column;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100px;
  background: #5478f0 !important; // Adjusted opacity
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
        {/* Vertical Navbar on the left */}
        <VerticalNavbar bg="dark" variant="dark">
          <Navbar.Brand href="#">Tamber</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto flex-column">
              <Nav.Link as={Link} to="/">
                <div className="icon-text-container">
                  <FontAwesomeIcon icon={faSearch} className="navbar-icon" />
                </div>
              </Nav.Link>
              <Nav.Link as={Link} to="/create">
                <div className="icon-text-container">
                  <FontAwesomeIcon icon={faPencil} className="navbar-icon" />
                </div>
              </Nav.Link>
              <Nav.Link as={Link} to="/upload">
                <div className="icon-text-container">
                  <p>
                    <FontAwesomeIcon icon={faUpload} className="navbar-icon" />
                  </p>
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </VerticalNavbar>

        {/* Main content offset to the right of the navbar */}
        <MainContent>
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
      <StyledHeader>Upload Songs CSV</StyledHeader>
      <CSVUpload />
    </div>
  );
}

export default App;
