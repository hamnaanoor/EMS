import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure you have this imported
import "./Refund.css";

const Refund = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState(""); 
  const [document, setDocument] = useState(null); 

  const [showModal, setShowModal] = useState(false); // State to handle modal visibility

  const transaction = location.state || {};

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation check
    if (!name || !email || !phone || !reason || !additionalInfo) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Display success toast notification
    toast.success("Refund request sent to Super Admin");

    // Delay the modal appearance and navigation
    setTimeout(() => {
      setShowModal(true); // Show the modal after form submission
    }, 1000); // Delay modal by 1 second to allow toast to show
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleReturnToDashboard = () => {
    navigate("/dashboard"); // Navigate to the dashboard after clicking the button in the modal
  };

  return (
    <div className="refund-container">
      <h1>Refund Request</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            placeholder="Your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Event:</label>
          <p>{transaction.event || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <p>${transaction.amount || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Reason for Refund:</label>
          <textarea
            placeholder="Please provide a reason for your refund request"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="additionalInfo">Additional Information:</label>
          <textarea
            id="additionalInfo"
            placeholder="Any extra details to support your refund request"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="document">Upload Supporting Document (optional):</label>
          <input
            type="file"
            id="document"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
          />
        </div>
        <button type="submit">Submit Request</button>
      </form>

      {/* Modal - Success Message */}
      {showModal && (
        <div className="refund-success-modal">
          <div className="refund-modal-content">
            <h2>Refund Request Sent</h2>
            <p>Your refund request has been successfully sent to the Super Admin.</p>
            <button onClick={handleReturnToDashboard}>Return to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Refund;
