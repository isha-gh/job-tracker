// src/pages/EditApplication.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function EditApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");
  const [dateApplied, setDateApplied] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const res = await api.get(`/applications/${id}`);
      setCompany(res.data.company);
      setPosition(res.data.position);
      setStatus(res.data.status);
      setDateApplied(res.data.date_applied || "");
      setNotes(res.data.notes || "");
    } catch (err) {
      console.error("Error fetching application:", err);
      alert("Could not load application data.");
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/applications/${id}`, {
        company,
        position,
        status,
        date_applied: dateApplied || null,
        notes,
      });
      navigate("/");
    } catch (err) {
      console.error("Error updating application:", err);
      alert("Failed to update application.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Job Application</h2>

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
          Update Application
        </button>
      </form>
    </div>
  );
}

export default EditApplication;
