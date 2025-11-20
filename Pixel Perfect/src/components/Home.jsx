import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import denoisingImage from './denoising.png';
import inpaintingImage from './inpainting.png';
import superImage from './super.png';


const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { 
      title: 'Denoising', 
      image: denoisingImage, 
      text: 'Process where unwanted noise is removed to enhance the image quality.', 
      link: '/denoising' 
    },
    { 
      title: 'Inpainting', 
      image: inpaintingImage, 
      text: 'Filling missing or damaged parts of an image based on surrounding content.', 
      link: '/inpainting' 
    },
    { 
      title: 'Super Resolution', 
      image: superImage, 
      text: 'Enhancing image resolution and quality from low resolution.', 
      link: '/super-resolution' 
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = (link) => {
    console.log("Navigating to:", link);
    navigate(link);
  };

  return (
    <div className="home">
      {/* Carousel Section */}
      <div className="carousel-container">
        <div className="slides">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-content">
                <div className="slide-title">{slide.title}</div>
                <div className="slide-text">{slide.text}</div>
                <button
                  className="explore-button"
                  onClick={() => handleButtonClick(slide.link)}
                >
                  Click to Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Below the Carousel */}
      <div className="content-section">
  <h2>Our Services</h2>
  <p>Our advanced image processing technologies aim to revolutionize how images are analyzed and enhanced. Here's a look at the key techniques we offer:</p>

  {/* Columns Container */}
  <div className="columns-container">
    {/* Denoising Column */}
    <div className="column">
      <h3>DENOISING</h3>
      <p>Our denoising technology removes unwanted noise from images, improving clarity and detail, and ensuring smoother transitions between colors.</p>
      <img src={denoisingImage} alt="Denoising" />
      <button className="column-button" onClick={() => navigate("/denoising")}>
        Learn More
      </button>
    </div>

    {/* Inpainting Column */}
    <div className="column">
      <img src={inpaintingImage} alt="Inpainting" />
      <h3>INPAINTING</h3>
      <p>Inpainting technology allows us to intelligently reconstruct damaged or missing parts of an image, filling in gaps seamlessly.</p>
      <button className="column-button" onClick={() => navigate("/inpainting")}>
        Learn More
      </button>
    </div>

    {/* Super Resolution Column */}
    <div className="column">
      <h3>SUPER RESOLUTION</h3>
      <p>Super resolution enhances the image quality by reconstructing high-resolution details from low-resolution images, making them sharper and clearer.</p>
      <img src={superImage} alt="Super Resolution" />
      <button className="column-button" onClick={() => navigate("/super-resolution")}>
        Learn More
      </button>
    </div>
  </div>
</div>


      {/* Contact Us Section */}
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
};

export default Home;
