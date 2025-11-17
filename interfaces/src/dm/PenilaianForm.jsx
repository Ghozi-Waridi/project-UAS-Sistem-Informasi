import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PenilaianForm() {
    const { kandidatId } = useParams();
    const navigate = useNavigate();

    // Dummy data for a candidate (replace with API call)
    const dummyKandidatDetail = {
        id: kandidatId,
        initials: "AR",
        nama: "Ahmad Rizki Pratama",
        email: "ahmad.rizki@email.com",
        pengalaman: "3 tahun",
        pendidikan: "S1 Teknik Informatika",
        keahlian: ["React", "Node.js", "TypeScript", "MongoDB"],
    };

    // State for criteria scores
    const [scores, setScores] = useState({
        keahlianTeknis: 0,
        problemSolving: 0,
        komunikasi: 0,
        kerjaTim: 0,
        pengalaman: 0,
    });
    const [catatanEvaluasi, setCatatanEvaluasi] = useState("");
    const [totalSkor, setTotalSkor] = useState(0);

    const kriteriaBobot = {
        keahlianTeknis: 0.30, // 30%
        problemSolving: 0.25, // 25%
        komunikasi: 0.20,     // 20%
        kerjaTim: 0.15,       // 15%
        pengalaman: 0.10,     // 10%
    };

    useEffect(() => {
        // Calculate total score whenever scores change
        let calculatedTotal = 0;
        calculatedTotal += (scores.keahlianTeknis / 10) * kriteriaBobot.keahlianTeknis;
        calculatedTotal += (scores.problemSolving / 10) * kriteriaBobot.problemSolving;
        calculatedTotal += (scores.komunikasi / 10) * kriteriaBobot.komunikasi;
        calculatedTotal += (scores.kerjaTim / 10) * kriteriaBobot.kerjaTim;
        calculatedTotal += (scores.pengalaman / 10) * kriteriaBobot.pengalaman;

        // Convert to a 0-10 scale
        setTotalSkor((calculatedTotal * 10).toFixed(1));
    }, [scores]);

    const handleScoreChange = (kriteria, value) => {
        setScores((prevScores) => ({
            ...prevScores,
            [kriteria]: parseInt(value, 10),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to send evaluation data to API
        console.log("Submitting evaluation for candidate:", kandidatId, {
            scores,
            catatanEvaluasi,
            totalSkor,
        });
        alert(`Evaluasi untuk kandidat ${dummyKandidatDetail.nama} berhasil dikirim!`);
        navigate("/kandidat"); // Navigate back to candidate list
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Evaluasi Kandidat</h1>
                    <p className="text-gray-500 text-sm">Berikan penilaian untuk kandidat Software Engineer</p>
                </div>

                {/* Kandidat Info */}
                <div className="p-6 border-b border-gray-200 bg-blue-50">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold text-lg">
                            {dummyKandidatDetail.initials}
                        </div>
                        <div className="ml-4">
                            <div className="text-lg font-semibold text-gray-800">{dummyKandidatDetail.nama}</div>
                            <div className="text-sm text-gray-600">
                                <span>{dummyKandidatDetail.email}</span> | <span>{dummyKandidatDetail.pengalaman}</span> |{" "}
                                <span>{dummyKandidatDetail.pendidikan}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {dummyKandidatDetail.keahlian.map((skill, idx) => (
                                    <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kriteria Penilaian */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Kriteria Penilaian</h2>
                        <p className="text-gray-500 text-sm mb-6">Berikan skor 1-10 untuk setiap kriteria evaluasi</p>

                        {Object.keys(kriteriaBobot).map((kriteriaKey) => (
                            <div key={kriteriaKey} className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex justify-between items-center mb-3">
                                    <label htmlFor={kriteriaKey} className="block text-md font-semibold text-gray-700 capitalize">
                                        {kriteriaKey.replace(/([A-Z])/g, ' $1')}
                                    </label>
                                    <span className="text-gray-600 text-sm">Bobot: {(kriteriaBobot[kriteriaKey] * 100).toFixed(0)}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${scores[kriteriaKey] === num
                                                    ? "bg-blue-600 text-white border-blue-600 shadow"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                                                    }`}
                                                onClick={() => handleScoreChange(kriteriaKey, num)}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-xl font-bold text-gray-800">
                                        {scores[kriteriaKey]}<span className="text-gray-500">/10</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Sangat Kurang - Sangat Baik</p>
                            </div>
                        ))}

                        {/* Catatan Evaluasi */}
                        <div className="mb-6">
                            <label htmlFor="catatan" className="block text-md font-semibold text-gray-700 mb-2">
                                Catatan Evaluasi
                            </label>
                            <textarea
                                id="catatan"
                                rows="5"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Tambahkan catatan atau komentar mengenai kandidat..."
                                value={catatanEvaluasi}
                                onChange={(e) => setCatatanEvaluasi(e.target.value)}
                                maxLength="500"
                            ></textarea>
                            <p className="text-right text-sm text-gray-500">{catatanEvaluasi.length}/500 karakter</p>
                        </div>

                        {/* Total Skor */}
                        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-md mt-6">
                            <h3 className="text-lg font-semibold text-blue-800">Total Skor</h3>
                            <div className="text-2xl font-bold text-blue-800">
                                {totalSkor}<span className="text-blue-600">/10.0</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Skor akhir berdasarkan bobot kriteria</p>
                    </div>

                    {/* Footer Aksi */}
                    <div className="flex justify-end p-6 bg-gray-50 border-t border-gray-200 space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard-dm")}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Kembali
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                        >
                            Simpan Draft
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <span className="mr-2">✔️</span> Submit Evaluasi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PenilaianForm;