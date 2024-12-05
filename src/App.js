import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Refund from "./pages/Refund";
import Payment from "./pages/Payment";
import Feedback from "./pages/Feedback";
import DonationPage from "./pages/DonationPage";
import ChatbotPage from "./pages/ChatbotPage";
import CalendarPage from "./pages/CalendarPage"; // Import the CalendarPage component
import MapsPage from "./pages/MapsPage";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
// Load Stripe public key from environment variables
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};
const App = () => {
  return (
    <Router>
      <Navbar />
      <Elements stripe={stripePromise}>
        <Routes>
          {/* Route definitions */}
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/map" element={<MapsPage />} />
        </Routes>
      </Elements>
    </Router>
  );
};

export default App;
