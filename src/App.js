// App.js
import React from 'react';
import LoginForm from './pages/Login';
import MainPage from './pages/MainPage';
import RegistrationForm from './Register';

function App() {
  return (
    <div className="App">
      {/* <MainPage /> */}
      <LoginForm/>
      <RegistrationForm/>
    </div>
  );
}

export default App;
