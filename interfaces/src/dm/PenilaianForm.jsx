import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../admin/components/Sidebar";
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


    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: "",
        message: "",
        type: "info",
        onConfirm: null
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const candidates = await getAlternativesByProject(projectId);
                const foundCandidate = candidates.find(c => c.alternative_id === parseInt(kandidatId) || c.id === parseInt(kandidatId));

                if (foundCandidate) {

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


                const { getAssignedProjects } = await import('../services/projectService');
                const assignedProjects = await getAssignedProjects();
                console.log('[PenilaianForm] Assigned projects:', assignedProjects);

                const currentProject = assignedProjects.find(p =>
                    (p.ID || p.project_id) === parseInt(projectId)
                );
                console.log('[PenilaianForm] Current project:', currentProject);

                const dmMethod = currentProject?.method || 'TOPSIS';
                console.log('[PenilaianForm] DM Method:', dmMethod);


                const criteriaData = await getCriteriaByProject(projectId);
                console.log('[PenilaianForm] All criteria from API:', criteriaData);

                // TOPSIS uses flat criteria structure (1 level)
                // No need to filter by parent_criteria_id
                // Backend returns tree structure, but we flatten it to get all criteria
                const flattenCriteria = (criteriaTree) => {
                    const flattened = [];
                    (criteriaTree || []).forEach(parent => {
                        flattened.push(parent);
                        // Also add any sub-criteria if they exist (for backward compatibility)
                        if (parent.sub_criteria && Array.isArray(parent.sub_criteria) && parent.sub_criteria.length > 0) {
                            parent.sub_criteria.forEach(sub => {
                                flattened.push(sub);
                            });
                        }
                    });
                    return flattened;
                };

                const allCriteria = flattenCriteria(criteriaData);
                
                console.log('[PenilaianForm] Flattened criteria:', allCriteria);
                console.log('[PenilaianForm] DM Method:', dmMethod);
                console.log('[PenilaianForm] Total criteria count:', allCriteria.length);

                // For TOPSIS: show all criteria (flat structure)
                setCriteriaList(allCriteria);
                console.log('[PenilaianForm] Criteria to display:', allCriteria);


                const existingScores = await getScores(projectId);

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


    useEffect(() => {
        if (criteriaList.length === 0) return;

        // Calculate weighted average based on criteria type
        const filledScores = Object.entries(scores);
        if (filledScores.length > 0) {
            // Normalize scores to percentage for display
            let totalPercentage = 0;
            let count = 0;
            
            filledScores.forEach(([criteriaId, scoreValue]) => {
                const criteria = criteriaList.find(c => (c.criteria_id || c.id) === parseInt(criteriaId));
                if (criteria) {
                    const isCost = criteria.type?.toLowerCase() === 'cost';
                    const maxScore = isCost ? 3 : 100;
                    // Convert to percentage (0-100%)
                    const percentage = (scoreValue / maxScore) * 100;
                    totalPercentage += percentage;
                    count++;
                }
            });
            
            setTotalScore((totalPercentage / count).toFixed(1));
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
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen bg-gray-100 p-8">
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

                        {criteriaList.map((criteria) => {
                            const isCost = criteria.type?.toLowerCase() === 'cost';
                            console.log(`[PenilaianForm] Rendering criteria: ${criteria.name} (Type: ${criteria.type})`);
                            const scoreOptions = isCost ? [0, 1, 2, 3] : [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
                            const maxScore = isCost ? 3 : 100;
                            const currentScore = scores[criteria.criteria_id || criteria.id] || 0;

                            return (
                                <div key={criteria.criteria_id || criteria.id} className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-md font-semibold text-gray-700 capitalize">
                                            {criteria.name}
                                        </label>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            isCost 
                                                ? 'bg-red-100 text-red-700' 
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {criteria.type} ({isCost ? '1-3' : '10-100'})
                                        </span>
                                    </div>
                                    
                                    {isCost ? (
                                        // Cost criteria: 1-3 scale with buttons
                                        <div className="flex justify-between items-center">
                                            <div className="flex space-x-4">
                                                {scoreOptions.map((num) => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        className={`w-16 h-16 rounded-lg flex items-center justify-center border-2 transition-all font-semibold text-lg ${
                                                            currentScore === num
                                                                ? "bg-red-600 text-white border-red-600 shadow-lg scale-105"
                                                                : "bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-300"
                                                        }`}
                                                        onClick={() => handleScoreChange(criteria.criteria_id || criteria.id, num)}
                                                    >
                                                        {num}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="text-2xl font-bold text-gray-800">
                                                {currentScore}<span className="text-gray-500">/{maxScore}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        // Benefit criteria: 10-100 scale with buttons
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                {scoreOptions.map((num) => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        className={`w-16 h-12 rounded-md flex items-center justify-center border transition-all font-semibold ${
                                                            currentScore === num
                                                                ? "bg-green-600 text-white border-green-600 shadow-md scale-105"
                                                                : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
                                                        }`}
                                                        onClick={() => handleScoreChange(criteria.criteria_id || criteria.id, num)}
                                                    >
                                                        {num}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="text-xl font-bold text-gray-800">
                                                Selected: {currentScore}<span className="text-gray-500">/{maxScore}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <p className="text-xs text-gray-400 mt-2">
                                        {isCost 
                                            ? '1 = Biaya Rendah (Terbaik), 2 = Sedang, 3 = Tinggi (Terburuk)' 
                                            : '10 = Sangat Kurang, 100 = Sangat Baik'}
                                    </p>
                                </div>
                            );
                        })}

                        {/* Total Skor Estimate */}
                        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-md mt-6">
                            <h3 className="text-lg font-semibold text-blue-800">Estimasi Rata-rata (Normalized %)</h3>
                            <div className="text-2xl font-bold text-blue-800">
                                {totalScore}<span className="text-blue-600">%</span>
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
        </>
    );
}

export default PenilaianForm;