import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CHANNELS } from '../../data/criteriaConfig';
import { PhoneCall, Calendar, Clock, User, X, Check, FileText } from 'lucide-react';

export const LogOutreachModal = ({ isOpen, onClose, initialSchoolId }) => {
  const { schools, logOutreach, addToast } = useApp();

  const [schoolId, setSchoolId] = useState(initialSchoolId || (schools[0]?.id || ''));
  const [channel, setChannel] = useState('Phone Call');
  const [contactPerson, setContactPerson] = useState('');
  const [responseStatus, setResponseStatus] = useState('Positive Interest');
  const [meetingStatus, setMeetingStatus] = useState('None');
  const [notes, setNotes] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [errors, setErrors] = useState({});

  const activeSchool = schools.find((s) => s.id === schoolId);

  // Update contact person default when active school changes
  useEffect(() => {
    if (activeSchool && !contactPerson) {
      setContactPerson(activeSchool.coordinator_name || activeSchool.principal_name || '');
    }
  }, [activeSchool]);

  useEffect(() => {
    if (initialSchoolId) {
      setSchoolId(initialSchoolId);
      const s = schools.find((x) => x.id === initialSchoolId);
      if (s) {
        setContactPerson(s.coordinator_name || s.principal_name || '');
      }
    }
  }, [initialSchoolId, schools]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!schoolId) errs.schoolId = 'Please select a school';
    if (!contactPerson.trim()) errs.contactPerson = 'Contact person name is required';
    if (!notes.trim() || notes.trim().length < 5) errs.notes = 'Please provide detailed interaction notes (at least 5 characters)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    logOutreach(schoolId, {
      channel,
      contact_person: contactPerson.trim(),
      response_status: responseStatus,
      meeting_status: meetingStatus,
      notes: notes.trim(),
      next_follow_up: nextFollowUp ? new Date(nextFollowUp).toISOString() : null,
    });

    onClose();
    // Reset form
    setNotes('');
    setNextFollowUp('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Log Outreach Activity</h3>
              <p className="text-xs text-slate-500">Record communication, meetings, and schedule next follow-up</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target School */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select School <span className="text-rose-500">*</span>
            </label>
            <select
              value={schoolId}
              onChange={(e) => {
                setSchoolId(e.target.value);
                const s = schools.find((x) => x.id === e.target.value);
                if (s) setContactPerson(s.coordinator_name || s.principal_name || '');
              }}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city}) - Score: {s.priority_score}
                </option>
              ))}
            </select>
            {errors.schoolId && <p className="text-xs text-rose-500 mt-1">{errors.schoolId}</p>}
          </div>

          {/* Channel & Contact Person */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Communication Channel <span className="text-rose-500">*</span>
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {CHANNELS.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Person Spoken To <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g., Vikram Joshi (ATL Coordinator)"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.contactPerson && <p className="text-xs text-rose-500 mt-1">{errors.contactPerson}</p>}
            </div>
          </div>

          {/* Response Status & Meeting Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Response Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={responseStatus}
                onChange={(e) => setResponseStatus(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Positive Interest">Positive Interest</option>
                <option value="Confirmed Delegation">Confirmed Delegation</option>
                <option value="Meeting Scheduled">Meeting Scheduled</option>
                <option value="Call Scheduled">Call Scheduled</option>
                <option value="Proposal Requested">Proposal Requested</option>
                <option value="Needs Follow-up">Needs Follow-up</option>
                <option value="Declined">Declined</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Status</label>
              <select
                value={meetingStatus}
                onChange={(e) => setMeetingStatus(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="None">None</option>
                <option value="Pending">Scheduled / Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Discussion Notes & Key Commitments <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Summary of conversation, questions raised, number of students promised, bus arrangement required, etc."
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.notes && <p className="text-xs text-rose-500 mt-1">{errors.notes}</p>}
          </div>

          {/* Next Follow-up Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Next Follow-Up Date & Time (Optional)
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              If this date elapses without completion, it will trigger an overdue alert on the dashboard.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Outreach Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
