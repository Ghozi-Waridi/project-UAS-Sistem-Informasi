import React, { useState } from "react";
import { createDecisionMaker } from "../../services/userService";
import { getCurrentUser } from "../../services/authService";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function CreateDMForm({ onClose, onSuccess }) {
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
   });

   const currentUser = getCurrentUser();

   // Debug log
   console.log('CreateDMForm - Current User:', currentUser);
   console.log('CreateDMForm - Company Name:', currentUser?.company_name);

   // Check if user is logged in
   if (!currentUser) {
      return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 space-y-4">
               <div className="text-center">
                  <div className="text-red-500 text-4xl mb-3">⚠️</div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                     Sesi Berakhir
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                     Silakan login kembali untuk melanjutkan.
                  </p>
                  <button
                     onClick={onClose}
                     className="px-5 py-2 rounded-2xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                  >
                     Tutup
                  </button>
               </div>
            </div>
         </div>
      );
   }

   // Modal State
   const [modal, setModal] = useState({
      isOpen: false,
      title: "",
      message: "",
      type: "success",
      onConfirm: null,
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      // Validation
      if (formData.password !== formData.confirmPassword) {
         setModal({
            isOpen: true,
            title: "Error",
            message: "Password dan konfirmasi password tidak cocok!",
            type: "danger",
            onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
            confirmText: "Oke",
         });
         return;
      }

      if (formData.password.length < 6) {
         setModal({
            isOpen: true,
            title: "Error",
            message: "Password minimal 6 karakter!",
            type: "danger",
            onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
            confirmText: "Oke",
         });
         return;
      }

      setLoading(true);

      try {
         // Create DM user using dedicated endpoint
         const dmData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "dm",
         };

         console.log('Creating DM with data:', dmData);

         await createDecisionMaker(dmData);

         setModal({
            isOpen: true,
            title: "Berhasil",
            message: `Akun Decision Maker untuk ${formData.name} berhasil dibuat!\n\nEmail: ${formData.email}\nPassword: ${formData.password}\n\nSilakan berikan kredensial ini kepada user.`,
            type: "success",
            onConfirm: () => {
               onSuccess();
               onClose();
            },
            confirmText: "Oke",
         });
      } catch (error) {
         console.error("Failed to create DM:", error);
         const errorMsg = error.error || error.message || JSON.stringify(error) || "Unknown error";
         setModal({
            isOpen: true,
            title: "Gagal",
            message: "Gagal membuat akun Decision Maker: " + errorMsg,
            type: "danger",
            onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
            confirmText: "Coba Lagi",
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
                  <div>
                     <h2 className="text-lg font-semibold text-gray-900">
                        Buat Akun Decision Maker
                     </h2>
                     <p className="text-xs text-gray-500 mt-1">
                        User: {currentUser?.name} ({currentUser?.email})
                     </p>
                  </div>
                  <button
                     onClick={onClose}
                     className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                     ✕
                  </button>
               </div>

               <form className="space-y-3" onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Nama Lengkap *
                     </label>
                     <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                        disabled={loading}
                     />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Email *
                     </label>
                     <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="user@company.com"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                        disabled={loading}
                     />
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Password *
                     </label>
                     <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 6 characters"
                        minLength={6}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                        disabled={loading}
                     />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600">
                        Konfirmasi Password *
                     </label>
                     <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat password"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                        disabled={loading}
                     />
                  </div>

                  {/* Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                     <p className="text-xs text-blue-700">
                        💡 Akun DM akan otomatis terhubung dengan perusahaan Anda. User dapat login dengan email dan password yang dibuat.
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
                        className="px-5 py-2 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 shadow-md hover:shadow-lg disabled:opacity-50"
                     >
                        {loading ? "Membuat..." : "Buat Akun DM"}
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
         />
      </>
   );
}
