import React, { useState } from 'react';
import './Denoising.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faClock, faCheckCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

import BASE_URL from './config';

function Denoising() {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedImage, setProcessedImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();
  
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

    // Initiate the denoising process
    const handleDenoise = async () => {
      if (!image) {
        toast.error('Please upload an image first.');
        return;
      }
  
      setIsProcessing(true);
      setProcessedImage(null);
      setProgress(0);
      
      try {
        const formData = new FormData();
        formData.append('image', image);
  
        const response = await fetch(`${BASE_URL}/denoise`, {
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
    <div className="denoising-page-container">
      <ToastContainer />
      <header className="header">Denoising</header>

      <div className="content-container">
        {/* Left Section */}
        <div className="left">
          <div className="upload-section">
            <h2>How to Denoise Your Image</h2>
            <div className="instructions">
              <div className="step">
                <FontAwesomeIcon icon={faUpload} className="step-number" />
                <div className="step-description">Upload your image</div>
              </div>
              <div className="step">
                <FontAwesomeIcon icon={faClock} className="step-number" />
                <div className="step-description">Watch the timer</div>
              </div>
              <div className="step">
                <FontAwesomeIcon icon={faCheckCircle} className="step-number" />
                <div className="step-description">Check the results below</div>
              </div>
              <div className="step">
                <FontAwesomeIcon icon={faDownload} className="step-number" />
                <div className="step-description">Download or Edit</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Example Image) */}
        <div className="right"></div>
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
            onClick={handleDenoise}
            className={`denoise-button ${isProcessing ? 'disabled' : ''}`}
            disabled={isProcessing} // Disable the button while processing
          >
            {isProcessing ? 'Processing...' : 'Denoise Image'}
          </button>
        )}
      </div>

      {/* Processing and Result Sections */}
      {isProcessing && (
        <div className="progress-section">
          <p>Processing...</p>
          <div className="spinner"></div>
          <progress value={progress} max="100"></progress>
        </div>
      )}

      {processedImage && (
        <div className="result-section">
          <h3>Before and After Denoising</h3>
          <div className="image-comparison">
            <div className="original-image">
              <h4>Original Image</h4>
              <img src={URL.createObjectURL(image)} alt="Original" />
            </div>
            <div className="processed-image">
              <h4>Denoised Image</h4>
              <img src={processedImage} alt="Denoised" />
            </div>
          </div>
          <a href={processedImage} download="denoised_image.png" className="download-button">
            Download Denoised Image
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

export default Denoising;
