// src/pages/AddApplication.js

import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function AddApplication() {
  // State variables for form inputs
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied"); // default to "applied"
  const [dateApplied, setDateApplied] = useState("");
  const [notes, setNotes] = useState("");

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // POST to your FastAPI backend
      await api.post("/applications", {
        company,
        position,
        status,
        date_applied: dateApplied ? dateApplied : null, // send null if empty
        notes,
      });

      // Redirect to home page after successful add
      navigate("/");
    } catch (error) {
      console.error("Failed to add application:", error);
      alert("Failed to add application. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Job Application</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Accepted">Accepted</option>
        </select>

        <input
          type="date"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Application
        </button>
      </form>
    </div>
  );
}

export default AddApplication;
