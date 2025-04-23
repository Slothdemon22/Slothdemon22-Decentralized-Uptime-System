'use client';
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load your Stripe public key
const stripePromise = loadStripe('pk_test_51PrFee05Xih061cSZB11wBkHrgCxoAIbsx1hB40L0hMGd3zAFpcYIAmEi82ATmqIkXCpEOzOp7mrgZLno5Q5tccU00dhIu9Y5p');

const PaymentPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState(null); // Holds the client secret from the backend

  const stripe = useStripe();
  const elements = useElements();

  // Call your backend to create a PaymentIntent
  const handleCreatePaymentIntent = async () => {
    setIsProcessing(true);
    setError(null);

    try {
        const response = await fetch('http://localhost:4242/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: 1000 }), // Amount in cents
        });
    
        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }
    
        const { sessionId } = await response.json(); // Get the session ID from the response
    
        const stripe = await stripePromise;
    
        // Redirect to Stripe Checkout using the session ID
        if(!stripe) {   
            throw new Error('Stripe.js has not loaded yet');
            }
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });
    
        if (error) {
          console.error('Error redirecting to checkout:', error.message);
        }
    
      } catch (error:any) {
        console.error('Error:', error.message);
      }
  };

  // Handle the payment submission
  const handleSubmit = async (event:any) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return; // Stripe.js has not loaded yet
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    // Confirm the payment with the PaymentIntent
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement as any,
      },
    });


    setIsProcessing(false);
  };

  return (
    <div>
      <h2>Payment Page</h2>
      {error && <div className="error">{error}</div>}
      <button onClick={handleCreatePaymentIntent} disabled={isProcessing}>
        {isProcessing ? 'Creating Payment Intent...' : 'Start Payment'}
      </button>

      {clientSecret && (
        <form onSubmit={handleSubmit}>
          <CardElement />
          <button type="submit" disabled={!stripe || isProcessing}>
            Pay Now
          </button>
        </form>
      )}
    </div>
  );
};

// Wrap the PaymentPage in Elements provider
const App = () => (
  <Elements stripe={stripePromise}>
    <PaymentPage />
  </Elements>
);

export default App;
