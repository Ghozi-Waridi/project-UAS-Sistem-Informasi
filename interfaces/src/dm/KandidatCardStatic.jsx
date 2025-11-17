import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    BsBag,
    BsBook,
    BsEnvelope,
    BsFileEarmarkPdf,
} from "react-icons/bs";
import { FaStar } from "react-icons/fa";

// Komponen Card Kandidat (Static)
function KandidatCardStatic({ kandidat }) {
    // Toggle logic dihapus untuk membuat card statis seperti di gambar terakhir

    const initials = kandidat.nama
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const statusStyle = kandidat.statusEvaluasi.includes("Menunggu")
        ? "bg-yellow-100 text-yellow-800"
        : "bg-green-100 text-green-800";

    const isSudahDinilai = kandidat.statusEvaluasi.includes("Sudah");

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-4">
            {/* === Bagian Atas: Ringkasan Utama === */}
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                    {/* Avatar Inisial */}
                    <div className="flex-shrink-0 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {initials}
                    </div>

                    {/* Info Dasar */}
                    <div className="mt-1">
                        <h2 className="text-xl font-bold text-gray-900">
                            {kandidat.nama}
                        </h2>
                        <p className="text-sm text-gray-600 mb-1 flex items-center">
                            <BsEnvelope className="mr-2 text-xs" />
                            {kandidat.email}
                        </p>

                        {/* Pengalaman & Pendidikan - BARIS KEDUA */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                                <BsBag className="mr-1.5 text-xs" />
                                {kandidat.pengalaman} tahun
                            </span>
                            <span className="flex items-center">
                                <BsBook className="mr-1.5 text-xs" />
                                {kandidat.pendidikan}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status dan Rata-rata Skor */}
                <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${statusStyle}`}>
                        {kandidat.statusEvaluasi}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                        Rata-rata:{" "}
                        <span className="text-red-600">{kandidat.skorRataRata}/10</span>
                    </p>
                    {isSudahDinilai && (
                        <p className="text-sm font-medium text-gray-600">
                            Skor Anda: <span className="font-bold text-green-600">{kandidat.skorAnda}/10</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Keahlian */}
            <div className="mt-4 pb-4 ml-[4.5rem] border-b">
                <p className="text-sm font-semibold text-gray-700 mb-2">Keahlian:</p>
                <div className="flex flex-wrap gap-2">
                    {kandidat.keahlian.map((skill) => (
                        <span
                            key={skill}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* === Footer Aksi === */}
            <div className="flex justify-between items-center mt-4 pt-0">
                {/* Lihat Detail (Link Statis) */}
                <Link
                    to={`/kandidat/${kandidat.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline transition-colors"
                >
                    Lihat Detail
                </Link>

                {/* Tombol Aksi */}
                <div className="flex space-x-3">
                    <a
                        href={kandidat.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    >
                        <BsFileEarmarkPdf className="mr-2" /> CV
                    </a>
                    <Link
                        to={`/penilaian/${kandidat.id}`}
                        className="flex items-center text-sm px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                    >
                        <FaStar className="mr-2" /> Beri Penilaian
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default KandidatCardStatic;