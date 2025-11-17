import React, { useState } from "react";
import {
    BsBarChartFill,
    BsFileEarmarkArrowUp,
    BsPrinter,
    BsPerson,
    BsCheckCircle,
    BsPersonBadge,
    BsXCircle,
    BsStar,
    BsGrid,
    BsListUl,
    BsGraphUp,
    BsCheckCircleFill,
} from "react-icons/bs";

// --- (SAMA) Data Dummy untuk TAB DETAIL ---
const dummyDetailHasil = [
    {
        id: 1,
        initials: "MI",
        nama: "Maya Indra Sari",
        posisi: "Senior Software Engineer",
        skorDM1: 9.0,
        skorDM2: 8.8,
        skorDM3: 9.2,
        skorAkhir: 9.0,
        keputusanTipe: "diterima",
        keputusanTeks: "Diterima",
    },
    {
        id: 2,
        initials: "SD",
        nama: "Sari Dewi Lestari",
        posisi: "Software Engineer",
        skorDM1: 8.5,
        skorDM2: 8.7,
        skorDM3: 8.3,
        skorAkhir: 8.5,
        keputusanTipe: "diterima",
        keputusanTeks: "Diterima",
    },
    {
        id: 3,
        initials: "AR",
        nama: "Ahmad Rizki Pratama",
        posisi: "Junior Software Engineer",
        skorDM1: 8.2,
        skorDM2: 7.8,
        skorDM3: 8.0,
        skorAkhir: 8.0,
        keputusanTipe: "interview",
        keputusanTeks: "Interview Lanjutan",
    },
    {
        id: 4,
        initials: "BS",
        nama: "Budi Santoso",
        posisi: "Software Engineer",
        skorDM1: 7.2,
        skorDM2: 7.5,
        skorDM3: 7.0,
        skorAkhir: 7.2,
        keputusanTipe: "ditolak",
        keputusanTeks: "Ditolak",
    },
];

// --- (SAMA) Data Dummy untuk TAB RINGKASAN ---
const dummyKandidatDiterima = [
    {
        id: 1,
        nama: "Maya Indra Sari",
        posisi: "Senior Software Engineer",
        mulai: "2024-02-01",
        skor: "9/10",
        gaji: "Rp 18.000.000",
    },
    {
        id: 2,
        nama: "Sari Dewi Lestari",
        posisi: "Software Engineer",
        mulai: "2024-02-15",
        skor: "8.5/10",
        gaji: "Rp 15.000.000",
    },
];

const dummyStatusLainnya = [
    {
        id: 3,
        nama: "Ahmad Rizki Pratama",
        posisi: "Junior Software Engineer",
        statusTeks: "Interview Lanjutan",
        skor: "8/10",
        tipe: "interview",
    },
    {
        id: 4,
        nama: "Budi Santoso",
        posisi: "Software Engineer",
        statusTeks: "Ditolak",
        skor: "7.2/10",
        tipe: "ditolak",
    },
];

// --- (BARU) Data Dummy untuk TAB ANALITIK ---
const analitikData = {
    distribusi: [
        { label: "Diterima", percentage: 50.0, color: "text-green-600" },
        {
            label: "Interview Lanjutan",
            percentage: 25.0,
            color: "text-blue-600",
        },
        { label: "Ditolak", percentage: 25.0, color: "text-red-600" },
    ],
    statistik: [
        { label: "Skor Tertinggi", value: "9.0/10", color: "text-green-600" },
        { label: "Skor Terendah", value: "7.2/10", color: "text-red-600" },
        { label: "Rata-rata", value: "8.2/10", color: "text-gray-800" },
    ],
};

// --- (SAMA) Komponen Kartu Statistik ---
function StatCard({ icon, value, title, bgColor, iconColor }) {
    // ... (kode StatCard tetap sama)
    return (
        <div className="bg-white p-5 rounded-lg shadow-sm flex items-center space-x-4">
            <div className={`${bgColor} ${iconColor} p-4 rounded-lg`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-gray-500">{title}</p>
            </div>
        </div>
    );
}

// --- (SAMA) Komponen Utama ---
function HasilSeleksi() {
    const [activeTab, setActiveTab] = useState("ringkasan");

    // --- (SAMA) Fungsi Helper untuk Badge Keputusan ---
    const getKeputusanBadge = (tipe, teks) => {
        // ... (kode getKeputusanBadge tetap sama)
        let classes = "";
        let icon = null;

        switch (tipe) {
            case "diterima":
                classes = "bg-green-100 text-green-800";
                icon = <BsCheckCircleFill className="mr-1.5" />;
                break;
            case "interview":
                classes = "bg-blue-100 text-blue-800";
                icon = <BsPersonBadge className="mr-1.5" />;
                break;
            case "ditolak":
                classes = "bg-red-100 text-red-800";
                icon = <BsXCircle className="mr-1.5" />;
                break;
            default:
                classes = "bg-gray-100 text-gray-800";
        }
        return (
            <span
                className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${classes}`}
            >
                {icon}
                {teks}
            </span>
        );
    };

    // --- (SAMA) Fungsi Helper untuk Warna Skor ---
    const getSkorColor = (skor) => {
        // ... (kode getSkorColor tetap sama)
        if (skor >= 9.0) return "text-green-600";
        if (skor >= 8.0) return "text-gray-800";
        return "text-red-600";
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* === (SAMA) Header === */}
                <div className="flex justify-between items-center mb-6">
                    {/* ... (kode header tetap sama) */}
                    <div>
                        <div className="flex items-center space-x-2">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Hasil Seleksi
                            </h1>
                            <BsBarChartFill className="text-2xl text-blue-500" />
                        </div>
                        <p className="text-gray-500 mt-1">
                            Hasil akhir proses seleksi Software Engineer berdasarkan konsensus
                            GDSS
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="flex items-center px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors font-semibold">
                            <BsFileEarmarkArrowUp className="mr-2" /> Export Laporan
                        </button>
                        <button className="flex items-center px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 hover:bg-green-100 transition-colors font-semibold">
                            <BsPrinter className="mr-2" /> Print
                        </button>
                    </div>
                </div>

                {/* === (SAMA) Stat Cards === */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                    {/* ... (kode 5 StatCard tetap sama) */}
                    <StatCard
                        icon={<BsPerson className="text-2xl" />}
                        value="4"
                        title="Total Kandidat"
                        bgColor="bg-blue-100"
                        iconColor="text-blue-600"
                    />
                    <StatCard
                        icon={<BsCheckCircle className="text-2xl" />}
                        value="2"
                        title="Diterima"
                        bgColor="bg-green-100"
                        iconColor="text-green-600"
                    />
                    <StatCard
                        icon={<BsPersonBadge className="text-2xl" />}
                        value="1"
                        title="Interview"
                        bgColor="bg-blue-100"
                        iconColor="text-blue-600"
                    />
                    <StatCard
                        icon={<BsXCircle className="text-2xl" />}
                        value="1"
                        title="Ditolak"
                        bgColor="bg-red-100"
                        iconColor="text-red-600"
                    />
                    <StatCard
                        icon={<BsStar className="text-2xl" />}
                        value="8.2"
                        title="Rata-rata Skor"
                        bgColor="bg-purple-100"
                        iconColor="text-purple-600"
                    />
                </div>

                {/* === (SAMA) Konten Tab === */}
                <div className="bg-white rounded-lg shadow-sm">
                    {/* (SAMA) Navigasi Tab */}
                    <div className="flex border-b border-gray-200 px-6">
                        <button
                            onClick={() => setActiveTab("ringkasan")}
                            className={`flex items-center px-1 py-4 text-base font-semibold ${activeTab === "ringkasan"
                                    ? "border-b-2 border-blue-600 text-blue-700"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <BsGrid className="mr-2" />
                            Ringkasan
                        </button>
                        <button
                            onClick={() => setActiveTab("detail")}
                            className={`flex items-center ml-8 px-1 py-4 text-base font-semibold ${activeTab === "detail"
                                    ? "border-b-2 border-blue-600 text-blue-700"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <BsListUl className="mr-2" />
                            Detail Hasil
                        </button>
                        <button
                            onClick={() => setActiveTab("analitik")}
                            className={`flex items-center ml-8 px-1 py-4 text-base font-semibold ${activeTab === "analitik"
                                    ? "border-b-2 border-blue-600 text-blue-700"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <BsGraphUp className="mr-2" />
                            Analitik
                        </button>
                    </div>

                    {/* (SAMA) Konten yang Ditampilkan */}
                    <div className="p-6">
                        {/* === (SAMA) TAB RINGKASAN === */}
                        {activeTab === "ringkasan" && (
                            <div>
                                {/* ... (kode tab ringkasan tetap sama) ... */}
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Ringkasan Hasil Seleksi
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                                    {/* Kolom Kandidat Diterima */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                            Kandidat Diterima
                                        </h3>
                                        <div className="space-y-4">
                                            {dummyKandidatDiterima.map((k) => (
                                                <div
                                                    key={k.id}
                                                    className="bg-green-50 border border-green-200 rounded-lg p-4"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-semibold text-lg text-gray-800">
                                                                {k.nama}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {k.posisi}
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Mulai: {k.mulai}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-lg text-green-700">
                                                                {k.skor}
                                                            </p>
                                                            <p className="text-sm text-gray-600">{k.gaji}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Kolom Status Lainnya */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                            Status Lainnya
                                        </h3>
                                        <div className="space-y-4">
                                            {dummyStatusLainnya.map((k) => (
                                                <div
                                                    key={k.id}
                                                    className={`border rounded-lg p-4 ${k.tipe === "interview"
                                                            ? "bg-blue-50 border-blue-200"
                                                            : "bg-red-50 border-red-200"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-semibold text-lg text-gray-800">
                                                                {k.nama}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {k.posisi}
                                                            </p>
                                                            <span
                                                                className={`mt-1 px-2 py-0.5 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${k.tipe === "interview"
                                                                        ? "bg-blue-100 text-blue-800"
                                                                        : "bg-red-100 text-red-800"
                                                                    }`}
                                                            >
                                                                {k.tipe === "interview" ? (
                                                                    <BsPersonBadge className="mr-1" />
                                                                ) : (
                                                                    <BsXCircle className="mr-1" />
                                                                )}
                                                                {k.statusTeks}
                                                            </span>
                                                        </div>
                                                        <p
                                                            className={`font-bold text-lg ${k.tipe === "interview"
                                                                    ? "text-blue-700"
                                                                    : "text-red-700"
                                                                }`}
                                                        >
                                                            {k.skor}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* === (SAMA) TAB DETAIL HASIL === */}
                        {activeTab === "detail" && (
                            <div>
                                {/* ... (kode tab detail tetap sama) ... */}
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Detail Hasil Evaluasi
                                </h2>
                                <div className="overflow-x-auto mt-4">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Kandidat
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Posisi
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Skor DM1
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Skor DM2
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Skor DM3
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Skor Akhir
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Keputusan
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {dummyDetailHasil.map((k) => (
                                                <tr key={k.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                                {k.initials}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {k.nama}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {k.posisi}
                                                    </td>
                                                    <td
                                                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getSkorColor(
                                                            k.skorDM1
                                                        )}`}
                                                    >
                                                        {k.skorDM1.toFixed(1)}
                                                    </td>
                                                    <td
                                                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getSkorColor(
                                                            k.skorDM2
                                                        )}`}
                                                    >
                                                        {k.skorDM2.toFixed(1)}
                                                    </td>
                                                    <td
                                                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getSkorColor(
                                                            k.skorDM3
                                                        )}`}
                                                    >
                                                        {k.skorDM3.toFixed(1)}
                                                    </td>
                                                    <td
                                                        className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getSkorColor(
                                                            k.skorAkhir
                                                        )}`}
                                                    >
                                                        {k.skorAkhir.toFixed(1)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getKeputusanBadge(k.keputusanTipe, k.keputusanTeks)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* === (BARU) TAB ANALITIK === */}
                        {activeTab === "analitik" && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Analitik Proses Seleksi
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                                    {/* Kolom Distribusi Keputusan */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                            Distribusi Keputusan
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                                            {analitikData.distribusi.map((item) => (
                                                <div
                                                    key={item.label}
                                                    className="flex justify-between items-center"
                                                >
                                                    <span className="text-gray-600">{item.label}</span>
                                                    <span
                                                        className={`font-semibold ${item.color}`}
                                                    >
                                                        {item.percentage.toFixed(1)}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Kolom Statistik Skor */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                            Statistik Skor
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                                            {analitikData.statistik.map((item) => (
                                                <div
                                                    key={item.label}
                                                    className="flex justify-between items-center"
                                                >
                                                    <span className="text-gray-600">{item.label}</span>
                                                    <span
                                                        className={`font-bold text-lg ${item.color}`}
                                                    >
                                                        {item.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HasilSeleksi;