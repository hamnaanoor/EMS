import React from 'react';

const AuthButtons = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/facebook';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button
        onClick={handleGoogleLogin}
        style={{
          backgroundColor: '#4285F4',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          margin: '10px',
          cursor: 'pointer',
        }}
      >
        Login with Google
      </button>

      <button
        onClick={handleFacebookLogin}
        style={{
          backgroundColor: '#3b5998',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          margin: '10px',
          cursor: 'pointer',
        }}
      >
        Login with Facebook
      </button>
    </div>
  );
};

export default AuthButtons;
