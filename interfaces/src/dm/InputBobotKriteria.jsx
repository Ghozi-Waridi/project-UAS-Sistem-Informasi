import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../admin/components/Sidebar";
import { getCriteriaByProject } from "../services/criteriaService";
import { submitDirectWeights, getDirectWeights } from "../services/evaluationService";
import ConfirmationModal from "../components/ConfirmationModal";

function InputBobotKriteria() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [criteriaList, setCriteriaList] = useState([]);
    const [weights, setWeights] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [totalWeight, setTotalWeight] = useState(0);
    const [projectName, setProjectName] = useState("");

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

                // Get assigned projects to find project name
                const { getAssignedProjects } = await import('../services/projectService');
                const assignedProjects = await getAssignedProjects();
                const currentProject = assignedProjects.find(p =>
                    (p.ID || p.project_id) === parseInt(projectId)
                );
                setProjectName(currentProject?.name || currentProject?.project_name || "Project");

                // Get criteria
                const criteriaData = await getCriteriaByProject(projectId);
                
                // Flatten criteria tree
                const flattenCriteria = (criteriaTree) => {
                    const flattened = [];
                    (criteriaTree || []).forEach(parent => {
                        flattened.push(parent);
                        if (parent.sub_criteria && Array.isArray(parent.sub_criteria) && parent.sub_criteria.length > 0) {
                            parent.sub_criteria.forEach(sub => {
                                flattened.push(sub);
                            });
                        }
                    });
                    return flattened;
                };

                const allCriteria = flattenCriteria(criteriaData);
                setCriteriaList(allCriteria);

                // Get existing weights if any
                try {
                    const existingWeights = await getDirectWeights(projectId);
                    const initialWeights = {};
                    existingWeights.forEach(w => {
                        initialWeights[w.criteria_id] = w.weight_value;
                    });
                    setWeights(initialWeights);
                } catch (error) {
                    console.log("No existing weights, starting fresh");
                    // Initialize with equal weights
                    const equalWeight = allCriteria.length > 0 ? (1 / allCriteria.length).toFixed(4) : 0;
                    const initialWeights = {};
                    allCriteria.forEach(c => {
                        initialWeights[c.criteria_id || c.id] = parseFloat(equalWeight);
                    });
                    setWeights(initialWeights);
                }

            } catch (error) {
                console.error("Failed to fetch data:", error);
                setModalConfig({
                    title: "Error",
                    message: "Gagal memuat data kriteria.",
                    type: "error",
                    onConfirm: () => setShowModal(false)
                });
                setShowModal(true);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchData();
        }
    }, [projectId]);

    // Calculate total weight
    useEffect(() => {
        const total = Object.values(weights).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        setTotalWeight(total.toFixed(4));
    }, [weights]);

    const handleWeightChange = (criteriaId, value) => {
        const numValue = parseFloat(value);
        if (numValue >= 0 && numValue <= 1) {
            setWeights(prev => ({
                ...prev,
                [criteriaId]: numValue
            }));
        }
    };

    const handleNormalize = () => {
        const total = Object.values(weights).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        if (total === 0) return;

        const normalized = {};
        Object.keys(weights).forEach(criteriaId => {
            normalized[criteriaId] = parseFloat((weights[criteriaId] / total).toFixed(4));
        });
        setWeights(normalized);
    };

    const handleEqualDistribution = () => {
        const equalWeight = criteriaList.length > 0 ? (1 / criteriaList.length).toFixed(4) : 0;
        const equalWeights = {};
        criteriaList.forEach(c => {
            equalWeights[c.criteria_id || c.id] = parseFloat(equalWeight);
        });
        setWeights(equalWeights);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate total weight
        const total = parseFloat(totalWeight);
        if (Math.abs(total - 1.0) > 0.01) {
            setModalConfig({
                title: "Validasi Gagal",
                message: `Total bobot harus = 1.0 (saat ini: ${totalWeight}). Gunakan tombol "Normalisasi" untuk menyesuaikan.`,
                type: "warning",
                onConfirm: () => setShowModal(false)
            });
            setShowModal(true);
            return;
        }

        setSubmitting(true);
        try {
            const weightsArray = Object.keys(weights).map(criteriaId => ({
                criteria_id: parseInt(criteriaId),
                weight_value: parseFloat(weights[criteriaId])
            }));

            await submitDirectWeights(projectId, { weights: weightsArray });

            setModalConfig({
                title: "Berhasil!",
                message: "Bobot kriteria berhasil disimpan!",
                type: "success",
                onConfirm: () => {
                    setShowModal(false);
                    navigate("/dm/dashboard");
                }
            });
            setShowModal(true);
        } catch (error) {
            console.error("Failed to submit weights:", error);
            setModalConfig({
                title: "Error",
                message: "Gagal menyimpan bobot: " + (error.message || "Unknown error"),
                type: "error",
                onConfirm: () => setShowModal(false)
            });
            setShowModal(true);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Memuat data...</div>;

    return (
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-card overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
                            <h1 className="text-2xl font-bold mb-1">Input Bobot Kriteria</h1>
                            <p className="text-blue-100 text-sm">Project: {projectName}</p>
                        </div>

                        {/* Info Box */}
                        <div className="p-6 bg-blue-50 border-b border-blue-100">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">ℹ️</div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 mb-1">Tentang Bobot Kriteria</h3>
                                    <p className="text-sm text-gray-600">
                                        Bobot kriteria menentukan seberapa penting setiap kriteria dalam penilaian akhir.
                                        Total semua bobot harus = 1.0 (100%).
                                    </p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        Contoh: Jika "Pengalaman" = 0.4 dan "Pendidikan" = 0.3, maka Pengalaman lebih penting.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="p-6 border-b border-gray-200 flex gap-3">
                            <button
                                type="button"
                                onClick={handleEqualDistribution}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                🔄 Bagi Rata
                            </button>
                            <button
                                type="button"
                                onClick={handleNormalize}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-2xl text-sm font-medium hover:bg-blue-200 transition-colors"
                            >
                                ⚖️ Normalisasi
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Daftar Kriteria</h2>

                                {criteriaList.map((criteria, index) => (
                                    <div key={criteria.criteria_id || criteria.id} className="bg-gray-50 rounded-2xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded-full">
                                                        #{index + 1}
                                                    </span>
                                                    <label className="text-md font-semibold text-gray-800 capitalize">
                                                        {criteria.name}
                                                    </label>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Type: <span className={`px-2 py-0.5 rounded-full ${criteria.type === 'benefit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {criteria.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                step="0.0001"
                                                min="0"
                                                max="1"
                                                value={weights[criteria.criteria_id || criteria.id] || 0}
                                                onChange={(e) => handleWeightChange(criteria.criteria_id || criteria.id, e.target.value)}
                                                className="flex-1 rounded-2xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                required
                                            />
                                            <div className="text-right min-w-[80px]">
                                                <div className="text-lg font-bold text-gray-800">
                                                    {((weights[criteria.criteria_id || criteria.id] || 0) * 100).toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Visual Bar */}
                                        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300"
                                                style={{ width: `${(weights[criteria.criteria_id || criteria.id] || 0) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Total Weight Display */}
                                <div className={`mt-6 p-4 rounded-2xl ${Math.abs(parseFloat(totalWeight) - 1.0) <= 0.01 ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className={`text-lg font-semibold ${Math.abs(parseFloat(totalWeight) - 1.0) <= 0.01 ? 'text-green-800' : 'text-yellow-800'}`}>
                                                Total Bobot
                                            </h3>
                                            <p className={`text-xs ${Math.abs(parseFloat(totalWeight) - 1.0) <= 0.01 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {Math.abs(parseFloat(totalWeight) - 1.0) <= 0.01 ? '✓ Sudah sesuai' : '⚠ Harus = 1.0'}
                                            </p>
                                        </div>
                                        <div className={`text-3xl font-bold ${Math.abs(parseFloat(totalWeight) - 1.0) <= 0.01 ? 'text-green-800' : 'text-yellow-800'}`}>
                                            {totalWeight}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate("/dm/dashboard")}
                                    className="px-6 py-2 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || Math.abs(parseFloat(totalWeight) - 1.0) > 0.01}
                                    className={`px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 ${(submitting || Math.abs(parseFloat(totalWeight) - 1.0) > 0.01) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {submitting ? "Menyimpan..." : <><span>✔️</span> Simpan Bobot</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
        </>
    );
}

export default InputBobotKriteria;
