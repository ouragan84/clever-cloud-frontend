// App.js
import React from 'react';
import LoginForm from './pages/Login';
import MainPage from './pages/MainPage';

import env from "react-dotenv";

// hpw to use env variables
console.log(env.BACKEND_URL);

function App() {
  return (
    <div className="App">
      <MainPage />
    </div>
  );
}

export default App;
