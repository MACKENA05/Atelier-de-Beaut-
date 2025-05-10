import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { clearCart, fetchCart, loadCartFromStorage } from '../slice/cartSlice';
import api from '../services/api';
import { fetchUserOrders } from '../slice/orderSlice';
import './Checkout.css';
import './ErrorMessages.css';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector(state => state.cart.items);
  const cartLoading = useSelector(state => state.cart.loading);
  const cartError = useSelector(state => state.cart.error);
  const user = useSelector(state => state.auth.user);

  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showPinPrompt, setShowPinPrompt] = useState(false);

  useEffect(() => {
    if (!cartLoading) {
      if (cartItems && cartItems.length > 0) {
        setCheckingAuth(false);
      } else if (!user) {
        navigate('/auth', { state: { from: location } });
      } else {
        setCheckingAuth(false);
      }
    }
  }, [user, cartItems, cartLoading, navigate, location]);

  if (checkingAuth || cartLoading) {
    return <div>Loading...</div>;
  }

  if (cartError) {
    return <div className="error">Error loading cart: {cartError}</div>;
  }

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const initialValues = {
    fullName: '',
    phoneNumber: '',
    postalAddress: '',
    city: '',
    country: '',
    shippingMethod: 'standard',
    paymentMethod: 'pay_on_delivery',
    deliveryInstructions: '',
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    phoneNumber: Yup.string()
      .matches(/^2547\d{8}$/, 'Phone number must be 12 digits and start with 2547')
      .required('Phone Number is required'),
    postalAddress: Yup.string().required('Postal Address is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    shippingMethod: Yup.string().required('Shipping Method is required'),
    paymentMethod: Yup.string().required('Payment Method is required'),
  });

  const handleNext = (values) => {
    setOrderData(values);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
    setPaymentMessage(null);
    setShowPinPrompt(false);
  };

  const handlePlaceOrder = async () => {
    setError(null);
    setPaymentMessage(null);
    setPaymentLoading(true);
    setPaymentStatus(null);
    setShowPinPrompt(false);
    try {
      // Construct payload matching backend expectations
      const payload = {
        address: {
          full_name: orderData.fullName,
          phone: orderData.phoneNumber,
          postal_address: orderData.postalAddress,
          city: orderData.city,
          country: orderData.country,
        },
        shipping_method: orderData.shippingMethod,
        payment_method: orderData.paymentMethod,
        description: orderData.deliveryInstructions || '',
      };
  
      if (orderData.paymentMethod === 'pay_on_delivery') {
        payload.cod_phone = orderData.phoneNumber;
      } else if (orderData.paymentMethod === 'mpesa') {
        // Ensure phone number starts with '2547' and is 12 digits
        let phone = orderData.phoneNumber;
        if (!phone.startsWith('2547')) {
          if (phone.startsWith('0')) {
            phone = '2547' + phone.slice(1);
          } else {
            phone = '2547' + phone;
          }
        }
        payload.phone_number = phone;
      }
  
      const orderResponse = await api.post('/orders/checkout', payload);
  
      const orderId = orderResponse.data.id;
  
      if (orderData.paymentMethod === 'mpesa') {
        setShowPinPrompt(true);
        const paymentResponse = await api.post(`/payment/checkout/${orderId}`, {
          phone_number: payload.phone_number,
        });
  
        setPaymentMessage(paymentResponse.data.message);
        setPaymentStatus('initiated');
        // Start polling payment status
        pollPaymentStatus(orderId);
      } else {
        setPaymentMessage('Order placed successfully. Please pay on delivery.');
        setPaymentStatus('completed');
      }
  
      dispatch(clearCart());
      dispatch(fetchUserOrders()); // Fetch updated orders after placing order
      setStep(3);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
      setPaymentStatus('failed');
      setShowPinPrompt(false);
    } finally {
      setPaymentLoading(false);
    }
  };

  const pollPaymentStatus = (orderId) => {
    const interval = setInterval(async () => {
      try {
        const statusResponse = await api.get(`/payment/mpesa/status/${orderId}`);
        const statusData = statusResponse.data;
        if (statusData.status === 'completed') {
          setPaymentMessage('Payment successful! Your order has been placed.');
          setPaymentStatus('completed');
          setShowPinPrompt(false);
          clearInterval(interval);
        } else if (statusData.status === 'failed') {
          setPaymentMessage('Payment failed. Please try again.');
          setPaymentStatus('failed');
          setShowPinPrompt(false);
          clearInterval(interval);
        } else {
          // Still pending, continue polling
          setPaymentMessage('Payment pending. Please complete the payment on your phone.');
          setPaymentStatus('pending');
          setShowPinPrompt(true);
        }
      } catch (error) {
        setPaymentMessage('Error checking payment status.');
        setPaymentStatus('error');
        setShowPinPrompt(false);
        clearInterval(interval);
      }
    }, 15000);


  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="step-indicator">
        <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`} onClick={() => setStep(1)}>
          <div className="step-circle">1</div>
          <div className="step-description">Enter Details</div>
        </div>
        <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`} onClick={() => orderData && setStep(2)}>
          <div className="step-circle">2</div>
          <div className="step-description">Review Order</div>
        </div>
        <div className={`step ${step === 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <div className="step-description">Confirmation</div>
        </div>
      </div>
      {step === 1 && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleNext}
          className="checkout-form"
        >
          <Form className="checkout-form">
            <div>
              <label>Full Name:</label>
              <Field name="fullName" type="text" />
              <ErrorMessage name="fullName" component="div" className="error" />
            </div>
            <div>
              <label>Phone Number:</label>
              <Field name="phoneNumber" type="text" placeholder="254712345678" />
              <ErrorMessage name="phoneNumber" component="div" className="error" />
            </div>
            <div>
              <label>Postal Address:</label>
              <Field name="postalAddress" type="text" />
              <ErrorMessage name="postalAddress" component="div" className="error" />
            </div>
            <div>
              <label>City:</label>
              <Field name="city" type="text" />
              <ErrorMessage name="city" component="div" className="error" />
            </div>
            <div>
              <label>Country:</label>
              <Field name="country" type="text" />
              <ErrorMessage name="country" component="div" className="error" />
            </div>
            <div>
              <label>Shipping Method:</label>
              <Field as="select" name="shippingMethod">
                <option value="express">Express (1-2 days)</option>
                <option value="standard">Standard (3-5 days)</option>
              </Field>
              <ErrorMessage name="shippingMethod" component="div" className="error" />
            </div>
            <div>
              <label>Payment Method:</label>
              <Field as="select" name="paymentMethod">
                <option value="pay_on_delivery">Pay on Delivery</option>
                <option value="mpesa">Mpesa</option>
              </Field>
              <ErrorMessage name="paymentMethod" component="div" className="error" />
            </div>
            <div>
              <label>Delivery Instructions (Optional):</label>
              <Field as="textarea" name="deliveryInstructions" rows="3" cols="40" />
            </div>
            <button type="submit">Next</button>
          </Form>
        </Formik>
      )}
      {step === 2 && orderData && (
        <div className="review-section">
          <h2>Review Your Order</h2>
          <div>
            <h3>Customer Information</h3>
            <p><strong>Full Name:</strong> {orderData.fullName}</p>
            <p><strong>Phone Number:</strong> {orderData.phoneNumber}</p>
            <p><strong>Postal Address:</strong> {orderData.postalAddress}</p>
            <p><strong>City:</strong> {orderData.city}</p>
            <p><strong>Country:</strong> {orderData.country}</p>
          </div>
          <div>
            <h3>Shipping Details</h3>
            <p><strong>Shipping Method:</strong> {orderData.shippingMethod === 'express' ? 'Express (1-2 days)' : 'Standard (3-5 days)'}</p>
          </div>
          <div>
            <h3>Payment Method</h3>
            <p>{orderData.paymentMethod === 'mpesa' ? 'Mpesa' : 'Pay on Delivery'}</p>
          </div>
          <div>
            <h3>Delivery Instructions</h3>
            <p>{orderData.deliveryInstructions || 'None'}</p>
          </div>
          <div>
            <h3>Items in Cart</h3>
            <ul>
              {cartItems.map(item => (
                <li key={item.id}>
                  {item.name} - Quantity: {item.quantity} - Price: KES {item.price}
                </li>
              ))}
            </ul>
            <p><strong>Subtotal:</strong> KES {totalPrice.toFixed(2)}</p>
            <p><strong>Shipping Fee:</strong> KES {orderData.shippingMethod === 'express' ? 15.00 : 5.00}</p>
            <p><strong>Total:</strong> KES {(totalPrice + (orderData.shippingMethod === 'express' ? 15.00 : 5.00)).toFixed(2)}</p>
          </div>
          {error && <div className="error">{error}</div>}
          {paymentMessage && <div className={`payment-message ${paymentStatus}`}>{paymentMessage}</div>}
          {paymentLoading && <div>Processing payment, please wait...</div>}
          {showPinPrompt && (
            <div className="pin-prompt">
              <p>Please check your phone and enter your M-Pesa PIN to complete the payment.</p>
            </div>
          )}
          <button onClick={handleBack}>Back</button>
          <button onClick={handlePlaceOrder} disabled={paymentLoading}>Place Order</button>
        </div>
      )}
   {step === 3 && (
        <div>
          {paymentStatus === 'failed' || paymentStatus === 'error' ? (
            <div>
              <h1>Payment Failed</h1>
              <p>We're sorry, but your payment could not be processed. Please try again or choose a different payment method.</p>
              <button onClick={() => setStep(2)}>Try Again</button>
              <button onClick={() => navigate('/shop')}>Return to Shop</button>
            </div>
          ) : (
            <div>
              <h1>Thank you for your order!</h1>
              <p>Your order has been placed successfully.</p>
              <button onClick={() => navigate('/shop')}>Continue Shopping</button>
              <button onClick={() => navigate('/my-orders')}>View My Orders</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default Checkout;