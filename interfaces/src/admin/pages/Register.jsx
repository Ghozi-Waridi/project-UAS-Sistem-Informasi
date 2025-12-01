import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

export default function Register() {
  const [userType, setUserType] = useState("admin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      // Call register API
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company_name: formData.companyName,
      });

      // Show success message and redirect to login
      alert("Registrasi berhasil! Silakan login dengan akun Anda.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.error || err.message || "Registrasi gagal. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft flex items-center justify-center px-4 relative">
      <Link to="/" className="absolute top-6 left-6 text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors font-medium text-sm">
        <span>←</span> Kembali ke Beranda
      </Link>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-b from-indigo-500 to-blue-500 px-8 py-8 text-center text-white">
          <div className="w-14 h-14 rounded-full bg-white/10 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📝</span>
          </div>
          <h1 className="text-2xl font-semibold">Registrasi GDSS</h1>
          <p className="text-sm text-blue-100 mt-1">
            Buat akun baru untuk menggunakan sistem
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-7 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}

          {/* Tipe pengguna - Only Admin for registration */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Tipe Pengguna
            </p>
            <div className="rounded-2xl border border-blue-500 bg-blue-50 text-blue-600 shadow-sm px-4 py-3 text-sm font-medium text-center">
              <span className="mr-2 text-lg">👤</span>
              Admin (Pemilik Perusahaan)
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Akun admin akan dibuat untuk perusahaan baru. Decision Maker dapat ditambahkan setelah login.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nama Perusahaan */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Nama Perusahaan *
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Masukkan nama perusahaan"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Nama lengkap */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Password *
              </label>
              <input
                type="password"
                name="password"
                placeholder="Buat password (min. 6 karakter)"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Konfirmasi Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Ulangi password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Tombol daftar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold py-2.5 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Buat Akun Admin</span>
                  <span className="text-base">✅</span>
                </>
              )}
            </button>
          </form>

          {/* Link ke login */}
          <p className="text-xs text-center text-gray-500">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
