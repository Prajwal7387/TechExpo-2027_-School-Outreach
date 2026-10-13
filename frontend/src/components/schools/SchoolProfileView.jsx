import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, StatusBadge, CategoryTag } from '../common/Badge';
import {
  Building2,
  MapPin,
  ExternalLink,
  Phone,
  Mail,
  User,
  Sparkles,
  PhoneCall,
  Edit2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  Globe,
  Tag,
  FileText,
  Shield,
  Layers,
  Share2
} from 'lucide-react';

export const SchoolProfileView = ({ onOpenEditModal, onOpenOutreachModal }) => {
  const {
    selectedSchool,
    schools,
    setSelectedSchoolId,
    setCurrentView,
    completeFollowUp,
    teamMembers,
    updateSchool,
    addToast,
  } = useApp();

  if (!selectedSchool) {
    return (
      <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">No school selected.</p>
        <button
          onClick={() => setCurrentView('directory')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const school = selectedSchool;
  const breakdown = school.scoring_breakdown || {};
  const history = school.outreach_history || [];

  const handleReassignOwner = (newMemberId) => {
    const member = teamMembers.find((m) => m.id === newMemberId);
    if (member) {
      updateSchool(school.id, {
        assigned_to: member.id,
        assigned_member_name: member.name,
      });
      addToast('success', `Assigned ${school.name} to ${member.name}.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* TOP BREADCRUMB & BACK NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('directory')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to School Directory</span>
        </button>

        {/* Quick School Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium hidden sm:inline">Jump to school:</span>
          <select
            value={school.id}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg py-1 px-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {schools.filter((s) => !s.is_archived).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* HEADER HERO CARD */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900">{school.name}</h1>
              <PriorityBadge level={school.priority_level} score={school.priority_score} />
              <StatusBadge status={school.outreach_status} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                {school.city}, Gujarat
              </span>
              <span>&bull;</span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                {school.board} Affiliated
              </span>
              <span>&bull;</span>
              <span>Approx. {school.student_strength} students</span>
              {school.website && (
                <>
                  <span>&bull;</span>
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 underline font-medium"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(school.categories || []).map((cat) => (
                <CategoryTag key={cat} category={cat} />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onOpenOutreachModal(school.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Log Outreach Activity</span>
            </button>

            <button
              onClick={() => {
                setSelectedSchoolId(school.id);
                setCurrentView('pitch');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Generate Pitch Draft</span>
            </button>

            <button
              onClick={() => onOpenEditModal(school)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-COLUMN MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: CONTACTS & PRIORITY SCORE BREAKDOWN */}
        <div className="space-y-6">
          {/* Key Contacts Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Institutional Leadership & Contacts</span>
              </h3>
            </div>

            {/* Principal */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Principal / Head of Institution
              </div>
              <div className="font-bold text-xs text-slate-900">
                {school.principal_name || 'Name not listed'}
              </div>
              <div className="space-y-1 text-xs text-slate-600 pt-1">
                {school.principal_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${school.principal_phone}`} className="hover:text-indigo-600">
                      {school.principal_phone}
                    </a>
                  </div>
                )}
                {school.principal_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${school.principal_email}`} className="hover:text-indigo-600 truncate">
                      {school.principal_email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Coordinator */}
            <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-1.5">
              <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                STEM / ATL Coordinator
              </div>
              <div className="font-bold text-xs text-indigo-950">
                {school.coordinator_name || 'Name not listed'}
              </div>
              <div className="space-y-1 text-xs text-slate-600 pt-1">
                {school.coordinator_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" />
                    <a href={`tel:${school.coordinator_phone}`} className="hover:text-indigo-600 font-medium">
                      {school.coordinator_phone}
                    </a>
                  </div>
                )}
                {school.coordinator_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <a href={`mailto:${school.coordinator_email}`} className="hover:text-indigo-600 truncate">
                      {school.coordinator_email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Ownership & Reassignment */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Assigned Team Member
              </label>
              <select
                value={school.assigned_to || ''}
                onChange={(e) => handleReassignOwner(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.region})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Research Notes & Evidence Links */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Research Notes & Evidence</span>
            </h3>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
              {school.research_notes || 'No preliminary notes recorded for this institution.'}
            </p>

            {school.evidence_links && school.evidence_links.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-semibold text-slate-500">Verified Evidence URLs:</div>
                {school.evidence_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 underline truncate p-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{link}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PRIORITY SCORE ENGINE BREAKDOWN & OUTREACH HISTORY TIMELINE */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Score Breakdown Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Priority Scoring Breakdown (100 pts Engine)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Total Score: <strong className="text-indigo-600 text-sm">{school.priority_score}</strong> / 100 &bull; Contribution per evaluation criterion
                </p>
              </div>
              <PriorityBadge level={school.priority_level} score={school.priority_score} />
            </div>

            <div className="space-y-3.5">
              {Object.entries(breakdown).map(([key, item]) => {
                const earned = item.earned || 0;
                const max = item.max || 1;
                const pct = Math.round((earned / max) * 100);

                return (
                  <div key={key} className="space-y-1 p-3 rounded-lg bg-slate-50/70 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        {item.isUnknown && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                            Unknown / Needs Research
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-xs">
                        <strong className="text-indigo-600">{earned}</strong> / {max} pts{' '}
                        <span className="text-slate-400">({pct}%)</span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-slate-600 pt-0.5 flex items-start gap-1">
                      <span className="font-semibold text-slate-500">Evidence:</span>
                      <span>{item.evidence || 'No verified evidence filed yet.'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chronological Outreach History Timeline */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Outreach Activity Timeline ({history.length} interactions)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Chronological history of calls, visits, emails, and follow-up commitments
                </p>
              </div>

              <button
                onClick={() => onOpenOutreachModal(school.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>+ Log New Activity</span>
              </button>
            </div>

            {history.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">No outreach activities logged yet</p>
                <p className="text-[11px] text-slate-400">
                  Begin initial contact with the school leadership and record notes here.
                </p>
                <button
                  onClick={() => onOpenOutreachModal(school.id)}
                  className="mt-2 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Log First Interaction
                </button>
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {history.map((log) => {
                  const isOverdue =
                    !log.is_completed && log.next_follow_up && new Date(log.next_follow_up) < new Date();

                  return (
                    <div key={log.id} className="relative pl-8">
                      {/* Timeline dot */}
                      <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-600 shadow-2xs"></div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {log.channel}
                            </span>
                            <span className="text-xs text-slate-600 font-medium">
                              with <strong>{log.contact_person}</strong>
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {new Date(log.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>

                        {/* Status badges */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                            {log.response_status}
                          </span>
                          {log.meeting_status && log.meeting_status !== 'None' && (
                            <span className="text-[11px] text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                              Meeting: {log.meeting_status}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 ml-auto">
                            Logged by {log.logged_by_name}
                          </span>
                        </div>

                        {/* Notes */}
                        <p className="text-xs text-slate-700 leading-relaxed pt-1">
                          {log.notes}
                        </p>

                        {/* Follow up pill */}
                        {log.next_follow_up && (
                          <div className={`mt-2 p-2.5 rounded-lg text-xs flex items-center justify-between ${isOverdue ? 'bg-rose-50 border border-rose-200 text-rose-800' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 shrink-0" />
                              <span>
                                <strong>Next Follow-up:</strong>{' '}
                                {new Date(log.next_follow_up).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                {isOverdue && ' (OVERDUE)'}
                              </span>
                            </div>

                            {!log.is_completed ? (
                              <button
                                onClick={() => completeFollowUp(school.id, log.id)}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-2xs"
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
