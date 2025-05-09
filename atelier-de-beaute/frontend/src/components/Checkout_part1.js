import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { clearCart, fetchCart, loadCartFromStorage } from '../slice/cartSlice';
import api from '../services/api';
import { fetchUserOrders } from '../slice/orderSlice';
import { initiatePayment, resetPayment, checkPaymentStatus } from '../slice/paymentSlice';
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

  const paymentState = useSelector(state => state.payment);
  const { loading: paymentLoading, error: paymentError, status: paymentStatus, orderCreationError, message: paymentMessage } = paymentState;

  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    if (paymentStatus === 'initiated' || paymentStatus === 'pending' || paymentStatus === 'retry_initiated') {
      setShowPinPrompt(true);
    } else {
      setShowPinPrompt(false);
    }
  }, [paymentStatus]);

  useEffect(() => {
    let interval;
    if (paymentStatus === 'initiated' || paymentStatus === 'pending' || paymentStatus === 'retry_initiated') {
      interval = setInterval(() => {
        if (orderData && orderData.orderId) {
          dispatch(checkPaymentStatus(orderData.orderId));
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [paymentStatus, dispatch, orderData]);

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
      .matches(/^2547\\d{8}$/, 'Phone number must be 12 digits and start with 2547')
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
    setShowPinPrompt(false);
    dispatch(resetPayment());
  };

  const handlePlaceOrder = async () => {
    setError(null);
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
      setOrderData(prev => ({ ...prev, orderId }));

      if (orderData.paymentMethod === 'mpesa') {
        dispatch(initiatePayment({ orderId, phoneNumber: payload.phone_number }));
      } else {
        setStep(3);
        dispatch(clearCart());
        dispatch(fetchUserOrders());
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
      dispatch(resetPayment());
    }
  };
