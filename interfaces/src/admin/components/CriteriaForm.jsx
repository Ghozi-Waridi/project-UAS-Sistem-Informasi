import React, { useState, useEffect } from 'react';
import { createCriteria, updateCriteria, getCriteriaByProject } from '../../services/criteriaService';

export default function CriteriaForm({ projectId, initialData, onClose, onSuccess }) {
   const [formData, setFormData] = useState({
      name: "",
      code: "",
      type: "benefit",
      parent_criteria_id: null
   });
   const [existingCriteria, setExistingCriteria] = useState([]);
   const [loading, setLoading] = useState(true);

   // Fetch existing criteria for parent selection
   useEffect(() => {
      const fetchCriteria = async () => {
         try {
            const criteria = await getCriteriaByProject(projectId);
            // Only show parent criteria (criteria without parent) as options
            const parentCriteria = criteria.filter(c => !c.parent_criteria_id);
            setExistingCriteria(parentCriteria);
         } catch (error) {
            console.error("Failed to fetch criteria:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchCriteria();
   }, [projectId]);

   useEffect(() => {
      if (initialData) {
         setFormData({
            name: initialData.name || "",
            code: initialData.code || "",
            type: initialData.type || "benefit",
            parent_criteria_id: initialData.parent_criteria_id || null
         });
      }
   }, [initialData]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const dataToSend = {
            name: formData.name,
            code: formData.code,
            type: formData.type,
            ...(formData.parent_criteria_id && { parent_criteria_id: parseInt(formData.parent_criteria_id) })
         };

         if (initialData) {
            await updateCriteria(projectId, initialData.criteria_id, dataToSend);
         } else {
            await createCriteria(projectId, dataToSend);
         }
         onSuccess();
         onClose();
      } catch (error) {
         console.error("Failed to save criteria:", error);
         alert("Gagal menyimpan kriteria");
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
         <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Kriteria' : 'Tambah Kriteria'}</h2>
            <form onSubmit={handleSubmit}>
               <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kriteria</label>
                  <input
                     type="text"
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     required
                     placeholder="Contoh: Pengalaman Kerja"
                  />
               </div>
               <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode (Opsional)</label>
                  <input
                     type="text"
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                     value={formData.code}
                     onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                     placeholder="Contoh: C1"
                  />
               </div>
               <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                  <select
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                     value={formData.type}
                     onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                     <option value="benefit">Benefit (Semakin besar semakin baik)</option>
                     <option value="cost">Cost (Semakin kecil semakin baik)</option>
                  </select>
               </div>

               {/* Parent Criteria Selection */}
               <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Parent Criteria (Opsional)
                  </label>
                  <select
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                     value={formData.parent_criteria_id || ""}
                     onChange={(e) => setFormData({ ...formData, parent_criteria_id: e.target.value || null })}
                     disabled={loading}
                  >
                     <option value="">-- Kriteria Utama (Tanpa Parent) --</option>
                     {existingCriteria.map(c => (
                        <option key={c.criteria_id} value={c.criteria_id}>
                           {c.code ? `${c.code} - ${c.name}` : c.name}
                        </option>
                     ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                     Pilih parent jika ini adalah sub-kriteria. Kosongkan untuk kriteria utama.
                  </p>
               </div>

               <div className="flex justify-end gap-3">
                  <button
                     type="button"
                     onClick={onClose}
                     className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                     Batal
                  </button>
                  <button
                     type="submit"
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                     Simpan
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
