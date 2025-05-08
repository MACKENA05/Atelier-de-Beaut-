import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './ContactForm.css';

const ContactForm = ({ onSubmit }) => {
  const [success, setSuccess] = useState('');
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('Please enter your name'),
    email: Yup.string().email('Invalid email').required('Please enter your email'),
    message: Yup.string().required('Please enter your message'),
  });

  const handleCaptchaChange = (e) => {
    setCaptchaChecked(e.target.checked);
  };

  const handleFormSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSuccess('');
    if (!captchaChecked) {
      setErrors({ captcha: 'Please verify that you are not a robot.' });
      setSubmitting(false);
      return;
    }

    try {
      // Replace URL with your backend endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      setSuccess('Message sent successfully!');
      resetForm();
      setCaptchaChecked(false);
      if (onSubmit) onSubmit();
    } catch (err) {
      setErrors({ submit: 'Failed to send message. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ name: '', email: '', message: '' }}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form className="contact-form" noValidate>
          <label htmlFor="name">Your Name</label>
          <Field id="name" name="name" placeholder="Your Name" disabled={isSubmitting} />
          <ErrorMessage name="name" component="p" className="error" />

          <label htmlFor="email">Your Email</label>
          <Field id="email" name="email" type="email" placeholder="Your Email" disabled={isSubmitting} />
          <ErrorMessage name="email" component="p" className="error" />

          <label htmlFor="message">Your Message</label>
          <Field
            as="textarea"
            id="message"
            name="message"
            placeholder="Your Message"
            disabled={isSubmitting}
          />
          <ErrorMessage name="message" component="p" className="error" />

          <label className="captcha-label">
            <input
              type="checkbox"
              checked={captchaChecked}
              onChange={handleCaptchaChange}
              disabled={isSubmitting}
            />{' '}
            I'm not a robot
          </label>
          {errors.captcha && <p className="error">{errors.captcha}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {errors.submit && <p className="error">{errors.submit}</p>}
          {success && <p className="success">{success}</p>}
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;
