import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PageEditor from './pages/PageEditor'; // A new page editor component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit/:pageId" element={<PageEditor />} /> {/* Route for editing a specific page */}
      </Routes>
    </Router>
  );
}

export default App;
