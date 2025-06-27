import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this application?");
    if (!confirmed) return;

    try {
      await api.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (error) {
      console.error("Failed to delete application:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700";
      case "Interviewing":
        return "bg-yellow-100 text-yellow-700";
      case "Offer":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Accepted":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Job Tracker
        </h1>

        <div className="text-center mb-8">
          <Link
            to="/add"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            + Add New Application
          </Link>
        </div>

        {applications.length === 0 ? (
          <p className="text-center text-gray-500">No applications found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-200"
              >
                <div className="mb-2 text-xl font-semibold text-gray-800">
                  {app.company}
                </div>
                <div className="text-gray-600 mb-1">{app.position}</div>
                <div
                  className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                    app.status
                  )}`}
                >
                  {app.status}
                </div>
                {app.date_applied && (
                  <div className="text-sm text-gray-400 mt-2">
                    Applied on {new Date(app.date_applied).toLocaleDateString()}
                  </div>
                )}
                {app.notes && (
                  <div className="text-sm text-gray-500 mt-2">
                    Notes: {app.notes}
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => navigate(`/edit/${app.id}`)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
