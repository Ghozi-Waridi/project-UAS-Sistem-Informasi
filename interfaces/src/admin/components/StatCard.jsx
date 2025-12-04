import React from 'react';

export default function StatCard({
  icon,
  label,
  value,
  subLabel,
  badgeText,
  badgeColor = 'bg-blue-100 text-blue-600',
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl px-6 py-5 flex flex-col gap-3 transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 text-2xl shadow-md transform hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {badgeText && (
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${badgeColor}`}
          >
            {badgeText}
          </span>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold animate-pulse">{value}</div>
        <div className="text-gray-600 font-medium text-sm mt-1">{label}</div>
        {subLabel && (
          <div className="text-gray-500 text-xs mt-0.5">{subLabel}</div>
        )}
      </div>
    </div>
  );
}
