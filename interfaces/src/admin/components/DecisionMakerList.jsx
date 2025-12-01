import React, { useState, useEffect } from "react";
import { getProjectDecisionMakers, removeDecisionMaker } from "../../services/projectService";
import { getUserProfile } from "../../services/userService";
import EditDMModal from "./EditDMModal";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function DecisionMakerList({ projectId, refreshTrigger }) {
   const [assignments, setAssignments] = useState([]);
   const [dmDetails, setDmDetails] = useState({}); // Map userID -> User Profile
   const [loading, setLoading] = useState(false);
   const [editingAssignment, setEditingAssignment] = useState(null);

   // Modal State
   const [modal, setModal] = useState({
      isOpen: false,
      title: "",
      message: "",
      type: "confirm",
      onConfirm: null,
   });

   useEffect(() => {
      if (projectId) {
         fetchAssignments();
      }
   }, [projectId, refreshTrigger]);

   const fetchAssignments = async () => {
      setLoading(true);
      try {
         const data = await getProjectDecisionMakers(projectId);

         // Ensure data is an array
         if (!Array.isArray(data)) {
            console.error("Expected array but got:", data);
            setAssignments([]);
            setDmDetails({});
            return;
         }

         setAssignments(data);

         // Fetch user details for each assignment
         const details = {};
         for (const assignment of data) {
            if (!details[assignment.dm_user_id]) {
               try {
                  const user = await getUserProfile(assignment.dm_user_id);
                  details[assignment.dm_user_id] = user;
               } catch (e) {
                  console.error(`Failed to fetch user ${assignment.dm_user_id}`, e);
                  details[assignment.dm_user_id] = { name: "Unknown", email: "-" };
               }
            }
         }
         setDmDetails(details);

      } catch (error) {
         console.error("Failed to fetch assignments:", error);
         setAssignments([]);
         setDmDetails({});
      } finally {
         setLoading(false);
      }
   };

   const handleRemove = (dmUserId) => {
      setModal({
         isOpen: true,
         title: "Hapus Decision Maker",
         message: "Apakah Anda yakin ingin menghapus Decision Maker ini dari project? Semua data penilaian yang terkait juga akan dihapus.",
         type: "danger",
         confirmText: "Ya, Hapus",
         cancelText: "Batal",
         onConfirm: async () => {
            try {
               await removeDecisionMaker(projectId, dmUserId);
               setModal(prev => ({ ...prev, isOpen: false }));
               fetchAssignments(); // Refresh list
            } catch (error) {
               console.error("Failed to remove DM:", error);
               setModal({
                  isOpen: true,
                  title: "Gagal",
                  message: "Gagal menghapus DM: " + (error.message || "Unknown error"),
                  type: "danger",
                  confirmText: "Tutup",
                  cancelText: null,
                  onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
               });
            }
         }
      });
   };

   const handleEditSuccess = () => {
      fetchAssignments(); // Refresh list
      setEditingAssignment(null);
   };

   if (loading && (!assignments || assignments.length === 0)) {
      return <div className="text-center py-4 text-gray-500 text-sm">Memuat data...</div>;
   }

   if (!assignments || assignments.length === 0) {
      return (
         <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">Belum ada Decision Maker yang ditugaskan.</p>
         </div>
      );
   }

   return (
      <>
         <div className="space-y-3">
            {assignments.map((assignment) => {
               const user = dmDetails[assignment.dm_user_id] || {};
               return (
                  <div
                     key={assignment.project_dm_id}
                     className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition"
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                           {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                           <p className="text-sm font-semibold text-gray-900">{user.name || "Loading..."}</p>
                           <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                           <p className="text-xs text-gray-500">Metode</p>
                           <p className="text-xs font-medium text-gray-700">{assignment.method}</p>
                        </div>
                        <div className="text-right hidden sm:block">
                           <p className="text-xs text-gray-500">Bobot</p>
                           <p className="text-xs font-medium text-gray-700">{assignment.group_weight}</p>
                        </div>

                        <button
                           onClick={() => setEditingAssignment(assignment)}
                           className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition"
                           title="Edit"
                        >
                           ✏️
                        </button>

                        <button
                           onClick={() => handleRemove(assignment.dm_user_id)}
                           className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                           title="Hapus dari Project"
                        >
                           🗑️
                        </button>
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Edit Modal */}
         {editingAssignment && (
            <EditDMModal
               projectId={projectId}
               assignment={editingAssignment}
               onClose={() => setEditingAssignment(null)}
               onSuccess={handleEditSuccess}
            />
         )}

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
