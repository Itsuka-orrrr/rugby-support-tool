import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './HomePage';
import TeamRegistrationForm from './TeamRegistrationForm';
import TeamDashboard from './TeamDashboard';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="App" style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/team/:teamId/dashboard" element={<TeamDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
