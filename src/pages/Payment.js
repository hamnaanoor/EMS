import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";

// Stripe public key (Replace with your actual key)
const stripePromise = loadStripe("pk_test_51QP7iqF3QVpgEpJeCVAv2ZB1rD6gdik7VY5zkiXjJyLz4FZEy5OF9rVFwiqsXncHIkPuKhP1rJu0ATVSyFTOyyfQ00giBisFnX");

const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;
