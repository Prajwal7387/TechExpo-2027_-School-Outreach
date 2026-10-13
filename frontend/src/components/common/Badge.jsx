import React from 'react';

export const PriorityBadge = ({ level, score }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  if (level === 'High' || score >= 75) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
  } else if (level === 'Medium' || score >= 50) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
  } else {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs border ${colorClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === 'High' ? 'bg-emerald-500' : level === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
      <span>{level} Priority</span>
      {score !== undefined && <span className="opacity-80">({score})</span>}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  switch (status) {
    case 'Confirmed':
      style = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
      break;
    case 'Interested':
      style = 'bg-indigo-100 text-indigo-800 border-indigo-300 font-medium';
      break;
    case 'Proposal Sent':
      style = 'bg-blue-100 text-blue-800 border-blue-300 font-medium';
      break;
    case 'Meeting Scheduled':
      style = 'bg-purple-100 text-purple-800 border-purple-300 font-medium';
      break;
    case 'Call Scheduled':
      style = 'bg-sky-100 text-sky-800 border-sky-300 font-medium';
      break;
    case 'Contacted':
      style = 'bg-amber-100 text-amber-800 border-amber-300 font-medium';
      break;
    case 'Not Interested':
      style = 'bg-rose-100 text-rose-800 border-rose-300 font-medium';
      break;
    case 'Not Contacted':
    default:
      style = 'bg-slate-100 text-slate-600 border-slate-200';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${style}`}>
      {status}
    </span>
  );
};

export const CategoryTag = ({ category }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  switch (category) {
    case 'Recent Events':
      style = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Locally Famous':
      style = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'Good to Connect With':
      style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Technology-Ready':
      style = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'Untapped Opportunity':
      style = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    default:
      style = 'bg-slate-50 text-slate-600 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${style}`}>
      {category}
    </span>
  );
};
