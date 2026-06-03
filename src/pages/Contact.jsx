import React, { useState, useCallback } from 'react';
import { useForm } from '@formspree/react';
import FloatingBlobBackground from '../components/FloatingBlobBackground';
import GlareHover from '../components/GlareHover';
import '../styles/pages.css';

const Contact = () => {
  const [state, handleSubmit] = useForm("xaqdpell");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    await handleSubmit(e);
    if (state.succeeded) {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  }, [handleSubmit, state.succeeded]);

  return (
    <div className="page contact-page">
      <FloatingBlobBackground />
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
        <div className="contact-form-and-info">
          <div className='form-info'>
            <GlareHover
              width="100%"
              height="auto"
              background="transparent"
              borderRadius="12px"
              borderColor="rgba(0, 198, 255, 0.3)"
              glareColor="#00C6FF"
              glareOpacity={0.1}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={800}
              playOnce={false}
              magnetism={true}
              magneticStrength={0.05}
              style={{
                minHeight: 'auto',
                padding: '0',
                display: 'block',
              }}
            >
              <form 
                className="contact-form" 
                onSubmit={onSubmit}
                style={state.succeeded ? { border: '2px solid #d4edda', borderRadius: '12px', padding: '20px' } : {}}
              >
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
            </GlareHover>
          </div>
          {/* Right Side: Contact Info aligned in the same row */}
          <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="info-item">
            <h3>Email</h3>
            <div className="contact-link-item">
              <p><a href="mailto:amanabat1927@gmail.com">amanabat1927@gmail.com</a></p>
            </div>
          </div>
          <div className="info-item">
            <h3>Social Media</h3>
            <div className="social-links-contact">
              <div className="social-link-item">
                <a href="https://www.facebook.com/alexander.manabat.3726/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/contactlogos/facebook_logo.png" alt="Facebook" className="contact-link-icon" />
                </a>
              </div>
              <div className="social-link-item">
                <a href="linkedin.com/in/alexander-manabat-8206002a7/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/contactlogos/link_logo.png" alt="LinkedIn" className="contact-link-icon" />
                </a>
              </div>
              <div className="social-link-item">
                <a href="https://github.com/alexdossss" target="_blank" rel="noopener noreferrer">
                  <img src="/images/contactlogos/github_logo.png" alt="GitHub" className="contact-link-icon" />
                </a>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(Contact);