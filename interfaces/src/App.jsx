import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import TopNav from "./admin/components/TopNav";

import Beranda from "./admin/pages/Beranda";
import Dashboard from "./admin/pages/Dashboard";
import DecisionMaker from "./admin/pages/DecisionMaker";
import Kandidat from "./admin/pages/Kandidat";
import Hasil from "./admin/pages/Hasil";

// Auth pages
import Login from "./admin/pages/Login";
import Register from "./admin/pages/Register";

export default function App() {
  const location = useLocation();

  // Hide navbar on login & register pages
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-h-screen bg-soft">

      {/* Navbar hanya tampil jika BUKAN di login/register */}
      {!hideNavbar && <TopNav />}

      <main
        className={`${!hideNavbar ? "pt-32" : "pt-6"} max-w-6xl mx-auto pb-12 px-4`}
      >
        <Routes>

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin pages */}
          <Route path="/beranda" element={<Beranda />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/decision-maker" element={<DecisionMaker />} />
          <Route path="/kandidat" element={<Kandidat />} />
          <Route path="/hasil" element={<Hasil />} />

        </Routes>
      </main>
    </div>
  );
}
