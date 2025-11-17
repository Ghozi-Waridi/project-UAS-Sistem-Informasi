import React from "react";
import { Link } from "react-router-dom";
import {
    BsArrowLeft,
    BsPeopleFill,
    BsCheckCircleFill,
    BsClockFill,
} from "react-icons/bs";

// Kita gunakan data yang sama dari Dashboard untuk konsistensi
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

function DetailKonsensus() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* --- Header Halaman --- */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <BsPeopleFill className="text-2xl text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-800">
                            Detail Status Konsensus
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

                {/* --- Card Konten (Sama seperti di Dashboard) --- */}
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
                </div>
            </div>
        </div>
    );
}

export default DetailKonsensus;