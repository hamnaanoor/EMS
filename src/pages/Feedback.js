import React, { useState } from "react";
import axios from "axios";
import "./Feedback.css"; // Optional: Style the form

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // Send feedback data to the backend
      const response = await axios.post("http://localhost:5001/api/feedback", formData);
      setMessage(response.data.message || "Feedback submitted successfully!");
      setFormData({ name: "", email: "", feedback: "" }); // Clear form
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage(
        error.response?.data?.message || "Error submitting feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-container">
      <h1>Submit Feedback</h1>
      <form onSubmit={handleSubmit} aria-label="Feedback Form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="feedback">Feedback:</label>
          <textarea
            id="feedback"
            name="feedback"
            placeholder="Your feedback here"
            value={formData.feedback}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
      {message && <p role="alert">{message}</p>}
    </div>
  );
};

export default Feedback;
