import React, { useState, useEffect, useMemo } from "react";
import {
    BsBarChartFill,
    BsFileEarmarkArrowUp,
    BsPrinter,
    BsPerson,
    BsCheckCircle,
    BsPersonBadge,
    BsXCircle,
    BsStar,
    BsGrid,
    BsListUl,
    BsGraphUp,
    BsCheckCircleFill,
} from "react-icons/bs";
import { getAssignedProjects } from "../services/projectService";
import { getResults } from "../services/resultService";
import { getAlternativesByProject } from "../services/alternativeService";

function StatCard({ icon, value, title, bgColor, iconColor }) {
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

function HasilSeleksi() {
    const [activeTab, setActiveTab] = useState("ringkasan");
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [results, setResults] = useState([]);
    const [alternatives, setAlternatives] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Assigned Projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAssignedProjects();
                // Ensure data is an array
                const projectsArray = Array.isArray(data) ? data : [];
                setProjects(projectsArray);
                if (projectsArray.length > 0) {
                    setSelectedProjectId(projectsArray[0].project_id);
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                setProjects([]); // Set empty array on error
            }
        };
        fetchProjects();
    }, []);

    // Fetch Results
    useEffect(() => {
        if (!selectedProjectId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const alts = await getAlternativesByProject(selectedProjectId);
                setAlternatives(alts);

                const res = await getResults(selectedProjectId);
                setResults(res || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedProjectId]);

    // Merge Data
    const mergedData = useMemo(() => {
        if (!results.length || !alternatives.length) return [];

        // Filter for final results (consensus)
        const finalResults = results.filter(r => r.ProjectDMID === null);

        return finalResults.map(r => {
            const alt = alternatives.find(a => (a.alternative_id || a.id) === r.AlternativeID);
            return {
                id: r.ID,
                name: alt ? alt.name : `Unknown (${r.AlternativeID})`,
                role: "Candidate",
                score: r.FinalScore,
                rank: r.Rank,
            };
        }).sort((a, b) => a.rank - b.rank);
    }, [results, alternatives]);

    const stats = useMemo(() => {
        const total = mergedData.length;
        const avgScore = total > 0 ? mergedData.reduce((acc, c) => acc + c.score, 0) / total : 0;
        const accepted = mergedData.filter((c, idx) => idx < 3).length;
        const interview = mergedData.filter((c, idx) => idx >= 3 && idx < 6).length;
        const rejected = total - accepted - interview;

        return { total, accepted, interview, rejected, avgScore };
    }, [mergedData]);

    const getSkorColor = (skor) => {
        if (skor >= 9.0) return "text-green-600";
        if (skor >= 8.0) return "text-gray-800";
        return "text-red-600";
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Hasil Seleksi
                            </h1>
                            <BsBarChartFill className="text-2xl text-blue-500" />
                        </div>
                        <p className="text-gray-500 mt-1">
                            Hasil akhir proses seleksi berdasarkan konsensus GDSS
                        </p>
                    </div>
                    <div className="flex space-x-3 items-center">
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                        >
                            <option value="" disabled>Pilih Proyek</option>
                            {projects.map(p => (
                                <option key={p.project_id} value={p.project_id}>{p.project_name}</option>
                            ))}
                        </select>
                        <button className="flex items-center px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors font-semibold">
                            <BsFileEarmarkArrowUp className="mr-2" /> Export
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                    <StatCard
                        icon={<BsPerson className="text-2xl" />}
                        value={stats.total}
                        title="Total Kandidat"
                        bgColor="bg-blue-100"
                        iconColor="text-blue-600"
                    />
                    <StatCard
                        icon={<BsCheckCircle className="text-2xl" />}
                        value={stats.accepted}
                        title="Top 3"
                        bgColor="bg-green-100"
                        iconColor="text-green-600"
                    />
                    <StatCard
                        icon={<BsPersonBadge className="text-2xl" />}
                        value={stats.interview}
                        title="Next 3"
                        bgColor="bg-blue-100"
                        iconColor="text-blue-600"
                    />
                    <StatCard
                        icon={<BsXCircle className="text-2xl" />}
                        value={stats.rejected}
                        title="Lainnya"
                        bgColor="bg-red-100"
                        iconColor="text-red-600"
                    />
                    <StatCard
                        icon={<BsStar className="text-2xl" />}
                        value={stats.avgScore.toFixed(2)}
                        title="Rata-rata Skor"
                        bgColor="bg-purple-100"
                        iconColor="text-purple-600"
                    />
                </div>

                {/* Konten Tab */}
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Navigasi Tab */}
                    <div className="flex border-b border-gray-200 px-6">
                        <button
                            onClick={() => setActiveTab("ringkasan")}
                            className={`flex items-center px-1 py-4 text-base font-semibold ${activeTab === "ringkasan"
                                ? "border-b-2 border-blue-600 text-blue-700"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <BsGrid className="mr-2" />
                            Ringkasan
                        </button>
                        <button
                            onClick={() => setActiveTab("detail")}
                            className={`flex items-center ml-8 px-1 py-4 text-base font-semibold ${activeTab === "detail"
                                ? "border-b-2 border-blue-600 text-blue-700"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <BsListUl className="mr-2" />
                            Detail Hasil
                        </button>
                    </div>

                    {/* Konten yang Ditampilkan */}
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-10 text-gray-500">Memuat data...</div>
                        ) : mergedData.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">Belum ada hasil perhitungan untuk proyek ini.</div>
                        ) : (
                            <>
                                {activeTab === "ringkasan" && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            Ringkasan Hasil Seleksi
                                        </h2>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                                            {/* Kolom Kandidat Terbaik */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                                    Kandidat Terbaik (Top 3)
                                                </h3>
                                                <div className="space-y-4">
                                                    {mergedData.slice(0, 3).map((k) => (
                                                        <div
                                                            key={k.id}
                                                            className="bg-green-50 border border-green-200 rounded-lg p-4"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">#{k.rank}</span>
                                                                        <h4 className="font-semibold text-lg text-gray-800">{k.name}</h4>
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 ml-8">{k.role}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-bold text-lg text-green-700">
                                                                        {k.score.toFixed(4)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Kolom Lainnya */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                                    Kandidat Lainnya
                                                </h3>
                                                <div className="space-y-4">
                                                    {mergedData.slice(3, 8).map((k) => (
                                                        <div
                                                            key={k.id}
                                                            className="border rounded-lg p-4 bg-gray-50 border-gray-200"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">#{k.rank}</span>
                                                                        <h4 className="font-semibold text-lg text-gray-800">{k.name}</h4>
                                                                    </div>
                                                                </div>
                                                                <p className="font-bold text-lg text-gray-600">
                                                                    {k.score.toFixed(4)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "detail" && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            Detail Hasil Evaluasi
                                        </h2>
                                        <div className="overflow-x-auto mt-4">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Rank
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Kandidat
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Posisi
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Skor Akhir
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {mergedData.map((k, idx) => (
                                                        <tr key={k.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-gray-700">
                                                                #{k.rank}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {k.name}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                                {k.role}
                                                            </td>
                                                            <td
                                                                className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getSkorColor(k.score)}`}
                                                            >
                                                                {k.score.toFixed(4)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {idx < 3 ? (
                                                                    <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                        <BsCheckCircleFill className="mr-1.5" />
                                                                        Disarankan
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                                        -
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HasilSeleksi;