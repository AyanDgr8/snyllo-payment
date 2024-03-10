// src/components/routes/LandingPage/BodyPartForm/BodyPartForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BodyPartForm.css'; 

const availableBodyParts = {
  men: {
    trial: ['chin', 'upperlip', 'underarms'],
    permanent: ['full', 'face', 'legs', 'arms', 'chest', 'back'],
  },
  women: {
    trial: ['chin', 'upperlip', 'underarms'],
    permanent: ['full', 'face', 'legs', 'arms', 'chest', 'back'],
  },
  others: {
    trial: ['chin', 'upperlip', 'underarms'],
    permanent: ['full', 'face', 'legs', 'arms', 'chest', 'back'],
  },
};

const trialMap = {
  chin: 2000,
  upperlip: 2000,
  underarms: 2000,
};

const permanentMap = {
  full: 11000,
  face: 3000,
  legs: 5000,
  arms: 6000,
  chest: 4000,
  back: 3500,
};

const BodyPartForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    gender: 'women',
    purchaseType: 'trial',
    selectedBodyParts: [],
    selectedDate: '',
    coupon: '',
  });
  
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation checks
    if (!validateForm()) return;
  
    const apiUrl = "https://snyllo-payment.onrender.com/user-details-bookform";
  
    try {
      // Prepare request data
      const requestData = {
        ...formData,
        selectedBodyParts: JSON.stringify(formData.selectedBodyParts),
        totalPrice: calculateTotalPrice()
      };
  
      // Submit the form data
      await axios.post(apiUrl, requestData);
      console.log('Submission successful');
      setSubmitStatus('success');
      handleSubmissionSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      handleSubmissionError(error);
    }
  };
  
  // Function to validate form inputs
  const validateForm = () => {
    const { name, phoneNumber, email, selectedDate, selectedBodyParts } = formData;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!name || !phoneNumber || !email || !selectedDate || selectedBodyParts.length === 0) {
      alert('Please fill in all the required fields');
      return false;
    }
  
    if (!phoneRegex.test(phoneNumber)) {
      alert('Please enter a valid phone number');
      return false;
    }
  
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }
  
    return true;
  };
  
  // Function to handle successful form submission
  const handleSubmissionSuccess = () => {
    setSubmitStatus('success');
    resetForm();
  };
  
  // Function to handle form submission error
  const handleSubmissionError = (error) => {
    if (error.response && error.response.data && error.response.data.error &&
      (error.response.data.error.includes('duplicate key error') ||
        error.response.data.error.includes('duplicate key email'))) {
      window.alert('The phone number or email you entered is already in use. Please enter different information.');
    } else {
      window.alert('An error occurred. Please try again later.');
    }
    setSubmitStatus('error');    
  };
  
  
  const resetForm = () => {
    setFormData({
      name:'',
      phoneNumber:'',
      email:'',
      gender:'',
      purchaseType:'',
      selectedBodyParts:[],
      selectedDate:'',
      coupon:'',
    });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
  
    if (type === 'checkbox' && name === 'selectedBodyParts') {
      if (checked) {
        setFormData((prevData) => ({
          ...prevData,
          selectedBodyParts: [...prevData.selectedBodyParts, value],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          selectedBodyParts: prevData.selectedBodyParts.filter(part => part !== value),
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  
  const calculateTotalPrice = () => {
    const selectedPriceMap = formData.purchaseType === 'trial' ? trialMap : permanentMap;
    let totalPrice = formData.selectedBodyParts.reduce((total, part) => total + selectedPriceMap[part], 0);
  
    if (formData.coupon === 'SNYLLO25') {
      totalPrice *= 0.75; 
    } else if (formData.coupon === 'SNYLLO40'){
      totalPrice *= 0.6;
    }

    return totalPrice;

  };

  const checkoutHandler = async () => {
    // Calculate the total price
    const amount = calculateTotalPrice();
  
    // Combine purchaseType and selectedBodyParts into the order object
    const order = {
      purchaseType: formData.purchaseType,
      selectedBodyParts: formData.selectedBodyParts
    };

    try {
        // const { data: { key } } = await axios.get("http://localhost:10000/api/getkey");
        // const { data: { order: razorpayOrder } } = await axios.post("http://localhost:10000/api/checkout", { amount });
        const { data: { key } } = await axios.get("https://snyllo-payment.onrender.com/api/getkey");
        const { data: { order: razorpayOrder } } = await axios.post("https://snyllo-payment.onrender.com/api/checkout", { amount });

        const options = {
            key,
            amount: razorpayOrder.amount,
            currency: "INR",
            name: "Snyllo Éstetica Appointment",
            description: "Tutorial of RazorPay",
            image: "https://avatars.githubusercontent.com/u/25058652?v=4",
            order_id: razorpayOrder.id,
            // callback_url: "http://localhost:10000/api/paymentverification",
            callback_url: "https://snyllo-payment.onrender.com/api/paymentverification",
            prefill: {
                name: "Ayan Khan",
                email: "ayan.khan@example.com",
                contact: "9999999999"
            },
            notes: {
                "address": "Snyllo Corporate Office",
                "order": JSON.stringify(order) // Include the order details as notes
            },
            theme: {
                "color": "#121212"
            }
        };

        const razor = new window.Razorpay(options);
        razor.open();
    } catch (error) {
        console.error('Error processing payment:', error);
    }
};

  useEffect(() => {
    if (submitStatus === 'success') {
      const resetFormTimeout = setTimeout(() => {
        setSubmitStatus(null);
        resetForm();
      }, 4000);
      return () => clearTimeout(resetFormTimeout);
    }
  }, [submitStatus]);
  return (
    <div>
      <section className='above-form'>
        <img 
          src="/upload/yoyo.jpg"
          className='yoyo'
          alt="yoyo"
        />
        <div className='form-header'>
          <img 
          src="/upload/logo.png"
          className='logo'
          alt="logo"
          />
        </div>
      </section>
      
      <section className='form-area'>
        <section className='main-form'>
          <div className='container-payment'>
            <form onSubmit={handleSubmit} className='form-payment'>
              <div className='form-heading'>
                <div className='form-line1'>Book Your Appointment</div>
              </div>
                <label className='question-field'>
                  Name
                  <input 
                  type="text" 
                  placeholder="Your Name*"
                  name="name"
                  className="name"
                  value={formData.name} 
                  onChange={handleChange} 
                  required  
                  />
                </label>
                <label className='question-field'>
                  Contact
                  <input 
                  type="text" 
                  placeholder="Phone Number*"
                  name="phoneNumber"
                  className="phoneNumber"
                  value={formData.phoneNumber} 
                  onChange={handleChange} 
                  pattern="[0-9]{10}"
                  required
                  />
                </label>
                <label className='question-field'>
                  Email
                  <input 
                  type="email" 
                  placeholder="Email Address*"
                  name="email"
                  className="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  />
                </label>

                <label className='question-field'>
                  Gender
                  <select
                      type="text"
                      placeholder="Gender"
                      name="gender"
                      className="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="others">Others</option>
                  </select>
                </label>
                <label className='question-field'>
                  Choose One
                <select
                    type="text"
                    placeholder="Trial"
                    name="purchaseType"
                    className="purchase"
                    value={formData.purchaseType}
                    onChange={handleChange}
                    required 
                >
                  <option value="trial">Trial</option>
                  <option value="permanent">Package</option>
                </select>
                </label>
                <label className='datee question-field'>
                  Date
                <input 
                  type="date" 
                  value={formData.selectedDate} 
                  onChange={handleChange} 
                  name="selectedDate"
                  className='tags'
                  required
                />
                </label>

              <h2 className='mid-heading'>Our Services</h2>

              {availableBodyParts?.[formData.gender]?.[formData.purchaseType]?.map(part => (
                <label key={part} className='input-field'>
                  <input 
                    type="checkbox" 
                    className='types'
                    value={part} 
                    checked={formData.selectedBodyParts.includes(part)} 
                    onChange={handleChange} 
                    name="selectedBodyParts" 
                  /> {part.charAt(0).toUpperCase() + part.slice(1)} - ₹{formData.purchaseType === 'trial' ? trialMap[part] : permanentMap[part]}
                </label>
              ))}
              <br /><br />
              <label className='couponn question-field'>
                Coupon
                  <input 
                  type="text" 
                  placeholder="Enter Your Coupon"
                  name="coupon"
                  className="coupon"
                  value={formData.coupon} 
                  onChange={handleChange} 
                  />
              </label>
              <label className='total'>
                Total Amount: ₹{calculateTotalPrice()}
              </label><br /><br />
              <button className='submit-button' type="submit" onClick={() => checkoutHandler()} >Proceed to Payment</button>
            </form>
            {submitStatus && (
              <p className={submitStatus === 'success' ? 'success-message' : 'error-message'}>
                {submitStatus && (
                  (() => {
                    if (submitStatus === 'success') {
                      window.alert('Thank you for contacting us, we will be in touch shortly!');
                    } else {
                      window.alert('Please try again!');
                    }
                  })()
                )}

              </p>
            )}
          </div>
          <button className='website'>
                <a 
                href="https://snylloestetica.com/"
                className='linkis'
                >SnylloÉstetica.com
                </a>
          </button>
        </section>
      </section>
    </div>
  );
};

export default BodyPartForm;
