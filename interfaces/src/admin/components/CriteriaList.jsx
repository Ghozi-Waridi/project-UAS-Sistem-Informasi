import React, { useState, useEffect } from 'react';
import { getCriteriaByProject, deleteCriteria } from '../../services/criteriaService';

export default function CriteriaList({ projectId, onEdit }) {
   const [criteria, setCriteria] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (projectId) {
         fetchCriteria();
      }
   }, [projectId]);

   const fetchCriteria = async () => {
      try {
         setLoading(true);
         const data = await getCriteriaByProject(projectId);
         setCriteria(data || []);
      } catch (error) {
         console.error("Failed to fetch criteria:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus kriteria ini?")) {
         try {
            await deleteCriteria(projectId, id);
            fetchCriteria();
         } catch (error) {
            console.error("Failed to delete criteria:", error);
            alert("Gagal menghapus kriteria");
         }
      }
   };

   if (loading) return <div className="text-center py-4 text-gray-500">Loading criteria...</div>;

   return (
      <div className="bg-white rounded-3xl shadow-card px-6 py-5 flex flex-col gap-4">
         <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Daftar Kriteria</h3>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-sm">
               <thead>
                  <tr className="text-gray-400 text-xs border-b">
                     <th className="py-2 text-left">Nama</th>
                     <th className="py-2 text-left">Kode</th>
                     <th className="py-2 text-left">Tipe</th>
                     <th className="py-2 text-right">Aksi</th>
                  </tr>
               </thead>
               <tbody>
                  {criteria.length > 0 ? (
                     criteria.map((c) => (
                        <tr key={c.criteria_id} className="border-b last:border-0 hover:bg-gray-50">
                           <td className="py-3 font-medium text-gray-800">{c.name}</td>
                           <td className="py-3 text-gray-600">{c.code || '-'}</td>
                           <td className="py-3">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${c.type === 'benefit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                 {c.type}
                              </span>
                           </td>
                           <td className="py-3 text-right">
                              <button
                                 onClick={() => onEdit(c)}
                                 className="text-blue-600 hover:text-blue-800 mr-3"
                              >
                                 ✏️
                              </button>
                              <button
                                 onClick={() => handleDelete(c.criteria_id)}
                                 className="text-red-600 hover:text-red-800"
                              >
                                 🗑️
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan="4" className="py-4 text-center text-gray-500">
                           Belum ada kriteria.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}
