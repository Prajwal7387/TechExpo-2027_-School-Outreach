import React from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, StatusBadge, CategoryTag } from '../common/Badge';
import {
  Building2,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  TrendingUp,
  ArrowRight,
  Calendar,
  Users,
  ChevronRight,
  ExternalLink,
  PhoneForwarded,
  GraduationCap
} from 'lucide-react';

export const DashboardView = ({ onOpenOutreachModal }) => {
  const {
    schools,
    overdueFollowUps,
    setCurrentView,
    setSelectedSchoolId,
    completeFollowUp,
  } = useApp();

  const activeSchools = schools.filter((s) => !s.is_archived);

  // Metrics
  const totalSchools = activeSchools.length;
  const highPrioritySchools = activeSchools.filter((s) => s.priority_score >= 75).length;
  const contactedSchools = activeSchools.filter((s) => s.outreach_status !== 'Not Contacted').length;
  const interestedSchools = activeSchools.filter(
    (s) => s.outreach_status === 'Interested' || s.outreach_status === 'Meeting Scheduled' || s.outreach_status === 'Proposal Sent'
  ).length;
  const confirmedSchools = activeSchools.filter((s) => s.outreach_status === 'Confirmed').length;
  const overdueCount = overdueFollowUps.length;

  // City Distribution
  const cityCounts = activeSchools.reduce((acc, s) => {
    acc[s.city] = (acc[s.city] || 0) + 1;
    return acc;
  }, {});

  const cityList = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  // Status Distribution
  const statusCounts = activeSchools.reduce((acc, s) => {
    acc[s.outreach_status] = (acc[s.outreach_status] || 0) + 1;
    return acc;
  }, {});

  // Recent Outreach Activity feed across all schools
  const recentActivities = [];
  activeSchools.forEach((s) => {
    (s.outreach_history || []).forEach((log) => {
      recentActivities.push({
        ...log,
        schoolId: s.id,
        schoolName: s.name,
        city: s.city,
      });
    });
  });
  recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestActivities = recentActivities.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* HOST INSTITUTION & EVENT BANNER */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-xl p-4 sm:p-5 text-white shadow-sm border border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-wide">TechExpo 2027</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                Conducted by Parul University
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Host Campus: Parul University, Vadodara, Gujarat &bull; Multi-Corridor Outreach & Institutional Delegation Pipeline
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setCurrentView('pitch')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Open Pitch Assistant</span>
          </button>
        </div>
      </div>
      {/* OVERDUE FOLLOW-UPS ALERT BANNER */}
      {overdueCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-900">
                  {overdueCount} School Outreach Follow-Up{overdueCount > 1 ? 's' : ''} Overdue
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  These commitments have passed their scheduled date without resolution. Immediate follow-up recommended.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {overdueFollowUps.slice(0, 3).map((item) => (
                    <div
                      key={item.logId}
                      className="bg-white border border-rose-200 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-2xs text-xs"
                    >
                      <span className="font-semibold text-slate-800">{item.schoolName}</span>
                      <span className="text-slate-400">({item.city})</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                        {new Date(item.nextFollowUp).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedSchoolId(item.schoolId);
                          setCurrentView('profile');
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px] ml-1"
                      >
                        Action &rarr;
                      </button>
                    </div>
                  ))}
                  {overdueCount > 3 && (
                    <button
                      onClick={() => setCurrentView('outreach')}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 self-center px-2 underline"
                    >
                      +{overdueCount - 3} more in pipeline
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('outreach')}
              className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors shrink-0 hidden md:block"
            >
              View Pipeline
            </button>
          </div>
        </div>
      )}

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Schools */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Schools</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalSchools}</div>
          <div className="text-[11px] text-slate-500 mt-1">Gujarat Institutions</div>
        </div>

        {/* High Priority */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">High Priority</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{highPrioritySchools}</div>
          <div className="text-[11px] text-emerald-700 mt-1">Score &ge; 75 pts</div>
        </div>

        {/* Contacted */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Contacted</span>
            <PhoneCall className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{contactedSchools}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {Math.round((contactedSchools / (totalSchools || 1)) * 100)}% coverage
          </div>
        </div>

        {/* Interested */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Interested</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{interestedSchools}</div>
          <div className="text-[11px] text-indigo-700 mt-1">Meetings/Proposals</div>
        </div>

        {/* Confirmed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{confirmedSchools}</div>
          <div className="text-[11px] text-emerald-700 mt-1">Delegations locked</div>
        </div>

        {/* Overdue */}
        <div className={`p-4 rounded-xl border shadow-2xs ${overdueCount > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Overdue Follow-ups</span>
            <Clock className={`w-4 h-4 ${overdueCount > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-bold ${overdueCount > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
            {overdueCount}
          </div>
          <div className={`text-[11px] mt-1 ${overdueCount > 0 ? 'text-rose-700 font-semibold' : 'text-slate-500'}`}>
            {overdueCount > 0 ? 'Action required' : 'All up to date'}
          </div>
        </div>
      </div>

      {/* VISUAL CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outreach Progress Funnel Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Outreach Conversion Funnel</h3>
              <p className="text-xs text-slate-500">Pipeline progression from discovery to confirmation</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {totalSchools} Target Schools
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Not Contacted', key: 'Not Contacted', color: 'bg-slate-300' },
              { label: 'Contacted', key: 'Contacted', color: 'bg-amber-400' },
              { label: 'Call / Meeting Scheduled', count: (statusCounts['Call Scheduled'] || 0) + (statusCounts['Meeting Scheduled'] || 0), color: 'bg-sky-500' },
              { label: 'Proposal Sent', key: 'Proposal Sent', color: 'bg-blue-500' },
              { label: 'Interested', key: 'Interested', color: 'bg-indigo-500' },
              { label: 'Confirmed Delegations', key: 'Confirmed', color: 'bg-emerald-500' },
            ].map((step, i) => {
              const count = step.count !== undefined ? step.count : (statusCounts[step.key] || 0);
              const pct = Math.round((count / (totalSchools || 1)) * 100);

              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{step.label}</span>
                    <span className="font-semibold text-slate-900">
                      {count} <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${step.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Distribution Across Gujarat Cities */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Distribution by Gujarat Hubs</h3>
              <p className="text-xs text-slate-500">School coverage across key urban and industrial centers</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>Gujarat Statewide</span>
            </div>
          </div>

          <div className="space-y-3">
            {cityList.map(([cityName, count]) => {
              const maxCityCount = cityList[0] ? cityList[0][1] : 1;
              const barWidth = Math.round((count / maxCityCount) * 100);
              const confirmedInCity = activeSchools.filter((s) => s.city === cityName && s.outreach_status === 'Confirmed').length;

              return (
                <div key={cityName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{cityName}</span>
                      {confirmedInCity > 0 && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium border border-emerald-200">
                          {confirmedInCity} Confirmed
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-900">
                      {count} <span className="text-slate-400 font-normal">schools</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* LOWER SECTION: TOP HIGH-PRIORITY INSTITUTIONS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top High-Priority Targets */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Priority Target Institutions</h3>
              <p className="text-xs text-slate-500">Highest ranked schools requiring key coordinator attention</p>
            </div>
            <button
              onClick={() => setCurrentView('directory')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {activeSchools
              .sort((a, b) => b.priority_score - a.priority_score)
              .slice(0, 5)
              .map((school) => (
                <div
                  key={school.id}
                  onClick={() => {
                    setSelectedSchoolId(school.id);
                    setCurrentView('profile');
                  }}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate hover:text-indigo-600">
                        {school.name}
                      </span>
                      <PriorityBadge level={school.priority_level} score={school.priority_score} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {school.city}
                      </span>
                      <span>&bull;</span>
                      <span>Board: {school.board}</span>
                      <span>&bull;</span>
                      <span className="text-slate-600 truncate">
                        Owner: {school.assigned_member_name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {school.categories.map((cat) => (
                        <CategoryTag key={cat} category={cat} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={school.outreach_status} />
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Outreach Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Outreach Feed</h3>
              <p className="text-xs text-slate-500">Latest field interactions & calls</p>
            </div>
            <button
              onClick={() => setCurrentView('outreach')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              All Logs
            </button>
          </div>

          <div className="p-4 space-y-4">
            {latestActivities.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No outreach logged yet.</p>
            ) : (
              latestActivities.map((act) => (
                <div key={act.id} className="text-xs border-l-2 border-indigo-500 pl-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 truncate">{act.schoolName}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-2">{act.notes}</p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                      {act.channel}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-semibold">{act.response_status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
