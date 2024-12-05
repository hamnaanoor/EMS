import React, { useState, useEffect } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
//import { loadStripe } from "@stripe/stripe-js";
import "./DonationPage.css";

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

if (!process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
  console.error('REACT_APP_STRIPE_PUBLIC_KEY is undefined. Check your .env file.');
}




//const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const DonationPage = () => {
  const [ngos, setNgos] = useState([]); // Initialized as an empty array
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [donationAmount, setDonationAmount] = useState(100); // Default to 100 cents (min $1)
  const [clientSecret, setClientSecret] = useState("");
  const [showStripePopup, setShowStripePopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    // Fetch NGOs from Mocky
    fetch("https://run.mocky.io/v3/1010b0df-8d5c-445e-b5d1-16c2081ba4ad")
      .then((res) => res.json())
      .then((data) => {
        console.log("NGO Data:", data); // Debug log to check structure
        if (data.ngos) {
          setNgos(data.ngos); // If `ngos` key exists, use it
        } else if (Array.isArray(data)) {
          setNgos(data); // If the response itself is an array
        } else {
          console.error("Unexpected data structure:", data);
          alert("Unable to load NGO data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching NGO data:", error.message);
        alert("Error loading NGO data.");
      });
  }, []);
  
  const handleDonation = async () => {
    if (donationAmount < 1) {
      alert("Minimum donation amount is $1.");
      return;
    }
  
    try {
        const response = await fetch('http://localhost:5001/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: donationAmount }),
          });
          
      const data = await response.json();
      if (response.ok) {
        setClientSecret(data.clientSecret);
      } else {
        console.error("Error response:", data.error);
        alert("Error creating payment intent. Please try again.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Network error. Please try again later.");
    }
  };
  
  const handleDonateClick = async () => {
    if (!selectedNgo) {
      alert("Please select an NGO to donate.");
      return;
    }

    if (donationAmount < 100) {
      alert("Minimum donation amount is 100 cents ($1).");
      return;
    }

    // Create payment intent
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: donationAmount }),
      });

      const data = await response.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowStripePopup(true); // Show the Stripe payment popup
      } else {
        throw new Error("Failed to create payment intent");
      }
    } catch (error) {
      console.error("Error creating payment intent:", error.message);
      alert("Error creating payment intent. Please try again.");
    }
  };

  const handlePaymentSuccess = (status) => {
    setPaymentStatus(status);
    setShowStripePopup(false); // Close the Stripe popup
  };

  return (
    <div className="donation-page">
      <h2>Donate to an NGO</h2>
      <div className="ngos-list">
        {ngos && ngos.length > 0 ? (
          ngos.map((ngo) => (
            <div
              key={ngo.id}
              className={`ngo-item ${selectedNgo === ngo ? "selected" : ""}`}
              onClick={() => setSelectedNgo(ngo)}
            >
              <h3>{ngo.name}</h3>
              <p>{ngo.description}</p>
            </div>
          ))
        ) : (
          <p>Loading NGOs...</p>
        )}
      </div>

      <div className="donation-form">
        <h3>Donation Amount</h3>
        <input
          type="number"
          placeholder="Enter amount in cents (min 100)"
          value={donationAmount}
          onChange={(e) => setDonationAmount(Number(e.target.value))}
        />
        <button onClick={handleDonateClick}>Donate</button>
      </div>

      {showStripePopup && clientSecret && (
        <Elements stripe={stripePromise}>
          <StripePopup
            clientSecret={clientSecret}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      )}

      {paymentStatus && (
        <div className="payment-status">
          <p>Payment Status: {paymentStatus}</p>
        </div>
      )}
    </div>
  );
};

const StripePopup = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Test User",
        },
      },
    });

    if (error) {
      console.error("Payment Error:", error.message);
      alert("Payment failed. Please try again.");
    } else if (paymentIntent) {
      console.log("Payment Successful:", paymentIntent);
      onPaymentSuccess("Success");
    }
  };

  return (
    <div className="stripe-popup">
      <form onSubmit={handleSubmit}>
        <h3>Enter Payment Details</h3>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default DonationPage;
