import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import AdvancedSearchComponent from './components/AdvancedSearchComponent';
import CreateComponent from './components/CreateComponent';
import CSVUpload from './components/CSVUpload';  // Import the CSVUpload component
import { Container, Navbar, Nav } from 'react-bootstrap';



function App() {
    return (
        <Router>
            <div className="App">
                {/* Header with navigation links */}
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand href="#">Tamber</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/">Search</Nav.Link>
                                <Nav.Link as={Link} to="/create">Create</Nav.Link>
                                <Nav.Link as={Link} to="/upload">Upload CSV</Nav.Link> {/* New navigation link for uploading CSV */}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                {/* Routes */}
                <Container className="mt-4">
                    <Routes>
                        <Route path="/" element={<AdvancedSearchComponent />} />
                        <Route path="/create" element={<CreateComponent />} />
                        <Route path="/upload" element={<CSVUploadPage />} />  {/* New route for uploading CSV */}
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

function CSVUploadPage() {  // New component for the CSV upload page
    return (
        <div>
            <h2>Upload Songs CSV</h2>
            <CSVUpload />
        </div>
    );
}

export default App;
