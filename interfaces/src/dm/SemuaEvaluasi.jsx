import React from "react";
import { Link } from "react-router-dom";
import { BsArrowLeft, BsEye } from "react-icons/bs";

// Data dummy yang lebih panjang untuk halaman ini
const dummySemuaEvaluasi = [
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
    {
        id: 4,
        nama: "Ahmad Rizki Pratama",
        waktu: "2 hari lalu",
        skor: "8.2/10",
        statusColor: "text-green-600",
    },
    {
        id: 5,
        nama: "Budi Santoso",
        waktu: "3 hari lalu",
        skor: "7.8/10",
        statusColor: "text-green-600",
    },
];

function SemuaEvaluasi() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* --- Header Halaman --- */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <BsEye className="text-2xl text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-800">
                            Riwayat Evaluasi
                        </h1>
                    </div>
                    <Link
                        to="/dashboard-dm"
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <BsArrowLeft className="mr-2" />
                        Kembali ke Dashboard
                    </Link>
                </div>

                {/* --- Card Konten --- */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-gray-600 mb-6">
                        Menampilkan semua riwayat evaluasi kandidat yang telah diselesaikan.
                    </p>
                    <div className="space-y-5">
                        {dummySemuaEvaluasi.map((evaluasi) => (
                            <div
                                key={evaluasi.id}
                                className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {evaluasi.nama}
                                        </p>
                                        <p className="text-sm text-gray-500">{evaluasi.waktu}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${evaluasi.statusColor} text-lg`}>
                                    {evaluasi.skor}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SemuaEvaluasi;