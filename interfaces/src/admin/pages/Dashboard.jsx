import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ProgressChart from '../components/ProgressChart';
import QuickActions from '../components/QuickActions';
import EvaluationTable from '../components/EvaluationTable';
import ActivityList from '../components/ActivityList';
import CriteriaList from '../components/CriteriaList';
import CriteriaForm from '../components/CriteriaForm';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/projectService';
import { getAlternativesByProject } from '../../services/alternativeService';
import { getProjectDecisionMakers } from '../../services/projectService';
import { getCurrentUser } from '../../services/authService';

export default function Dashboard() {
  const [user, setUser] = useState(getCurrentUser());

  // ⬇️ State untuk waktu & tanggal
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // ⬇️ State untuk Data Project & Stats
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeDMs: 0,
    completedEvaluations: 0, // Placeholder
    consensusReached: 0 // Placeholder
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newAggregationMethod, setNewAggregationMethod] = useState("BORDA");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: "", description: "", aggregation_method: "BORDA" });

  // ⬇️ State untuk Criteria
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [criteriaRefreshKey, setCriteriaRefreshKey] = useState(0);

  const handleOpenCriteriaModal = (criteria = null) => {
    setEditingCriteria(criteria);
    setShowCriteriaModal(true);
  };

  const handleCloseCriteriaModal = () => {
    setEditingCriteria(null);
    setShowCriteriaModal(false);
  };

  // ⬇️ Update waktu setiap detik
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const wibTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
      );

      const hours = wibTime.getHours().toString().padStart(2, "0");
      const minutes = wibTime.getMinutes().toString().padStart(2, "0");

      const dateString = wibTime.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setCurrentTime(`${hours}.${minutes}`);
      setCurrentDate(dateString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // ⬇️ Fetch Projects on Mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // ⬇️ Fetch Stats when Selected Project Changes
  useEffect(() => {
    if (selectedProject) {
      const projectId = selectedProject.ID || selectedProject.project_id;
      if (projectId) {
        fetchProjectStats(projectId);
      }
    }
  }, [selectedProject]); // Refresh stats when DM list updates

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
      if (data && data.length > 0) {
        setSelectedProject(data[0]); // Default to first project
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const [candidates, setCandidates] = useState([]);
  const [dms, setDms] = useState([]);

  const fetchProjectStats = async (projectId) => {
    try {
      const [candidatesData, dmsData] = await Promise.all([
        getAlternativesByProject(projectId),
        getProjectDecisionMakers(projectId)
      ]);

      setCandidates(candidatesData || []);
      setDms(dmsData || []);

      setStats({
        totalCandidates: candidatesData ? candidatesData.length : 0,
        activeDMs: dmsData ? dmsData.length : 0,
        completedEvaluations: 0, // Logic to calculate this needs backend support or complex frontend logic
        consensusReached: 0 // Logic to calculate this needs backend support
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const newProject = await createProject({
        project_name: newProjectName,
        description: newProjectDescription,
        aggregation_method: newAggregationMethod
      });
      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
      setShowCreateModal(false);
      setNewProjectName("");
      setNewProjectDescription("");
      setNewAggregationMethod("BORDA");
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Gagal membuat project");
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      const updatedProject = await updateProject(selectedProject.ID || selectedProject.project_id, {
        project_name: editData.name,
        description: editData.description,
        aggregation_method: editData.aggregation_method
      });

      // Update local state
      const updatedProjects = projects.map(p =>
        (p.ID || p.project_id) === (updatedProject.ID || updatedProject.project_id) ? updatedProject : p
      );
      setProjects(updatedProjects);
      setSelectedProject(updatedProject);
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Gagal mengupdate project");
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    if (!window.confirm(`Apakah Anda yakin ingin menghapus project "${selectedProject.name || selectedProject.project_name}"?`)) return;

    try {
      await deleteProject(selectedProject.ID || selectedProject.project_id);

      const remainingProjects = projects.filter(p => (p.ID || p.project_id) !== (selectedProject.ID || selectedProject.project_id));
      setProjects(remainingProjects);
      setSelectedProject(remainingProjects.length > 0 ? remainingProjects[0] : null);
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Gagal menghapus project");
    }
  };

  const openEditModal = () => {
    if (selectedProject) {
      setEditData({
        name: selectedProject.name || selectedProject.project_name,
        description: selectedProject.description || "",
        aggregation_method: selectedProject.aggregation_method || "BORDA"
      });
      setShowEditModal(true);
    }
  };

  return (
    <div className="space-y-6">

      {/* Hero welcome + waktu + profil admin */}
      <section className="bg-white rounded-3xl shadow-card px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Selamat Datang, {user?.name || 'Admin'}! <span className="inline-block">👋</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">
            {selectedProject
              ? `Project Aktif: ${selectedProject.name || selectedProject.project_name}`
              : "Pilih atau buat project untuk memulai"}
          </p>
        </div>

        <div className="flex items-center gap-5">
          {/* Project Selector / Creator */}
          <div className="flex items-center gap-2">
            {projects.length > 0 ? (
              <>
                <select
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={selectedProject?.ID || selectedProject?.project_id || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    const proj = projects.find(p => (p.ID || p.project_id) === val);
                    setSelectedProject(proj);
                  }}
                >
                  {projects.map(p => (
                    <option key={p.ID || p.project_id} value={p.ID || p.project_id}>{p.name || p.project_name}</option>
                  ))}
                </select>
                <button
                  onClick={openEditModal}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit Project"
                >
                  ✏️
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Hapus Project"
                >
                  🗑️
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
              >
                + Buat Project Baru
              </button>
            )}

            {projects.length > 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
                title="Buat Project Baru"
              >
                +
              </button>
            )}
          </div>

          <div className="bg-blue-50 rounded-3xl px-6 py-4 text-center hidden md:block">
            {/* ⬇️ Jam Real-time WIB */}
            <div className="text-3xl font-semibold text-blue-600">
              {currentTime}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentDate}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-gray-800">
                {user?.name || 'Admin'}
              </div>
              <div className="text-xs text-gray-400 capitalize">{user?.role || 'Administrator'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          icon="👤"
          label="Total Kandidat"
          value={stats.totalCandidates.toString()}
          subLabel="Dalam project ini"
          badgeText="Live"
          badgeColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon="✅"
          label="Evaluasi Selesai"
          value={stats.completedEvaluations.toString()}
          subLabel="Placeholder"
          badgeText="-"
          badgeColor="bg-green-100 text-green-600"
        />
        <StatCard
          icon="🧠"
          label="Decision Maker"
          value={stats.activeDMs.toString()}
          subLabel="Aktif"
          badgeText="Active"
          badgeColor="bg-purple-100 text-purple-600"
        />
        <StatCard
          icon="💡"
          label="Konsensus"
          value={stats.consensusReached.toString()}
          subLabel="Placeholder"
          badgeText="-"
          badgeColor="bg-yellow-100 text-yellow-600"
        />
      </section>

      {/* Middle section: chart + quick actions */}
      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <ProgressChart />
        <QuickActions />
      </section>

      {/* Bottom section: evaluation table + activity */}
      <section
        id="evaluation-section"
        className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5"
      >
        <EvaluationTable candidates={candidates} />
        <ActivityList />
      </section>

      {/* Criteria Section */}
      {selectedProject && (
        <section className="grid grid-cols-1 gap-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Manajemen Kriteria</h2>
            <button
              onClick={() => handleOpenCriteriaModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              + Tambah Kriteria
            </button>
          </div>
          <CriteriaList
            key={criteriaRefreshKey}
            projectId={selectedProject.ID || selectedProject.project_id}
            onEdit={handleOpenCriteriaModal}
          />
        </section>
      )}

      {/* Criteria Modal */}
      {showCriteriaModal && selectedProject && (
        <CriteriaForm
          projectId={selectedProject.ID || selectedProject.project_id}
          initialData={editingCriteria}
          onClose={handleCloseCriteriaModal}
          onSuccess={() => {
            setCriteriaRefreshKey(prev => prev + 1);
          }}
        />
      )}



      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Buat Project Baru</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Project</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: Seleksi SE Batch 1"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Deskripsi project..."
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Metode Agregasi</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newAggregationMethod}
                  onChange={(e) => setNewAggregationMethod(e.target.value)}
                >
                  <option value="BORDA">Borda</option>
                  <option value="COPELAND">Copeland</option>
                  <option value="LAINNYA">Lainnya</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Buat Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Edit Project</h2>
            <form onSubmit={handleUpdateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Project</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Metode Agregasi</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editData.aggregation_method}
                  onChange={(e) => setEditData({ ...editData, aggregation_method: e.target.value })}
                >
                  <option value="BORDA">Borda</option>
                  <option value="COPELAND">Copeland</option>
                  <option value="LAINNYA">Lainnya</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



    </div>
  );
}
