import React, { useState } from 'react';
import './SuperResolution.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faClock, faCheckCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

import BASE_URL from './config';

function SuperResolution() {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [progress, setProgress] = useState(0);
  const [processedImage, setProcessedImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();

  // Helper function to generate a unique ID
  const generateUniqueId = () => {
    return `img_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    e.preventDefault();
    let file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];

    if (file) {
      setImage(file);
      toast.success('Image uploaded successfully!');
    } else {
      toast.error('Failed to upload image. Please try again.');
    }

    setDragging(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Call to backend API to get estimated time
  const getEstimatedTime = async (uniqueId) => {
    // For now, we'll use a fixed estimated time since our backend doesn't provide this
    const estimatedTime = 30; // 30 seconds
    setEstimatedTime(estimatedTime);
    setRemainingTime(estimatedTime);
    toast.info(`Estimated time for processing: ${formatTime(estimatedTime)}`);
    return estimatedTime;
  };

  // Call to backend API to fetch processed image
  const getProcessedImage = async (uniqueId) => {
    try {
      const response = await fetch(`http://localhost:80/status/${uniqueId}`);
      if (!response.ok) throw new Error('Failed to check processing status.');
      
      const status = await response.json();
      if (status.status === 'completed') {
        setProcessedImage(`http://localhost:80/process-image/superresolution?id=${uniqueId}`);
        toast.success('Processing complete!');
        setIsProcessing(false);
        setProgress(100);
      } else if (status.status === 'failed') {
        throw new Error(status.error || 'Processing failed');
      }
    } catch (error) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  // Initiate the SuperResolution process
  const handleSuper = async () => {
    if (!image) {
      toast.error('Please upload an image first.');
      return;
    }

    setIsProcessing(true);
    setProcessedImage(null);
    setProgress(0);

    const uniqueId = generateUniqueId();
    
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('id', uniqueId);

      const response = await fetch(`${BASE_URL}/upscale`, {
        method: 'POST',
        // headers: {
        //   'Accept': 'application/json',
        // },
        // credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error:', errorData);
        throw new Error(`Failed to process image: ${errorData}`);
      }

      // Get the processed image directly
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(imageUrl);
      setIsProcessing(false);
      setProgress(100);
      toast.success('Processing complete!');

    } catch (error) {
      console.error('Error details:', error);
      toast.error(error.message || 'Failed to process image. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="super-page-container">
      <ToastContainer />
      <header className="super-header">Super Resolution</header>

      <div className="content-container">
        {/* Left Section */}
        <div className="super-left">
          <div className="upload-section">
            <h2>How to Improve Your Image</h2>
            <div className="instructions">
              <div className="super-step">
                <FontAwesomeIcon icon={faUpload} className="step-number" />
                <div className="step-description">Upload your image</div>
              </div>
              <div className="super-step">
                <FontAwesomeIcon icon={faClock} className="step-number" />
                <div className="step-description">Watch the timer</div>
              </div>
              <div className="super-step">
                <FontAwesomeIcon icon={faCheckCircle} className="step-number" />
                <div className="step-description">Check the results below</div>
              </div>
              <div className="super-step">
                <FontAwesomeIcon icon={faDownload} className="step-number" />
                <div className="step-description">Download or Edit</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Example Image) */}
        <div className="super-right"></div>
      </div>

      {/* Centered Upload Button Below Both Sections */}
      <div className="upload-section">
        <div
          className={`upload-container ${dragging ? 'drag-over' : ''}`}
          onDrop={handleImageUpload}
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
            onChange={handleImageUpload}
            disabled={isProcessing} // Disable the file input while processing
          />
          <label
            htmlFor="file-input"
            className={`custom-file-label ${isProcessing ? 'disabled' : ''}`} // Apply the 'disabled' class when processing
          >
            {image ? image.name : 'Choose an Image or Drag & Drop Here'}
          </label>

          {image && (
            <div className="image-preview">
              <img src={URL.createObjectURL(image)} alt="Uploaded Preview" />
            </div>
          )}
        </div>

        {image && (
          <button
            onClick={handleSuper}
            className={`super-button ${isProcessing ? 'disabled' : ''}`}
            disabled={isProcessing} // Disable the button while processing
          >
            {isProcessing ? 'Processing...' : 'Improve Image'}
          </button>
        )}
      </div>

      {/* Processing and Result Sections */}
      {isProcessing && estimatedTime !== null && (
        <div className="progress-section">
          <p>Processing... Estimated time: {formatTime(remainingTime)}</p>
          <div className="spinner"></div>
          <progress value={progress} max="100"></progress>
        </div>
      )}

      {processedImage && (
        <div className="result-section">
          <h3>Before and After Super Resolution</h3>
          <div className="image-comparison">
            <div className="original-image">
              <h4>Original Image</h4>
              <img src={URL.createObjectURL(image)} alt="Original" />
            </div>
            <div className="processed-image">
              <h4>Improved Image</h4>
              <img src={processedImage} alt="Improved" />
            </div>
          </div>
          <a href={processedImage} download="improved-image.png" className="download-button">
            Download Improved Image
          </a>
          <button
        onClick={() => navigate("/edit", { state: { image: processedImage } })}
        className="edit-button"
      >
        Edit
      </button>
        </div>
      )}
    </div>
  );
}

export default SuperResolution;
