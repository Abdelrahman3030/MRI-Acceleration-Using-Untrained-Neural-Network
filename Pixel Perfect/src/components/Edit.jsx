import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Edit.css";
import {
  FaUndo,
  FaArrowsAltH,
  FaCrop,
  FaAdjust,
  FaPen,
  FaFont,
  FaFilter,
  FaEraser,
  FaHighlighter,
  FaPaintBrush,
  FaPencilAlt,
  FaPenFancy,
} from "react-icons/fa";

const Edit = () => {
  const location = useLocation();
  const processedImage = location.state?.image;

  const [selectedFont, setSelectedFont] = useState("Arial"); // Default font
  const [selectedPen, setSelectedPen] = useState("Fancy Pen"); // Default pen type
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false); // Font dropdown visibility
  const [isDrawDropdownOpen, setIsDrawDropdownOpen] = useState(false); // Draw dropdown visibility

  const fontDropdownRef = useRef(null);
  const drawDropdownRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFontChange = (font) => {
    setSelectedFont(font);
    setIsFontDropdownOpen(false); // Close dropdown after selection
  };

  const handlePenChange = (pen) => {
    setSelectedPen(pen);
    setIsDrawDropdownOpen(false); // Close dropdown after selection
  };

  const handleClickOutside = (event) => {
    if (
      fontDropdownRef.current &&
      !fontDropdownRef.current.contains(event.target)
    ) {
      setIsFontDropdownOpen(false);
    }
    if (
      drawDropdownRef.current &&
      !drawDropdownRef.current.contains(event.target)
    ) {
      setIsDrawDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (canvasRef.current && processedImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = processedImage;

      img.onload = () => {
        canvas.width = img.width; // Set canvas size to image size
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0); // Draw the processed image on the canvas
      };
    }
  }, [processedImage]);

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.href = canvasRef.current.toDataURL("image/png"); // Export the canvas as a PNG image
      link.download = "edited-image.png"; // The downloaded file name
      link.click();
    }
  };

  return (
    <div className="edit-container">
      <div className="edit-main">
        {processedImage ? (
          <canvas ref={canvasRef} className="processed-image" />
        ) : (
          <p>No image to edit.</p>
        )}
      </div>
      <div className="edit-sidebar">
        <button className="sidebar-icon-button">
          <FaUndo title="Rotate" />
        </button>
        <button className="sidebar-icon-button">
          <FaArrowsAltH title="Flip" />
        </button>
        <button className="sidebar-icon-button">
          <FaCrop title="Crop" />
        </button>
        <button className="sidebar-icon-button">
          <FaAdjust title="Adjust" />
        </button>

        {/* Draw Button with Dropdown */}
        <div className="dropdown-container" ref={drawDropdownRef}>
          <button
            className="sidebar-icon-button dropdown-button"
            onClick={() => setIsDrawDropdownOpen((prev) => !prev)}
          >
            <FaPen title="Draw" />
          </button>
          {isDrawDropdownOpen && (
            <ul className="dropdown-menu classy-dropdown">
              {[
                { name: "Fancy Pen", icon: <FaPenFancy /> },
                { name: "Pencil", icon: <FaPencilAlt /> },
                { name: "Paint Brush", icon: <FaPaintBrush /> },
                { name: "Highlighter", icon: <FaHighlighter /> },
                { name: "Eraser", icon: <FaEraser /> },
              ].map((tool) => (
                <li
                  key={tool.name}
                  className={`dropdown-item classy-item ${
                    tool.name === selectedPen ? "selected" : ""
                  }`}
                  onClick={() => handlePenChange(tool.name)}
                >
                  {tool.icon} {tool.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Text Button with Dropdown */}
        <div className="dropdown-container" ref={fontDropdownRef}>
          <button
            className="sidebar-icon-button dropdown-button"
            onClick={() => setIsFontDropdownOpen((prev) => !prev)}
          >
            <FaFont title="Text" />
          </button>
          {isFontDropdownOpen && (
            <ul className="dropdown-menu classy-dropdown">
              {["Arial", "Calibri", "Dubai", "Times New Roman", "Sans Serif", "Suranna"].map((font) => (
                <li
                  key={font}
                  className={`dropdown-item classy-item ${
                    font === selectedFont ? "selected" : ""
                  }`}
                  onClick={() => handleFontChange(font)}
                  style={{ fontFamily: font }}
                >
                  {font}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="sidebar-icon-button">
          <FaFilter title="Filters" />
        </button>
        <button className="sidebar-icon-button">
          <i className="fa fa-refresh" aria-hidden="true" title="Reset"></i>
        </button>
      </div>
      <div className="download-container">
        <button className="download-button" onClick={downloadImage}>
          Download
        </button>
      </div>
    </div>
  );
};

export default Edit;
