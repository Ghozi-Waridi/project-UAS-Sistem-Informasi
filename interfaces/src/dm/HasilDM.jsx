import React, { useState, useEffect } from 'react';
import Sidebar from '../admin/components/Sidebar';
import { getAssignedProjects } from '../services/projectService';
import { getResults } from '../services/resultService';
import { getAlternativesByProject } from '../services/alternativeService';

export default function HasilDM() {
   const [projects, setProjects] = useState([]);
   const [selectedProjectId, setSelectedProjectId] = useState('');
   const [results, setResults] = useState([]);
   const [alternatives, setAlternatives] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      fetchProjects();
   }, []);

   useEffect(() => {
      if (selectedProjectId) {
         fetchResults();
      }
   }, [selectedProjectId]);

   const fetchProjects = async () => {
      try {
         const data = await getAssignedProjects();
         setProjects(data || []);
         if (data.length > 0) {
            setSelectedProjectId(data[0].project_id || data[0].ID);
         }
      } catch (error) {
         console.error('Failed to fetch projects:', error);
      }
   };

   const fetchResults = async () => {
      setLoading(true);
      try {
         const [resultsData, altsData] = await Promise.all([
            getResults(selectedProjectId),
            getAlternativesByProject(selectedProjectId)
         ]);

         setResults(resultsData || []);
         setAlternatives(altsData || []);
      } catch (error) {
         console.error('Failed to fetch results:', error);
         setResults([]);
      } finally {
         setLoading(false);
      }
   };

   // Merge results with alternatives
   // Filter only final consensus results (project_dm_id = null)
   const finalResults = results.filter(r => r.project_dm_id === null || r.ProjectDMID === null);
   
   // If no consensus results, show all results (single DM case)
   const resultsToShow = finalResults.length > 0 ? finalResults : results;

   const mergedData = resultsToShow.map(r => {
      // Backend sends: AlternativeID, FinalScore, Rank, ProjectDMID (camelCase or snake_case)
      const alternativeId = r.alternative_id || r.AlternativeID;
      const alt = alternatives.find(a => {
         const altId = a.alternative_id || a.AlternativeID || a.id;
         return altId === alternativeId;
      });

      return {
         id: r.result_id || r.ResultID || r.id || r.ID,
         alternativeId: alternativeId,
         name: alt ? alt.name : `Kandidat #${alternativeId}`,
         score: parseFloat(r.final_score || r.FinalScore || 0),
         rank: parseInt(r.rank || r.Rank || 0)
      };
   })
      .filter(r => r.score > 0 && r.rank > 0) // Only valid results
      .sort((a, b) => a.rank - b.rank);

   const selectedProject = projects.find(p =>
      (p.project_id || p.ID) === parseInt(selectedProjectId)
   );

   return (
      <>
         <Sidebar />
         <div className="ml-72 min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
               <h1 className="text-2xl font-bold text-gray-900">Hasil Seleksi</h1>
               <p className="text-gray-600 mt-2">
                  Lihat hasil perhitungan untuk proyek yang Anda nilai
               </p>
            </div>

            {/* Project Selector */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Proyek
               </label>
               <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                  {projects.map(project => (
                     <option key={project.project_id || project.ID} value={project.project_id || project.ID}>
                        {project.project_name}
                     </option>
                  ))}
               </select>
            </div>

            {/* Results */}
            {loading ? (
               <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Memuat hasil...</p>
               </div>
            ) : mergedData.length === 0 ? (
               <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <div className="text-gray-400 mb-4">
                     <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                  </div>
                  <p className="text-gray-600 font-medium">📊 Belum ada hasil perhitungan</p>
                  <p className="text-sm text-gray-500 mt-2">
                     Hasil akan muncul setelah admin melakukan perhitungan konsensus
                  </p>
               </div>
            ) : (
               <>
                  {/* Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                     <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm text-gray-600">Total Kandidat</p>
                              <p className="text-2xl font-bold text-gray-900 mt-1">{mergedData.length}</p>
                           </div>
                           <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm text-gray-600">Peringkat Tertinggi</p>
                              <p className="text-2xl font-bold text-green-600 mt-1">
                                 {mergedData[0]?.name || '-'}
                              </p>
                           </div>
                           <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                              </svg>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm text-gray-600">Skor Tertinggi</p>
                              <p className="text-2xl font-bold text-purple-600 mt-1">
                                 {mergedData[0]?.score ? (mergedData[0].score || 0).toFixed(4) : '0.0000'}
                              </p>
                           </div>
                           <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Results Table */}
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                     <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Ranking Kandidat</h2>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full">
                           <thead className="bg-gray-50">
                              <tr>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rank
                                 </th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Kandidat
                                 </th>
                                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Skor Akhir
                                 </th>
                              </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-100">
                              {mergedData.map((candidate, idx) => (
                                 <tr key={candidate.id} className={idx < 3 ? 'bg-green-50' : 'hover:bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                       <div className="flex items-center">
                                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                                                idx === 1 ? 'bg-gray-200 text-gray-700' :
                                                   idx === 2 ? 'bg-orange-100 text-orange-800' :
                                                      'bg-gray-100 text-gray-600'
                                             }`}>
                                             #{candidate.rank}
                                          </span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                       <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                       <span className="text-sm font-semibold text-blue-600">
                                          {(candidate.score || 0).toFixed(4)}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>

                  {/* Info Note */}
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                     <div className="flex">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="ml-3">
                           <p className="text-sm text-blue-800">
                              <strong>Catatan:</strong> Hasil ini adalah hasil akhir konsensus dari perhitungan TOPSIS dengan metode agregasi BORDA.
                              Jika ada perubahan penilaian diperlukan, silakan hubungi admin proyek.
                           </p>
                        </div>
                     </div>
                  </div>
               </>
            )}
            </div>
         </div>
      </>
   );
}
