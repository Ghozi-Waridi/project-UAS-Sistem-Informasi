import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

export default function Login() {
  // const [userType, setUserType] = useState("decision-maker"); // Removed manual role selection
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const isAdmin = userType === "admin"; // No longer needed
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call API login
      const response = await login({
        email: email,
        password: password,
      });

      // Redirect based on user role from response
      const userRole = response.user?.role;

      if (userRole === "admin") {
        navigate("/dashboard");
      } else if (userRole === "dm") {
        navigate("/dm/dashboard");
      } else {
        // Default fallback if role is unknown
        navigate("/dm/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login gagal. Periksa email dan password Anda.");
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
        {/* Header gradient */}
        <div className="bg-gradient-to-b from-indigo-500 to-blue-500 px-8 py-8 text-center text-white">
          <div className="w-14 h-14 rounded-full bg-white/10 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-semibold">Login GDSS</h1>
          <p className="text-sm text-blue-100 mt-1">
            Sistem Pendukung Keputusan Kelompok
          </p>
        </div>

        {/* Body form */}
        <div className="px-8 py-7 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}

          {/* Tipe pengguna selector removed as role is determined by backend */}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                  📧
                </span>
                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                  🔒
                </span>
                <input
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Ingat saya & lupa password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-500">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span>Ingat saya</span>
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
                disabled={loading}
              >
                Lupa password?
              </button>
            </div>

            {/* Tombol login */}
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
                  <span>Masuk ke Dashboard</span>
                  <span className="text-base">↪️</span>
                </>
              )}
            </button>
          </form>

          {/* Link ke register */}
          <p className="text-xs text-center text-gray-500">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
