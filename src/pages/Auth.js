import React, { useState } from "react";
import "./Auth.css"; // CSS file for styling

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);

  const toggleMode = () => setIsSignup((prev) => !prev);

  const handleGoogleSignIn = () => {
    window.location.href = "https://accounts.google.com/signin";
  };

  const handleFacebookSignIn = () => {
    window.location.href = "https://www.facebook.com/login/";
  };

  return (
    <div className="auth-container">
      <h1>{isSignup ? "Sign Up" : "Log In"}</h1>
      <form className="auth-form">
        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            className="auth-input"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
        />
        <button type="submit" className="auth-button">
          {isSignup ? "Create Account" : "Log In"}
        </button>
      </form>
      <div className="social-buttons">
        <button
          className="social-button google"
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </button>
        <button
          className="social-button facebook"
          onClick={handleFacebookSignIn}
        >
          Continue with Facebook
        </button>
      </div>
      <p>
        {isSignup
          ? "Already have an account?"
          : "Don't have an account?"}{" "}
        <span
          className="toggle-mode"
          onClick={toggleMode}
        >
          {isSignup ? "Log In" : "Sign Up"}
        </span>
      </p>
    </div>
  );
};

export default Auth;
