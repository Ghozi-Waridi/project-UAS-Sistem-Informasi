import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAlternativesByProject } from "../services/alternativeService";
import { getCriteriaByProject } from "../services/criteriaService";
import { submitScore, getScores } from "../services/evaluationService";
import ConfirmationModal from "../components/ConfirmationModal";

function PenilaianForm() {
    const { projectId, kandidatId } = useParams();
    const navigate = useNavigate();

    const [candidate, setCandidate] = useState(null);
    const [criteriaList, setCriteriaList] = useState([]);
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [totalScore, setTotalScore] = useState(0);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: "",
        message: "",
        type: "info",
        onConfirm: null
    });

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Fetch Candidate Details (find from list)
                const candidates = await getAlternativesByProject(projectId);
                const foundCandidate = candidates.find(c => c.alternative_id === parseInt(kandidatId) || c.id === parseInt(kandidatId));

                if (foundCandidate) {
                    // Parse description
                    let details = {};
                    try {
                        details = JSON.parse(foundCandidate.description || "{}");
                        if (typeof details === 'string') details = JSON.parse(details);
                        if (details.education && typeof details.education === 'string' && details.education.startsWith('{')) {
                            try { details = JSON.parse(details.education); } catch (e) { }
                        }
                    } catch (e) {
                        details = { note: foundCandidate.description };
                    }
                    setCandidate({ ...foundCandidate, ...details, initials: foundCandidate.name.substring(0, 2).toUpperCase() });
                }

                // 2. Get DM assignment to determine method
                const { getAssignedProjects } = await import('../services/projectService');
                const assignedProjects = await getAssignedProjects();
                const currentProject = assignedProjects.find(p =>
                    (p.ID || p.project_id) === parseInt(projectId)
                );
                const dmMethod = currentProject?.method || 'DIRECT_WEIGHT';

                // 3. Fetch Criteria
                const criteriaData = await getCriteriaByProject(projectId);

                // Filter based on DM method:
                // - AHP_SAW: Show only sub-criteria (needs pairwise comparison)
                // - TOPSIS/DIRECT_WEIGHT: Show all criteria (direct scoring)
                let filteredCriteria = criteriaData || [];
                if (dmMethod === 'AHP_SAW') {
                    const subCriteria = filteredCriteria.filter(c => c.parent_criteria_id);
                    // If no sub-criteria exist, show all (fallback)
                    filteredCriteria = subCriteria.length > 0 ? subCriteria : filteredCriteria;
                }
                // For TOPSIS and DIRECT_WEIGHT, show all criteria

                setCriteriaList(filteredCriteria);

                // 4. Fetch Existing Scores (if any)
                const existingScores = await getScores(projectId);
                // Filter for this candidate
                const candidateScores = existingScores.filter(s => s.alternative_id === parseInt(kandidatId));

                const initialScores = {};
                candidateScores.forEach(s => {
                    initialScores[s.criteria_id] = s.score_value;
                });
                setScores(initialScores);

            } catch (error) {
                console.error("Failed to fetch data:", error);
                setModalConfig({
                    title: "Error",
                    message: "Gagal memuat data penilaian.",
                    type: "error",
                    onConfirm: () => setShowModal(false)
                });
                setShowModal(true);
            } finally {
                setLoading(false);
            }
        };

        if (projectId && kandidatId) {
            fetchData();
        }
    }, [projectId, kandidatId]);

    // Calculate Total Score (Simple Average for now, or based on weights if available)
    // Note: Real calculation happens on backend usually, but we can show estimate
    useEffect(() => {
        if (criteriaList.length === 0) return;

        // Assuming equal weight if not specified, or use criteria weight if available
        // For now, just average of filled scores
        const filledScores = Object.values(scores);
        if (filledScores.length > 0) {
            const sum = filledScores.reduce((a, b) => a + b, 0);
            setTotalScore((sum / filledScores.length).toFixed(1));
        } else {
            setTotalScore(0);
        }
    }, [scores, criteriaList]);

    const handleScoreChange = (criteriaId, value) => {
        setScores(prev => ({
            ...prev,
            [criteriaId]: parseInt(value, 10)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Submit each score
            // We use singular submitScore for each criteria to ensure granular updates
            // Or we could use batch submitScores if backend supports it efficiently

            const promises = Object.keys(scores).map(criteriaId => {
                return submitScore(projectId, {
                    alternative_id: parseInt(kandidatId),
                    criteria_id: parseInt(criteriaId),
                    score_value: scores[criteriaId]
                });
            });

            await Promise.all(promises);

            setModalConfig({
                title: "Berhasil!",
                message: "Penilaian berhasil disimpan!",
                type: "success",
                onConfirm: () => {
                    setShowModal(false);
                    navigate("/dm/dashboard");
                }
            });
            setShowModal(true);
        } catch (error) {
            console.error("Failed to submit scores:", error);
            setModalConfig({
                title: "Error",
                message: "Gagal menyimpan penilaian: " + (error.message || "Unknown error"),
                type: "error",
                onConfirm: () => setShowModal(false)
            });
            setShowModal(true);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Memuat data...</div>;
    if (!candidate) return <div className="p-8 text-center">Kandidat tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Evaluasi Kandidat</h1>
                    <p className="text-gray-500 text-sm">Berikan penilaian untuk kandidat</p>
                </div>

                {/* Kandidat Info */}
                <div className="p-6 border-b border-gray-200 bg-blue-50">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold text-lg">
                            {candidate.initials}
                        </div>
                        <div className="ml-4">
                            <div className="text-lg font-semibold text-gray-800">{candidate.name}</div>
                            <div className="text-sm text-gray-600">
                                <span>{candidate.email || "-"}</span> | <span>{candidate.experience || "-"}</span> |{" "}
                                <span>{candidate.education || "-"}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {candidate.skills && Array.isArray(candidate.skills) && candidate.skills.map((skill, idx) => (
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

                        {criteriaList.map((criteria) => (
                            <div key={criteria.criteria_id || criteria.id} className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-md font-semibold text-gray-700 capitalize">
                                        {criteria.name}
                                    </label>
                                    <span className="text-gray-600 text-sm">Type: {criteria.type}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${scores[criteria.criteria_id || criteria.id] === num
                                                    ? "bg-blue-600 text-white border-blue-600 shadow"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                                                    }`}
                                                onClick={() => handleScoreChange(criteria.criteria_id || criteria.id, num)}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-xl font-bold text-gray-800">
                                        {scores[criteria.criteria_id || criteria.id] || 0}<span className="text-gray-500">/10</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Sangat Kurang - Sangat Baik</p>
                            </div>
                        ))}

                        {/* Total Skor Estimate */}
                        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-md mt-6">
                            <h3 className="text-lg font-semibold text-blue-800">Estimasi Rata-rata</h3>
                            <div className="text-2xl font-bold text-blue-800">
                                {totalScore}<span className="text-blue-600">/10.0</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Aksi */}
                    <div className="flex justify-end p-6 bg-gray-50 border-t border-gray-200 space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate("/dm/dashboard")}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Kembali
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors flex items-center ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? "Menyimpan..." : <><span className="mr-2">✔️</span> Submit Evaluasi</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
            />
        </div>
    );
}

export default PenilaianForm;