import React, { useState } from "react";
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
  const [popupData, setPopupData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && value.length > 10) return;
    if (name === "aadhaar" && value.length > 12) return;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "coupon" ? value.toUpperCase() : value,
    }));
  };

  const verifyCoupon = async () => {
    if (!formData.coupon) return alert("Enter coupon code");
    setVerifying(true);
    try {
      const res = await axios.post(
        "https://guestdandiya-backend.onrender.com/api/verify-coupon",
        { coupon: formData.coupon }
      );

      if (res.data.valid) {
        setEventDate(res.data.eventDate);
        alert(`Coupon verified for event date: ${res.data.eventDate}`);
        setIsCouponVerified(true);
      } else {
        alert("Invalid or already used coupon!");
        setIsCouponVerified(false);
        setEventDate("");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying coupon");
      setIsCouponVerified(false);
      setEventDate("");
    }
    setVerifying(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) return alert("Phone must be 10 digits");
    if (formData.aadhaar.length !== 12) return alert("Aadhaar must be 12 digits");
    if (!isCouponVerified) return alert("Verify coupon first");

    try {
      const res = await axios.post(
        "https://guestdandiya-backend.onrender.com/api/submit-user",
        { ...formData, eventDate }
      );

      if (res.data.phoneExists) {
        return alert(`This mobile number (${formData.phone}) already exists!`);
      }

      const [day] = eventDate.split("-");
      const dayString = day.padStart(2, "0");
      const token = formData.coupon[0] + dayString + formData.coupon.slice(1) + formData.phone.slice(-4);

      const smsMessage = `Confirmed! Booking ID ${token}. You are entitled to 1 ticket dated ${eventDate} for Taaza Dandiya @Netaji Indoor Stadium. Rights of admission reserved. T%26C apply. Go to the Ticket counter at venue to redeem. -Taaza Infotainment pvt ltd`;

      setPopupData({
        token,
        message: smsMessage,
        phone: formData.phone,
      });

      setFormData({
        name: "",
        phone: "",
        aadhaar: "",
        email: "",
        coupon: "",
        userReference: "",
      });
      setIsCouponVerified(false);
      setEventDate("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const closePopup = () => setPopupData(null);

  return (
    <div className="form-container">
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-logos">
          <img src={taazDandiya} alt="Taaza Dandiya" className="form-logo" />
          <img src={taaztv} alt="Taaza TV" className="form-logo" />
        </div>

        <h2>COMPLIMENTARY GUEST PASSES</h2>
        <h3>REDEEM AT VENUE TICKET COUNTER</h3>
        <h3>Enter mobile no. & Aadhaar card at venue for verification</h3>

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
          placeholder="10-digit valid phone no for sending ticket"
          required
        />

        <label>Aadhaar Number</label>
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

        <div className="tc-box">
          <h4>Terms & Conditions:</h4>
          <ul>
            <li>Only 1 booking allowed per phone number</li>
            <li>Carry your Aadhaar card at venue for verification</li>
            <li>Only SMS received on mobile is valid</li>
            <li>No screenshots or forwards allowed</li>
            <li>Rights of admission reserved</li>
            <li>
              Severe action will be taken against misconduct or mischievous behavior
            </li>
            <li>Smoking and consumption of alcohol is strictly prohibited inside the venue</li>
            <li>Outside eatables and water are not allowed</li>
            <li>Scissors, knives, blades, or any other objectionable instruments are not allowed</li>
            <li>Every individual must undergo security checks and frisking before entering</li>
            <li>Re-entry is not allowed once you exit the venue</li>
          </ul>
        </div>
      </form>

      {popupData && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Booking Confirmed!</h3>
            <p>
              <strong>Phone:</strong> {popupData.phone}
            </p>
            <p>
              <strong>SMS Message You Will Receive:</strong>
            </p>
            <p className="sms-message">{popupData.message}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;
