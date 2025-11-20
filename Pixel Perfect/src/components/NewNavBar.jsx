import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NewNavBar.css';

export default function NewNavBar({ darkMode, toggleMode }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          PixelPerfect
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link
              to="/mri-acceleration"
              className={`nav-links ${location.pathname === '/mri-acceleration' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/mri-model"
              className={`nav-links ${location.pathname === '/mri-model' ? 'active' : ''}`}
            >
              MRI Model
            </Link>
          </li>
          <li className="nav-item">
            <button onClick={toggleMode} className="mode-toggle">
              {darkMode ? 'Dark' : 'Light'} Mode
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
