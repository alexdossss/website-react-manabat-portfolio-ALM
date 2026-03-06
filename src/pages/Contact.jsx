import React, { useState } from 'react';
import { useForm } from '@formspree/react';
import '../styles/pages.css';

const Contact = () => {
  const [state, handleSubmit] = useForm("xaqdpell");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(e);
    if (state.succeeded) {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="page contact-page">
      <section className="contact-content">
        {/* Left Side: Header, Description, and Form grouped together */}
        <div className="contact-top-side">
          <div className='header-h1-h2-layered'>
            <h1>GET IN TOUCH</h1>
            <h2>Contact</h2>
          </div>
          
          <p className="contact-description">
            If you’re interested in collaborating or have any questions, feel free to reach out. 
            You can email me directly at the provided address or use the contact form below 
            to send a message. I’ll get back to you as soon as possible and look forward to connecting!
          </p>
        
        </div>
        <div className='form-info'>
            <form className="contact-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this about?" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Your message here..." rows="6" required></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={state.submitting}>
              {state.submitting ? 'Sending...' : 'Send Message'}
            </button>
            
            {state.succeeded && <p className="success-message">Thank you! Your message has been sent successfully.</p>}
          </form>
        {/* Right Side: Contact Info aligned in the same row */}
        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="info-item">
            <h3>Email</h3>
            <p><a href="mailto:amanabat1927@gmail.com">amanabat1927@gmail.com</a></p>
          </div>
          <div className="info-item">
            <h3>Social Media</h3>
            <div className="social-links-contact">
              <a href="https://facebook.com/..." target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://linkedin.com/..." target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/..." target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;