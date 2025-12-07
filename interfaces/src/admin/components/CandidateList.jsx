import React from 'react';

const STATUS_OPTIONS = ["Semua Status", "Pending", "In Review", "Evaluated"];

function getStatusStyle(status) {
   switch (status) {
      case "Pending":
         return { badge: "bg-yellow-50 text-yellow-700", dot: "bg-yellow-400" };
      case "In Review":
         return { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-400" };
      case "Evaluated":
         return { badge: "bg-green-50 text-green-700", dot: "bg-green-400" };
      default:
         return { badge: "bg-gray-50 text-gray-600", dot: "bg-gray-400" };
   }
}

export default function CandidateList({ candidates, loading, onEdit, onDelete, onViewDetail }) {
   if (loading) {
      return <div className="p-8 text-center text-gray-500">Memuat data...</div>;
   }

   return (
      <div className="mt-2 rounded-2xl border border-gray-100 overflow-hidden">
         <table className="w-full text-sm">
            <thead className="bg-gray-50">
               <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3">Kandidat</th>
                  <th className="px-6 py-3">Kontak</th>
                  <th className="px-6 py-3">Pengalaman</th>
                  <th className="px-6 py-3">Keahlian</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {candidates.map((c) => {
                  const statusStyle = getStatusStyle(c.status);
                  return (
                     <tr key={c.id} className="hover:bg-gray-50/70">
                        <td className="px-6 py-4 align-top">
                           <p className="font-semibold text-gray-900">{c.name}</p>
                           <p className="text-xs text-gray-500 mt-0.5">
                              {c.education}
                           </p>
                        </td>

                        <td className="px-6 py-4 align-top">
                           <p className="text-xs text-gray-600">{c.email}</p>
                           <p className="text-xs text-gray-500 mt-0.5">
                              {c.phone}
                           </p>
                        </td>

                        <td className="px-6 py-4 align-top">
                           <p className="text-sm text-gray-700">{c.experience}</p>
                        </td>

                        <td className="px-6 py-4 align-top">
                           <div className="flex flex-wrap gap-1.5">
                              {c.skills && c.skills.map((skill, idx) => (
                                 <span
                                    key={idx}
                                    className="inline-flex items-center rounded-full bg-blue-50 text-blue-600 px-2.5 py-0.5 text-xs font-medium"
                                 >
                                    {skill}
                                 </span>
                              ))}
                           </div>
                        </td>

                        <td className="px-6 py-4 align-top">
                           <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusStyle.badge}`}
                           >
                              <span
                                 className={`w-2 h-2 rounded-full ${statusStyle.dot}`}
                              ></span>
                              {c.status}
                           </span>
                        </td>

                        <td className="px-6 py-4 align-top text-sm text-gray-700">
                           {c.date}
                        </td>

                        <td className="px-6 py-4 align-top">
                           <div className="flex items-center justify-center gap-3 text-lg">
                              <button
                                 className="text-blue-500 hover:text-blue-600"
                                 onClick={() => onViewDetail(c)}
                                 title="Lihat detail"
                              >
                                 👁️
                              </button>
                              <button
                                 className="text-green-500 hover:text-green-600"
                                 onClick={() => onEdit(c)}
                                 title="Edit"
                              >
                                 ✏️
                              </button>
                              <button
                                 className="text-red-500 hover:text-red-600"
                                 onClick={() => onDelete(c.id)}
                                 title="Hapus"
                              >
                                 🗑️
                              </button>
                           </div>
                        </td>
                     </tr>
                  );
               })}

               {candidates.length === 0 && (
                  <tr>
                     <td
                        className="px-6 py-6 text-center text-sm text-gray-500"
                        colSpan={7}
                     >
                        Tidak ada kandidat yang cocok dengan filter.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
   );
}
