import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

export default function Register() {
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

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company_name: formData.companyName,
      });

      alert("Registrasi Admin berhasil! Silakan login dengan akun Anda.");
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
          <Link to="/" className="text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-colors font-medium text-sm mb-8">
            <span>←</span> Kembali
          </Link>

          {/* Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-3xl font-bold text-white">G</span>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Admin Account</h1>
            <p className="text-gray-500 text-sm">Welcome to GDSS Pro – Register your company and start managing decisions</p>
          </div>

          {/* Info Box */}
          <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
            <p className="font-semibold mb-1">👤 Admin Registration</p>
            <p className="text-xs text-blue-600">After registration, you can add Decision Makers for your company from the dashboard.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Company Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="hi@yourcompany.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create password (min. 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold py-3.5 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Create Admin Account</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-gray-500 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Title */}
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Join Us &<br />
              Start Making<br />
              Better Decisions,<br />
              today
            </h2>
          </div>

          {/* Card Preview */}
          <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-3xl font-bold text-white mb-1">Enterprise Ready</div>
              <div className="text-sm text-blue-200">Collaborative Platform</div>
            </div>

            <div className="space-y-3">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                <span className="text-sm text-blue-100">Multi-criteria Analysis</span>
                <span className="text-xl">✓</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                <span className="text-sm text-blue-100">Team Collaboration</span>
                <span className="text-xl">✓</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                <span className="text-sm text-blue-100">Real-time Analytics</span>
                <span className="text-xl">✓</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-blue-200">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Active Now
              </span>
              <button className="text-white font-semibold hover:underline">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
