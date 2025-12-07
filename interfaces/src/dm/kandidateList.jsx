import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    BsPeopleFill,
    BsPlusLg,
    BsSearch,
    BsChevronDown,
    BsFileEarmarkArrowUp,
    BsPerson,
    BsCheckCircle,
    BsClock,
    BsStar,
    BsEye,
    BsPencil,
    BsTrash,
} from "react-icons/bs";

// --- (SAMA) Data Dummy Sesuai Gambar ---
const dummyKandidat = [
    {
        id: 1,
        initials: "AR",
        nama: "Ahmad Rizki Pratama",
        pendidikan: "S1 Sistem Informatika",
        email: "ahmad.rizki@email.com",
        telepon: "+62 812-3456-7890",
        pengalamanDurasi: "3 tahun",
        pengalamanMulai: "Melamar: 2024-01-15",
        keahlian: ["React", "Node.js", "TypeScript", "MongoDB"],
        status: "Berlangsung",
        skor: "8.2/10",
    },
    {
        id: 2,
        initials: "SD",
        nama: "Sari Dewi Lestari",
        pendidikan: "S1 Sistem Informasi",
        email: "sari.dewi@email.com",
        telepon: "+62 813-4567-8901",
        pengalamanDurasi: "5 tahun",
        pengalamanMulai: "Melamar: 2024-01-12",
        keahlian: ["Vue.js", "Python", "SQL", "AWS"],
        status: "Selesai",
        skor: "8.7/10",
    },
    {
        id: 3,
        initials: "BS",
        nama: "Budi Santoso",
        pendidikan: "S1 Teknik Komputer",
        email: "budi.santoso@email.com",
        telepon: "+62 814-5678-9012",
        pengalamanDurasi: "2 tahun",
        pengalamanMulai: "Melamar: 2024-01-10",
        keahlian: ["Angular", "Java", "Spring Boot", "MySQL"],
        status: "Menunggu",
        skor: null,
    },
    {
        id: 4,
        initials: "MI",
        nama: "Maya Indra Sari",
        pendidikan: "S1 Teknik Informatika",
        email: "maya.indra@email.com",
        telepon: "+62 815-6789-0123",
        pengalamanDurasi: "4 tahun",
        pengalamanMulai: "Melamar: 2024-01-18",
        keahlian: ["React Native", "Flutter", "Firebase"],
        status: "Selesai",
        skor: "9.1/10",
    },
];

// --- (SAMA) Komponen & Fungsi Utilitas ---
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

const getStatusClass = (status) => {
    // ... (kode getStatusClass tetap sama)
    switch (status) {
        case "Selesai":
            return "bg-green-100 text-green-800";
        case "Berlangsung":
            return "bg-blue-100 text-blue-800";
        case "Menunggu":
            return "bg-yellow-100 text-yellow-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const renderSkills = (skills) => {
    // ... (kode renderSkills tetap sama)
    const maxSkills = 2;
    const displayedSkills = skills.slice(0, maxSkills);
    const hiddenSkills = skills.length - maxSkills;

    return (
        <div className="flex flex-wrap gap-2">
            {displayedSkills.map((skill, idx) => (
                <span
                    key={idx}
                    className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200"
                >
                    {skill}
                </span>
            ))}
            {hiddenSkills > 0 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full border border-gray-200">
                    +{hiddenSkills}
                </span>
            )}
        </div>
    );
};

// --- Komponen Utama ---
function KandidatList() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("Semua Status");
    const [searchQuery, setSearchQuery] = useState(""); // <-- (BARU) State untuk search bar

    // --- (UPDATE) Logika untuk memfilter kandidat ---
    const filteredKandidat = dummyKandidat.filter((kandidat) => {
        // 1. Cek filter status
        const statusMatch =
            selectedStatus === "Semua Status" || kandidat.status === selectedStatus;

        // 2. Cek filter search query (berdasarkan nama ATAU email)
        const query = searchQuery.toLowerCase();
        const nameMatch = kandidat.nama.toLowerCase().includes(query);
        const emailMatch = kandidat.email.toLowerCase().includes(query);
        const searchMatch = nameMatch || emailMatch;

        // 3. Kandidat lolos HANYA JIKA lolos filter status DAN filter search
        return statusMatch && searchMatch;
    });

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* === (SAMA) Header === */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Manajemen Kandidat
                            </h1>
                            <BsPeopleFill className="text-2xl text-gray-500" />
                        </div>
                        <p className="text-gray-500 mt-1">
                            Kelola data kandidat Software Engineer dan monitor proses evaluasi
                        </p>
                    </div>
                    <Link
                        to="/kandidat/tambah"
                        className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center font-semibold"
                    >
                        <BsPlusLg className="mr-2" /> Tambah Kandidat
                    </Link>
                </div>

                {/* === (UPDATE) Toolbar: Search, Filter, Export === */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4 mb-8">
                    {/* Search Bar */}
                    <div className="relative flex-grow">
                        <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari kandidat berdasarkan nama atau email..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery} // <-- (BARU) Hubungkan value ke state
                            onChange={(e) => setSearchQuery(e.target.value)} // <-- (BARU) Update state saat diketik
                        />
                    </div>

                    {/* (SAMA) Status Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center justify-between w-48 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            <span>{selectedStatus}</span>
                            <BsChevronDown className="text-gray-500" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-48 mt-1 bg-white rounded-lg shadow-xl border border-gray-100">
                                <a
                                    href="#"
                                    className={`block px-4 py-2 text-gray-700 ${selectedStatus === "Semua Status"
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-blue-50"
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedStatus("Semua Status");
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    Semua Status
                                </a>
                                <a
                                    href="#"
                                    className={`block px-4 py-2 text-gray-700 ${selectedStatus === "Menunggu"
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-blue-50"
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedStatus("Menunggu");
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    Menunggu
                                </a>
                                <a
                                    href="#"
                                    className={`block px-4 py-2 text-gray-700 ${selectedStatus === "Berlangsung"
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-blue-50"
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedStatus("Berlangsung");
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    Berlangsung
                                </a>
                                <a
                                    href="#"
                                    className={`block px-4 py-2 text-gray-700 ${selectedStatus === "Selesai"
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-blue-50"
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedStatus("Selesai");
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    Selesai
                                </a>
                            </div>
                        )}
                    </div>

                    {/* (SAMA) Export Button */}
                    <button className="flex items-center px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
                        <BsFileEarmarkArrowUp className="mr-2 text-gray-500" /> Export
                    </button>
                </div>

                {/* === (SAMA) Stat Cards === */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                        title="Evaluasi Selesai"
                        bgColor="bg-green-100"
                        iconColor="text-green-600"
                    />
                    <StatCard
                        icon={<BsClock className="text-2xl" />}
                        value="1"
                        title="Sedang Evaluasi"
                        bgColor="bg-yellow-100"
                        iconColor="text-yellow-600"
                    />
                    <StatCard
                        icon={<BsStar className="text-2xl" />}
                        value="8.7"
                        title="Rata-rata Skor"
                        bgColor="bg-purple-100"
                        iconColor="text-purple-600"
                    />
                </div>

                {/* === (UPDATE) Daftar Kandidat Table === */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Daftar Kandidat
                        </h3>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {/* (SAMA) <thead> ... */}
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Kandidat
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Kontak
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Pengalaman
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Keahlian
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Status Evaluasi
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Skor
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* (SAMA) Menggunakan filteredKandidat.map */}
                            {filteredKandidat.map((kandidat) => (
                                <tr key={kandidat.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {kandidat.initials}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {kandidat.nama}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {kandidat.pendidikan}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div>{kandidat.email}</div>
                                        <div>{kandidat.telepon}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div>{kandidat.pengalamanDurasi}</div>
                                        <div className="text-gray-400">
                                            {kandidat.pengalamanMulai}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {renderSkills(kandidat.keahlian)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                                                kandidat.status
                                            )}`}
                                        >
                                            {kandidat.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                        {kandidat.skor || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg">
                                        <div className="flex items-center space-x-3 text-gray-400">
                                            <Link
                                                to="#"
                                                className="hover:text-blue-600"
                                                title="Lihat Detail"
                                            >
                                                <BsEye />
                                            </Link>
                                            <Link
                                                to={`/penilaian/${kandidat.id}`}
                                                className="hover:text-green-600"
                                                title="Edit Penilaian"
                                            >
                                                <BsPencil />
                                            </Link>
                                            <button
                                                className="hover:text-red-600"
                                                title="Hapus Kandidat"
                                            >
                                                <BsTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default KandidatList;