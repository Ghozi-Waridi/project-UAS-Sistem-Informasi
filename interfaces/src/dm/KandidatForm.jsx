import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BsPersonPlusFill,
    BsUpload,
    BsCheckLg,
    BsX,
} from "react-icons/bs";

function KandidatForm() {
    const navigate = useNavigate();

    // Fungsi dummy untuk submit. Ganti dengan logika API Anda.
    const handleSubmit = (e) => {
        e.preventDefault();
        // Logika untuk mengirim data form ke API
        console.log("Form disubmit!");
        // Tampilkan alert (opsional)
        alert("Kandidat baru berhasil ditambahkan!");
        // Arahkan kembali ke halaman daftar kandidat
        navigate("/kandidat");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* === Header === */}
                <div className="flex items-center space-x-2 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tambah Kandidat Baru
                    </h1>
                    <BsPersonPlusFill className="text-2xl text-blue-600" />
                </div>
                <p className="text-gray-500 mb-8 -mt-4">
                    Isi detail kandidat baru di bawah ini untuk memulai proses evaluasi.
                </p>

                {/* === Form Card === */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-lg shadow-sm"
                >
                    {/* Bagian Info Pribadi */}
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
                        Informasi Pribadi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label
                                htmlFor="nama"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                id="nama"
                                placeholder="cth: Budi Santoso"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="cth: budi.santoso@email.com"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label
                                htmlFor="telepon"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nomor Telepon
                            </label>
                            <input
                                type="tel"
                                id="telepon"
                                placeholder="cth: +62 812-3456-7890"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-1">
                            <label
                                htmlFor="pendidikan"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Pendidikan Terakhir
                            </label>
                            <input
                                type="text"
                                id="pendidikan"
                                placeholder="cth: S1 Teknik Informatika"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Bagian Info Profesional */}
                    <h2 className="text-xl font-semibold text-gray-800 mt-10 mb-6 border-b pb-3">
                        Informasi Profesional
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label
                                htmlFor="posisi"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Posisi yang Dilamar
                            </label>
                            <input
                                type="text"
                                id="posisi"
                                placeholder="cth: Software Engineer"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label
                                htmlFor="pengalaman"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Pengalaman Kerja (Tahun)
                            </label>
                            <input
                                type="text"
                                id="pengalaman"
                                placeholder="cth: 3 tahun"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="keahlian"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Keahlian (pisahkan dengan koma)
                            </label>
                            <input
                                type="text"
                                id="keahlian"
                                placeholder="cth: React, Node.js, TypeScript"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="cv"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Upload CV (PDF)
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    <BsUpload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="cv-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                        >
                                            <span>Upload file</span>
                                            <input
                                                id="cv-upload"
                                                name="cv-upload"
                                                type="file"
                                                className="sr-only"
                                                accept=".pdf"
                                            />
                                        </label>
                                        <p className="pl-1">atau seret dan lepas</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === Tombol Aksi === */}
                    <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                        <Link
                            to="/kandidat"
                            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <BsX className="mr-2 text-lg" />
                            Batal
                        </Link>
                        <button
                            type="submit"
                            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors text-sm font-semibold"
                        >
                            <BsCheckLg className="mr-2 text-lg" />
                            Simpan Kandidat
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default KandidatForm;