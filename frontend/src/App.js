import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PageEditor from './pages/PageEditor';
import WebsiteList from './pages/WebsiteList';
import AddWebsite from './pages/AddWebsite';
import PageList from './pages/PageList';
import AddPage from './pages/AddPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  return (
    <Router>
      <Navigation token={token} setToken={saveToken} />
      <Routes>
        <Route path="/" element={<WebsiteList />} />
        <Route path="/add-website" element={<AddWebsite />} />
        <Route path="/website/:websiteId/pages" element={<PageList />} />
        <Route path="/website/:websiteId/add-page" element={<AddPage />} />
        <Route path="/page/:pageId/edit" element={<PrivateRoute token={token} element={PageEditor} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setToken={saveToken} />} />
      </Routes>
    </Router>
  );
}

export default App;
