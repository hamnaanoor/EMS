import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">Event App</div>

      {/* Links */}
      <div className="navbar-links">
        <Link to="/login" className="navbar-link">Login</Link>
        <Link to="/signup" className="navbar-link">SignUp</Link>
        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
        <Link to="/about" className="navbar-link">About</Link>
        <Link to="/feedback" className="navbar-link">Feedback</Link> {/* Add Feedback Link */}
        <Link to="/donate" className="navbar-link">Donate</Link> {/* Add Donate Link */}
        <Link to="/chatbot" className="navbar-link">Chatbot</Link>
        <Link to="/calendar" className="navbar-link">Calendar</Link> {/* Add Calendar Link */}
        <Link to="/map" className="navbar-link">Event Map</Link>
      </div>
    </nav>
  );
};

export default Navbar;
