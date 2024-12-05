import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthButtons from '../components/AuthButtons';

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        alert('Login successful');

        // Store token in localStorage
        localStorage.setItem('token', data.token);

        // Redirect user to the dashboard
        navigate('/dashboard');
      } else {
        console.error('Login failed:', data.message);
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <h1>Login</h1>
      <form
        onSubmit={handleLogin}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          margin: '20px 0',
        }}
      >
        <input
          type="text"
          placeholder="Email or Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          style={{ margin: '10px 0', padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: '10px 0', padding: '10px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>
      <div style={{ marginTop: '10px' }}>
        <p>Or log in using:</p>
        <AuthButtons />
      </div>
    </div>
  );
};

export default LoginPage;
