import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';
import { CHANNELS } from '../../data/criteriaConfig';
import {
  PhoneCall,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  Plus,
  ArrowRight,
  User,
  MapPin,
  MessageSquare,
  Check,
  ChevronRight
} from 'lucide-react';

export const OutreachManagementView = ({ onOpenOutreachModal }) => {
  const {
    schools,
    overdueFollowUps,
    completeFollowUp,
    setCurrentView,
    setSelectedSchoolId,
  } = useApp();

  const [channelFilter, setChannelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [followUpFilter, setFollowUpFilter] = useState('all'); // 'all', 'overdue', 'pending', 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all logs flattened
  const allLogs = useMemo(() => {
    const list = [];
    const now = new Date();

    schools.forEach((school) => {
      if (school.is_archived) return;
      (school.outreach_history || []).forEach((log) => {
        const isOverdue =
          !log.is_completed && log.next_follow_up && new Date(log.next_follow_up) < now;

        list.push({
          ...log,
          schoolId: school.id,
          schoolName: school.name,
          city: school.city,
          assignedMember: school.assigned_member_name,
          isOverdue,
        });
      });
    });

    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [schools]);

  // Apply filters
  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      if (channelFilter && log.channel !== channelFilter) return false;
      if (statusFilter && log.response_status !== statusFilter) return false;
      if (followUpFilter === 'overdue' && !log.isOverdue) return false;
      if (followUpFilter === 'pending' && (log.is_completed || !log.next_follow_up)) return false;
      if (followUpFilter === 'completed' && !log.is_completed) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSchool = log.schoolName.toLowerCase().includes(q);
        const matchesContact = log.contact_person.toLowerCase().includes(q);
        const matchesNotes = log.notes.toLowerCase().includes(q);
        if (!matchesSchool && !matchesContact && !matchesNotes) return false;
      }

      return true;
    });
  }, [allLogs, channelFilter, statusFilter, followUpFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* OVERDUE CRITICAL SECTION */}
      {overdueFollowUps.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-900">
                  {overdueFollowUps.length} Overdue Follow-Ups Require Immediate Attention
                </h3>
                <p className="text-xs text-rose-700">
                  Action items committed to school administrators that have passed their deadline
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenOutreachModal()}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
            >
              Log New Interaction
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {overdueFollowUps.map((item) => (
              <div
                key={item.logId}
                className="bg-white p-3.5 rounded-lg border border-rose-200 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 line-clamp-1">
                      {item.schoolName}
                    </span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold shrink-0">
                      Due: {new Date(item.nextFollowUp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Contact: {item.contactPerson} &bull; Owner: {item.assignedMember}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 italic">
                    &ldquo;{item.notes}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => completeFollowUp(item.schoolId, item.logId)}
                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Done</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSchoolId(item.schoolId);
                      setCurrentView('profile');
                    }}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search outreach notes, school names, contact persons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => onOpenOutreachModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Log Outreach Activity</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-semibold pr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Pipeline:</span>
          </div>

          {/* Follow-up status */}
          <select
            value={followUpFilter}
            onChange={(e) => setFollowUpFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Timeline Entries</option>
            <option value="overdue">Overdue Follow-ups Only</option>
            <option value="pending">Upcoming & Pending Follow-ups</option>
            <option value="completed">Completed Follow-ups</option>
          </select>

          {/* Channel */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Channels ({CHANNELS.length})</option>
            {CHANNELS.map((ch) => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>

          {/* Response Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Responses</option>
            <option value="Confirmed Delegation">Confirmed Delegation</option>
            <option value="Positive Interest">Positive Interest</option>
            <option value="Meeting Scheduled">Meeting Scheduled</option>
            <option value="Call Scheduled">Call Scheduled</option>
            <option value="Proposal Requested">Proposal Requested</option>
            <option value="Needs Follow-up">Needs Follow-up</option>
            <option value="Declined">Declined</option>
          </select>

          {(channelFilter || statusFilter || followUpFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setChannelFilter('');
                setStatusFilter('');
                setFollowUpFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* CHRONOLOGICAL TIMELINE FEED */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Outreach Activity Stream ({filteredLogs.length} events)
          </h3>
          <span className="text-xs text-slate-500">Sorted newest first</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <PhoneCall className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No outreach activities match current filters</p>
            <p className="text-[11px] text-slate-400">Try adjusting your filters or search term above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                      onClick={() => {
                        setSelectedSchoolId(log.schoolId);
                        setCurrentView('profile');
                      }}
                    >
                      {log.schoolName}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {log.city}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {log.channel}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(log.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                {/* Details & Status */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-700">
                    Spoke with: {log.contact_person}
                  </span>
                  <span>&bull;</span>
                  <span className="font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.2 rounded text-[11px]">
                    {log.response_status}
                  </span>
                  {log.meeting_status && log.meeting_status !== 'None' && (
                    <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.2 rounded">
                      Meeting: {log.meeting_status}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 ml-auto">
                    Logged by {log.logged_by_name} (Owner: {log.assignedMember})
                  </span>
                </div>

                {/* Notes */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                  {log.notes}
                </p>

                {/* Follow up line */}
                {log.next_follow_up && (
                  <div className={`flex items-center justify-between p-2 rounded-lg text-xs ${log.isOverdue ? 'bg-rose-50 border border-rose-200 text-rose-800' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        <strong>Follow-up:</strong>{' '}
                        {new Date(log.next_follow_up).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        {log.isOverdue && ' (OVERDUE)'}
                      </span>
                    </div>

                    {!log.is_completed ? (
                      <button
                        onClick={() => completeFollowUp(log.schoolId, log.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors shadow-2xs"
                      >
                        Mark Completed
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
