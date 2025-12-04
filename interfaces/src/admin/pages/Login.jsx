import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({
        email: email,
        password: password,
      });

      const userRole = response.user?.role;

      if (userRole === "admin") {
        navigate("/dashboard");
      } else if (userRole === "dm") {
        navigate("/dm/dashboard");
      } else {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
            <p className="text-gray-500 text-sm">Welcome to GDSS Pro – Let's login to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="hi@filianta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  disabled={loading}
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-gray-500 mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Create one here
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
              Enter<br />
              the Future<br />
              of Decision<br />
              Making, today
            </h2>
          </div>

          {/* Card Preview */}
          <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-3xl font-bold text-white mb-1">Advanced Analytics</div>
              <div className="text-sm text-blue-200">Group Decision Support System</div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-blue-200">Decision Accuracy</span>
                <span className="text-sm font-bold text-white">94.5%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{width: '94.5%'}}></div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-blue-200">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                TOPSIS Method
              </span>
              <button className="text-white font-semibold hover:underline">
                View All →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
