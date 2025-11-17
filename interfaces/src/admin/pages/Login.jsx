import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [userType, setUserType] = useState("decision-maker"); // "admin" | "decision-maker"
  const isAdmin = userType === "admin";

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Logika redirect sederhana
    if (isAdmin) {
      // Jika memilih Admin → ke Dashboard Admin
      navigate("/dashboard-admin");
    } else {
      // Jika memilih Decision Maker → ke Beranda (atau halaman lain kalau mau)
      navigate("/beranda");
    }
  };

  return (
    <div className="min-h-screen bg-soft flex items-center justify-center px-4">
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
          {/* Tipe pengguna */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Tipe Pengguna
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("admin")}
                className={`flex flex-col items-center justify-center rounded-2xl border px-4 py-3 text-sm font-medium transition
                ${
                  isAdmin
                    ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                    : "border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50/40"
                }`}
              >
                <span className="mb-1 text-lg">👤</span>
                Admin
              </button>
              <button
                type="button"
                onClick={() => setUserType("decision-maker")}
                className={`flex flex-col items-center justify-center rounded-2xl border px-4 py-3 text-sm font-medium transition
                ${
                  !isAdmin
                    ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                    : "border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50/40"
                }`}
              >
                <span className="mb-1 text-lg">🧠</span>
                Decision Maker
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                  👤
                </span>
                <input
                  type="text"
                  placeholder="Masukkan username"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  required
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
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  required
                />
              </div>
            </div>

            {/* Lupa password & remember (opsional) */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-500">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Ingat saya</span>
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Lupa password?
              </button>
            </div>

            {/* Tombol login */}
            <button
              type="submit"
              className="w-full mt-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold py-2.5 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
            >
              <span>Login sebagai {isAdmin ? "Admin" : "Decision Maker"}</span>
              <span className="text-base">↪️</span>
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
