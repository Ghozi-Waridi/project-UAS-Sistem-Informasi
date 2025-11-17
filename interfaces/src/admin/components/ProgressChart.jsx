import React, { useState } from 'react';

const tabs = ['Evaluasi', 'Kandidat', 'Konsensus'];

const weeks = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];

const chartData = [
  { dm1: 8, dm2: 7, dm3: 6 },
  { dm1: 14, dm2: 12, dm3: 11 },
  { dm1: 16, dm2: 15, dm3: 14 },
  { dm1: 20, dm2: 18, dm3: 19 },
];

export default function ProgressChart() {
  const [activeTab, setActiveTab] = useState('Evaluasi');

  return (
    <div className="bg-white rounded-3xl shadow-card px-6 py-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-800">Progress Evaluasi</h3>
          <p className="text-gray-400 text-sm">
            Evaluasi yang diselesaikan per minggu
          </p>
        </div>

        <div className="bg-gray-100 rounded-full flex p-1 text-xs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full transition ${
                activeTab === tab
                  ? 'bg-white shadow text-blue-600 font-semibold'
                  : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-blue-50 rounded-2xl px-6 py-6">
        <div className="grid grid-cols-4 gap-6 items-end h-48">
          {weeks.map((week, idx) => {
            const d = chartData[idx];
            const max = 22;
            return (
              <div key={week} className="flex flex-col items-center gap-3">
                <div className="flex items-end gap-1 h-32">
                  <div
                    className="w-4 rounded-t-md bg-blue-500"
                    style={{ height: `${(d.dm1 / max) * 100}%` }}
                  />
                  <div
                    className="w-4 rounded-t-md bg-green-400"
                    style={{ height: `${(d.dm2 / max) * 100}%` }}
                  />
                  <div
                    className="w-4 rounded-t-md bg-purple-400"
                    style={{ height: `${(d.dm3 / max) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{week}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini stats bawah chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div className="bg-gray-50 rounded-2xl px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">Decision Maker 1</p>
            <p className="font-semibold text-gray-800">18</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
            +12%
          </span>
        </div>
        <div className="bg-gray-50 rounded-2xl px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">Decision Maker 2</p>
            <p className="font-semibold text-gray-800">16</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
            +8%
          </span>
        </div>
        <div className="bg-gray-50 rounded-2xl px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">Decision Maker 3</p>
            <p className="font-semibold text-gray-800">17</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold">
            +10%
          </span>
        </div>
      </div>
    </div>
  );
}
