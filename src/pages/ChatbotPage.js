import React, { useState } from "react";
import './ChatbotPage.css'; // Ensure the path is correct

const Chatbot = () => {
    const [city, setCity] = useState(""); // Tracks the selected city
    const [faqData, setFaqData] = useState([]); // Stores FAQs for the selected city
    const [message, setMessage] = useState(""); // Stores user input for Gemini API
    const [chatResponse, setChatResponse] = useState(""); // Stores Gemini API's response
    const [loading, setLoading] = useState(false); // Loading state for interaction

    // Mocky URLs for city-specific FAQs
    const faqUrls = {
        Lahore: "https://run.mocky.io/v3/eb814f22-fa13-4e10-834a-91741fd1e0df",
        Karachi: "https://run.mocky.io/v3/2a164ae1-f445-41ed-af6b-ec7cb2c14bc4",
        Islamabad: "https://run.mocky.io/v3/6140e4fd-e3ff-4fda-83b0-10626580507b",
        Peshawar: "https://run.mocky.io/v3/792abffd-b9a3-4914-8990-e005971b41a0",
    };

    // Fetch FAQs based on the selected city
    const fetchFAQs = async () => {
        if (!city) return alert("Please select a city first!");

        try {
            const response = await fetch(faqUrls[city]);
            const data = await response.json();
            setFaqData(data);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    };

    // Interact with Gemini API
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!message) return alert("Please enter a message!");
    
        setLoading(true);
    
        try {
            const response = await fetch("http://localhost:5001/chat/ask-gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
    
            const data = await response.json();
            setChatResponse(data.response || "No response from Gemini");
        } catch (error) {
            console.error("Error interacting with Gemini API:", error);
        }
    
        setLoading(false);
    };
    

    return (
        <div className="chatbot-container">
            <h1>Chatbot</h1>

            {/* FAQ Section */}
            <div className="faq-section">
                <h2>Select Your City</h2>
                <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="city-dropdown"
                >
                    <option value="">-- Select a City --</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Peshawar">Peshawar</option>
                </select>
                <button onClick={fetchFAQs} className="faq-button">
                    Get FAQs
                </button>

                {/* Render FAQs */}
                <ul className="faq-list">
                    {faqData.map((faq, index) => (
                        <li key={index}>
                            <strong>{faq.question}</strong>
                            <p>{faq.answer}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Gemini Chat Section */}
            <div className="chat-section">
                <h2>Chat with Us</h2>
                <form onSubmit={handleChatSubmit}>
                    <input
                        type="text"
                        placeholder="Ask something..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ width: "calc(100% - 90px)", padding: "10px" }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "10px",
                            background: loading ? "#ccc" : "#007BFF",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        {loading ? "Loading..." : "Send"}
                    </button>
                </form>

                {chatResponse && <p className="chat-response">Chatbot: {chatResponse}</p>}
            </div>
        </div>
    );
};

export default Chatbot;
