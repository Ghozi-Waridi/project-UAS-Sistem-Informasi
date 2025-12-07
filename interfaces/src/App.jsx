import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Import Admin Components
import Beranda from "./admin/pages/Beranda";
import Dashboard from "./admin/pages/Dashboard";
import DecisionMaker from "./admin/pages/DecisionMaker";
import Kandidat from "./admin/pages/Kandidat";
import Hasil from "./admin/pages/Hasil";

// Auth pages
import Login from "./admin/pages/Login";
import Register from "./admin/pages/Register";

// Import Decision Maker (DM) Components
import DashboardDM from "./dm/DashboardDM";
import KandidatList from "./dm/kandidateList";
import KandidatForm from "./dm/KandidatForm";
import KandidatDetail from "./dm/KandidatDetail";
import PenilaianForm from "./dm/PenilaianForm";
import HasilSeleksi from "./dm/HasilSeleksi";
import SemuaEvaluasi from "./dm/SemuaEvaluasi";
import DetailKonsensus from "./dm/DetailKonsensus";
import KandidatCardStatic from "./dm/KandidatCardStatic";
import HasilDM from "./dm/HasilDM";
import InputBobotKriteria from "./dm/InputBobotKriteria";

export default function App() {
  const location = useLocation();

  // Hide navbar on login & register pages
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";


  return (
    <div className="min-h-screen">

      <main
        className={
          location.pathname === "/"
            ? "w-full"
            : ""
        }
      >
        <Routes>

          {/* ========== AUTH ROUTES ========== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Default route - Landing Page */}
          <Route path="/" element={<Beranda />} />

          {/* ========== ADMIN ROUTES ========== */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/decision-maker" element={<DecisionMaker />} />
            <Route path="/kandidat" element={<Kandidat />} />
            <Route path="/hasil" element={<Hasil />} />
          </Route>

          {/* ========== DECISION MAKER (DM) ROUTES ========== */}
          <Route element={<ProtectedRoute allowedRoles={['dm']} />}>
            {/* Dashboard DM */}
            <Route path="/dm/dashboard" element={<DashboardDM />} />

            {/* Kandidat Management (Admin Feature - Hidden for DM MVP) */}
            {/* <Route path="/dm/kandidat" element={<KandidatList />} />
            <Route path="/dm/kandidat/tambah" element={<KandidatForm />} />
            <Route path="/dm/kandidat/:id" element={<KandidatDetail />} />
            <Route path="/dm/kandidat-card-static" element={<KandidatCardStatic />} /> */}

            {/* Evaluasi/Penilaian */}
            <Route path="/dm/penilaian/:projectId/:kandidatId" element={<PenilaianForm />} />
            <Route path="/dm/bobot-kriteria/:projectId" element={<InputBobotKriteria />} />
            {/* <Route path="/dm/evaluasi-semua" element={<SemuaEvaluasi />} /> */}

            {/* Hasil dan Konsensus */}
            <Route path="/dm/hasil" element={<HasilDM />} />
            <Route path="/dm/hasil-seleksi" element={<HasilSeleksi />} />
            {/* <Route path="/dm/konsensus-detail" element={<DetailKonsensus />} /> */}
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </main>
    </div>
  );
}



