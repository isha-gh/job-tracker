// src/pages/ViewApplication.js

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

function ViewApplication() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        setApplication(res.data);
      } catch (err) {
        console.error("Failed to fetch application", err);
      }
    };
    fetchApp();
  }, [id]);

  if (!application) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{application.company}</h2>
      <p className="text-gray-700 mb-2">Position: {application.position}</p>
      <p className="text-gray-700 mb-2">Status: {application.status}</p>
      <p className="text-gray-600 mb-2">
        Date Applied:{" "}
        {application.date_applied
          ? new Date(application.date_applied).toLocaleDateString()
          : "N/A"}
      </p>
      <p className="text-gray-600 mb-4">Notes: {application.notes || "None"}</p>

      <div className="flex justify-between">
        <Link to={`/edit/${application.id}`} className="text-blue-600 underline">
          Edit
        </Link>
        <Link to="/" className="text-gray-600 underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ViewApplication;
