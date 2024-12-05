import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const navigate = useNavigate(); // For navigation to the payment page

  // Mock API call to fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/events"); // Replace with your actual backend URL
        const data = await response.json();
        console.log("API Response:", data);
        setEvents(data); // Directly set the events array from MongoDB
        console.log("Events State:", data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);
  
  

  const handleBookEvent = (event) => {
    setSelectedEvent(event);
    setQrCode(event.id); // Generate a QR code based on the event ID
  };

  const handleStripePayment = () => {
    navigate("/payment"); // Navigate to the payment page
  };

  return (
    <div className="dashboard-container">
      <h1>Event Dashboard</h1>
      <div className="sections">
        <div className="section">
          <h2>In Your Area</h2>
          {Array.isArray(events) &&
            events
              .filter((event) => event.category === "local")
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onBook={handleBookEvent}
                />
              ))}
        </div>
        <div className="section">
          <h2>For You</h2>
          {Array.isArray(events) &&
            events
              .filter((event) => event.category === "recommended")
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onBook={handleBookEvent}
                />
              ))}
        </div>
        <div className="section">
          <h2>Recent</h2>
          {Array.isArray(events) &&
            events
              .filter((event) => event.category === "recent")
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onBook={handleBookEvent}
                />
              ))}
        </div>
      </div>

      {selectedEvent && (
        <div className="modal">
          <h3>{selectedEvent.name}</h3>
          {selectedEvent.isSoldOut ? (
            <p>This event is sold out!</p>
          ) : (
            <>
              <QRCodeSVG value={qrCode} size={200} />
              <button onClick={handleStripePayment}>Book & Pay</button>
              <button onClick={() => setSelectedEvent(null)}>Close</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const EventCard = ({ event, onBook }) => {
  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>{event.description}</p>
      <p>Status: {event.isSoldOut ? "Sold Out" : "Available"}</p>
      {!event.isSoldOut && <button onClick={() => onBook(event)}>Book</button>}
    </div>
  );
};

export default Dashboard;
