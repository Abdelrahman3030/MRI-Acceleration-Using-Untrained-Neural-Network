import React, { useState } from 'react';
import './AuthForm.css';

function AuthForm() {
  const [isSignInActive, setIsSignInActive] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const API_BASE = 'http://localhost:8000/api/auth';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignInActive ? '/signin' : '/signup';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="auth-form-container">
      <div className={`form-panel sign-up-panel ${isSignInActive ? 'collapsed' : 'expanded'}`} onClick={() => setIsSignInActive(false)}>
        <h2 className="sign-up-text">SIGN UP</h2>
        {!isSignInActive && (
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            <button className="form-button" type="submit">Sign Up</button>
          </form>
        )}
      </div>

      <div className={`form-panel sign-in-panel ${isSignInActive ? 'expanded' : 'collapsed'}`} onClick={() => setIsSignInActive(true)}>
        <h2 className="sign-in-text">SIGN IN</h2>
        {isSignInActive && (
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
            <button className="form-button" type="submit">Sign In</button>
            <div className="forgot-password-link" onClick={() => alert('Redirect to Forgot Password')}>Forgot Password?</div>
          </form>
        )}
      </div>

      {message && <p className="response-message">{message}</p>}
    </div>
  );
}

export default AuthForm;
