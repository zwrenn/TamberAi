import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import AdvancedSearchComponent from './components/AdvancedSearchComponent';
import CreateComponent from './components/CreateComponent';
import SongList from './components/SongList';

function App() {
    return (
        <Router>
            <div className="App">
                {/* Header with navigation links */}
                <header className="App-header">
                    <nav>
                        <ul>
                            <li><Link to="/">Search</Link></li>
                            <li><Link to="/create">Create</Link></li>
                            <li><Link to="/songs">Songs</Link></li>
                        </ul>
                    </nav>
                </header>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<AdvancedSearchComponent />} />
                    <Route path="/create" element={<CreateComponent />} />
                    <Route path="/songs" element={<SongListPage />} />
                </Routes>
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
