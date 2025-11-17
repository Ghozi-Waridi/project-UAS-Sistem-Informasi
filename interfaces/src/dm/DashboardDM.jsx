import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    BsPerson,
    BsCheckLg,
    BsClock,
    BsStar,
    BsPersonCircle,
    BsEye,
    BsCheckCircleFill,
    BsClockFill,
    BsPeopleFill,
} from "react-icons/bs";
import {
    FaFilter,
    FaFileExport,
    FaBriefcase,
    FaGraduationCap,
    FaDownload,
    FaStar as FaStarFill,
    FaPencilAlt,
    FaChevronDown,
    FaCheck,
} from "react-icons/fa";

// Data dummy (TIDAK ADA PERUBAHAN DI BAGIAN DATA DUMMY)
const dummyEvaluasiTerbaru = [
    {
        id: 1,
        nama: "Maya Indra Sari",
        waktu: "2 jam lalu",
        skor: "9/10",
        statusColor: "text-green-600",
    },
    {
        id: 2,
        nama: "Sari Dewi Lestari",
        waktu: "1 hari lalu",
        skor: "8.5/10",
        statusColor: "text-green-600",
    },
    {
        id: 3,
        nama: "Rudi Hermawan",
        waktu: "2 hari lalu",
        skor: "7.2/10",
        statusColor: "text-green-600",
    },
];

const dummyStatusEvaluator = [
    {
        id: 1,
        nama: "Decision Maker 1 (Anda)",
        status: "Selesai",
        progress: 67,
        progressText: "8/12 kandidat",
        icon: "check",
    },
    {
        id: 2,
        nama: "Decision Maker 2",
        status: "Selesai",
        progress: 100,
        progressText: "12/12 kandidat",
        icon: "check",
    },
    {
        id: 3,
        nama: "Decision Maker 3",
        status: "Berlangsung",
        progress: 42,
        progressText: "5/12 kandidat",
        icon: "clock",
    },
];

const dummyKandidat = [
    {
        id: 1,
        initials: "AR",
        nama: "Ahmad Rizki Pratama",
        email: "ahmad.rizki@email.com",
        pengalaman: "3 tahun",
        pendidikan: "S1 Teknik Informatika",
        skill: ["React", "Node.js", "TypeScript", "MongoDB"],
        status: "Menunggu Penilaian",
        avgRating: "8.2/1/0",
        yourRating: null,
    },
    {
        id: 2,
        initials: "SD",
        nama: "Sari Dewi Lestari",
        email: "sari.dewi@email.com",
        pengalaman: "5 tahun",
        pendidikan: "S1 Sistem Informasi",
        skill: ["Vue.js", "Python", "PostgreSQL", "Docker"],
        status: "Sudah Dinilai",
        avgRating: "8.1/10",
        yourRating: "8.5/10",
    },
    {
        id: 3,
        initials: "BS",
        nama: "Budi Santoso",
        email: "budi.santoso@email.com",
        pengalaman: "2 tahun",
        pendidikan: "S1 Teknik Komputer",
        skill: ["Angular", "Java", "Spring Boot", "MySQL"],
        status: "Menunggu Penilaian",
        avgRating: "7.8/10",
        yourRating: null,
    },
    {
        id: 4,
        initials: "MI",
        nama: "Maya Indra Sari",
        email: "maya.indra@email.com",
        pengalaman: "4 tahun",
        pendidikan: "S1 Teknik Informatika",
        skill: ["React Native", "Flutter", "Firebase", "GraphQL"],
        status: "Sudah Dinilai",
        avgRating: "8.7/10",
        yourRating: "9/10",
    },
];

// Komponen Kartu Statistik (TIDAK ADA PERUBAHAN)
function StatCard({ icon, color, value, title, badge }) {
    const colors = {
        blue: {
            bg: "bg-blue-100",
            text: "text-blue-600",
            badge: "text-green-600",
        },
        green: {
            bg: "bg-green-100",
            text: "text-green-600",
            badge: "text-gray-600",
        },
        yellow: {
            bg: "bg-yellow-100",
            text: "text-yellow-600",
            badge: "text-gray-600",
        },
        purple: {
            bg: "bg-purple-100",
            text: "text-purple-600",
            badge: "text-purple-600",
        },
    };
    const c = colors[color] || colors.blue;
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
                <div className={`${c.bg} ${c.text} p-4 rounded-lg`}>{icon}</div>
                <span className="text-3xl font-bold text-gray-800">{value}</span>
            </div>
            <div className="mt-2">
                <p className="text-gray-500">{title}</p>
                <span className={`${c.badge} font-semibold text-sm`}>{badge}</span>
            </div>
        </div>
    );
}

// Komponen Utama Dashboard
function DashboardDM() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [openDetailId, setOpenDetailId] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const filterRef = useRef(null);

    useEffect(() => {
        const timerID = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => {
            clearInterval(timerID);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filterRef]);

    const toggleDetail = (kandidatId) => {
        setOpenDetailId(openDetailId === kandidatId ? null : kandidatId);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setIsFilterOpen(false);
        setOpenDetailId(null);
        console.log(`Filter diubah menjadi: ${status}`);
    };

    const handleExport = () => {
        console.log("Fungsi Export dipanggil. Implementasi logika export di sini.");
    };

    const filteredKandidat = dummyKandidat.filter(kandidat => {
        if (filterStatus === 'all') {
            return true;
        }
        if (filterStatus === 'menunggu') {
            return kandidat.status === "Menunggu Penilaian";
        }
        if (filterStatus === 'dinilai') {
            return kandidat.status === "Sudah Dinilai";
        }
        return true;
    });

    const getFilterLabel = () => {
        switch (filterStatus) {
            case 'menunggu':
                return 'Menunggu Penilaian';
            case 'dinilai':
                return 'Sudah Dinilai';
            default:
                return 'Semua Status';
        }
    };

    const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
    };
    const formattedTime = new Intl.DateTimeFormat("id-ID", timeOptions)
        .format(currentDateTime)
        .replace(":", ".");

    const dateOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
    };
    const formattedDate = new Intl.DateTimeFormat("id-ID", dateOptions).format(
        currentDateTime
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Dashboard (TIDAK BERUBAH) */}
                <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Dashboard Decision Maker
                            </h1>
                            <span className="text-2xl">🎯</span>
                        </div>
                        <p className="text-gray-500 mt-1">
                            Evaluasi kandidat Software Engineer dan berikan penilaian Anda
                        </p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="bg-green-50 rounded-lg px-4 py-2 text-right">
                            <p className="font-bold text-xl text-green-700">
                                {formattedTime}
                            </p>
                            <p className="text-sm text-green-600">{formattedDate}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="bg-green-600 text-white p-2 rounded-full">
                                <BsPersonCircle className="text-3xl" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Decision Maker 1</p>
                                <p className="text-sm text-gray-500">
                                    Senior Technical Evaluator
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Statistik 4 Kartu (TIDAK BERUBAH) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<BsPerson className="text-2xl" />}
                        color="blue"
                        value="12"
                        title="Total Kandidat"
                        badge="+3 baru"
                    />
                    <StatCard
                        icon={<BsCheckLg className="text-2xl" />}
                        color="green"
                        value="8"
                        title="Sudah Dievaluasi"
                        badge="67% selesai"
                    />
                    <StatCard
                        icon={<BsClock className="text-2xl" />}
                        color="yellow"
                        value="4"
                        title="Menunggu Evaluasi"
                        badge="33% tersisa"
                    />
                    <StatCard
                        icon={<BsStar className="text-2xl" />}
                        color="purple"
                        value="7.8"
                        title="Rata-rata Skor"
                        badge="+0.3 dari target"
                    />
                </div>

                {/* Konten Bawah (Daftar Kandidat & Progress Baru) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Daftar Kandidat */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                        {/* Header Daftar Kandidat */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Daftar Kandidat Software Engineer
                            </h3>
                            <div className="flex space-x-3">
                                {/* KOMPONEN FILTER DENGAN DROPDOWN */}
                                <div className="relative" ref={filterRef}>
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <FaFilter className="mr-2 text-gray-500" />
                                        <span className="font-semibold">{getFilterLabel()}</span>
                                        <FaChevronDown className={`ml-2 w-3 h-3 transition-transform ${isFilterOpen ? 'rotate-180' : 'rotate-0'}`} />
                                    </button>

                                    {isFilterOpen && (
                                        <div className="absolute z-10 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none right-0">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handleFilterChange('all')}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                                                >
                                                    Semua Kandidat
                                                    {filterStatus === 'all' && <FaCheck className="text-blue-600 w-3 h-3" />}
                                                </button>
                                                <button
                                                    onClick={() => handleFilterChange('menunggu')}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                                                >
                                                    Menunggu Penilaian
                                                    {filterStatus === 'menunggu' && <FaCheck className="text-blue-600 w-3 h-3" />}
                                                </button>
                                                <button
                                                    onClick={() => handleFilterChange('dinilai')}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                                                >
                                                    Sudah Dinilai
                                                    {filterStatus === 'dinilai' && <FaCheck className="text-blue-600 w-3 h-3" />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* END KOMPONEN FILTER */}


                                <button
                                    onClick={handleExport}
                                    className="flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 hover:bg-green-100 transition-colors"
                                >
                                    <FaFileExport className="mr-2" /> Export
                                </button>
                            </div>
                        </div>

                        {/* List Kandidat */}
                        <div className="space-y-6">
                            {filteredKandidat.map((kandidat) => (
                                <div
                                    key={kandidat.id}
                                    className={`border rounded-lg p-5 transition-all duration-300 ${openDetailId === kandidat.id ? 'border-blue-400 shadow-lg' : 'border-gray-200'}`}
                                >
                                    {/* Info Atas */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-4">
                                            {/* Inisial */}
                                            <div className="shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                {kandidat.initials}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg text-gray-800">
                                                    {kandidat.nama}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {kandidat.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`px-3 py-1 text-sm font-semibold rounded-full ${kandidat.status === "Menunggu Penilaian"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-green-100 text-green-800"
                                                    }`}
                                            >
                                                {kandidat.status}
                                            </span>
                                            <div className="text-gray-500 text-sm mt-2">
                                                Rata-rata:{" "}
                                                <span className="font-bold text-gray-800">
                                                    {kandidat.avgRating}
                                                </span>
                                            </div>
                                            {kandidat.yourRating && (
                                                <div className="text-green-600 text-sm">
                                                    Skor Anda:{" "}
                                                    <span className="font-bold">
                                                        {kandidat.yourRating}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info Tengah (Pengalaman & Pendidikan) */}
                                    <div className={`flex items-center space-x-6 text-gray-600 text-sm mb-4 ${openDetailId === kandidat.id ? '' : 'ml-16'}`}>
                                        <div className="flex items-center space-x-2">
                                            <FaBriefcase />
                                            <span>{kandidat.pengalaman}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FaGraduationCap />
                                            <span>{kandidat.pendidikan}</span>
                                        </div>
                                    </div>

                                    {/* Keahlian */}
                                    <div className={`mb-5 ${openDetailId === kandidat.id ? '' : 'ml-16'}`}>
                                        <p className="text-gray-600 text-sm mb-2">Keahlian:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {kandidat.skill.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-200"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Kartu (Tombol dan Detail) */}
                                    <div className="border-t border-gray-200 pt-4">

                                        {/* Container Tombol Aksi */}
                                        <div className="flex justify-between items-center mb-0"> {/* Perbaikan: Mengubah mb-4 menjadi mb-0 */}
                                            <button
                                                onClick={() => toggleDetail(kandidat.id)}
                                                className="text-blue-600 font-semibold text-sm hover:underline"
                                            >
                                                {openDetailId === kandidat.id ? "Tutup Detail" : "Lihat Detail"}
                                            </button>
                                            <div className="flex items-center space-x-4">
                                                <button className="flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                                                    <FaDownload className="mr-2" /> CV
                                                </button>

                                                <Link
                                                    to={`/penilaian/${kandidat.id}`}
                                                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${kandidat.status === "Menunggu Penilaian"
                                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                                        }`}
                                                >
                                                    {kandidat.status === "Menunggu Penilaian" ? (
                                                        <FaStarFill className="mr-2" />
                                                    ) : (
                                                        <FaPencilAlt className="mr-2" />
                                                    )}
                                                    {kandidat.status === "Menunggu Penilaian"
                                                        ? "Beri Penilaian"
                                                        : "Edit Penilaian"}
                                                </Link>
                                            </div>
                                        </div>

                                        {/* DETAIL TAMBAHAN DITEMPATKAN DI BAWAH TOMBOL AKSI */}
                                        {openDetailId === kandidat.id && (
                                            // Perbaikan: Menambahkan margin-top agar tidak terlalu rapat dengan tombol, dan memastikan konten detail mengisi kotak
                                            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                                                <h5 className="font-semibold text-gray-800 mb-2">Detail Kandidat</h5>
                                                <div className="space-y-1 text-sm text-gray-700">
                                                    {/* Menggunakan div untuk setiap baris, bukan hanya untuk grup */}
                                                    <div className="flex justify-between">
                                                        <p><span className="font-medium">Pengalaman:</span> {kandidat.pengalaman}</p>
                                                        <p><span className="font-medium">Pendidikan:</span> {kandidat.pendidikan}</p>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <p><span className="font-medium">Status Evaluasi:</span> {kandidat.status}</p>
                                                        <p><span className="font-medium">Skor Rata-rata:</span> {kandidat.avgRating}</p>
                                                    </div>
                                                    {kandidat.yourRating && (
                                                        <div className="flex justify-start">
                                                            <p><span className="font-medium text-green-700">Skor Anda:</span> {kandidat.yourRating}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pesan jika tidak ada kandidat */}
                        {filteredKandidat.length === 0 && (
                            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                                Tidak ada kandidat dengan status **{getFilterLabel()}**.
                            </div>
                        )}
                    </div>

                    {/* Kolom Kanan: Progress & Evaluasi Terbaru (TIDAK BERUBAH) */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Box Progress Evaluasi */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Progress Evaluasi
                                </h3>
                                <span className="text-sm text-gray-500">8/12 selesai</span>
                            </div>
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Kemajuan Evaluasi</span>
                                    <span className="font-semibold text-blue-600">67%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: "67%" }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>0</span>
                                    <span>12 kandidat</span>
                                </div>
                            </div>

                            {/* Evaluasi Terbaru */}
                            <h3 className="text-xl font-semibold text-gray-800 mb-5">
                                Evaluasi Terbaru
                            </h3>
                            <div className="space-y-5">
                                {dummyEvaluasiTerbaru.map((evaluasi) => (
                                    <div
                                        key={evaluasi.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-3">
                                            {/* Status Dot */}
                                            <div className="shrink-0">
                                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {evaluasi.nama}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {evaluasi.waktu}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`font-bold ${evaluasi.statusColor} text-lg`}
                                        >
                                            {evaluasi.skor}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/evaluasi-semua"
                                className="w-full flex items-center justify-center text-blue-600 font-semibold mt-6 py-2.5 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                            >
                                <BsEye className="mr-2" />
                                Lihat Semua Evaluasi
                            </Link>
                        </div>

                        {/* Box Status Konsensus */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Status Konsensus
                                </h3>
                                <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                                    Berlangsung
                                </span>
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Progress Evaluator</span>
                                    <span className="font-semibold text-green-600">2/3</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full"
                                        style={{ width: "66.6%" }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Deadline konsensus: 2 hari lagi
                                </p>
                            </div>

                            {/* Status Evaluator */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Status Evaluator
                            </h3>
                            <div className="space-y-3">
                                {dummyStatusEvaluator.map((evaluator) => (
                                    <div
                                        key={evaluator.id}
                                        className="border border-gray-200 rounded-lg p-4"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center space-x-2">
                                                {evaluator.icon === "check" && (
                                                    <BsCheckCircleFill className="text-green-600" />
                                                )}
                                                {evaluator.icon === "clock" && (
                                                    <BsClockFill className="text-yellow-600" />
                                                )}
                                                <span className="font-semibold text-gray-800">
                                                    {evaluator.nama}
                                                </span>
                                            </div>
                                            <span
                                                className={`font-semibold ${evaluator.status === "Selesai"
                                                    ? "text-green-600"
                                                    : "text-yellow-800"
                                                    }`}
                                            >
                                                {evaluator.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Progress: {evaluator.progressText}
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`${evaluator.status === "Selesai"
                                                    ? "bg-green-600"
                                                    : "bg-yellow-600"
                                                    } h-2 rounded-full`}
                                                style={{ width: `${evaluator.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/konsensus-detail"
                                className="w-full flex items-center justify-center text-white font-semibold bg-blue-600 mt-6 py-2.5 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                <BsPeopleFill className="mr-2" />
                                Lihat Detail Konsensus
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardDM;