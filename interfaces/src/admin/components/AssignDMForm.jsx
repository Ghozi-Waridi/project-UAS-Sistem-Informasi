import React, { useState, useEffect } from "react";
import { getDMs } from "../../services/userService";
import { assignDecisionMaker } from "../../services/projectService";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function AssignDMForm({ projectId, onClose, onSuccess }) {
   const [dms, setDms] = useState([]);
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
      dm_user_id: "",
      method: "DIRECT_WEIGHT",
      group_weight: 1,
   });

   // Modal State
   const [modal, setModal] = useState({
      isOpen: false,
      title: "",
      message: "",
      type: "success",
      onConfirm: null,
   });

   useEffect(() => {
      fetchDMs();
   }, []);

   const fetchDMs = async () => {
      try {
         const data = await getDMs();
         setDms(Array.isArray(data) ? data : []);
      } catch (error) {
         console.error("Failed to fetch DMs:", error);
      }
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: name === "dm_user_id" || name === "group_weight" ? Number(value) : value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
         await assignDecisionMaker(projectId, formData);
         setModal({
            isOpen: true,
            title: "Berhasil",
            message: "Decision Maker berhasil ditambahkan!",
            type: "success",
            onConfirm: () => {
               onSuccess();
               onClose();
            },
            confirmText: "Oke",
            cancelText: "Tutup"
         });
      } catch (error) {
         console.error("Failed to assign DM:", error);
         setModal({
            isOpen: true,
            title: "Gagal",
            message: "Gagal menambahkan Decision Maker: " + (error.error || error.message || "Unknown error"),
            type: "danger",
            onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
            confirmText: "Coba Lagi",
            cancelText: "Tutup"
         });
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 space-y-4">
               <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                     Tambah Decision Maker
                  </h2>
                  <button
                     onClick={onClose}
                     className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                     ✕
                  </button>
               </div>

               <form className="space-y-3" onSubmit={handleSubmit}>
                  {/* Pilih User */}
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Pilih User (DM) *
                     </label>
                     <select
                        name="dm_user_id"
                        value={formData.dm_user_id}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                     >
                        <option value="" disabled>Pilih User</option>
                        {dms.map((dm) => (
                           <option key={dm.user_id} value={dm.user_id}>
                              {dm.name} ({dm.email})
                           </option>
                        ))}
                     </select>
                  </div>

                  {/* Metode */}
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Metode Penilaian *
                     </label>
                     <select
                        name="method"
                        value={formData.method}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                     >
                        <option value="DIRECT_WEIGHT">Direct Weight</option>
                        <option value="AHP_SAW">Pairwise Comparison (AHP)</option>
                        <option value="TOPSIS">TOPSIS</option>
                     </select>
                  </div>

                  {/* Bobot Group */}
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Bobot Group (1-10) *
                     </label>
                     <input
                        type="number"
                        name="group_weight"
                        value={formData.group_weight}
                        onChange={handleChange}
                        min="1"
                        max="10"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                     />
                     <p className="text-[10px] text-gray-400">
                        Semakin tinggi angka, semakin besar pengaruh penilaian user ini.
                     </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                     <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-2xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
                     >
                        Batal
                     </button>
                     <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 shadow-md hover:shadow-lg disabled:opacity-50"
                     >
                        {loading ? "Menyimpan..." : "Tambah"}
                     </button>
                  </div>
               </form>
            </div>
         </div>

         <ConfirmationModal
            isOpen={modal.isOpen}
            onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
            onConfirm={modal.onConfirm}
            title={modal.title}
            message={modal.message}
            type={modal.type}
            confirmText={modal.confirmText}
            cancelText={modal.cancelText}
         />
      </>
   );
}
