import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
                    const data = await getAlternativesByProject(projectId);

                    // Format data similar to dummy structure
                    const formatted = data.map(item => {
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

                        return {
                            id: item.alternative_id,
                            initials: item.name.substring(0, 2).toUpperCase(),
                            nama: item.name,
                            email: details.email || "-",
                            pengalaman: details.experience || "-",
                            pendidikan: details.education || "-",
                            skill: Array.isArray(details.skills) ? details.skills : [],
                            status: "Menunggu Penilaian", // Default for now
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
                                                    to={`/dm/penilaian/${selectedProject?.ID || selectedProject?.project_id}/${kandidat.id}`}
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

                    {/* Kolom Kanan: Progress & Evaluasi Terbaru */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Box Progress Evaluasi */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Progress Evaluasi
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {candidates.filter(c => c.status === "Sudah Dinilai").length}/{candidates.length} selesai
                                </span>
                            </div>
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Kemajuan Evaluasi</span>
                                    <span className="font-semibold text-blue-600">
                                        {candidates.length > 0 ? Math.round((candidates.filter(c => c.status === "Sudah Dinilai").length / candidates.length) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${candidates.length > 0 ? Math.round((candidates.filter(c => c.status === "Sudah Dinilai").length / candidates.length) * 100) : 0}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>0</span>
                                    <span>{candidates.length} kandidat</span>
                                </div>
                            </div>

                            {/* Evaluasi Terbaru (Placeholder) */}
                            <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
                                <p className="text-gray-500 text-sm">
                                    Riwayat evaluasi terbaru akan muncul di sini.
                                </p>
                            </div>
                        </div>

                        {/* Box Status Konsensus (Placeholder) */}
                        <div className="bg-white p-6 rounded-lg shadow-sm opacity-75">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Status Konsensus
                                </h3>
                                <span className="bg-gray-100 text-gray-600 text-sm font-semibold px-3 py-1 rounded-full">
                                    Coming Soon
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                Fitur konsensus tim akan tersedia pada update berikutnya.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardDM;