import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from '@formspree/react';
import '../styles/pages.css';

const emptyFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const Contact = () => {
  const [state, handleSubmit] = useForm("xaqdpell");
  const [formData, setFormData] = useState(emptyFormData);

  const formRef = useRef(null);
  const emailCardRef = useRef(null);
  const socialCardRef = useRef(null);
  const statusCardRef = useRef(null);

  const socialLinks = useMemo(() => [
    {
      href: 'https://www.facebook.com/alexander.manabat.3726/',
      img: '/images/contactlogos/facebook_logo.png',
      label: 'Facebook',
    },
    {
      href: 'https://www.linkedin.com/in/alexander-manabat-8206002a7/',
      img: '/images/contactlogos/link_logo.png',
      label: 'LinkedIn',
    },
    {
      href: 'https://github.com/alexdossss',
      img: '/images/contactlogos/github_logo.png',
      label: 'GitHub',
    },
  ], []);

  const handleMouseMove = useCallback((event, ref) => {
    const item = ref.current;
    if (!item) return;

    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    item.style.setProperty('--mouse-x', `${x}px`);
    item.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tX = ((x - centerX) / centerX) * 8;
    const tY = ((y - centerY) / centerY) * 8;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((centerX - x) / centerX) * 10;

    item.style.setProperty('--rotate-x', `${rotateX}deg`);
    item.style.setProperty('--rotate-y', `${rotateY}deg`);
    item.style.setProperty('--t-x', `${tX}px`);
    item.style.setProperty('--t-y', `${tY}px`);
  }, []);

  const handleMouseLeave = useCallback((ref) => {
    const item = ref.current;
    if (!item) return;
    item.style.setProperty('--rotate-x', '0deg');
    item.style.setProperty('--rotate-y', '0deg');
    item.style.setProperty('--t-x', '0px');
    item.style.setProperty('--t-y', '0px');
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    await handleSubmit(event);
  }, [handleSubmit]);

  useEffect(() => {
    if (!state.succeeded) return;

    const timerId = window.setTimeout(() => {
      setFormData(emptyFormData);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [state.succeeded]);

  return (
    <div className="page contact-page">
      <section className="contact-content">
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
          <div className="form-info">
            <div 
              ref={formRef}
              className="contact-form-card"
              onMouseMove={(event) => handleMouseMove(event, formRef)}
              onMouseLeave={() => handleMouseLeave(formRef)}
            >
              <div className="bento-spotlight"></div>
              <div className="bento-stars"></div>
              <form 
                className="contact-form" 
                onSubmit={onSubmit}
                style={state.succeeded ? { border: 'none', padding: '0' } : {}}
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
            </div>
          </div>

          <div className="contact-info">
            <div 
              ref={emailCardRef}
              className="contact-info-card email-card"
              onMouseMove={(event) => handleMouseMove(event, emailCardRef)}
              onMouseLeave={() => handleMouseLeave(emailCardRef)}
            >
              <div className="bento-spotlight"></div>
              <div className="bento-stars"></div>
              <div className="contact-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="contact-card-content">
                <h3>Email Me</h3>
                <a href="mailto:amanabat1927@gmail.com" className="contact-card-link">amanabat1927@gmail.com</a>
              </div>
            </div>

            <div 
              ref={socialCardRef}
              className="contact-info-card socials-card"
              onMouseMove={(event) => handleMouseMove(event, socialCardRef)}
              onMouseLeave={() => handleMouseLeave(socialCardRef)}
            >
              <div className="bento-spotlight"></div>
              <div className="bento-stars"></div>
              <div className="contact-card-content">
                <h3>Connect With Me</h3>
                <div className="social-links-contact">
                  {socialLinks.map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                      <img src={link.img} alt={link.label} className="contact-link-icon" loading="lazy" decoding="async" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div 
              ref={statusCardRef}
              className="contact-info-card status-card"
              onMouseMove={(event) => handleMouseMove(event, statusCardRef)}
              onMouseLeave={() => handleMouseLeave(statusCardRef)}
            >
              <div className="bento-spotlight"></div>
              <div className="bento-stars"></div>
              <div className="contact-card-content">
                <div className="status-header">
                  <span className="status-dot"></span>
                  <h3>Availability</h3>
                </div>
                <p>Available for freelance work, internships, and full-time opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(Contact);
