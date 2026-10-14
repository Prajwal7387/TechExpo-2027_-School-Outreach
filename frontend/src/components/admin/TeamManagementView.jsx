import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Mail,
  MapPin,
  Building2,
  PhoneCall,
  Check,
  Plus,
  Lock,
  Unlock,
  KeyRound
} from 'lucide-react';

export const TeamManagementView = () => {
  const {
    teamMembers,
    currentUser,
    setCurrentUser,
    schools,
    addToast,
  } = useApp();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [newMemberRegion, setNewMemberRegion] = useState('Ahmedabad Hub');

  // Compute school assignment counts dynamically from schools list
  const memberStats = teamMembers.map((member) => {
    const assignedSchools = schools.filter((s) => s.assigned_to === member.id && !s.is_archived);
    const confirmedCount = assignedSchools.filter((s) => s.outreach_status === 'Confirmed').length;
    let totalLogs = 0;
    assignedSchools.forEach((s) => {
      totalLogs += (s.outreach_history || []).length;
    });

    return {
      ...member,
      assignedCount: assignedSchools.length,
      confirmedCount,
      totalLogs,
    };
  });

  const handleSimulateInvite = (e) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      addToast('error', 'Name and email are required');
      return;
    }

    addToast('success', `Team invitation dispatched to ${newMemberEmail}. Profile registered.`);
    setIsInviteOpen(false);
    setNewMemberName('');
    setNewMemberEmail('');
  };

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Team Management & Security</h2>
              <p className="text-xs text-slate-500">
                Role-based access control (RBAC), school portfolio assignments, and activity velocity
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* WORKLOAD KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Active Team Members</div>
          <div className="text-2xl font-bold text-slate-900">{teamMembers.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {teamMembers.filter((m) => m.role === 'admin').length} Admins &bull;{' '}
            {teamMembers.filter((m) => m.role === 'member').length} Coordinators
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Statewide Allocation Coverage</div>
          <div className="text-2xl font-bold text-indigo-600">
            {schools.filter((s) => s.assigned_to && !s.is_archived).length} / {schools.filter((s) => !s.is_archived).length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Schools assigned to primary owners</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Access Control & Security</div>
          <div className="text-2xl font-bold text-emerald-600">
            RBAC Active
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Role-Based Access Control enforced</div>
        </div>
      </div>

      {/* TEAM DIRECTORY TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Outreach Team Directory</h3>
          <span className="text-xs text-slate-500">Click member to switch profile context</span>
        </div>

        <div className="divide-y divide-slate-100">
          {memberStats.map((member) => {
            const isSelf = currentUser.id === member.id;

            return (
              <div
                key={member.id}
                className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${isSelf ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{member.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded uppercase ${member.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'}`}>
                        {member.role}
                      </span>
                      {isSelf && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                          Active Profile
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{member.designation}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {member.region}
                      </span>
                      <span>&bull;</span>
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6 text-xs text-slate-600">
                  <div className="text-center">
                    <div className="font-bold text-slate-900">{member.assignedCount}</div>
                    <div className="text-[10px] text-slate-400">Schools</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-emerald-600">{member.confirmedCount}</div>
                    <div className="text-[10px] text-slate-400">Confirmed</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-indigo-600">{member.totalLogs}</div>
                    <div className="text-[10px] text-slate-400">Activities</div>
                  </div>

                  {!isSelf && (
                    <button
                      onClick={() => {
                        setCurrentUser(member);
                        addToast('info', `Switched active profile to ${member.name}`);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 shadow-2xs transition-colors"
                    >
                      Assume Profile
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PERMISSIONS MATRIX */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Role-Based Access Control (RBAC) Permissions Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">System Capability</th>
                <th className="py-2.5 px-4 text-center">Administrator Role</th>
                <th className="py-2.5 px-4 text-center">Member Role</th>
                <th className="py-2.5 px-4">Enforcement Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-800">View School Directory & Profiles</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">&#10003; Granted</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">&#10003; Granted</td>
                <td className="py-2.5 px-4 text-[11px] text-slate-500">Authenticated read via RLS</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-800">Log Outreach Activities & Follow-ups</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">&#10003; Granted</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">&#10003; Granted</td>
                <td className="py-2.5 px-4 text-[11px] text-slate-500">Insert allowed for all team members</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-800">Use Grounded Pitch Assistant</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">&#10003; Granted</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">&#10003; Granted</td>
                <td className="py-2.5 px-4 text-[11px] text-slate-500">All members can generate and copy pitches</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-800">Reconfigure 5-Point Priority Scoring Weights</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">&#10003; Full Control</td>
                <td className="py-2.5 px-4 text-center text-rose-500 font-bold">&#10007; Restricted</td>
                <td className="py-2.5 px-4 text-[11px] text-slate-500">Enforced by RLS & UI state lock</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-800">Permanently Delete Institutions</td>
                <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">&#10003; Full Control</td>
                <td className="py-2.5 px-4 text-center text-rose-500 font-bold">&#10007; Restricted</td>
                <td className="py-2.5 px-4 text-[11px] text-slate-500">Admin delete policy in PostgreSQL</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* INVITE MODAL */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Invite New Team Member</h3>
            <p className="text-xs text-slate-500">
              Send an onboarding credential link for TechExpo 2027 school outreach.
            </p>

            <form onSubmit={handleSimulateInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g., Yashvi Desai"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="name@techexpo2027.in"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Region</label>
                  <select
                    value={newMemberRegion}
                    onChange={(e) => setNewMemberRegion(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Ahmedabad Hub">Ahmedabad Hub</option>
                    <option value="Vadodara Hub">Vadodara Hub</option>
                    <option value="Surat Hub">Surat Hub</option>
                    <option value="Rajkot Hub">Rajkot Hub</option>
                    <option value="Gandhinagar">Gandhinagar</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
