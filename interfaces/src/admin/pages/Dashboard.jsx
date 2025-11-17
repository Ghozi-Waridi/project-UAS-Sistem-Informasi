import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ProgressChart from '../components/ProgressChart';
import QuickActions from '../components/QuickActions';
import EvaluationTable from '../components/EvaluationTable';
import ActivityList from '../components/ActivityList';

export default function Beranda() {

  // ⬇️ State untuk waktu & tanggal
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // ⬇️ Update waktu setiap detik
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const wibTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
      );

      const hours = wibTime.getHours().toString().padStart(2, "0");
      const minutes = wibTime.getMinutes().toString().padStart(2, "0");

      const dateString = wibTime.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setCurrentTime(`${hours}.${minutes}`);
      setCurrentDate(dateString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Hero welcome + waktu + profil admin */}
      <section className="bg-white rounded-3xl shadow-card px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Selamat Datang, Admin GDSS! <span className="inline-block">👋</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">
            Kelola sistem pendukung keputusan kelompok untuk seleksi Software
            Engineer
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="bg-blue-50 rounded-3xl px-6 py-4 text-center">
            {/* ⬇️ Jam Real-time WIB */}
            <div className="text-3xl font-semibold text-blue-600">
              {currentTime}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentDate}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md">
              AD
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">
                Admin GDSS
              </div>
              <div className="text-xs text-gray-400">System Administrator</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          icon="👤"
          label="Total Kandidat"
          value="47"
          subLabel="Bulan ini"
          badgeText="+8 baru"
          badgeColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon="✅"
          label="Evaluasi Selesai"
          value="32"
          subLabel="Dari 47 kandidat"
          badgeText="+12"
          badgeColor="bg-green-100 text-green-600"
        />
        <StatCard
          icon="🧠"
          label="Decision Maker Aktif"
          value="3"
          subLabel="Semua aktif"
          badgeText="100%"
          badgeColor="bg-purple-100 text-purple-600"
        />
        <StatCard
          icon="💡"
          label="Konsensus Tercapai"
          value="28"
          subLabel="Keputusan final"
          badgeText="+5"
          badgeColor="bg-yellow-100 text-yellow-600"
        />
      </section>

      {/* Middle section: chart + quick actions */}
      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <ProgressChart />
        <QuickActions />
      </section>

      {/* Bottom section: evaluation table + activity */}
            {/* Bottom section: evaluation table + activity */}
      <section
        id="evaluation-section"
        className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5"
      >
        <EvaluationTable />
        <ActivityList />
      </section>

    </div>
  );
}
