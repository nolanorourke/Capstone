// Assuming this is src/app/App.js
'use client';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './login/LoginPage';
import RegisterPage from './register/RegisterPage';
import UserPage from './user/UserPage';
import ReportPage from './ReportPage/ReportPage'

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/recipe" element={<RegisterPage />} />
          <Route path="/ReportPage" element={<ReportPage />}/>
          {/* Define other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;