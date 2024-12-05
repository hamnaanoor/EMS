import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import AuthButtons from '../components/AuthButtons';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();  // Initialize useNavigate for redirection

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, username, password }),  // Sending username
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Sign-up successful:', data);
        alert('Sign-up successful! Please log in.');
        // Redirect to the login page after successful sign-up
        navigate('/login');  // This will redirect to the login page
      } else {
        console.error('Sign-up failed:', data.message);
        alert(data.message || 'Sign-up failed');
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      <div style={{ marginTop: '10px' }}>
        <p>Or sign up using:</p>
        <AuthButtons />
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '300px', margin: '50px auto', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' },
  button: { padding: '10px', fontSize: '16px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' },
};

export default SignUp;
