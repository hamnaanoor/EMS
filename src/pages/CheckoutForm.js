import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!stripe || !elements) {
        return; // Stripe.js hasn't loaded yet
      }
  
      setProcessing(true);
      const cardElement = elements.getElement(CardElement);
  
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
  
      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }
  
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });
  
      if (confirmError) {
        setError(confirmError.message);
      } else if (paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
      }
  
      setProcessing(false);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <h3>Enter Card Details</h3>
        <CardElement />
        {error && <div>{error}</div>}
        <button type="submit" disabled={processing || !stripe}>
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    );
  };
  
  
export default CheckoutForm;
