import React, { useState, useEffect } from 'react';
import { createCriteria, updateCriteria, getCriteriaByProject } from '../../services/criteriaService';

export default function CriteriaForm({ projectId, initialData, onClose, onSuccess }) {
   const [formData, setFormData] = useState({
      name: "",
      code: "",
      type: "benefit",
      weight: 0
   });

   useEffect(() => {
      if (initialData) {
         setFormData({
            name: initialData.name || "",
            code: initialData.code || "",
            type: initialData.type || "benefit",
            weight: initialData.weight || 0
         });
      }
   }, [initialData]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validasi bobot
      const weight = parseFloat(formData.weight);
      if (weight < 0 || weight > 1) {
         alert("Bobot harus antara 0 dan 1");
         return;
      }
      
      try {
         const dataToSend = {
            name: formData.name,
            code: formData.code,
            type: formData.type,
            weight: weight
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

               <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Bobot Kriteria (0-1) *
                  </label>
                  <input
                     type="number"
                     step="0.01"
                     min="0"
                     max="1"
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                     value={formData.weight}
                     onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                     required
                     placeholder="Contoh: 0.25"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                     Bobot menentukan kepentingan kriteria. Pastikan total semua bobot = 1.0
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                     {formData.weight ? `${(parseFloat(formData.weight) * 100).toFixed(0)}%` : '0%'}
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
