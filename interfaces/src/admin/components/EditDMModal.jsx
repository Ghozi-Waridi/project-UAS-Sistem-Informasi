import React, { useState } from "react";
import { updateDecisionMaker } from "../../services/projectService";

export default function EditDMModal({ projectId, assignment, onClose, onSuccess }) {
   const [method, setMethod] = useState(assignment.method);
   const [groupWeight, setGroupWeight] = useState(assignment.group_weight);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const methods = ["AHP", "AHP_SAW", "TOPSIS", "DIRECT_WEIGHT"];

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      // Validation
      if (!method) {
         setError("Metode harus dipilih");
         return;
      }
      if (groupWeight < 0 || groupWeight > 10) {
         setError("Bobot harus antara 0 dan 10");
         return;
      }

      setLoading(true);
      try {
         await updateDecisionMaker(projectId, assignment.project_dm_id, {
            method,
            group_weight: parseFloat(groupWeight),
         });
         onSuccess();
         onClose();
      } catch (err) {
         console.error("Failed to update DM:", err);
         setError(err.error || "Gagal mengupdate Decision Maker");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
               Edit Decision Maker
            </h2>

            {error && (
               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                  {error}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Method Selection */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Metode Perhitungan
                  </label>
                  <select
                     value={method}
                     onChange={(e) => setMethod(e.target.value)}
                     className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                     required
                  >
                     <option value="">Pilih Metode</option>
                     {methods.map((m) => (
                        <option key={m} value={m}>
                           {m}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Group Weight */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Bobot Grup (1-10)
                  </label>
                  <input
                     type="number"
                     step="0.01"
                     min="0"
                     max="10"
                     value={groupWeight}
                     onChange={(e) => setGroupWeight(e.target.value)}
                     className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                     required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                     Nilai antara 1 hingga 10
                  </p>
               </div>

               {/* Actions */}
               <div className="flex gap-3 pt-2">
                  <button
                     type="button"
                     onClick={onClose}
                     className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                     Batal
                  </button>
                  <button
                     type="submit"
                     disabled={loading}
                     className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold px-4 py-2.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {loading ? "Menyimpan..." : "Simpan"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
