import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import AdvancedSearchComponent from './components/AdvancedSearchComponent';
import CreateComponent from './components/CreateComponent'; // Update the path to where CreateComponent is actually located
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
                            <li><Link to="/songs">Songs</Link></li>  {/* New Link */}
                        </ul>
                    </nav>
                </header>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<AdvancedSearchComponent />} />
                    <Route path="/create" element={<CreateComponent />} />
                    <Route path="/songs" element={<SongList />} />  {/* New Route */}
                </Routes>

                {/* You can add other components and elements below */}
            </div>
        </Router>
    );
}

export default App;
