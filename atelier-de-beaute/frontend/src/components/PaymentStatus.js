import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { retryPayment, checkPaymentStatus } from '../slice/paymentSlice';

function PaymentStatus({ orderId }) {
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Checking payment status...');
  const intervalIdRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Function to fetch payment status
    const fetchStatus = async () => {
      try {
        const response = await dispatch(checkPaymentStatus(orderId)).unwrap();
        setStatus(response.status);
        setMessage(response.message);

        // Stop polling if payment is completed or failed
        if (response.status === 'completed' || response.status === 'failed') {
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
        }
      } catch (error) {
        setMessage('Error checking payment status. Please try again later.');
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every 5 seconds
    intervalIdRef.current = setInterval(fetchStatus, 5000);

    // Cleanup on unmount
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [orderId, dispatch]);

  const handleRetry = () => {
    dispatch(retryPayment({ orderId, phoneNumber: '' })) // phoneNumber can be handled as needed
      .unwrap()
      .then(() => {
        setMessage('Retry payment initiated. Please check your phone.');
        setStatus('retry_initiated');
        // Restart polling
        if (!intervalIdRef.current) {
          intervalIdRef.current = setInterval(() => {
            dispatch(checkPaymentStatus(orderId)).unwrap().then((response) => {
              setStatus(response.status);
              setMessage(response.message);
              if (response.status === 'completed' || response.status === 'failed') {
                if (intervalIdRef.current) {
                  clearInterval(intervalIdRef.current);
                  intervalIdRef.current = null;
                }
              }
            });
          }, 5000);
        }
      })
      .catch(() => {
        setMessage('Failed to retry payment. Please try again later.');
      });
  };

  return (
    <div>
      <h3>Payment Status</h3>
      <p>{message}</p>
      {(status === 'failed' || status === 'retry_initiated') && (
        <button onClick={handleRetry}>
          Retry Payment
        </button>
      )}
    </div>
  );
}

export default PaymentStatus;
