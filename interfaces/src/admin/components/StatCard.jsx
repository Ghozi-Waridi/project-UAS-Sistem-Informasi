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
    <div className="bg-white rounded-3xl shadow-card px-6 py-5 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 text-xl">
          {icon}
        </div>
        {badgeText && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}
          >
            {badgeText}
          </span>
        )}
      </div>
      <div>
        <div className="text-3xl font-semibold">{value}</div>
        <div className="text-gray-500 text-sm mt-1">{label}</div>
        {subLabel && (
          <div className="text-gray-400 text-xs mt-0.5">{subLabel}</div>
        )}
      </div>
    </div>
  );
}
