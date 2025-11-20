import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function Navbar({ toggleMode, darkMode }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          PixelPerfect
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/image-processing" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/denoising" className="nav-links">
              Denoising
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/inpainting" className="nav-links">
              Inpainting
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/super-resolution" className="nav-links">
              Super Resolution
            </Link>
          </li>
          {/* Dark Mode Toggle Button */}
          <li className="nav-item">
            <button className="mode-toggle" onClick={toggleMode}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
