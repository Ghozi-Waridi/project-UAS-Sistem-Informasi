import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [userType, setUserType] = useState("decision-maker");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: ganti dengan logic register beneran
    console.log("Registrasi sebagai:", userType);
  };

  return (
    <div className="min-h-screen bg-soft flex items-center justify-center px-4">
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
                  userType === "admin"
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
                  userType === "decision-maker"
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
            {/* Nama lengkap */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
              />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Username
              </label>
              <input
                type="text"
                placeholder="Masukkan username"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
              />
            </div>

            {/* Email (opsional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Email (opsional)
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="Buat password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
              />
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">
                Konfirmasi Password
              </label>
              <input
                type="password"
                placeholder="Ulangi password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
              />
            </div>

            {/* Tombol daftar */}
            <button
              type="submit"
              className="w-full mt-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold py-2.5 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition"
            >
              <span>Buat akun {userType === "admin" ? "Admin" : "Decision Maker"}</span>
              <span className="text-base">✅</span>
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
