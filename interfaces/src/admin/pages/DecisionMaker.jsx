import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getProjects } from "../../services/projectService";
import DecisionMakerList from "../components/DecisionMakerList";
import AssignDMForm from "../components/AssignDMForm";
import CreateDMForm from "../components/CreateDMForm";

export default function DecisionMaker() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateDMModal, setShowCreateDMModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch Projects on Mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
      if (data && data.length > 0) {
        setSelectedProjectId(data[0].ID || data[0].project_id);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="ml-72 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6">
        <div className="space-y-6">
      <section className="bg-white rounded-3xl shadow-card px-8 py-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Manajemen Decision Maker
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola tim evaluator untuk setiap project
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="" disabled>Pilih Project</option>
              {projects.map((p) => (
                <option key={p.ID || p.project_id} value={p.ID || p.project_id}>
                  {p.name || p.project_name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowCreateDMModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold px-5 py-2.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              <span className="text-base">👤＋</span>
              <span>Buat Akun DM</span>
            </button>

            <button
              onClick={() => setShowAssignModal(true)}
              disabled={!selectedProjectId}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold px-5 py-2.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-base">＋</span>
              <span>Assign ke Project</span>
            </button>
          </div>
        </div>

        {/* List Decision Makers */}
        {selectedProjectId ? (
          <DecisionMakerList
            projectId={selectedProjectId}
            refreshTrigger={refreshKey}
          />
        ) : (
          <div className="text-center py-10 text-gray-500">
            Silakan pilih project terlebih dahulu.
          </div>
        )}
      </section>

      {/* Modal Assign DM */}
      {showAssignModal && selectedProjectId && (
        <AssignDMForm
          projectId={selectedProjectId}
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
        />
      )}

      {/* Modal Create DM */}
      {showCreateDMModal && (
        <CreateDMForm
          onClose={() => setShowCreateDMModal(false)}
          onSuccess={() => {
            setShowCreateDMModal(false);
            // Optionally refresh the DM list
          }}
        />
      )}
        </div>
      </div>
    </>
  );
}

