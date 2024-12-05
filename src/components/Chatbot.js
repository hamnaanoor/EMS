import React, { useState } from "react";

const Chatbot = () => {
    const [city, setCity] = useState(""); // Tracks the selected city
    const [faqData, setFaqData] = useState([]); // Stores FAQs for the selected city
    const [message, setMessage] = useState(""); // Stores user input for ChatGPT
    const [chatResponse, setChatResponse] = useState(""); // Stores ChatGPT's response
    const [loading, setLoading] = useState(false); // Loading state for ChatGPT interaction

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

    // Interact with ChatGPT
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!message) return alert("Please enter a message!");

        setLoading(true);
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: message }],
                    max_tokens: 100,
                }),
            });

            const data = await response.json();
            setChatResponse(data.choices[0]?.message?.content || "No response from ChatGPT");
        } catch (error) {
            console.error("Error interacting with ChatGPT:", error);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h1>Chatbot</h1>

            {/* FAQ Section */}
            <div>
                <h2>Select Your City</h2>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">-- Select a City --</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Peshawar">Peshawar</option>
                </select>
                <button onClick={fetchFAQs} style={{ marginLeft: "10px" }}>
                    Get FAQs
                </button>

                {/* Render FAQs */}
                <ul>
                    {faqData.map((faq, index) => (
                        <li key={index}>
                            <strong>{faq.question}</strong>
                            <p>{faq.answer}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ChatGPT Section */}
            <div style={{ marginTop: "30px" }}>
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
                {chatResponse && <p style={{ marginTop: "20px" }}>Chatbot: {chatResponse}</p>}
            </div>
        </div>
    );
};

export default Chatbot;
