import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import heroImage from './assets/mri-hero.png';
import iconImageProcessing from './assets/icon-image-processing.png';
import iconMRI from './assets/icon-mri.png';
import { MdEmail } from 'react-icons/md';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const texts = [
    "Unlock The Power Of Untrained Model In Medical Imaging",
    "Unlock The Power Of Untrained Model In Image Processing"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === texts.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-container landing-bg">
      {/* Logo Bar */}
      <div className="landing-logo-bar">
        <div className="landing-logo" onClick={() => navigate('/')}>
          PixelPerfect
        </div>
      </div>

      {/* Hero Section */}
      <section className="LANDINGhero">
        <div className="LANDINGhero-content">
          <div className="LANDINGtext-side">
            <div className="text-animation-container">
              {texts.map((text, index) => (
                <h1 
                  key={index}
                  className={`animated-text ${
                    index === activeIndex ? 'active' 
                    : index === (activeIndex + 1) % texts.length ? 'next' 
                    : 'inactive'
                  }`}
                >
                  {text}
                </h1>
              ))}
            </div>
            <p>
              Explore our advanced models for image enhancement and MRI Acceleration.
            </p>
            <div className="hero-buttons">
              <button onClick={() => navigate('/image-processing')}>
                Try Image Processing
              </button>
              <button onClick={() => navigate('/mri-acceleration')}>
                Explore MRI
              </button>
            </div>
          </div>
          <div className="image-side">
            <img src={heroImage} alt="MRI scan" />
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="models-section">
        <h2>Our Untrained Models</h2>
        <div className="models-cards">
          <div className="model-card">
            <img src={iconImageProcessing} alt="Image Processing Icon" />
            <h3>Image Processing</h3>
            <p>Denoise, Inpaint and enhance your images for clearer memories.</p>
            <button onClick={() => navigate('/image-processing')}>
              Explore Model
            </button>
          </div>
          <div className="model-card">
            <img src={iconMRI} alt="MRI Icon" />
            <h3>MRI Acceleration</h3>
            <p>Accelerate MRI scan reconstruction using deep learning.</p>
            <button onClick={() => navigate('/mri-acceleration')}>
              Explore Model
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-boxes">
          <div className="box about">
            <h3>About Us</h3>
            <p>
              <strong>Empowering image processing through untrained methods.</strong><br />
              We are a team of eight students passionate about using Deep Learning 
              to solve real-world daily and healthcare challenges.<br /> 
              This website is the result of our collaborative effort to explore the
              potential of deep learning in image processing and MRI reconstruction.
            </p>
          </div>
          <div className="box what">
            <h3>What We Built</h3>
            <p>
              <strong>We created two untrained models focused on:</strong><br />
              <b>Image Processing:</b> Enhancing clarity, removing noise, and restoring medical images.<br />
              <b>MRI Acceleration:</b> Speeding up MRI reconstruction using AI-driven techniques.<br />
              Though our models are still in early development, they represent a foundation for
              further exploration and optimization in medical imaging.
            </p>
          </div>
        </div>
        <div className="box mission">
          <h3>Our Mission</h3>
          <p>
            To develop accessible and innovative tools that assist researchers, radiologists, and
            healthcare professionals in improving image quality and accelerating MRI processes.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <div className="contact-content">
        <h2>Contact Us</h2>
        <p>Feel free to reach out to us!</p>
        <div className="contact-icon">
          <MdEmail size={28} color="#031930" />
          <p>github894@gmail.com</p>
        </div>
      </div>
    </div>
  );
}