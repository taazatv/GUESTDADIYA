import React from "react";

function SuccessPage() {
  return (
    <div className="form-container">
      <div className="user-form" style={{ textAlign: "center" }}>
        <h2 style={{ color: "rgb(236 72 153)" }}> Details Submitted!</h2>
        <p style={{ marginTop: "1rem", fontSize: "1.1rem", color: "#444" }}>
          Your details have been submitted successfully.<br />
          Please wait for approval. 
        </p>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#666" }}>
          Once approved, you will receive an <b>SMS</b> on your phone number.
        </p>
        <p style={{ marginTop: "1rem", fontWeight: "600", color: "#333" }}>
          Thank you for your patience!
        </p>
      </div>
    </div>
  );
}

export default SuccessPage;
