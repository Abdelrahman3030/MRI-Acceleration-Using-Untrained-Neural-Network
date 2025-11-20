import React, { useState } from 'react';
import './MRI.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faClock, faCheckCircle, faDownload } from '@fortawesome/free-solid-svg-icons';


import BASE_URL from './config';

function MRI() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedImage, setProcessedImage] = useState(null);
  const [dragging, setDragging] = useState(false);

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const uploadedFile = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];

    if (!uploadedFile || !uploadedFile.name.endsWith('.h5')) {
      toast.error('Please upload a valid .h5 file.');
      return;
    }

    setFile(uploadedFile);
    toast.success('HDF5 file uploaded successfully!');
    setDragging(false);
  };

  const handleProcess = async () => {
    console.log("Triggered reconstruction");
  
    if (!file) {
      toast.error('Please upload an HDF5 file first.');
      return;
    }
  
    setIsProcessing(true);
    setProcessedImage(null);
    setProgress(0);
  
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      console.log("Sending file to:", `${BASE_URL}/mri`);
      console.log("File name:", file.name);
  
      const response = await fetch(`${BASE_URL}/mri`, {
        method: 'POST',
        body: formData,
        headers: {
          'Connection': 'close'
        }
      });
      
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }
  
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(imageUrl);
      console.log("Processed image URL:", imageUrl);
      window.open(imageUrl);


      setProgress(100);
      toast.success('MRI processed successfully!');
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(error.message || 'Processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };
  

  return (
    <div className="MRI-page-container">
      <ToastContainer />
      <header className="header-MRI">MRI RECONSTRUCTION</header>

      <div className="content-container">
        {/* Left Section */}
        <div className="left">
          <div className="upload-section">
            <h2>How To Use Our Product</h2>
            <div className="instructions">
              <div className="step">
                <FontAwesomeIcon icon={faUpload} className="step-number" />
                <div className="step-description">Upload your HDF5 file</div>
              </div>
              <div className="step">
                <FontAwesomeIcon icon={faClock} className="step-number" />
                <div className="step-description">Wait for processing</div>
              </div>
              <div className="step">
                <FontAwesomeIcon icon={faCheckCircle} className="step-number" />
                <div className="step-description">View reconstruction results</div>
              </div>
              <div className="step">
                <FontAwesomeIcon icon={faDownload} className="step-number" />
                <div className="step-description">Download your results</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Example Image) */}
        <div className="MRIright"></div>
      </div>

      {/* Centered Upload Button Below Both Sections */}
      <div className="upload-section">
        <div
          className={`upload-container ${dragging ? 'drag-over' : ''}`}
          onDrop={handleFileUpload}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
        >
          <input
            type="file"
            id="file-input"
            className="file-input"
            onChange={handleFileUpload}
            accept=".h5,.hdf5"
            disabled={isProcessing}
          />
          <label
            htmlFor="file-input"
            className={`custom-file-label ${isProcessing ? 'disabled' : ''}`}
          >
            {file ? file.name : 'Choose HDF5 File or Drag & Drop Here'}
          </label>

          {file && (
            <div className="file-info">
              <p>Selected file: {file.name}</p>
              <p>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}
        </div>

        {file && (
          <button
            onClick={handleProcess}
            className={`MRI-button ${isProcessing ? 'disabled' : ''}`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Reconstructing...' : 'Reconstruct MRI Data'}
          </button>
        )}
      </div>

      {/* Processing and Result Sections */}
      {isProcessing && (
        <div className="processing-section">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <p>Processing MRI data... This may take a few moments.</p>
        </div>
      )}

      {processedImage && (
        <div className="result-section">
          <h3>Reconstruction Results</h3>
          <div className="reconstruction-result">
          <img src={processedImage} alt="MRI Reconstruction" style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ccc' }} />
          </div>
          <a href={processedImage} download="mri-reconstruction.png" className="download-button">
            <FontAwesomeIcon icon={faDownload} /> Download Reconstruction
          </a>
        </div>
      )}
    </div>
  );
}

export default MRI;
