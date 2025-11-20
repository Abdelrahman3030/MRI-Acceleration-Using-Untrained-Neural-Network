import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./AuthForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract token and user ID from query params
  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      // Replace with your backend API endpoint for resetting password
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
          token,
          userId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Failed to reset password.");
        return;
      }

      toast.success(data.message || "Password reset successful!");
      setTimeout(() => navigate("/"), 2000); // Redirect to home page after 2 seconds
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="auth-form-container">
      <ToastContainer />
      <div className="form-panel reset-password-panel">
        <h2>Create New Password</h2>
        <p>The new password must be different from the old one</p>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button className="form-button" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
