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





// import React from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// // Import komponen Admin
// import TopNav from "./admin/components/TopNav";
// import Beranda from "./admin/pages/Beranda";
// import DashboardAdmin from "./admin/pages/DashboardAdmin";
// import DecisionMaker from "./admin/pages/DecisionMaker"; // Ini akan jadi layout untuk rute DM
// import Kandidat from "./admin/pages/Kandidat";
// import Hasil from "./admin/pages/Hasil";
// import Login from "./admin/pages/Login";
// import Register from "./admin/pages/Register";

// // Import komponen Decision Maker (DM)
// import DashboardDM from "./dm/DashboardDM";
// import KandidatList from "./dm/kandidateList"; // Perhatikan penulisan 'kandidateList'
// import KandidatForm from "./dm/KandidatForm";
// import PenilaianForm from "./dm/PenilaianForm";
// import HasilSeleksi from "./dm/HasilSeleksi";
// import SemuaEvaluasi from "./dm/SemuaEvaluasi";
// import DetailKonsensus from "./dm/DetailKonsensus";
// import KandidatCardStatic from "./dm/KandidatCardStatic";

// export default function App() {
//   const location = useLocation();

//   // Hide navbar on login & register pages
//   const hideNavbar =
//     location.pathname === "/login" ||
//     location.pathname === "/register";

//   return (
//     <div className="min-h-screen bg-soft">
//       {/* Navbar hanya tampil jika BUKAN di login/register */}
//       {!hideNavbar && <TopNav />}

//       <main
//         className={`${!hideNavbar ? "pt-32" : "pt-6"} max-w-6xl mx-auto pb-12 px-4`}
//       >
//         <Routes>

//           {/* ------------------------------------- */}
//           {/* RUTE OTENTIKASI             */}
//           {/* ------------------------------------- */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Default redirect: '/' akan mengarahkan ke '/login' */}
//           <Route path="/" element={<Navigate to="/login" replace />} />

//           {/* ------------------------------------- */}
//           {/* RUTE ADMIN                */}
//           {/* ------------------------------------- */}
//           <Route path="/beranda" element={<Beranda />} />
//           <Route path="/dashboard-admin" element={<DashboardAdmin />} />
//           <Route path="/kandidat" element={<Kandidat />} />
//           <Route path="/hasil" element={<Hasil />} />

//           {/* Catatan: Rute "/decision-maker" sudah ada di sini,
//               kita akan menggunakannya sebagai jalur utama/layout
//               untuk semua sub-rute DM. */}
//           <Route path="/decision-maker" element={<DecisionMaker />} />

//           {/* ------------------------------------- */}
//           {/* RUTE DECISION MAKER (DM)     */}
//           {/* Menggunakan NESTED ROUTES    */}
//           {/* ------------------------------------- */}
//           {/*
//             Kita membuat rute induk di /dm yang menggunakan DecisionMaker
//             sebagai layout (jika DecisionMaker berisi layout/navbar DM).
//             Jika tidak, kita langsung gunakan sub-rute /dm/path.
            
//             Berdasarkan kode Anda, saya akan membuat DecisionMaker
//             sebagai layout yang menampung semua rute DM di dalamnya.
//           */}
//           <Route path="/dm" element={<DecisionMaker />}>

//             {/* Rute Default DM, Redirect ke /dm/dashboard */}
//             <Route index element={<Navigate to="dashboard" replace />} />

//             <Route path="dashboard" element={<DashboardDM />} />

//             {/* Manajemen Kandidat */}
//             <Route path="kandidat" element={<KandidatList />} />
//             <Route path="kandidat/tambah" element={<KandidatForm />} />

//             {/* Evaluasi/Penilaian */}
//             <Route path="penilaian/:kandidatId" element={<PenilaianForm />} />
//             <Route path="evaluasi-semua" element={<SemuaEvaluasi />} />

//             {/* Hasil dan Konsensus */}
//             <Route path="hasil" element={<HasilSeleksi />} />
//             <Route path="konsensus-detail" element={<DetailKonsensus />} />

//             {/* Rute Tambahan */}
//             <Route path="kandidate-card-static" element={<KandidatCardStatic />} />

//           </Route>

//           {/* Catatan: Ada juga rute Admin "/decision-maker".
//              Jika DecisionMaker (admin page) sama dengan layout DM,
//              rute di atas bisa diganti menjadi:
//              <Route path="/decision-maker" element={<DecisionMaker />}>
//                  ... semua rute DM ...
//              </Route>
             
//              Saya asumsikan Anda ingin menggunakan DecisionMaker sebagai layout
//              atau halaman utama Decision Maker.
//           */}

//         </Routes>
//       </main>
//     </div>
//   );
// }