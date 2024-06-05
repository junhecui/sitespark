import React from 'react';
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
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<WebsiteList />} />
          <Route path="/add-website" element={<AddWebsite />} />
          <Route path="/website/:websiteId/pages" element={<PageList />} />
          <Route path="/website/:websiteId/add-page" element={<AddPage />} />
          <Route path="/page/:pageId/edit" element={<PrivateRoute component={PageEditor} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
