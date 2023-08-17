import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import AdvancedSearchComponent from './components/AdvancedSearchComponent';
import CreateComponent from './components/CreateComponent';
import SongList from './components/SongList';
import { Container, Navbar, Nav } from 'react-bootstrap';

function App() {
    return (
        <Router>
            <div className="App">
                {/* Header with navigation links */}
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand href="#">Your App Name</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/">Search</Nav.Link>
                                <Nav.Link as={Link} to="/create">Create</Nav.Link>
                                <Nav.Link as={Link} to="/songs">Songs</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                {/* Routes */}
                <Container className="mt-4">
                    <Routes>
                        <Route path="/" element={<AdvancedSearchComponent />} />
                        <Route path="/create" element={<CreateComponent />} />
                        <Route path="/songs" element={<SongListPage />} />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

function SongListPage() {
    return (
        <div>
            <h2>Songs Page</h2>
            <SongList />
        </div>
    );
}

export default App;
