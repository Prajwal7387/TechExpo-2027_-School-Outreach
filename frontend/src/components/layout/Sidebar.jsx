import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  PhoneCall,
  Sparkles,
  SlidersHorizontal,
  Users,
  ShieldCheck,
  AlertCircle,
  Database,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const Sidebar = ({ onOpenSupabaseModal }) => {
  const {
    currentView,
    setCurrentView,
    schools,
    overdueFollowUps,
    currentUser,
    isSupabaseLive,
  } = useApp();

  const highPriorityCount = schools.filter((s) => !s.is_archived && s.priority_score >= 75).length;
  const overdueCount = overdueFollowUps.length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'directory',
      label: 'School Directory',
      icon: Building2,
      badge: highPriorityCount ? `${highPriorityCount} High` : null,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'outreach',
      label: 'Outreach Pipeline',
      icon: PhoneCall,
      badge: overdueCount > 0 ? `${overdueCount} Overdue` : null,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold animate-pulse',
    },
    {
      id: 'pitch',
      label: 'Pitch Assistant',
      icon: Sparkles,
      badge: 'AI Grounded',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'weights',
      label: 'Priority Scoring Config',
      icon: SlidersHorizontal,
      adminOnly: true,
      badge: 'Admin',
      badgeColor: 'bg-slate-200 text-slate-700',
    },
    {
      id: 'team',
      label: 'Team & Permissions',
      icon: Users,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-bold text-white tracking-wide">TechExpo 2027</h1>
            <span className="text-[10px] uppercase font-bold bg-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-400/30">
              Gujarat
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">School Intelligence & Outreach</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Core Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Supabase status indicator */}
      <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] font-semibold text-slate-200">Database & Security</span>
          </div>
          <button
            onClick={onOpenSupabaseModal}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-medium"
          >
            Details
          </button>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className={`w-2 h-2 rounded-full ${isSupabaseLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="text-slate-300 truncate">
            {isSupabaseLive ? 'Supabase Live PostgREST' : 'Local Intelligence Store'}
          </span>
        </div>
      </div>

      {/* User info & Role display */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full bg-slate-700 object-cover border border-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1">
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${currentUser.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-700 text-slate-300'}`}>
                {currentUser.role}
              </span>
              <span className="text-[10px] text-slate-400 truncate">{currentUser.designation.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
