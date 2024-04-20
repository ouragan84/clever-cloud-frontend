import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const hashedPassword = CryptoJS.SHA256(password).toString();

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: hashedPassword }),
      });
      const data = await response.json();
      console.log(data);
      // Handle the response appropriately
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '300px', margin: 'auto' }}>
    
      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" 
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
      </div>
      <br />
      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" 
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
      </div>
      <br />
      <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '4px' }}>Submit</button>
    </form>
  );
}
