import React from "react";
import { useParams, Link } from "react-router-dom";
import {
    BsArrowLeft,
    BsEnvelope,
    BsPhone,
    BsBag,
    BsBook,
    BsCpu,
    BsFileEarmarkPdf,
} from "react-icons/bs";

// Data Dummy Kandidat (Ganti dengan pengambilan data dari API)
const dummyKandidat = {
    id: "SE-001",
    nama: "Rizky Firmansyah",
    posisi: "Software Engineer",
    email: "rizky.f@email.com",
    telepon: "+62 812-3456-7890",
    pendidikan: "S1 Teknik Informatika - ITB",
    pengalaman: "4 Tahun",
    keahlian: ["React.js", "Node.js", "MongoDB", "TypeScript", "AWS"],
    status: "Lolos Evaluasi", // Status dalam proses seleksi
    skor: 9.1,
    cv_url: "#",
};

function KandidatDetail() {
    const { kandidatId } = useParams();
    // Di sini, Anda akan menggunakan kandidatId untuk mengambil data dari API
    // Untuk contoh ini, kita menggunakan data dummy
    const kandidat = dummyKandidat;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                {/* === Header dan Navigasi === */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Detail Kandidat
                        </h1>
                        <span className="text-xl font-light text-gray-500">
                            / {kandidat.nama}
                        </span>
                    </div>
                    <Link
                        to="/kandidat"
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <BsArrowLeft className="mr-2" />
                        Kembali ke Daftar
                    </Link>
                </div>

                {/* --- Card Utama Informasi --- */}
                <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
                    <div className="flex justify-between items-start border-b pb-4 mb-4">
                        <div>
                            <h2 className="text-2xl font-extrabold text-blue-600">
                                {kandidat.nama}
                            </h2>
                            <p className="text-lg text-gray-700 font-medium">
                                {kandidat.posisi}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center px-4 py-1.5 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                                Skor Evaluasi: {kandidat.skor}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">Status: {kandidat.status}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Kolom Kiri: Kontak & Pendidikan */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                                Kontak & Riwayat
                            </h3>
                            <div className="space-y-4 text-gray-700">
                                <div className="flex items-center">
                                    <BsEnvelope className="text-blue-500 mr-3" />
                                    <span>{kandidat.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <BsPhone className="text-blue-500 mr-3" />
                                    <span>{kandidat.telepon}</span>
                                </div>
                                <div className="flex items-center">
                                    <BsBook className="text-blue-500 mr-3" />
                                    <span>{kandidat.pendidikan}</span>
                                </div>
                                <div className="flex items-center">
                                    <BsBag className="text-blue-500 mr-3" />
                                    <span>Pengalaman: **{kandidat.pengalaman}**</span>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Keahlian & CV */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                                Keahlian Teknis
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {kandidat.keahlian.map((skill) => (
                                    <span
                                        key={skill}
                                        className="flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full border border-gray-200"
                                    >
                                        <BsCpu className="mr-1.5 text-xs text-blue-500" /> {skill}
                                    </span>
                                ))}
                            </div>

                            <a
                                href={kandidat.cv_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full px-4 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors font-semibold"
                            >
                                <BsFileEarmarkPdf className="mr-3 text-lg" />
                                Unduh CV Kandidat
                            </a>
                        </div>
                    </div>
                </div>

                {/* --- Area Aksi (Opsional: Tambahkan tombol Evaluasi/Penilaian) --- */}
                <div className="flex justify-end space-x-3 mt-6">
                    <Link
                        to={`/penilaian/${kandidat.id}`}
                        className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors font-semibold"
                    >
                        Lihat/Lakukan Evaluasi
                    </Link>
                    <button className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition-colors font-semibold">
                        Tandai sebagai Finalis
                    </button>
                </div>
            </div>
        </div>
    );
}

export default KandidatDetail;