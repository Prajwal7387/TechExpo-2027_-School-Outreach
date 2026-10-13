import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Copy,
  Check,
  Send,
  Building2,
  User,
  ShieldCheck,
  FileText,
  Download,
  PhoneCall,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

export const PitchAssistantView = ({ onOpenOutreachModal }) => {
  const {
    schools,
    selectedSchoolId,
    setSelectedSchoolId,
    currentUser,
    addToast,
    logOutreach,
  } = useApp();

  const [activeSchoolId, setActiveSchoolId] = useState(selectedSchoolId || (schools[0]?.id || ''));
  const [targetAudience, setTargetAudience] = useState('Principal'); // 'Principal', 'Coordinator', 'Trustee'
  const [pitchChannel, setPitchChannel] = useState('Email'); // 'Email', 'WhatsApp', 'Phone Script', 'Letter'
  const [pitchTone, setPitchTone] = useState('Professional & Collaborative'); // 'Professional & Collaborative', 'High-Energy STEM', 'Formal Institutional'

  const [generatedPitch, setGeneratedPitch] = useState('');
  const [copied, setCopied] = useState(false);

  const school = schools.find((s) => s.id === activeSchoolId) || schools[0];

  useEffect(() => {
    if (selectedSchoolId) {
      setActiveSchoolId(selectedSchoolId);
    }
  }, [selectedSchoolId]);

  // Synthesis generator using strictly verified facts and approved TechExpo collateral
  const generatePitchContent = () => {
    if (!school) return;

    const principal = school.principal_name || 'Respected Principal';
    const coordinator = school.coordinator_name || 'Respected Coordinator';
    const city = school.city;
    const board = school.board;
    const categories = school.categories || [];
    const recentEvidence = school.scoring_data?.recent_events?.evidence || '';
    const techEvidence = school.scoring_data?.technology_interest?.evidence || '';

    let pitch = '';

    if (pitchChannel === 'Email') {
      if (targetAudience === 'Principal') {
        pitch = `Subject: Official Invitation: Priority Delegation Reservation for ${school.name} at TechExpo 2027

Respected ${principal},

Greetings from the Organizing Directorate of TechExpo 2027 – Gujarat’s Flagship Youth Science, Technology & Innovation Exposition.

We have closely observed the commendable academic and extracurricular leadership of ${school.name} in ${city}. In particular, your focus on progressive pedagogy (${board} curriculum) and notable student initiatives${techEvidence ? ` — such as ${techEvidence} —` : ''} stands as a benchmark for student excellence across Gujarat.

We have the privilege of formally extending an invitation to ${school.name} to participate as an Honored Institutional Partner at TechExpo 2027, scheduled for January 2027 in Gandhinagar/Ahmedabad.

Opportunities Exclusively Reserved for Your School's Contingent:
1. Student Innovation Olympiad & Robotics Championship: High-school student teams can present maker projects before national evaluators and academic leaders.
2. Hands-on Immersion Pavilions: Access to state-of-the-art interactive demonstrations in Aerospace, Robotics, Artificial Intelligence, and Sustainable Energy.
3. Subsidized School Contingent Passes: Special student bus arrival facilitation and accredited Certificates of Innovation for all registered delegates.
${recentEvidence ? `4. Institutional Showcase: Given your institution's track record (${recentEvidence}), we are pleased to offer a dedicated student innovation demonstration booth.` : ''}

Could we schedule a brief 10-minute briefing with your office or appointed STEM Coordinator (${coordinator}) this week to confirm student contingent quotas?

Warm regards,

${currentUser.name}
${currentUser.designation}
TechExpo 2027 Organizing Directorate
Email: ${currentUser.email}`;
      } else if (targetAudience === 'Coordinator') {
        pitch = `Subject: TechExpo 2027 Student Tech Challenge: Nomination Slot for ${school.name}

Dear ${coordinator},

Hope this email finds you well.

I am reaching out from the TechExpo 2027 School Outreach team. We have noted with great appreciation your active leadership in fostering STEM initiatives at ${school.name}, ${city}${techEvidence ? `, specifically your work with ${techEvidence}` : ''}.

TechExpo 2027 is hosting Gujarat's largest inter-school student technology challenge this January 2027. We are inviting premier institutions to nominate student maker teams in three key tracks:
• Autonomous Robotics & Drone Systems
• AI & Computational Problem Solving
• CleanTech & Climate Innovation

Each selected student project team receives complimentary exhibition space in our Youth Innovation Pavilion, alongside dedicated mentorship from premier university faculty.

Would you have 10 minutes this Thursday or Friday for a quick coordination call to share the delegation handbook and student registration guidelines?

Best regards,

${currentUser.name}
${currentUser.designation}
TechExpo 2027 Organizing Committee
Contact: ${currentUser.email}`;
      } else {
        // Trustee / Management
        pitch = `Subject: Institutional Partnership Invitation: TechExpo 2027 & ${school.name}

Respected Management & Trustees of ${school.name},

On behalf of the TechExpo 2027 Advisory Council, we extend our compliments on the outstanding reputation and community trust commanded by ${school.name} across ${city} and Gujarat.

As Gujarat prepares to convene its premier technology showcase in January 2027, bringing together over 25,000 students, researchers, and technology leaders, we seek to formalize an Institutional Delegation Partnership with ${school.name}.

Participation ensures your senior students receive direct exposure to emerging career pathways in DeepTech, Robotics, and Advanced Engineering, reflecting the forward-looking vision of your institution.

We would welcome an introductory meeting with the board of management to review transport logistics, safety protocols, and student delegation sponsorship details.

Sincerely,

${currentUser.name}
${currentUser.designation}
TechExpo 2027 Secretariat`;
      }
    } else if (pitchChannel === 'WhatsApp') {
      if (targetAudience === 'Coordinator') {
        pitch = `Hello ${coordinator}! Hope you are having a great week at ${school.name}, ${city}.

I am reaching out from the TechExpo 2027 School Outreach team. We have been following the impressive STEM activities at your campus${techEvidence ? ` (${techEvidence})` : ''}.

We are officially launching student registrations for the TechExpo 2027 Youth Innovation Pavilion (Jan 2027 in Gandhinagar). Each premier school can nominate up to 3 student maker projects for national showcase and awards.

Would you be open to a 3-minute phone call today, or may I send you our 2-page PDF overview on WhatsApp?

Best regards,
${currentUser.name}
TechExpo 2027 Outreach Lead`;
      } else {
        pitch = `Respected ${principal},

Greetings from the TechExpo 2027 Organizing Secretariat. We have reserved an initial 80-student delegation quota for ${school.name}, ${city} for Gujarat's Flagship Youth Tech Expo in January 2027.

Key highlights include the Student Robotics Olympiad, Hands-on AI labs, and accredited innovation certificates.

May our outreach coordinator connect with your office or STEM in-charge for a brief 5-minute briefing?

Warm regards,
${currentUser.name} | TechExpo 2027 Secretariat`;
      }
    } else if (pitchChannel === 'Phone Script') {
      pitch = `[PHONE CALL OUTLINE - STRICTLY GROUNDED]

Target: ${targetAudience === 'Coordinator' ? coordinator : principal} (${school.name}, ${city})

1. GREETING & CONTEXT:
"Good morning / afternoon ${targetAudience === 'Coordinator' ? coordinator : principal}. My name is ${currentUser.name} calling from the TechExpo 2027 Organizing Secretariat in Gujarat. Am I speaking with the person who oversees STEM initiatives and student exhibitions for ${school.name}?"

2. RECOGNITION (VERIFIED RECORD):
"The reason for my call today is that we have been reviewing top-tier institutions across ${city}${techEvidence ? `, and we specifically noted your campus achievements in ${techEvidence}` : ''}. We are hosting TechExpo 2027 in January, and our committee has reserved a priority delegation slot for ${school.name} students."

3. VALUE PROPOSITION:
• Free entry passes and bus logistics support for student contingents.
• Hands-on Robotics, Drone Arena, and AI workshops.
• Opportunity for your students to present their science projects in the State Youth Pavilion with prizes and certificates.

4. OBJECTION HANDLING:
• If they ask about exam schedules: "We understand academic priorities; the Expo is scheduled for early January with flexible half-day morning/afternoon arrival slots so student classes are not disrupted."
• If they ask about transport: "We coordinate with local charter bus providers to subsidize school group transport directly to the exhibition hall."

5. CLOSING ACTION COMMITMENT:
"Can I confirm your preferred email address to share the official 3-page delegation briefing and schedule a follow-up confirmation call next Tuesday?"`;
    } else {
      // Official Letter
      pitch = `REF: TE27/OUTREACH/SCH-${school.id.toUpperCase()}
DATE: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

TO:
The Principal / Head of Institution
${school.name}
${school.address ? school.address + ',\n' : ''}${school.city}, Gujarat - ${school.pincode || '380001'}

SUBJECT: OFFICIAL INVITATION TO ATTEND TECHEXPO 2027 (GUJARAT YOUTH INNOVATION PAVILION)

Respected Madam / Sir,

It gives us immense pleasure to invite ${school.name} to participate as an Official Delegating Institution at TechExpo 2027, the flagship student technology and future industries exposition of Western India, scheduled for January 2027.

Recognizing ${school.name}'s pioneering standards in science education and holistic student development${recentEvidence ? ` (demonstrated during ${recentEvidence})` : ''}, our committee has reserved attendance allocations for up to 100 students from your senior secondary classes.

Students attending the exposition will receive:
a) Direct interactive masterclasses with leading scientists and space tech founders.
b) Official Gujarat Student Innovation Certification.
c) Access to the competitive Robotics Olympiad and Maker Challenges.

We request you to kindly nominate a Faculty Coordinator to liaise with our team regarding logistical arrangements and student safety guidelines.

Yours faithfully,

${currentUser.name}
${currentUser.designation}
Organizing Directorate, TechExpo 2027`;
    }

    setGeneratedPitch(pitch);
  };

  useEffect(() => {
    generatePitchContent();
  }, [activeSchoolId, targetAudience, pitchChannel, pitchTone]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPitch);
    setCopied(true);
    addToast('success', 'Pitch copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPitch], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Pitch_${school.name.replace(/[^a-zA-Z0-9]/g, '_')}_${pitchChannel}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Downloaded pitch script file.');
  };

  const handleSaveAsOutreach = () => {
    // Log pitch as an outreach attempt directly
    logOutreach(school.id, {
      channel: pitchChannel === 'WhatsApp' ? 'WhatsApp' : pitchChannel === 'Email' ? 'Email' : 'Phone Call',
      contact_person: targetAudience === 'Coordinator' ? school.coordinator_name || 'Coordinator' : school.principal_name || 'Principal',
      response_status: 'Proposal Requested',
      meeting_status: 'None',
      notes: `Dispatched customized ${pitchChannel} pitch to ${targetAudience}. Content saved in outreach archive.`,
      pitch_used: generatedPitch,
      next_follow_up: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Grounded Pitch Assistant</h2>
              <p className="text-xs text-slate-500">
                Synthesizes verified school facts with approved TechExpo 2027 collateral &bull; Zero hallucinations
              </p>
            </div>
          </div>

          {/* Strict Grounding Badge */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 text-xs shrink-0 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Strictly Grounded &bull; Verified Intelligence Only</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: CONFIGURATION VS EDITABLE PITCH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: PARAMETER CONFIGURATION */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Pitch Parameters
            </h3>

            {/* Target School Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target School
              </label>
              <select
                value={activeSchoolId}
                onChange={(e) => {
                  setActiveSchoolId(e.target.value);
                  setSelectedSchoolId(e.target.value);
                }}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {schools.filter((s) => !s.is_archived).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Stakeholder
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Principal', 'Coordinator', 'Trustee'].map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setTargetAudience(aud)}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                      targetAudience === aud
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>

            {/* Pitch Channel */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Communication Channel
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Email', label: 'Email Invite' },
                  { id: 'WhatsApp', label: 'WhatsApp' },
                  { id: 'Phone Script', label: 'Phone Script' },
                  { id: 'Letter', label: 'Official Letter' },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setPitchChannel(ch.id)}
                    className={`p-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                      pitchChannel === ch.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Re-generate trigger button */}
            <button
              onClick={generatePitchContent}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Base Draft</span>
            </button>
          </div>

          {/* VERIFIED GROUNDING DATA INSPECTOR */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Active Evidence Used for Grounding</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-600 pt-1">
              <div>
                <strong>Location & Board:</strong> {school?.city}, {school?.board}
              </div>
              <div>
                <strong>Key Contact:</strong> {targetAudience === 'Coordinator' ? school?.coordinator_name : school?.principal_name}
              </div>
              <div>
                <strong>Categories:</strong> {(school?.categories || []).join(', ')}
              </div>
              <div>
                <strong>Lab/Tech Notes:</strong>{' '}
                <span className="italic">{school?.scoring_data?.technology_interest?.evidence || 'General STEM'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE EDITABLE PITCH CANVAS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-full">
            {/* Top Toolbar */}
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {school.name} &bull; {pitchChannel} Draft
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-medium">
                  Audience: {targetAudience}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Copy */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
                  title="Download as TXT"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                {/* Save and Log as Outreach */}
                <button
                  onClick={handleSaveAsOutreach}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
                  title="Log directly as an outreach interaction"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save as Outreach Log</span>
                </button>
              </div>
            </div>

            {/* Editable Pitch Area */}
            <div className="p-4 flex-1">
              <textarea
                value={generatedPitch}
                onChange={(e) => setGeneratedPitch(e.target.value)}
                rows={18}
                className="w-full h-full p-4 text-xs font-mono text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed resize-y"
              />
            </div>

            {/* Bottom character counter & guidance */}
            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <span>
                {generatedPitch.split(/\s+/).filter(Boolean).length} words &bull; {generatedPitch.length} characters
              </span>
              <span>
                Review and tweak any sentences before sending to ensure institutional tone alignment.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
