import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Form.css";
import taazDandiya from "../assets/taaza-dandiya-logo.png";
import taaztv from "../assets/taaza-main-logo.png";

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    aadhaar: "",
    email: "",
    coupon: "",
    userReference: "",
  });

  const [isCouponVerified, setIsCouponVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const navigate = useNavigate();

  const handleChange = async (e) => {
  const { name, value } = e.target;

  if (name === "phone" && value.length > 10) return;
  if (name === "aadhaar" && value.length > 12) return;

  setFormData((prev) => ({
    ...prev,
    [name]: name === "coupon" ? value.toUpperCase() : value,
  }));

  // Check email on change
  if (name === "email" && value) {
    try {
      const res = await axios.post(
        "https://guestdandiya-backend.onrender.com/api/check-email",
        { email: value }
      );
      if (res.data.exists) {
        setEmailWarning(
          "This email has been used before, but you can still submit."
        );
      } else {
        setEmailWarning("");
      }
    } catch (err) {
      console.error(err);
      setEmailWarning("");
    }
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) return alert("Phone must be 10 digits");
    if (formData.aadhaar.length !== 12)
      return alert("Aadhaar must be 12 digits");
    if (!isCouponVerified) return alert("Verify coupon first");

    try {
      const res = await axios.post(
        "https://guestdandiya-backend.onrender.com/api/submit-user",
        {
          ...formData,
          eventDate,
        }
      );

      alert(`Form submitted! Token: ${res.data.token}`);
      navigate("/success");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-logos">
          <img src={taazDandiya} alt="Taaza Dandiya" className="form-logo" />
          <img src={taaztv} alt="Taaza TV" className="form-logo" />
        </div>

        <h2>GUEST PASSES REGISTRATION</h2>

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name"
          required
        />

        <label>Mobile No (Booking SMS will be sent here)</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="10-digit valid phone no for sending ticket "
          required
        />

        <label>Aadhar Number</label>
        <input
          type="text"
          name="aadhaar"
          value={formData.aadhaar}
          onChange={handleChange}
          placeholder="12-digit Aadhaar"
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />
        {emailWarning && (
          <p style={{ color: "orange", fontWeight: "600" }}>{emailWarning}</p>
        )}

        <label>Coupon</label>
        <div className="coupon-section">
          <input
            type="text"
            name="coupon"
            value={formData.coupon}
            onChange={handleChange}
            placeholder="Enter coupon"
            required
          />
          <button
            type="button"
            className="verify-btn"
            onClick={verifyCoupon}
            disabled={verifying}
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>
        </div>

        {isCouponVerified && eventDate && (
          <p style={{ color: "green", fontWeight: "600" }}>
            Event Date: {eventDate}
          </p>
        )}

        <label>Coupon Received From</label>
        <input
          type="text"
          name="userReference"
          value={formData.userReference}
          onChange={handleChange}
          placeholder="Name of person/company who gave you the coupon?"
          required
        />

        <div className="terms-section">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            I agree to the terms & conditions listed below
          </label>
        </div>

        <button type="submit" disabled={!isCouponVerified}>
          Submit
        </button>

        {/* Terms & Conditions Section */}
        <div className="tc-box">
          <h4>Terms & Conditions:</h4>
          <ul>
            <li>Only 1 booking allowed per phone number</li>
            <li>
              Severe action will be taken against misconduct or mischievous
              behavior
            </li>
            <li>
              Smoking and consumption of alcohol is strictly prohibited inside
              the venue
            </li>
            <li>Outside eatables and water are not allowed</li>
            <li>
              Scissors, knives, blades, or any other objectionable instruments
              are not allowed
            </li>
            <li>
              Every individual must undergo security checks and frisking before
              entering
            </li>
            <li>Re-entry is not allowed once you exit the venue</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

export default Form;
