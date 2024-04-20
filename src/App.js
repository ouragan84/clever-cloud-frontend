import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/Login';
import Home from './pages/MainPage';
import RegistrationForm from './Register';

import env from "react-dotenv";

// hpw to use env variables
console.log(env.BACKEND_URL);

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={!authToken ? <LoginForm setToken={setAuthToken} /> : <Navigate replace to="/" />} />
          <Route path="/register" element={!authToken ? <RegistrationForm setToken={setAuthToken} /> : <Navigate replace to="/" />} />
          <Route path="/" element={authToken ? <Home /> : <Navigate replace to="/register" />} />
          <Route path="*" element={<Navigate to={authToken ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
