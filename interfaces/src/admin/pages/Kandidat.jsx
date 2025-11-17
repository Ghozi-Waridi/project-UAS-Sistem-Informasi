import React, { useMemo, useState } from "react";

const initialCandidates = [
  {
    id: 1,
    name: "Ahmad Rizki",
    education: "S1 Teknik Informatika",
    email: "ahmad.rizki@email.com",
    phone: "+62 812-3456-7890",
    experience: "3 tahun",
    salaryExpectation: "Rp 12.000.000",
    availability: "Segera",
    portfolio: "https://portfolio.com/ahmad",
    github: "https://github.com/ahmad",
    linkedin: "https://linkedin.com/in/ahmad",
    skills: ["React", "Node.js", "+2"],
    status: "Pending",
    date: "15/1/2024",
  },
  {
    id: 2,
    name: "Sari Dewi",
    education: "S1 Sistem Informasi",
    email: "sari.dewi@email.com",
    phone: "+62 813-9876-5432",
    experience: "5 tahun",
    salaryExpectation: "",
    availability: "2 minggu",
    portfolio: "",
    github: "",
    linkedin: "",
    skills: ["Vue.js", "Python", "+2"],
    status: "In Review",
    date: "12/1/2024",
  },
];

const STATUS_OPTIONS = ["Semua Status", "Pending", "In Review", "Evaluated"];

function getStatusStyle(status) {
  switch (status) {
    case "Pending":
      return {
        badge: "bg-yellow-50 text-yellow-700",
        dot: "bg-yellow-400",
      };
    case "In Review":
      return {
        badge: "bg-blue-50 text-blue-700",
        dot: "bg-blue-400",
      };
    case "Evaluated":
      return {
        badge: "bg-green-50 text-green-700",
        dot: "bg-green-400",
      };
    default:
      return {
        badge: "bg-gray-50 text-gray-600",
        dot: "bg-gray-400",
      };
  }
}

export default function Kandidat() {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailCandidate, setDetailCandidate] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    education: "",
    salaryExpectation: "",
    availability: "",
    portfolio: "",
    github: "",
    linkedin: "",
    skills: "",
    status: "Pending",
    date: "",
  });

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
          c.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "Semua Status" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [candidates, searchTerm, statusFilter]
  );

  const openAddForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      experience: "",
      education: "",
      salaryExpectation: "",
      availability: "",
      portfolio: "",
      github: "",
      linkedin: "",
      skills: "",
      status: "Pending",
      date: "",
    });
    setIsFormOpen(true);
  };

  const openEditForm = (candidate) => {
    setEditingId(candidate.id);
    setFormData({
      name: candidate.name || "",
      email: candidate.email || "",
      phone: candidate.phone || "",
      experience: candidate.experience || "",
      education: candidate.education || "",
      salaryExpectation: candidate.salaryExpectation || "",
      availability: candidate.availability || "",
      portfolio: candidate.portfolio || "",
      github: candidate.github || "",
      linkedin: candidate.linkedin || "",
      skills:
        candidate.skills?.filter((s) => !s.startsWith("+")).join(", ") || "",
      status: candidate.status || "Pending",
      date: candidate.date || "",
    });
    setIsFormOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                ...formData,
                skills: skillsArray.length ? skillsArray : [],
              }
            : c
        )
      );
    } else {
      const newCandidate = {
        id: Date.now(),
        ...formData,
        skills: skillsArray.length ? skillsArray : [],
      };
      setCandidates((prev) => [newCandidate, ...prev]);
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    const candidate = candidates.find((c) => c.id === id);
    const ok = window.confirm(
      `Hapus kandidat "${candidate?.name}" dari daftar?`
    );
    if (!ok) return;
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  return (
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

          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold px-5 py-2.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
          >
            <span className="text-base">＋</span>
            <span>Tambah Kandidat</span>
          </button>
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
        <div className="mt-2 rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-6 py-3">Kandidat</th>
                <th className="px-6 py-3">Kontak</th>
                <th className="px-6 py-3">Pengalaman</th>
                <th className="px-6 py-3">Keahlian</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCandidates.map((c) => {
                const statusStyle = getStatusStyle(c.status);
                return (
                  <tr key={c.id} className="hover:bg-gray-50/70">
                    <td className="px-6 py-4 align-top">
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {c.education}
                      </p>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <p className="text-xs text-gray-600">{c.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {c.phone}
                      </p>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <p className="text-sm text-gray-700">{c.experience}</p>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {c.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center rounded-full bg-blue-50 text-blue-600 px-2.5 py-0.5 text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusStyle.badge}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${statusStyle.dot}`}
                        ></span>
                        {c.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-top text-sm text-gray-700">
                      {c.date}
                    </td>

                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center justify-center gap-3 text-lg">
                        <button
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => setDetailCandidate(c)}
                          title="Lihat detail"
                        >
                          👁️
                        </button>
                        <button
                          className="text-green-500 hover:text-green-600"
                          onClick={() => openEditForm(c)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(c.id)}
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCandidates.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-6 text-center text-sm text-gray-500"
                    colSpan={7}
                  >
                    Tidak ada kandidat yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal Form Tambah / Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Kandidat" : "Tambah Kandidat"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={handleFormSubmit}>
              {/* Nama & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Nama Lengkap *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              {/* Telepon & Pengalaman */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Telepon *
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Pengalaman *
                  </label>
                  <input
                    name="experience"
                    value={formData.experience}
                    onChange={handleFormChange}
                    placeholder="contoh: 3 tahun"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              {/* Pendidikan & Ekspektasi Gaji */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Pendidikan *
                  </label>
                  <input
                    name="education"
                    value={formData.education}
                    onChange={handleFormChange}
                    placeholder="contoh: S1 Teknik Informatika"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Ekspektasi Gaji
                  </label>
                  <input
                    name="salaryExpectation"
                    value={formData.salaryExpectation}
                    onChange={handleFormChange}
                    placeholder="contoh: Rp 12.000.000"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Ketersediaan & Portfolio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Ketersediaan
                  </label>
                  <input
                    name="availability"
                    value={formData.availability}
                    onChange={handleFormChange}
                    placeholder="contoh: Segera, 2 minggu"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Portfolio
                  </label>
                  <input
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleFormChange}
                    placeholder="https://portfolio.com"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* GitHub & LinkedIn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    GitHub
                  </label>
                  <input
                    name="github"
                    value={formData.github}
                    onChange={handleFormChange}
                    placeholder="https://github.com/username"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    LinkedIn
                  </label>
                  <input
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleFormChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Keahlian */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">
                  Keahlian *
                </label>
                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleFormChange}
                  placeholder="React, Node.js, TypeScript (pisahkan dengan koma)"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                <p className="text-[11px] text-gray-400">
                  Pisahkan setiap keahlian dengan koma
                </p>
              </div>

              {/* Tanggal & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Tanggal
                  </label>
                  <input
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    placeholder="15/1/2024"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Evaluated">Evaluated</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-2xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 shadow-md hover:shadow-lg"
                >
                  {editingId ? "Simpan Perubahan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
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

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailCandidate(null)}
                className="px-4 py-2 rounded-2xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
