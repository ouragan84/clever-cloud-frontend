// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LoginForm from './pages/Login';
// import Home from './pages/MainPage';
// import RegistrationForm from './Register';

// function App() {
//   const token = localStorage.getItem('token');

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Redirect users based on the presence of a token */}
//           {/* Login Route: Only accessible if no token is present, otherwise redirect to home */}
//           <Route path="/login" element={!token ? <LoginForm /> : <Navigate replace to="/" />} />
          
//           {/* Registration Route: Similar logic to login, accessible only when no token exists */}
//           <Route path="/register" element={!token ? <RegistrationForm /> : <Navigate replace to="/" />} />
          
//           {/* Home/Main Page Route: Requires a token, if not present, redirect to login */}
//           <Route path="/" element={token ? <Home /> : <Navigate replace to="/login" />} />
          
//           {/* Handling any other undefined routes: Redirect to the main page or login based on authentication */}
//           <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/Login';
import Home from './pages/MainPage';
import RegistrationForm from './Register';

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
          <Route path="/" element={authToken ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="*" element={<Navigate to={authToken ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
