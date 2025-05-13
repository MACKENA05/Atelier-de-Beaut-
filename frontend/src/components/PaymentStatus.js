import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PaymentStatus({ orderId }) {
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Checking payment status...');
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Function to fetch payment status
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`/api/payment/mpesa/status/${orderId}`);
        const data = response.data;
        setStatus(data.status);
        setMessage(data.message);

        // Stop polling if payment is completed or failed
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(intervalId);
        }
      } catch (error) {
        setMessage('Error checking payment status. Please try again later.');
        clearInterval(intervalId);
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every 5 seconds
    const id = setInterval(fetchStatus, 5000);
    setIntervalId(id);

    // Cleanup on unmount
    return () => clearInterval(id);
  }, [orderId]);

  return (
    <div>
      <h3>Payment Status</h3>
      <p>{message}</p>
      {status === 'failed' && (
        <button onClick={() => window.location.reload()}>
          Retry Payment
        </button>
      )}
    </div>
  );
}

export default PaymentStatus;