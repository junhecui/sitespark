import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PageEditor from './pages/PageEditor';
import WebsiteList from './pages/WebsiteList';
import AddWebsite from './pages/AddWebsite';
import PageList from './pages/PageList';
import AddPage from './pages/AddPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WebsiteList />} />
        <Route path="/add-website" element={<AddWebsite />} />
        <Route path="/website/:websiteId/pages" element={<PageList />} />
        <Route path="/website/:websiteId/add-page" element={<AddPage />} />
        <Route path="/page/:pageId/edit" element={<PageEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
