import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import Navbar from './NavBar';
import NewNavBar from './components/NewNavBar';

import LandingPage from './LandingPage';
import Home from './components/Home';
import Denoising from './components/Denoising';
import Inpainting from './components/Inpainting';
import SuperResolution from './components/SuperResolution';
import AuthForm from './components/AuthForm';
import ResetPassword from './components/ResetPassword';
import Edit from './components/Edit';
import MRI from './components/MRI'
import MRIHome from './components/MRIHome'
import './App.css';
import './dark-mode.css';




// ✅ AppContent can safely use useLocation
function AppContent({ darkMode, toggleMode }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const routeState = location.state;

  const isLanding = currentPath === '/';
  const isMRI = currentPath.startsWith('/mri') || routeState?.from === 'mri';
  const isImage = [
    '/image-processing',
    '/denoising',
    '/inpainting',
    '/super-resolution',
    '/edit',
    '/resetPassword',
  ].includes(currentPath) || routeState?.from === 'image';

  // ✅ Set landing body background class
  useEffect(() => {
    if (isLanding) {
      document.body.classList.add('landing-body');
    } else {
      document.body.classList.remove('landing-body');
    }
  }, [isLanding]);

  return (
    <div className="App">
      {isImage && <Navbar toggleMode={toggleMode} darkMode={darkMode} />}
      {isMRI && <NewNavBar toggleMode={toggleMode} darkMode={darkMode} />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/image-processing" element={<Home />} />
        <Route path="/denoising" element={<Denoising />} />
        <Route path="/inpainting" element={<Inpainting />} />
        <Route path="/super-resolution" element={<SuperResolution />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/signup" element={<AuthForm />} />
        <Route path="/mri-acceleration" element={<MRIHome />} />
        <Route path="/mri-model" element={<MRI />} />
      </Routes>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('darkmode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('darkmode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleMode = () => setDarkMode(prev => !prev);

  return (
    <Router>
      <AppContent darkMode={darkMode} toggleMode={toggleMode} />
    </Router>
  );
}

export default App;
