import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  PhoneCall,
  Search,
  ShieldCheck,
  UserCheck,
  Sparkles,
  HelpCircle,
  Database,
  RotateCcw
} from 'lucide-react';

export const Header = ({ onOpenAddModal, onOpenOutreachModal, onOpenSupabaseModal }) => {
  const {
    currentView,
    currentUser,
    setCurrentUser,
    teamMembers,
    schools,
    setSelectedSchoolId,
    setCurrentView,
    addToast,
    isSupabaseLive,
    syncVerifiedIntelligence,
  } = useApp();

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return { title: 'Executive Outreach Dashboard', subtitle: 'Real-time intelligence and pipeline status across Gujarat schools' };
      case 'directory':
        return { title: 'School Directory & Intelligence', subtitle: 'Search, filter, classify, and manage institution profiles' };
      case 'profile':
        return { title: 'School Intelligence Profile', subtitle: 'Deep-dive metrics, contact hierarchy, and outreach timeline' };
      case 'outreach':
        return { title: 'Outreach Management Pipeline', subtitle: 'Chronological activity timeline, response tracking, and follow-ups' };
      case 'pitch':
        return { title: 'Grounded Pitch Assistant', subtitle: 'Synthesize verified school data and approved TechExpo 2027 collateral' };
      case 'weights':
        return { title: 'Priority Scoring Configuration', subtitle: 'Administrator control to calibrate 5-point evaluation algorithm' };
      case 'team':
        return { title: 'Team Management & Security', subtitle: 'Role-based access control, school allocation, and activity velocity' };
      default:
        return { title: 'TechExpo 2027', subtitle: 'School Intelligence & Outreach System' };
    }
  };

  const { title, subtitle } = getTitle();

  const switchRole = (memberId) => {
    const found = teamMembers.find((m) => m.id === memberId);
    if (found) {
      setCurrentUser(found);
      addToast('info', `Switched active profile to ${found.name} (${found.role.toUpperCase()})`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Title & context */}
      <div>
        <h2 className="text-base font-bold text-slate-900 leading-tight">{title}</h2>
        <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
      </div>

      {/* Action buttons & Member Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Role & User Selector for Testing Permissions */}
        <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 pl-2 hidden md:inline">Profile:</span>
          <select
            value={currentUser.id}
            onChange={(e) => switchRole(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 py-1 px-1.5 rounded focus:outline-none cursor-pointer"
            title="Switch user to test Admin vs Member permissions"
          >
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.role.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Database Status Button */}
        <button
          onClick={onOpenSupabaseModal}
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isSupabaseLive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          title="Supabase PostgreSQL & RLS Status"
        >
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          <span>{isSupabaseLive ? 'Supabase Connected' : 'Local Storage Mode'}</span>
        </button>

        {/* Sync Verified Data Button */}
        <button
          onClick={syncVerifiedIntelligence}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
          title="Sync & Update Verified School Contacts & Websites"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Sync Verified Data</span>
        </button>

        {/* Quick Log Outreach Button */}
        <button
          onClick={onOpenOutreachModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-2xs"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Log Outreach</span>
        </button>

        {/* Add School Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add School</span>
        </button>
      </div>
    </header>
  );
};
