import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_CATEGORIES, GUJARAT_CITIES, calculatePriorityScore } from '../../data/criteriaConfig';
import { Building2, X, Check, Info, Sparkles, Shield, User } from 'lucide-react';

export const SchoolModal = ({ isOpen, onClose, initialSchool = null }) => {
  const { addSchool, updateSchool, criteriaWeights, teamMembers, currentUser } = useApp();

  const isEditing = Boolean(initialSchool);

  // Form State
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'contacts', 'scoring', 'classification'
  
  const [name, setName] = useState('');
  const [city, setCity] = useState('Ahmedabad');
  const [board, setBoard] = useState('CBSE');
  const [studentStrength, setStudentStrength] = useState(1200);
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [website, setWebsite] = useState('');

  const [principalName, setPrincipalName] = useState('');
  const [principalPhone, setPrincipalPhone] = useState('');
  const [principalEmail, setPrincipalEmail] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorPhone, setCoordinatorPhone] = useState('');
  const [coordinatorEmail, setCoordinatorEmail] = useState('');

  const [categories, setCategories] = useState(['Good to Connect With']);
  const [outreachStatus, setOutreachStatus] = useState('Not Contacted');
  const [assignedTo, setAssignedTo] = useState(currentUser.id);
  const [researchNotes, setResearchNotes] = useState('');
  const [evidenceLink, setEvidenceLink] = useState('');

  // 5 Scoring Criteria State
  const [scoringData, setScoringData] = useState({
    recent_events: { rating: 0.7, isUnknown: false, evidence: '' },
    reputation: { rating: 0.8, isUnknown: false, evidence: '' },
    existing_connections: { rating: 0.5, isUnknown: false, evidence: '' },
    technology_interest: { rating: 0.75, isUnknown: false, evidence: '' },
    ease_of_coordination: { rating: 0.8, isUnknown: false, evidence: '' },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialSchool) {
      setName(initialSchool.name || '');
      setCity(initialSchool.city || 'Ahmedabad');
      setBoard(initialSchool.board || 'CBSE');
      setStudentStrength(initialSchool.student_strength || 1000);
      setAddress(initialSchool.address || '');
      setPincode(initialSchool.pincode || '');
      setWebsite(initialSchool.website || '');

      setPrincipalName(initialSchool.principal_name || '');
      setPrincipalPhone(initialSchool.principal_phone || '');
      setPrincipalEmail(initialSchool.principal_email || '');
      setCoordinatorName(initialSchool.coordinator_name || '');
      setCoordinatorPhone(initialSchool.coordinator_phone || '');
      setCoordinatorEmail(initialSchool.coordinator_email || '');

      setCategories(initialSchool.categories || ['Good to Connect With']);
      setOutreachStatus(initialSchool.outreach_status || 'Not Contacted');
      setAssignedTo(initialSchool.assigned_to || currentUser.id);
      setResearchNotes(initialSchool.research_notes || '');
      setEvidenceLink((initialSchool.evidence_links && initialSchool.evidence_links[0]) || '');

      if (initialSchool.scoring_data) {
        setScoringData(initialSchool.scoring_data);
      }
    } else {
      // Reset defaults for Add mode
      setName('');
      setCity('Ahmedabad');
      setBoard('CBSE');
      setStudentStrength(1200);
      setAddress('');
      setPincode('');
      setWebsite('');
      setPrincipalName('');
      setPrincipalPhone('');
      setPrincipalEmail('');
      setCoordinatorName('');
      setCoordinatorPhone('');
      setCoordinatorEmail('');
      setCategories(['Good to Connect With']);
      setOutreachStatus('Not Contacted');
      setAssignedTo(currentUser.id);
      setResearchNotes('');
      setEvidenceLink('');
      setScoringData({
        recent_events: { rating: 0.7, isUnknown: false, evidence: 'Hosted science festival in recent academic year' },
        reputation: { rating: 0.8, isUnknown: false, evidence: 'Established board rankings and regional standing' },
        existing_connections: { rating: 0.5, isUnknown: false, evidence: 'Verified through education directory' },
        technology_interest: { rating: 0.75, isUnknown: false, evidence: 'Equipped with computer lab and science club' },
        ease_of_coordination: { rating: 0.8, isUnknown: false, evidence: 'Accessible transport corridor' },
      });
      setActiveTab('basic');
    }
    setErrors({});
  }, [initialSchool, isOpen, currentUser]);

  if (!isOpen) return null;

  // Live computed score
  const computed = calculatePriorityScore(scoringData, criteriaWeights);

  const toggleCategory = (catId) => {
    setCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const updateCriterion = (key, field, value) => {
    setScoringData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'School name is required';
    if (!city.trim()) errs.city = 'City is required';
    if (categories.length === 0) errs.categories = 'Please select at least one classification category';
    if (!principalName.trim() && !coordinatorName.trim()) {
      errs.contacts = 'Please provide either Principal or STEM Coordinator name';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const assignedMember = teamMembers.find((m) => m.id === assignedTo);

    const schoolPayload = {
      name: name.trim(),
      city: city.trim(),
      district: city.trim(),
      state: 'Gujarat',
      board,
      student_strength: Number(studentStrength) || 500,
      address: address.trim(),
      pincode: pincode.trim(),
      website: website.trim(),

      principal_name: principalName.trim(),
      principal_phone: principalPhone.trim(),
      principal_email: principalEmail.trim(),
      coordinator_name: coordinatorName.trim(),
      coordinator_phone: coordinatorPhone.trim(),
      coordinator_email: coordinatorEmail.trim(),

      categories,
      scoring_data: scoringData,
      outreach_status: outreachStatus,
      assigned_to: assignedTo,
      assigned_member_name: assignedMember ? assignedMember.name : currentUser.name,
      research_notes: researchNotes.trim(),
      evidence_links: evidenceLink.trim() ? [evidenceLink.trim()] : [],
    };

    if (isEditing) {
      updateSchool(initialSchool.id, schoolPayload);
    } else {
      addSchool(schoolPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? `Edit School: ${initialSchool?.name}` : 'Add New Institution to Directory'}
              </h3>
              <p className="text-xs text-slate-500">
                Gujarat School Intelligence & Priority Scoring Engine
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Score Preview Header Banner */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Computed Priority Score:</span>
            <span className="font-bold text-sm text-emerald-400">{computed.totalScore} / 100</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${computed.level === 'High' ? 'bg-emerald-500/30 text-emerald-300' : computed.level === 'Medium' ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-500/30 text-slate-300'}`}>
              {computed.level} Priority
            </span>
          </div>
          <div className="text-[11px] text-slate-300 hidden sm:block">
            Calculated across 5 weighted criteria
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 shrink-0 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors ${activeTab === 'basic' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            1. Basic & Academic Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors ${activeTab === 'contacts' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            2. Key Contacts & Ownership
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('classification')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors ${activeTab === 'classification' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            3. Classifications & Notes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scoring')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors ${activeTab === 'scoring' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            4. Priority Criteria Ratings
          </button>
        </div>

        {/* Tab Contents */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: BASIC DETAILS */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  School Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Delhi Public School, Bopal"
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City (Gujarat) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {GUJARAT_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Affiliation Board</label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="GSEB">GSEB (Gujarat State Board)</option>
                    <option value="ICSE">ICSE / ISC</option>
                    <option value="IB">IB (International Baccalaureate)</option>
                    <option value="Cambridge">Cambridge (IGCSE)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Student Strength</label>
                  <input
                    type="number"
                    value={studentStrength}
                    onChange={(e) => setStudentStrength(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Campus street address, area"
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACTS & OWNERSHIP */}
          {activeTab === 'contacts' && (
            <div className="space-y-5">
              {errors.contacts && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  {errors.contacts}
                </div>
              )}

              {/* Principal Card */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Principal / Head of School
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Principal Name</label>
                    <input
                      type="text"
                      value={principalName}
                      onChange={(e) => setPrincipalName(e.target.value)}
                      placeholder="Dr. / Mrs. / Mr."
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone / Office Line</label>
                    <input
                      type="text"
                      value={principalPhone}
                      onChange={(e) => setPrincipalPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Official Email</label>
                    <input
                      type="email"
                      value={principalEmail}
                      onChange={(e) => setPrincipalEmail(e.target.value)}
                      placeholder="principal@school.edu.in"
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Coordinator Card */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> STEM / ATL / Robotics Coordinator
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Coordinator Name</label>
                    <input
                      type="text"
                      value={coordinatorName}
                      onChange={(e) => setCoordinatorName(e.target.value)}
                      placeholder="Name & Designation"
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile / WhatsApp</label>
                    <input
                      type="text"
                      value={coordinatorPhone}
                      onChange={(e) => setCoordinatorPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Direct Email</label>
                    <input
                      type="email"
                      value={coordinatorEmail}
                      onChange={(e) => setCoordinatorEmail(e.target.value)}
                      placeholder="coordinator@school.edu.in"
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Assignment & Pipeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Team Owner</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.region})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Outreach Status</label>
                  <select
                    value={outreachStatus}
                    onChange={(e) => setOutreachStatus(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Not Contacted">Not Contacted</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Call Scheduled">Call Scheduled</option>
                    <option value="Meeting Scheduled">Meeting Scheduled</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Interested">Interested</option>
                    <option value="Confirmed">Confirmed Delegation</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLASSIFICATIONS & NOTES */}
          {activeTab === 'classification' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  School Classifications (Multiple Allowed) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ALL_CATEGORIES.map((cat) => {
                    const isSelected = categories.includes(cat.id);
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border text-left text-xs transition-all ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-400 text-indigo-900 font-semibold ring-1 ring-indigo-400'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
                {errors.categories && <p className="text-xs text-rose-500 mt-1">{errors.categories}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Field Research Notes</label>
                <textarea
                  rows={3}
                  value={researchNotes}
                  onChange={(e) => setResearchNotes(e.target.value)}
                  placeholder="Specific intelligence regarding student robotics clubs, administrative openness, preferred communication time, etc."
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supporting Evidence Link (URL)</label>
                <input
                  type="url"
                  value={evidenceLink}
                  onChange={(e) => setEvidenceLink(e.target.value)}
                  placeholder="https://... (e.g. news article, school science fair report, ATL directory entry)"
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 4: SCORING CRITERIA */}
          {activeTab === 'scoring' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-lg text-xs text-indigo-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Configurable Priority Weights:</strong> Adjust the rating slider for each criterion. Mark as &ldquo;Unknown&rdquo; if data is pending verification; unknown entries contribute 0 points until verified.
                </div>
              </div>

              {Object.entries(criteriaWeights).map(([key, criterion]) => {
                const item = scoringData[key] || { rating: 0.5, isUnknown: false, evidence: '' };
                const currentRating = item.isUnknown ? 0 : Math.round(item.rating * 100);
                const earnedPoints = item.isUnknown ? 0 : (item.rating * criterion.weight).toFixed(1);

                return (
                  <div key={key} className="p-4 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>{criterion.name}</span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Weight: {criterion.weight} pts max
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{criterion.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-indigo-600">
                          {item.isUnknown ? '0.0' : earnedPoints}
                        </span>
                        <span className="text-xs text-slate-400"> / {criterion.weight} pts</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          disabled={item.isUnknown}
                          value={item.isUnknown ? 0 : Math.round(item.rating * 100)}
                          onChange={(e) => updateCriterion(key, 'rating', Number(e.target.value) / 100)}
                          className="w-full accent-indigo-600 cursor-pointer disabled:opacity-30"
                        />
                        <span className="text-xs font-mono font-bold w-12 text-right text-slate-700">
                          {item.isUnknown ? 'N/A' : `${Math.round(item.rating * 100)}%`}
                        </span>
                      </div>

                      <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={item.isUnknown}
                          onChange={(e) => updateCriterion(key, 'isUnknown', e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Unknown / Needs Research</span>
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Supporting evidence, awards, lab details, or contact notes..."
                        value={item.evidence}
                        onChange={(e) => updateCriterion(key, 'evidence', e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'scoring') setActiveTab('classification');
                    else if (activeTab === 'classification') setActiveTab('contacts');
                    else if (activeTab === 'contacts') setActiveTab('basic');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  &larr; Previous
                </button>
              )}
              {activeTab !== 'scoring' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'basic') setActiveTab('contacts');
                    else if (activeTab === 'contacts') setActiveTab('classification');
                    else if (activeTab === 'classification') setActiveTab('scoring');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Next &rarr;
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
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
                <span>{isEditing ? 'Save Changes' : 'Create School Record'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
