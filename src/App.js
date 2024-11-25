import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import GenerateQR from './components/GenerateQR';
import UpdateCard from './components/UpdateCard';

function App() {
  return (
    <Router>
      <div>
        <h1>NFC Card Manager</h1>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generate" element={<GenerateQR />} />
          <Route path="/update/:cardId" element={<UpdateCard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
