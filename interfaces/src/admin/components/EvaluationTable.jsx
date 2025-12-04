import React from "react";

export default function EvaluationTable({ candidates = [], scores = [] }) {

  // Debug logging
  console.log('=== EvaluationTable Debug ===');
  console.log('Candidates received:', candidates);
  console.log('Scores received:', scores);
  console.log('Candidates count:', candidates.length);
  console.log('Scores count:', scores.length);

  // Build set of candidate IDs that have scores
  const scoredCandidateIds = new Set();
  if (Array.isArray(scores)) {
    scores.forEach(score => {
      console.log('Processing score:', score);
      if (score.alternative_id) {
        scoredCandidateIds.add(score.alternative_id);
        console.log(`Added alternative_id ${score.alternative_id} to scored set`);
      }
    });
  }
  console.log('Scored Candidate IDs Set:', Array.from(scoredCandidateIds));

  // Map candidates to rows
  const displayRows = candidates.map(c => {
    let details = {};
    try {
      const parsed = JSON.parse(c.description || "{}");
      if (typeof parsed === 'string') {
        details = JSON.parse(parsed);
      } else {
        details = parsed;
      }
    } catch (e) {
      details = { note: c.description };
    }

    const candidateId = c.alternative_id || c.id || c.ID;
    const hasScores = scoredCandidateIds.has(candidateId);
    
    console.log(`\n--- Candidate: ${c.name} ---`);
    console.log('Candidate object:', c);
    console.log('Candidate ID used:', candidateId);
    console.log('Has scores?', hasScores);
    console.log('Scored IDs in set:', Array.from(scoredCandidateIds));

    return {
      id: candidateId,
      kandidat: c.name,
      posisi: details.experience ? `${details.experience} - ${details.education || ''}` : (details.note || "-"),
      evaluator: hasScores ? "Decision Maker" : "-",
      status: hasScores ? "Sudah Dinilai" : "Menunggu Evaluasi DM",
      statusColor: hasScores ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600",
      skor: "-", // Placeholder
    };
  });
  
  console.log('=== End EvaluationTable Debug ===\n');

  return (
    <>
      {/* Card daftar kandidat - Read only */}
      <div className="bg-white rounded-2xl shadow-xl px-6 py-5 flex flex-col gap-4 border border-gray-100">
        <div className="flex justify-between items-center pb-3 border-b-2 border-gray-200">
          <div>
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span className="bg-green-600 text-white p-2 rounded-lg">
                👥
              </span>
              Daftar Kandidat
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Kandidat akan dievaluasi oleh Decision Maker
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b-2 border-gray-200">
                <th className="py-3 text-left font-bold">Kandidat</th>
                <th className="py-3 text-left font-bold">Deskripsi</th>
                <th className="py-3 text-left font-bold">Evaluator</th>
                <th className="py-3 text-left font-bold">Status</th>
                <th className="py-3 text-right font-bold">Skor</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.length > 0 ? (
                displayRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-0 hover:bg-blue-50/30 transition-colors duration-200"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs flex items-center justify-center font-bold shadow-md">
                          {row.kandidat
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-sm">
                            {row.kandidat}
                          </div>
                          <div className="text-xs text-gray-500">#{row.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-700 font-medium">{row.posisi}</td>
                    <td className="py-4 text-sm text-gray-700 font-medium">
                      {row.evaluator}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${row.statusColor}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-gray-800">
                      {row.skor}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="font-medium">Belum ada kandidat di project ini.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
