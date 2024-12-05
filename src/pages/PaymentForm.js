import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./Payment.css";

const PaymentForm = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "https://run.mocky.io/v3/488a4436-af76-4585-a19a-b568796d805b" // Replace with your Mocky endpoint
        );
        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("Failed to fetch transaction history:", error);
      }
    };
    fetchTransactions();
  }, []);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      alert("Stripe has not loaded yet. Please try again later.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000 }), // Amount in cents
      });
      const { clientSecret } = await response.json();

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        alert(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefund = (transaction) => {
    navigate("/refund", { state: transaction });
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    alert("Transaction deleted!");
  };

  return (
    <div className="payment-container">
      <h1>Complete Your Payment</h1>
      <div className="payment-details">
        <p>Event: Music Festival</p>
        <p>Price: $50</p>
      </div>
      <div className="card-input">
        <CardElement />
      </div>
      <button className="pay-button" onClick={handlePayment} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Pay with Stripe"}
      </button>

      <button className="history-button" onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? "Hide" : "View"} Transaction History
      </button>

      {showHistory && (
        <div className="transaction-history">
          <h2>Transaction History</h2>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-card">
                <p>
                  <strong>Event:</strong> {transaction.event}
                </p>
                <p>
                  <strong>Amount:</strong> ${transaction.amount}
                </p>
                <p>
                  <strong>Status:</strong> {transaction.status}
                </p>
                <button className="refund-button" onClick={() => handleRefund(transaction)}>
                  Request Refund
                </button>
                <button className="delete-button" onClick={() => handleDeleteTransaction(transaction.id)}>
                  Delete Transaction
                </button>
              </div>
            ))
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
