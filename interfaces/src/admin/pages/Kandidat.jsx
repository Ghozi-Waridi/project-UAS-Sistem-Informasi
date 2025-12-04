import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getProjects } from "../../services/projectService";
import {
  getAlternativesByProject,
  deleteAlternative
} from "../../services/alternativeService";
import CandidateList from "../components/CandidateList";
import CandidateForm from "../components/CandidateForm";

export default function Kandidat() {
  // State for Projects
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // State for Candidates
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [detailCandidate, setDetailCandidate] = useState(null);

  // Fetch Projects on Mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch Candidates when Project Changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchCandidates(selectedProjectId);
    } else {
      setCandidates([]);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
      if (data && data.length > 0) {
        setSelectedProjectId(data[0].ID || data[0].project_id); // Handle case sensitivity
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const fetchCandidates = async (projectId) => {
    setLoading(true);
    try {
      const data = await getAlternativesByProject(projectId);
      // Transform backend data to frontend format
      // Backend: { alternative_id, name, description (JSON string) }
      const safeData = Array.isArray(data) ? data : [];
      const formattedData = safeData.map(item => {
        let details = {};
        try {
          const parsed = JSON.parse(item.description || "{}");
          // Handle case where description is double-encoded or nested in a property
          if (typeof parsed === 'string') {
            details = JSON.parse(parsed);
          } else if (parsed.education && typeof parsed.education === 'string' && parsed.education.startsWith('{')) {
            // Handle specific case where data is nested in education field (as seen in bug)
            try {
              details = JSON.parse(parsed.education);
            } catch (e) {
              details = parsed;
            }
          } else {
            details = parsed;
          }
        } catch (e) {
          details = { note: item.description };
        }

        return {
          id: item.alternative_id,
          name: item.name,
          ...details, // Spread the parsed details
          // Ensure defaults if missing in JSON
          email: details.email || "-",
          phone: details.phone || "-",
          education: details.education || "-",
          skills: Array.isArray(details.skills) ? details.skills : [],
          status: details.status || "Pending",
          date: details.date || "-",
        };
      });
      setCandidates(formattedData);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Statistik kecil
  const stats = useMemo(() => {
    const total = candidates.length;
    const pending = candidates.filter((c) => c.status === "Pending").length;
    const inReview = candidates.filter((c) => c.status === "In Review").length;
    const evaluated = candidates.filter((c) => c.status === "Evaluated").length;
    return { total, pending, inReview, evaluated };
  }, [candidates]);

  // Search + filter
  const filteredCandidates = useMemo(
    () =>
      candidates.filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus =
          statusFilter === "Semua Status" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [candidates, searchTerm, statusFilter]
  );

  const openAddForm = () => {
    setEditingCandidate(null);
    setIsFormOpen(true);
  };

  const openEditForm = (candidate) => {
    setEditingCandidate(candidate);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kandidat ini?")) {
      try {
        await deleteAlternative(selectedProjectId, id);
        fetchCandidates(selectedProjectId);
      } catch (error) {
        console.error("Failed to delete candidate:", error);
        alert("Gagal menghapus kandidat");
      }
    }
  };

  const STATUS_OPTIONS = ["Semua Status", "Pending", "In Review", "Evaluated"];

  function getStatusStyle(status) {
    switch (status) {
      case "Pending":
        return { badge: "bg-yellow-50 text-yellow-700", dot: "bg-yellow-400" };
      case "In Review":
        return { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-400" };
      case "Evaluated":
        return { badge: "bg-green-50 text-green-700", dot: "bg-green-400" };
      default:
        return { badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" };
    }
  }

  return (
    <>
      <Sidebar />
      <div className="ml-72 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6">
        <div className="space-y-6">
      {/* Card utama */}
      <section className="bg-white rounded-3xl shadow-card px-8 py-7 space-y-6">
        {/* Header + tombol tambah */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Manajemen Kandidat
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola data kandidat Software Engineer
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Project Selector */}
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
              onClick={openAddForm}
              disabled={!selectedProjectId}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold px-5 py-2.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-base">＋</span>
              <span>Tambah Kandidat</span>
            </button>
          </div>
        </div>

        {/* Search + filter + export */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Cari kandidat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>

            <button className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50/80 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 transition">
              <span className="text-base">⭳</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stat kecil */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">Total Kandidat</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-blue-100 flex items-center justify-center">
              <span className="text-blue-500 text-lg">👤</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-yellow-50/60 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-xl font-semibold text-yellow-600 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-500 text-lg">⏱</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-blue-50/60 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">In Review</p>
              <p className="text-xl font-semibold text-blue-600 mt-1">
                {stats.inReview}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-blue-100 flex items-center justify-center">
              <span className="text-blue-500 text-lg">👁️</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-green-50/70 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">Evaluated</p>
              <p className="text-xl font-semibold text-green-600 mt-1">
                {stats.evaluated}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-green-100 flex items-center justify-center">
              <span className="text-green-500 text-lg">✔</span>
            </div>
          </div>
        </div>

        {/* Tabel kandidat */}
        <CandidateList
          candidates={filteredCandidates}
          loading={loading}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onViewDetail={setDetailCandidate}
        />
      </section>

      {/* Modal Form Tambah / Edit */}
      {isFormOpen && (
        <CandidateForm
          projectId={selectedProjectId}
          initialData={editingCandidate}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => fetchCandidates(selectedProjectId)}
        />
      )}

      {/* Modal Detail Kandidat */}
      {detailCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Detail Kandidat
              </h2>
              <button
                onClick={() => setDetailCandidate(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-gray-500">Nama</p>
                <p className="font-medium text-gray-900">
                  {detailCandidate.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pendidikan</p>
                <p className="text-gray-700">
                  {detailCandidate.education || "-"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-gray-700">
                    {detailCandidate.email || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Telepon</p>
                  <p className="text-gray-700">
                    {detailCandidate.phone || "-"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Pengalaman</p>
                  <p className="text-gray-700">
                    {detailCandidate.experience || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ekspektasi Gaji</p>
                  <p className="text-gray-700">
                    {detailCandidate.salaryExpectation || "-"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Ketersediaan</p>
                <p className="text-gray-700">
                  {detailCandidate.availability || "-"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Portfolio</p>
                  <p className="text-gray-700 break-all">
                    {detailCandidate.portfolio || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">GitHub</p>
                  <p className="text-gray-700 break-all">
                    {detailCandidate.github || "-"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">LinkedIn</p>
                <p className="text-gray-700 break-all">
                  {detailCandidate.linkedin || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Keahlian</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {detailCandidate.skills?.length ? (
                    detailCandidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-blue-50 text-blue-600 px-2.5 py-0.5 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-xs">-</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1">
                  {(() => {
                    const statusStyle = getStatusStyle(detailCandidate.status);
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusStyle.badge}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${statusStyle.dot}`}
                        ></span>
                        {detailCandidate.status}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </>
  );
}



