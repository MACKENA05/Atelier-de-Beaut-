useEffect(() => {
    if (paymentStatus === 'completed') {
      setStep(3);
      dispatch(clearCart());
      dispatch(fetchUserOrders());
    } else if (paymentStatus === 'failed') {
      setError(paymentError || 'Payment failed. Please try again.');
    } else if (orderCreationError) {
      setError(orderCreationError);
    }
  }, [paymentStatus, paymentError, orderCreationError, dispatch]);

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
          {paymentError && <div className="error">{paymentError}</div>}
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
          <h1>Thank you for your order!</h1>
          <p>Your order has been placed successfully.</p>
          <button onClick={() => navigate('/shop')}>Continue Shopping</button>
          <button onClick={() => navigate('/my-orders')}>View My Orders</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
