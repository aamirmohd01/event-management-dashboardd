// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventManagement from './pages/EventManagement';
import AttendeeManagement from './pages/AttendeeManagement';
import TaskTracker from './pages/TaskTracker';
import Login from './pages/Login';
import Register from './pages/Register'; // Import Register Page

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Add Register Route */}
        <Route
          path="/"
          element={isAuthenticated ? <EventManagement /> : <Navigate to="/login" />}
        />
        <Route
          path="/attendees"
          element={isAuthenticated ? <AttendeeManagement /> : <Navigate to="/login" />}
        />
        <Route
          path="/tasks"
          element={isAuthenticated ? <TaskTracker /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
