import React, { useState, useEffect } from 'react';
import { createAlternative, updateAlternative } from '../../services/alternativeService';

export default function CandidateForm({ projectId, initialData, onClose, onSuccess }) {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      experience: "",
      education: "",
      salaryExpectation: "",
      availability: "",
      portfolio: "",
      github: "",
      linkedin: "",
      skills: "",
      status: "Pending",
      date: new Date().toLocaleDateString('id-ID'),
   });

   useEffect(() => {
      if (initialData) {
         setFormData({
            name: initialData.name || "",
            email: initialData.email || "",
            phone: initialData.phone || "",
            experience: initialData.experience || "",
            education: initialData.education || "",
            salaryExpectation: initialData.salaryExpectation || "",
            availability: initialData.availability || "",
            portfolio: initialData.portfolio || "",
            github: initialData.github || "",
            linkedin: initialData.linkedin || "",
            skills: Array.isArray(initialData.skills) ? initialData.skills.join(", ") : (initialData.skills || ""),
            status: initialData.status || "Pending",
            date: initialData.date || new Date().toLocaleDateString('id-ID'),
         });
      }
   }, [initialData]);

   const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      const skillsArray = formData.skills
         .split(",")
         .map((s) => s.trim())
         .filter(Boolean);

      const candidateData = {
         ...formData,
         skills: skillsArray,
      };

      // Prepare payload for backend
      // We store the rich details in 'description' field as JSON
      const payload = {
         name: formData.name,
         description: JSON.stringify(candidateData)
      };

      try {
         if (initialData) {
            await updateAlternative(projectId, initialData.id, payload);
         } else {
            await createAlternative(projectId, payload);
         }
         onSuccess();
         onClose();
      } catch (error) {
         console.error("Failed to save candidate:", error);
         alert("Gagal menyimpan kandidat: " + (error.message || "Unknown error"));
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
         <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-lg font-semibold text-gray-900">
                  {initialData ? "Edit Kandidat" : "Tambah Kandidat"}
               </h2>
               <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl"
               >
                  ✕
               </button>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
               {/* Nama & Email */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Nama Lengkap *
                     </label>
                     <input
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Email *
                     </label>
                     <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                     />
                  </div>
               </div>

               {/* Telepon & Pengalaman */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Telepon *
                     </label>
                     <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Pengalaman *
                     </label>
                     <input
                        name="experience"
                        value={formData.experience}
                        onChange={handleFormChange}
                        placeholder="contoh: 3 tahun"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                     />
                  </div>
               </div>

               {/* Pendidikan & Ekspektasi Gaji */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Pendidikan *
                     </label>
                     <input
                        name="education"
                        value={formData.education}
                        onChange={handleFormChange}
                        placeholder="contoh: S1 Teknik Informatika"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Ekspektasi Gaji
                     </label>
                     <input
                        name="salaryExpectation"
                        value={formData.salaryExpectation}
                        onChange={handleFormChange}
                        placeholder="contoh: Rp 12.000.000"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                     />
                  </div>
               </div>

               {/* Ketersediaan & Portfolio */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Ketersediaan
                     </label>
                     <input
                        name="availability"
                        value={formData.availability}
                        onChange={handleFormChange}
                        placeholder="contoh: Segera, 2 minggu"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Portfolio
                     </label>
                     <input
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleFormChange}
                        placeholder="https://portfolio.com"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                     />
                  </div>
               </div>

               {/* GitHub & LinkedIn */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        GitHub
                     </label>
                     <input
                        name="github"
                        value={formData.github}
                        onChange={handleFormChange}
                        placeholder="https://github.com/username"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        LinkedIn
                     </label>
                     <input
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleFormChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                     />
                  </div>
               </div>

               {/* Keahlian */}
               <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                     Keahlian *
                  </label>
                  <input
                     name="skills"
                     value={formData.skills}
                     onChange={handleFormChange}
                     placeholder="React, Node.js, TypeScript (pisahkan dengan koma)"
                     className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                     required
                  />
                  <p className="text-[11px] text-gray-400">
                     Pisahkan setiap keahlian dengan koma
                  </p>
               </div>

               {/* Tanggal & Status */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Tanggal
                     </label>
                     <input
                        name="date"
                        value={formData.date}
                        onChange={handleFormChange}
                        placeholder="15/1/2024"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Status
                     </label>
                     <select
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                     >
                        <option value="Pending">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="Evaluated">Evaluated</option>
                     </select>
                  </div>
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
                     className="px-5 py-2 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 shadow-md hover:shadow-lg"
                  >
                     {initialData ? "Simpan Perubahan" : "Tambah"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
