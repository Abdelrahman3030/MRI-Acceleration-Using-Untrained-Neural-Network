import React, { useState, useRef, useEffect } from 'react';
import './Inpainting.css';  // Importing the Inpainting-specific CSS
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faCheckCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

import BASE_URL from './config';

function Inpainting() {
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

  // Refs for canvas and mask canvas
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  
  const ctx = useRef(null);
  const maskCtx = useRef(null);
  
  const [drawing, setDrawing] = useState(false);
  
  const [lineWidth, setLineWidth] = useState(5); // Line width for drawing

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Call to backend API to get estimated processing time
  const getEstimatedTime = async (uniqueId) => {
    // For now, we'll use a fixed estimated time since our backend doesn't provide this
    const estimatedTime = 30; // 30 seconds
    setEstimatedTime(estimatedTime);
    setRemainingTime(estimatedTime);
    toast.info(`Estimated time for processing: ${formatTime(estimatedTime)}`);
    return estimatedTime;
  };

  const getProcessedImage = async (uniqueId) => {
    try {
      const response = await fetch(`http://localhost:80/status/${uniqueId}`);
      if (!response.ok) throw new Error('Failed to check processing status.');
      
      const status = await response.json();
      if (status.status === 'completed') {
        setProcessedImage(`http://localhost:80/process-image/inpainting?id=${uniqueId}`);
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

  const handleInpaint = async () => {
    if (!image) {
      toast.error('Please upload an image first.');
      return;
    }

    if (!maskCanvasRef.current) {
      toast.error('Please draw a mask on the image first.');
      return;
    }

    setIsProcessing(true);
    setProcessedImage(null);
    setProgress(0);
    
    try {
      // Get the mask data
      const maskDataUrl = maskCanvasRef.current.toDataURL('image/png');
      const maskBlob = await (await fetch(maskDataUrl)).blob();

      const formData = new FormData();
      formData.append('image', image);
      formData.append('mask', maskBlob);

      const response = await fetch(`${BASE_URL}/inpaint`, {
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

  // Initialize canvas context after the component mounts
  useEffect(() => {
    if (canvasRef.current && maskCanvasRef.current) {
      ctx.current = canvasRef.current.getContext('2d');
      maskCtx.current = maskCanvasRef.current.getContext('2d');
    }
  }, []);

  // Handle image upload with resizing for performance
  const handleImageUpload = (e) => {
    e.preventDefault();
    let file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];

    if (file) {
      setImage(file);
      toast.success('Image uploaded successfully!');
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const maskCanvas = maskCanvasRef.current;

          // Resize image for performance (max width of 1024px)
          const maxWidth = 1024;
          const scaleFactor = Math.min(maxWidth / img.width, 1);
          const scaledWidth = img.width * scaleFactor;
          const scaledHeight = img.height * scaleFactor;

          // Set canvas size to match the resized image dimensions
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          maskCanvas.width = scaledWidth;
          maskCanvas.height = scaledHeight;

          // Draw the image on the main canvas
          ctx.current.drawImage(img, 0, 0);

          // Initialize mask canvas with white background
          maskCtx.current.fillStyle = "white";
          maskCtx.current.fillRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
      };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Failed to upload image. Please try again.');
    }
    setDragging(false);
  };

  // Mouse events for drawing on the canvas
  const handleMouseDown = (e) => {
    setDrawing(true);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    ctx.current.beginPath();
    ctx.current.moveTo(x, y);
    maskCtx.current.beginPath();
    maskCtx.current.moveTo(x, y);
};

const handleMouseMove = (e) => {
    if (drawing) {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        ctx.current.lineTo(x, y);
        ctx.current.strokeStyle = 'rgba(94, 23, 235, 0.05)';
        ctx.current.lineWidth = lineWidth;
        ctx.current.stroke();

        maskCtx.current.lineTo(x, y);
        maskCtx.current.strokeStyle = "black";
        maskCtx.current.lineWidth = lineWidth;
        maskCtx.current.stroke();
    }
};

const handleMouseUp = () => {
    setDrawing(false);
    maskCtx.current.closePath();
};


  // Stop drawing when mouse leaves the canvas
  const handleMouseLeave = () => {
    setDrawing(false); // Stops drawing when the mouse leaves the canvas
  };

  // Check if mask is drawn
  const isMaskDrawn = maskCtx.current && maskCtx.current.getImageData(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height).data.some(value => value > 0);

  return (
    <div className="inpainting-page-container">
      <ToastContainer />
      <header className="inpainting-header">Inpainting</header>

      <div className="content-container">
        <div className="inpainting-left">
          <div className="upload-section">
            <h2>How To Edit Your Photo</h2>
            <div className="instructions">
              <div className="inpainting-step">
                <FontAwesomeIcon icon={faUpload} className="step-number" />
                <div className="step-description">Upload your image</div>
              </div>
              <div className="inpainting-step">
                <FontAwesomeIcon icon={faXmark} className="step-number" />
                <div className="step-description">Select the unwanted area</div>
              </div>
              <div className="inpainting-step">
              <FontAwesomeIcon icon={faCheckCircle} className="step-number" />
              <div className="step-description">Check the results below</div>
              </div>
              <div className="inpainting-step">
              <FontAwesomeIcon icon={faDownload} className="step-number" />
              <div className="step-description">Download or Edit</div>
              </div>
            </div>
          </div>
        </div>

        <div className="inpainting-right"></div>
      </div>

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
            disabled={isProcessing}
          />
          <label
            htmlFor="file-input"
            className={`custom-file-label ${isProcessing ? 'disabled' : ''}`}
          >
            {image ? image.name : 'Choose an Image or Drag & Drop Here'}
          </label>
          {image && (
            <div className="controls">
              <label>Font Size (Line Width):</label>
              <input
                type="range"
                min="1"
                max="50"
                value={lineWidth}
                onChange={(e) => setLineWidth(e.target.value)}
                className="line-width-slider"
              />
            </div>
          )}

          {/* Canvas for image and mask */}
          <canvas
            ref={canvasRef}
            id="canvas"
            style={{ display: image ? 'block' : 'none' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave} // Stop drawing when mouse leaves the canvas
          />
          <canvas ref={maskCanvasRef} id="maskCanvas" style={{ display: 'none' }} />
        </div>

        {image && (
          <button
            onClick={handleInpaint}
            className={`inpaint-button ${isProcessing ? 'disabled' : ''}`}
            disabled={isProcessing || !isMaskDrawn} // Disable if no mask drawn
          >
            {isProcessing ? 'Processing...' : 'Inpaint Image'}
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
          <h3>Before and After Inpainting</h3>
          <div className="image-comparison">
            <div className="original-image">
              <h4>Original Image</h4>
              <img src={URL.createObjectURL(image)} alt="Original" />
            </div>
            <div className="processed-image">
              <h4>Inpainted Image</h4>
              <img src={processedImage} alt="Inpainted" />
            </div>
          </div>
          <a href={processedImage} download="inpainted-image.png" className="download-button">
            Download Inpainted Image
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

export default Inpainting;
