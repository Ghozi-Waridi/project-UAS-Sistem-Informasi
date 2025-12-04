import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../admin/components/Sidebar";
import {
    BsPerson,
    BsCheckLg,
    BsClock,
    BsStar,
    BsPersonCircle,
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
import { getAssignedProjects } from "../services/projectService";
import { getAlternativesByProject } from "../services/alternativeService";
import { getScores } from "../services/evaluationService";

// Komponen Kartu Statistik dengan Animasi
function StatCard({ icon, color, value, title, badge }) {
    const colors = {
        blue: {
            bg: "bg-gradient-to-br from-blue-50 to-blue-100",
            text: "text-blue-600",
            badge: "text-green-600",
            iconBg: "bg-blue-600",
            iconHover: "hover:bg-blue-700",
        },
        green: {
            bg: "bg-gradient-to-br from-green-50 to-green-100",
            text: "text-green-600",
            badge: "text-gray-600",
            iconBg: "bg-green-600",
            iconHover: "hover:bg-green-700",
        },
        yellow: {
            bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
            text: "text-yellow-600",
            badge: "text-gray-600",
            iconBg: "bg-yellow-600",
            iconHover: "hover:bg-yellow-700",
        },
        purple: {
            bg: "bg-gradient-to-br from-purple-50 to-purple-100",
            text: "text-purple-600",
            badge: "text-purple-600",
            iconBg: "bg-purple-600",
            iconHover: "hover:bg-purple-700",
        },
    };
    const c = colors[color] || colors.blue;
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-start justify-between">
                <div className={`${c.iconBg} ${c.iconHover} text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md`}>
                    {icon}
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold text-gray-800 block animate-pulse">{value}</span>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-gray-600 font-medium text-sm">{title}</p>
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
    const navigate = useNavigate();

    // Real Data State
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const timerID = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => {
            clearInterval(timerID);
        };
    }, []);

    // Fetch Assigned Projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAssignedProjects();
                setProjects(data || []);
                if (data && data.length > 0) {
                    setSelectedProject(data[0]); // Default to first project
                }
            } catch (error) {
                console.error("Failed to fetch assigned projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Fetch Candidates when Project Changes
    useEffect(() => {
        if (selectedProject) {
            const fetchCandidates = async () => {
                try {
                    const projectId = selectedProject.ID || selectedProject.project_id;
                    const [candidatesData, scoresData] = await Promise.all([
                        getAlternativesByProject(projectId),
                        getScores(projectId).catch(() => []) // Handle error gracefully, return empty array
                    ]);

                    // Build set of candidate IDs that have scores
                    const scoredCandidateIds = new Set();
                    if (Array.isArray(scoresData)) {
                        scoresData.forEach(score => {
                            if (score.alternative_id) {
                                scoredCandidateIds.add(score.alternative_id);
                            }
                        });
                    }
                    console.log('Scores Data:', scoresData);
                    console.log('Scored Candidate IDs:', Array.from(scoredCandidateIds));

                    // Format data similar to dummy structure
                    const formatted = candidatesData.map(item => {
                        let details = {};
                        try {
                            details = JSON.parse(item.description || "{}");
                            // Handle double encoded or nested
                            if (typeof details === 'string') details = JSON.parse(details);
                            if (details.education && typeof details.education === 'string' && details.education.startsWith('{')) {
                                try { details = JSON.parse(details.education); } catch (e) { }
                            }
                        } catch (e) {
                            details = { note: item.description };
                        }

                        // Check if this candidate has been scored
                        const hasScores = scoredCandidateIds.has(item.alternative_id);
                        console.log(`Candidate ${item.name} (ID: ${item.alternative_id}):`, hasScores ? 'HAS SCORES' : 'NO SCORES');

                        return {
                            id: item.alternative_id,
                            initials: item.name.substring(0, 2).toUpperCase(),
                            nama: item.name,
                            email: details.email || "-",
                            pengalaman: details.experience || "-",
                            pendidikan: details.education || "-",
                            skill: Array.isArray(details.skills) ? details.skills : [],
                            status: hasScores ? "Sudah Dinilai" : "Menunggu Penilaian",
                            avgRating: "-", // Placeholder
                            yourRating: null, // Placeholder
                        };
                    });
                    setCandidates(formatted);
                } catch (error) {
                    console.error("Failed to fetch candidates:", error);
                }
            };
            fetchCandidates();
        }
    }, [selectedProject]);

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
    };

    const handleExport = () => {
        alert("Fitur Export akan segera hadir!");
    };

    const filteredKandidat = candidates.filter(kandidat => {
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
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-8">
                <div className="max-w-7xl mx-auto">
                {/* Header Dashboard dengan Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6 flex justify-between items-center mb-8 text-white transform hover:scale-[1.01] transition-transform duration-300">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-3xl font-bold">
                                Dashboard Decision Maker
                            </h1>
                            <span className="text-3xl animate-bounce">🎯</span>
                        </div>
                        <p className="text-blue-100 mt-2 text-sm">
                            Evaluasi kandidat Software Engineer dan berikan penilaian Anda
                        </p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-right border border-white/20">
                            <p className="font-bold text-2xl">
                                {formattedTime}
                            </p>
                            <p className="text-sm text-blue-100">{formattedDate}</p>
                        </div>
                        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                            <div className="bg-white text-blue-600 p-2 rounded-full">
                                <BsPersonCircle className="text-3xl" />
                            </div>
                            <div>
                                <p className="font-semibold">Decision Maker 1</p>
                                <p className="text-sm text-blue-100">
                                    Senior Technical Evaluator
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Statistik 4 Kartu */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<BsPerson className="text-2xl" />}
                        color="blue"
                        value={candidates.length}
                        title="Total Kandidat"
                        badge={`${candidates.length} orang`}
                    />
                    <StatCard
                        icon={<BsCheckLg className="text-2xl" />}
                        color="green"
                        value={candidates.filter(c => c.status === "Sudah Dinilai").length}
                        title="Sudah Dievaluasi"
                        badge={`${candidates.length > 0 ? Math.round((candidates.filter(c => c.status === "Sudah Dinilai").length / candidates.length) * 100) : 0}% selesai`}
                    />
                    <StatCard
                        icon={<BsClock className="text-2xl" />}
                        color="yellow"
                        value={candidates.filter(c => c.status === "Menunggu Penilaian").length}
                        title="Menunggu Evaluasi"
                        badge={`${candidates.length > 0 ? Math.round((candidates.filter(c => c.status === "Menunggu Penilaian").length / candidates.length) * 100) : 0}% tersisa`}
                    />
                    <StatCard
                        icon={<BsStar className="text-2xl" />}
                        color="purple"
                        value="-"
                        title="Rata-rata Skor"
                        badge="Menunggu hasil"
                    />
                </div>

                {/* Konten Bawah (Daftar Kandidat & Progress Baru) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Daftar Kandidat */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                        {/* Header Daftar Kandidat */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="bg-blue-600 text-white p-2 rounded-lg">
                                        <BsPerson className="text-xl" />
                                    </span>
                                    Daftar Kandidat Software Engineer
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Total {candidates.length} kandidat terdaftar</p>
                            </div>
                            <div className="flex space-x-3">
                                {/* KOMPONEN FILTER DENGAN DROPDOWN */}
                                <div className="relative" ref={filterRef}>
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="flex items-center px-5 py-2.5 border-2 border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-blue-400 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                                    >
                                        <FaFilter className="mr-2 text-blue-600" />
                                        <span className="font-semibold">{getFilterLabel()}</span>
                                        <FaChevronDown className={`ml-2 w-3 h-3 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : 'rotate-0'}`} />
                                    </button>

                                    {isFilterOpen && (
                                        <div className="absolute z-10 mt-2 w-60 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none right-0 animate-fadeIn">
                                            <div className="py-2">
                                                <button
                                                    onClick={() => handleFilterChange('all')}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex justify-between items-center transition-colors duration-200 rounded-lg mx-1"
                                                >
                                                    <span className="font-medium">Semua Kandidat</span>
                                                    {filterStatus === 'all' && <FaCheck className="text-blue-600 w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleFilterChange('menunggu')}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 flex justify-between items-center transition-colors duration-200 rounded-lg mx-1"
                                                >
                                                    <span className="font-medium">Menunggu Penilaian</span>
                                                    {filterStatus === 'menunggu' && <FaCheck className="text-yellow-600 w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleFilterChange('dinilai')}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex justify-between items-center transition-colors duration-200 rounded-lg mx-1"
                                                >
                                                    <span className="font-medium">Sudah Dinilai</span>
                                                    {filterStatus === 'dinilai' && <FaCheck className="text-green-600 w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* END KOMPONEN FILTER */}

                                <button
                                    onClick={handleExport}
                                    className="flex items-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 border border-green-600 rounded-xl text-sm text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <FaFileExport className="mr-2" /> Export
                                </button>
                            </div>
                        </div>

                        {/* List Kandidat */}
                        <div className="space-y-4">
                            {filteredKandidat.map((kandidat) => (
                                <div
                                    key={kandidat.id}
                                    className={`border-2 rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] ${
                                        openDetailId === kandidat.id 
                                            ? 'border-blue-500 shadow-2xl bg-blue-50/30' 
                                            : 'border-gray-200 shadow-md hover:shadow-xl hover:border-blue-300 bg-white'
                                    }`}
                                >
                                    {/* Info Atas */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-4">
                                            {/* Inisial dengan Gradient */}
                                            <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                                                {kandidat.initials}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-800 hover:text-blue-600 transition-colors duration-200">
                                                    {kandidat.nama}
                                                </h4>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <span>📧</span> {kandidat.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <span
                                                className={`px-4 py-1.5 text-sm font-semibold rounded-full inline-flex items-center gap-2 shadow-md ${
                                                    kandidat.status === "Menunggu Penilaian"
                                                        ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300"
                                                        : "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                                                }`}
                                            >
                                                {kandidat.status === "Menunggu Penilaian" ? "⏳" : "✅"}
                                                {kandidat.status}
                                            </span>
                                            <div className="text-gray-600 text-sm">
                                                Rata-rata:{" "}
                                                <span className="font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                                    {kandidat.avgRating}
                                                </span>
                                            </div>
                                            {kandidat.yourRating && (
                                                <div className="text-green-600 text-sm">
                                                    Skor Anda:{" "}
                                                    <span className="font-bold bg-green-100 px-2 py-1 rounded">
                                                        {kandidat.yourRating}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info Tengah (Pengalaman & Pendidikan) */}
                                    <div className={`flex items-center space-x-6 text-gray-700 text-sm mb-4 ${openDetailId === kandidat.id ? '' : 'ml-16'}`}>
                                        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                            <FaBriefcase className="text-blue-600" />
                                            <span className="font-medium">{kandidat.pengalaman}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                            <FaGraduationCap className="text-purple-600" />
                                            <span className="font-medium">{kandidat.pendidikan}</span>
                                        </div>
                                    </div>

                                    {/* Keahlian */}
                                    <div className={`mb-5 ${openDetailId === kandidat.id ? '' : 'ml-16'}`}>
                                        <p className="text-gray-700 text-sm mb-2 font-semibold flex items-center gap-2">
                                            <span>⚡</span> Keahlian:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {kandidat.skill.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs px-4 py-1.5 rounded-full border border-blue-300 font-medium hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 transform hover:scale-105"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Kartu (Tombol dan Detail) */}
                                    <div className="border-t-2 border-gray-200 pt-4">

                                        {/* Container Tombol Aksi */}
                                        <div className="flex justify-between items-center mb-0">
                                            <button
                                                onClick={() => toggleDetail(kandidat.id)}
                                                className="text-blue-600 font-bold text-sm hover:text-blue-700 hover:underline flex items-center gap-2 transition-all duration-200"
                                            >
                                                {openDetailId === kandidat.id ? (
                                                    <>
                                                        <FaChevronDown className="rotate-180 transition-transform duration-300" />
                                                        Tutup Detail
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaChevronDown className="transition-transform duration-300" />
                                                        Lihat Detail
                                                    </>
                                                )}
                                            </button>
                                            <div className="flex items-center space-x-3">
                                                <button className="flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md transition-all duration-300 border border-gray-300 transform hover:-translate-y-0.5">
                                                    <FaDownload className="mr-2" /> CV
                                                </button>

                                                <Link
                                                    to={`/dm/penilaian/${selectedProject?.ID || selectedProject?.project_id}/${kandidat.id}`}
                                                    className={`flex items-center px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                                                        kandidat.status === "Menunggu Penilaian"
                                                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                                                            : "bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 border border-green-300"
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
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl mt-4 border-2 border-blue-200 shadow-inner animate-fadeIn">
                                                <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                                                    <span className="bg-blue-600 text-white p-1.5 rounded-lg">ℹ️</span>
                                                    Detail Kandidat
                                                </h5>
                                                <div className="space-y-2 text-sm text-gray-700">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                            <p className="text-gray-500 text-xs mb-1">Pengalaman</p>
                                                            <p className="font-semibold text-gray-800">{kandidat.pengalaman}</p>
                                                        </div>
                                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                            <p className="text-gray-500 text-xs mb-1">Pendidikan</p>
                                                            <p className="font-semibold text-gray-800">{kandidat.pendidikan}</p>
                                                        </div>
                                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                            <p className="text-gray-500 text-xs mb-1">Status Evaluasi</p>
                                                            <p className="font-semibold text-gray-800">{kandidat.status}</p>
                                                        </div>
                                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
                                                            <p className="text-gray-500 text-xs mb-1">Skor Rata-rata</p>
                                                            <p className="font-semibold text-gray-800">{kandidat.avgRating}</p>
                                                        </div>
                                                    </div>
                                                    {kandidat.yourRating && (
                                                        <div className="bg-green-100 p-3 rounded-lg shadow-sm border border-green-300 mt-3">
                                                            <p className="text-gray-600 text-xs mb-1">Skor Anda</p>
                                                            <p className="font-bold text-green-700 text-lg">{kandidat.yourRating}</p>
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
                            <div className="text-center py-16 text-gray-500 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-lg font-semibold text-gray-700">Tidak ada kandidat ditemukan</p>
                                <p className="text-sm text-gray-500 mt-2">Tidak ada kandidat dengan status <span className="font-bold text-blue-600">{getFilterLabel()}</span></p>
                            </div>
                        )}
                    </div>

                    {/* Kolom Kanan: Progress & Evaluasi Terbaru */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Box Progress Evaluasi */}
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="bg-purple-600 text-white p-2 rounded-lg">
                                        📊
                                    </span>
                                    Progress Evaluasi
                                </h3>
                                <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                    {candidates.filter(c => c.status === "Sudah Dinilai").length}/{candidates.length}
                                </span>
                            </div>
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-700 mb-2 font-medium">
                                    <span>Kemajuan Evaluasi</span>
                                    <span className="font-bold text-blue-600 text-lg">
                                        {candidates.length > 0 ? Math.round((candidates.filter(c => c.status === "Sudah Dinilai").length / candidates.length) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out shadow-md"
                                        style={{ width: `${candidates.length > 0 ? Math.round((candidates.filter(c => c.status === "Sudah Dinilai").length / candidates.length) * 100) : 0}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                                    <span>0 kandidat</span>
                                    <span>{candidates.length} kandidat</span>
                                </div>
                            </div>

                            {/* Statistik Mini */}
                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
                                    <p className="text-xs text-green-700 font-medium mb-1">Selesai</p>
                                    <p className="text-2xl font-bold text-green-700">
                                        {candidates.filter(c => c.status === "Sudah Dinilai").length}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200 shadow-sm">
                                    <p className="text-xs text-yellow-700 font-medium mb-1">Tertunda</p>
                                    <p className="text-2xl font-bold text-yellow-700">
                                        {candidates.filter(c => c.status === "Menunggu Penilaian").length}
                                    </p>
                                </div>
                            </div>

                            {/* Evaluasi Terbaru (Placeholder) */}
                            <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl text-center border border-gray-200">
                                <div className="text-3xl mb-2">📝</div>
                                <p className="text-gray-600 text-sm font-medium">
                                    Riwayat evaluasi terbaru akan muncul di sini
                                </p>
                            </div>
                        </div>

                        {/* Box Input Bobot Kriteria */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl shadow-xl border border-indigo-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="bg-indigo-600 text-white p-2 rounded-lg">
                                        ⚖️
                                    </span>
                                    Bobot Kriteria
                                </h3>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Tentukan seberapa penting setiap kriteria dalam penilaian Anda. Total bobot harus = 1.0 (100%).
                            </p>
                            <Link
                                to={`/dm/bobot-kriteria/${selectedProject?.ID || selectedProject?.project_id}`}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                <span className="text-lg">⚖️</span>
                                Input Bobot Kriteria
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default DashboardDM;