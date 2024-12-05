import React, { useState } from "react";
import "./FAQPopup.css";

const FAQPopup = ({ city, faqs, onClose }) => {
    return (
        <div className="faq-popup">
            <div className="faq-content">
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>
                <h2>FAQs for {city}</h2>
                <ul className="faq-list">
                    {faqs.length > 0 ? (
                        faqs.map((faq, index) => (
                            <li key={index}>
                                <strong>{faq.question}</strong>
                                <p>{faq.answer}</p>
                            </li>
                        ))
                    ) : (
                        <p>No FAQs available for this city.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default FAQPopup;
