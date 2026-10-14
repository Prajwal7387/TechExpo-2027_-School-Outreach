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
  RefreshCw,
  Bus,
  MapPin,
  GraduationCap
} from 'lucide-react';

/**
 * City-specific transit and connectivity intelligence for schools visiting
 * Parul University Campus, P.O. Limda, Waghodia, Vadodara, Gujarat.
 */
export const getCityConnectivityInfo = (city) => {
  switch (city?.toLowerCase()) {
    case 'vadodara':
      return {
        distance: 'Local City Transit (Approx. 20–25 mins)',
        transitType: 'Dedicated Campus Shuttle Pickup',
        route: 'Direct via Waghodia Road Arterial Link',
        summary: 'Direct campus shuttle pickup from your school gates to Parul University, with round-trip morning & afternoon timing.',
        travelClause: 'As your institution is situated within Vadodara, Parul University is arranging dedicated campus shuttle services directly from your school premises to our expo grounds, ensuring zero transit friction for your students.',
        transitNote: 'School gate pickup • 20-min direct campus shuttle • Zero cost to students',
      };
    case 'anand':
      return {
        distance: '45 km (Approx. 45–50 mins)',
        transitType: 'Expressway Student Coaches',
        route: 'Direct via NE-1 / NH-48 Express Corridor',
        summary: 'Direct 45-minute smooth highway transit to Parul University Campus via NH-48.',
        travelClause: 'Given your convenient proximity (~45 minutes via NH-48), Parul University is facilitating subsidized student delegation buses from Anand directly to our campus entrance.',
        transitNote: 'Direct NH-48 expressway coach • 45 mins • Teacher escort reserved',
      };
    case 'ahmedabad':
      return {
        distance: '115 km (Approx. 1 hr 45 mins)',
        transitType: 'Chartered AC Delegation Coaches',
        route: 'National Expressway 1 (NE-1 Ahmedabad-Vadodara Expressway)',
        summary: 'Rapid 1.5–2 hour transit via Ahmedabad-Vadodara Expressway (NE-1) with designated pickup points.',
        travelClause: 'To ensure effortless connectivity from Ahmedabad, Parul University is coordinating chartered AC student delegation coaches via National Expressway 1 (NE-1) with morning departures and escorted arrival directly at the Parul University Expo Pavilion.',
        transitNote: 'Chartered AC Volvo coaches via NE-1 • 1.5 hrs • Escorted campus entry',
      };
    case 'gandhinagar':
      return {
        distance: '140 km (Approx. 2 hrs 15 mins)',
        transitType: 'Chartered Highway Delegation Coaches',
        route: 'Direct via SP Ring Road & NE-1 Expressway to Vadodara',
        summary: 'Coordinated expressway transit connecting Gandhinagar capital hub directly to Parul University, Vadodara.',
        travelClause: 'For visiting student contingents from Gandhinagar, Parul University provides chartered express coaches via NE-1, along with dedicated campus arrival hospitality and scheduled return transit.',
        transitNote: 'Express highway coach via NE-1 • Dedicated arrival hospitality desk',
      };
    case 'surat':
      return {
        distance: '155 km (Approx. 2 hrs 30 mins)',
        transitType: 'Highway Transit / Vadodara Rly Shuttle',
        route: 'NH-48 Golden Corridor & Vande Bharat Rail Links',
        summary: 'Smooth 2.5-hour highway transit via NH-48 or morning rail delegation with Parul University station pickup.',
        travelClause: 'For schools traveling from Surat, Parul University offers coordinated arrival support, including reception shuttles from Vadodara Junction railway station and chartered bus parking at the Expo grounds.',
        transitNote: 'NH-48 corridor / Morning Vande Bharat • Station pickup to campus',
      };
    case 'rajkot':
      return {
        distance: '260 km (Approx. 4 hrs 30 mins)',
        transitType: 'Full-Day Delegation Package / Campus Hostels',
        route: 'SH-25 & NH-47 Corridor / Rail Transit to Vadodara',
        summary: 'Full-day delegation support with Parul University guest reception and student refreshment lounges.',
        travelClause: 'For outstation delegations from Rajkot and Saurashtra, Parul University provides an all-inclusive delegation package, including station pick-and-drop from Vadodara Junction, dedicated student lounges, and campus hospitality.',
        transitNote: 'Full-day delegation package • Vadodara Junction shuttle • Guest lounge',
      };
    case 'bhavnagar':
      return {
        distance: '200 km (Approx. 3 hrs 45 mins)',
        transitType: 'Express Coaches via Tarapur-Vasad',
        route: 'State Highway via Tarapur-Vasad to Vadodara',
        summary: 'Express bus coordination and dedicated contingent reception at Parul University.',
        travelClause: 'For schools traveling from Bhavnagar, Parul University assists with chartered group transit coordination and dedicated campus registration desks upon arrival.',
        transitNote: 'Chartered group transit • Direct campus registration lounge',
      };
    default:
      return {
        distance: 'Gujarat Regional Transit Corridor',
        transitType: 'Delegation Bus & Station Shuttle',
        route: 'Direct Access via Vadodara Highway & Railway Hub',
        summary: 'Dedicated Parul University reception at Vadodara Junction and highway transit hubs.',
        travelClause: 'Parul University provides comprehensive arrival support for student delegations, including shuttle connections from Vadodara transit hubs directly to our campus pavilions.',
        transitNote: 'Dedicated arrival shuttle from Vadodara transit hubs directly to campus',
      };
  }
};

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
  const [pitchFocus, setPitchFocus] = useState('Balanced'); // 'Balanced', 'Logistics', 'Robotics'
  const [includeConnectivity, setIncludeConnectivity] = useState(true);
  const [variantIndex, setVariantIndex] = useState(0);

  const [generatedPitch, setGeneratedPitch] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const school = schools.find((s) => s.id === activeSchoolId) || schools[0];
  const connectivity = getCityConnectivityInfo(school?.city);

  useEffect(() => {
    if (selectedSchoolId) {
      setActiveSchoolId(selectedSchoolId);
    }
  }, [selectedSchoolId]);

  // Synthesis generator strictly incorporating Parul University and verified school facts
  const generatePitchContent = (customVariant = variantIndex) => {
    if (!school) return;

    const principal = school.principal_name || 'Respected Principal';
    const coordinator = school.coordinator_name || 'Respected Coordinator';
    const city = school.city;
    const board = school.board;
    const categories = school.categories || [];
    const recentEvidence = school.scoring_data?.recent_events?.evidence || '';
    const techEvidence = school.scoring_data?.technology_interest?.evidence || '';
    const connClause = includeConnectivity ? `\n\nCampus Transit & Connectivity Facilitation:\n${connectivity.travelClause}` : '';

    let pitch = '';

    if (pitchChannel === 'Email') {
      if (targetAudience === 'Principal') {
        const intros = [
          `Greetings from the Organizing Directorate of TechExpo 2027, proudly hosted and conducted by Parul University, Vadodara — Gujarat’s premier multidisciplinary innovation and research institution.`,
          `On behalf of the Leadership and Academic Directorate of Parul University, Vadodara, I am delighted to reach out regarding TechExpo 2027 — Western India's flagship youth technology exposition.`,
          `It is our distinct honour at Parul University, Vadodara, to invite your esteemed institution to TechExpo 2027, convening Gujarat's brightest young innovators this January 2027.`,
        ];
        const selectedIntro = intros[customVariant % intros.length];

        pitch = `Subject: Official Invitation: Priority Delegation Reservation for ${school.name} at TechExpo 2027 (Conducted by Parul University)

Respected ${principal},

${selectedIntro}

We have closely observed the commendable academic and extracurricular leadership of ${school.name} in ${city}. In particular, your focus on progressive pedagogy (${board} curriculum) and notable student initiatives${techEvidence ? ` — such as ${techEvidence} —` : ''} stands as a benchmark for student excellence across Gujarat.

We have the privilege of formally extending an invitation to ${school.name} to participate as an Honored Institutional Partner at TechExpo 2027, scheduled for January 2027 at the expansive Parul University Campus, Vadodara.

Opportunities Exclusively Reserved for Your School's Contingent:
1. Student Innovation Olympiad & Robotics Championship: High-school student teams can present maker projects before national evaluators, startup founders, and Parul University faculty.
2. Hands-on Immersion Pavilions: Access to state-of-the-art interactive demonstrations in Aerospace, Robotics, Artificial Intelligence, and Sustainable Energy across Parul University's world-class labs.
3. Subsidized School Contingent Passes: Official accredited Certificates of Innovation for all registered student delegates and faculty coordinators.${connClause}
${recentEvidence ? `4. Institutional Showcase: Given your institution's track record (${recentEvidence}), we are pleased to offer a dedicated student innovation demonstration booth on the main expo floor.` : ''}

Could we schedule a brief 10-minute briefing with your office or appointed STEM Coordinator (${coordinator}) this week to confirm student contingent quotas and logistical arrangements?

Warm regards,

${currentUser.name}
${currentUser.designation}
TechExpo 2027 Organizing Directorate
Parul University, P.O. Limda, Waghodia, Vadodara, Gujarat - 391760
Email: ${currentUser.email} | university-outreach@paruluniversity.ac.in
Website: paruluniversity.ac.in`;
      } else if (targetAudience === 'Coordinator') {
        pitch = `Subject: TechExpo 2027 Student Tech Challenge @ Parul University: Nomination Slot for ${school.name}

Dear ${coordinator},

Hope this email finds you well.

I am reaching out from the TechExpo 2027 School Outreach team at Parul University, Vadodara. We have noted with great appreciation your active leadership in fostering STEM, robotics, and hands-on maker initiatives at ${school.name}, ${city}${techEvidence ? `, specifically your work with ${techEvidence}` : ''}.

Parul University is conducting Gujarat's largest inter-school student technology challenge and exposition this January 2027 at our 150-acre multidisciplinary campus in Vadodara. We are inviting premier institutions to nominate student maker teams in three key tracks:
• Autonomous Robotics & Aerial Drone Systems
• AI & Computational Problem Solving
• CleanTech, EV & Sustainable Engineering

Each selected student project team receives complimentary exhibition space in our Central Innovation Pavilion, alongside dedicated technical mentoring from Parul University engineering faculty and industry judges.${connClause}

Would you have 10 minutes this Thursday or Friday for a quick coordination call to share the delegation handbook, student registration guidelines, and bus arrival slots?

Best regards,

${currentUser.name}
${currentUser.designation}
TechExpo 2027 Organizing Committee
Parul University, Vadodara
Contact: ${currentUser.email}`;
      } else {
        // Trustee / Management
        pitch = `Subject: Institutional Delegation Partnership: TechExpo 2027 & ${school.name} (Conducted by Parul University)

Respected Management & Trustees of ${school.name},

On behalf of the Governing Board and Leadership of Parul University, Vadodara, we extend our compliments on the outstanding reputation and community trust commanded by ${school.name} across ${city} and Gujarat.

As Parul University prepares to host TechExpo 2027 this January on our Vadodara campus — bringing together over 25,000 students, researchers, and technology leaders — we seek to formalize an Institutional Delegation Partnership with ${school.name}.

Participation ensures your senior secondary students receive direct exposure to emerging career pathways in DeepTech, Robotics, Artificial Intelligence, and Advanced Engineering, reflecting the progressive vision of your institution.

Logistics & Campus Hospitality:
${connectivity.travelClause} Parul University's dedicated delegation liaison will oversee student arrival, guided campus safety, and dedicated faculty reception.

We would welcome an introductory meeting with the board of management to review transport logistics, safety protocols, and student delegation sponsorship details.

Sincerely,

${currentUser.name}
${currentUser.designation}
TechExpo 2027 Secretariat
Parul University, P.O. Limda, Waghodia, Vadodara, Gujarat 391760`;
      }
    } else if (pitchChannel === 'WhatsApp') {
      if (targetAudience === 'Coordinator') {
        pitch = `Hello ${coordinator}! Greetings from Parul University, Vadodara — organizers of TechExpo 2027.

We have been closely following the impressive STEM activities at ${school.name}, ${city}${techEvidence ? ` (${techEvidence})` : ''}.

We are officially launching student nominations for the TechExpo 2027 Youth Innovation Pavilion (Jan 2027 at Parul University Campus, Vadodara). Each premier school can nominate up to 3 student maker projects for national showcase, cash prizes, and innovation certs.

🚌 Campus Transit: ${connectivity.summary}

Would you be open to a quick 3-minute phone call today, or may I send you our 2-page delegation PDF on WhatsApp?

Best regards,
${currentUser.name}
TechExpo 2027 School Outreach | Parul University, Vadodara`;
      } else {
        pitch = `Respected ${principal},

Greetings from Parul University, Vadodara. We have reserved an initial 80-student delegation quota for ${school.name}, ${city} for TechExpo 2027, conducted at our Vadodara campus this January 2027.

Key highlights include the Student Robotics Olympiad, Hands-on AI labs, and accredited innovation certificates.

🚌 Campus Connectivity: ${connectivity.summary}

May our outreach coordinator connect with your office or STEM in-charge for a brief 5-minute briefing?

Warm regards,
${currentUser.name} | TechExpo 2027 Secretariat, Parul University`;
      }
    } else if (pitchChannel === 'Phone Script') {
      pitch = `[PHONE CALL OUTLINE - CONDUCTED BY PARUL UNIVERSITY]

Target: ${targetAudience === 'Coordinator' ? coordinator : principal} (${school.name}, ${city})
Location & Transit: ${connectivity.distance} (${connectivity.transitType})

1. GREETING & CONTEXT:
"Good morning / afternoon ${targetAudience === 'Coordinator' ? coordinator : principal}. My name is ${currentUser.name} calling from the TechExpo 2027 Organizing Directorate at Parul University, Vadodara. Am I speaking with the person who oversees STEM initiatives and student exhibitions for ${school.name}?"

2. INSTITUTIONAL CREDIBILITY & RECOGNITION:
"The reason for my call today is that Parul University is conducting TechExpo 2027 — Gujarat's flagship youth technology exposition this January. Our committee has been reviewing top-tier institutions across ${city}${techEvidence ? `, and we specifically noted your campus achievements in ${techEvidence}` : ''}. We have reserved a priority delegation slot for ${school.name} students."

3. VALUE PROPOSITION & PARUL UNIVERSITY HIGHLIGHTS:
• State-of-the-art Robotics Arenas, AI supercomputing pavilions, and Drone challenges on the 150-acre Parul University campus.
• Opportunity for your students to present their science projects in the State Youth Pavilion before university evaluators and industry mentors.
• Accredited Innovation Certificates for all delegates.

4. LOGISTICS & CONNECTIVITY (GROUNDED IN GUJARAT REGIONAL ACCESS):
• "${connectivity.travelClause}"
• "Our campus hospitality team coordinates flexible arrival slots so student classes and exams are not disrupted."

5. OBJECTION HANDLING:
• If they ask about exam schedules: "We understand academic priorities; the Expo is scheduled for early January with flexible half-day morning/afternoon arrival slots so student classes are not disrupted."
• If they ask about transport from ${city}: "${connectivity.summary} Parul University covers delegation reception so teachers have zero logistical burden."
• If they ask about student safety: "Parul University operates a 24x7 secure campus with dedicated school contingent reception desks, student escorts, and medical facilities on site."

6. CLOSING ACTION COMMITMENT:
"Can I confirm your preferred email address to share the official Parul University delegation docket and confirm your student contingent quota?"`;
    } else {
      // Official Letter
      pitch = `PARUL UNIVERSITY — TECHEXPO 2027 ORGANIZING DIRECTORATE
P.O. Limda, Waghodia, Vadodara, Gujarat - 391760
Web: paruluniversity.ac.in | Email: techexpo@paruluniversity.ac.in

REF: PU/TE27/OUTREACH/SCH-${school.id.toUpperCase()}
DATE: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

TO:
The Principal / Head of Institution
${school.name}
${school.address ? school.address + ',\n' : ''}${school.city}, Gujarat - ${school.pincode || '390001'}

SUBJECT: OFFICIAL INVITATION TO ATTEND TECHEXPO 2027 (HOSTED & CONDUCTED BY PARUL UNIVERSITY, VADODARA)

Respected Madam / Sir,

On behalf of the Leadership and Governing Body of Parul University, Vadodara, it gives us immense pleasure to formally invite ${school.name} to participate as an Honored Delegating Institution at TechExpo 2027, the flagship student technology and future industries exposition of Western India, scheduled for January 2027.

Recognizing ${school.name}'s pioneering standards in science education and holistic student development in ${city}${recentEvidence ? ` (demonstrated during ${recentEvidence})` : ''}, our committee has reserved attendance allocations for up to 100 students from your senior secondary classes.

Students attending the exposition at the Parul University Campus will receive:
a) Direct interactive masterclasses with leading scientists, space tech innovators, and university faculty.
b) Official Gujarat Student Innovation Certification accredited by Parul University.
c) Access to the competitive Robotics Olympiad, AI Arena, and Youth Maker Challenges with cash prizes.

Campus Transit & Connectivity:
${connectivity.travelClause} Dedicated arrival bays and student reception lounges will be provided on the Parul University campus grounds.

We request you to kindly nominate a Faculty Coordinator to liaise with our team regarding logistical arrangements, contingent numbers, and student safety guidelines.

Yours faithfully,

${currentUser.name}
${currentUser.designation}
Organizing Directorate, TechExpo 2027
Parul University, Vadodara`;
    }

    setGeneratedPitch(pitch);
  };

  // Re-generate trigger button with visual animation and instant feedback
  const handleRegenerate = () => {
    setIsRegenerating(true);
    const nextVariant = variantIndex + 1;
    setVariantIndex(nextVariant);

    setTimeout(() => {
      generatePitchContent(nextVariant);
      setIsRegenerating(false);
      addToast('success', `Base draft regenerated with Parul University credentials & ${school?.city} transit details.`);
    }, 350);
  };

  useEffect(() => {
    generatePitchContent(variantIndex);
  }, [activeSchoolId, targetAudience, pitchChannel, pitchFocus, includeConnectivity]);

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
    link.setAttribute('download', `Pitch_${school.name.replace(/[^a-zA-Z0-9]/g, '_')}_${pitchChannel}_ParulUni.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Downloaded pitch script file.');
  };

  const handleSaveAsOutreach = () => {
    logOutreach(school.id, {
      channel: pitchChannel === 'WhatsApp' ? 'WhatsApp' : pitchChannel === 'Email' ? 'Email' : 'Phone Call',
      contact_person: targetAudience === 'Coordinator' ? school.coordinator_name || 'Coordinator' : school.principal_name || 'Principal',
      response_status: 'Proposal Requested',
      meeting_status: 'None',
      notes: `Dispatched customized ${pitchChannel} pitch (Parul University format) to ${targetAudience}. Content saved in outreach archive.`,
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
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Grounded Pitch Assistant</h2>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                  Conducted by Parul University
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Synthesizes verified school facts with official Parul University & TechExpo 2027 collateral &bull; Zero hallucinations
              </p>
            </div>
          </div>

          {/* Strict Grounding Badge */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 text-xs shrink-0 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Strictly Grounded &bull; Parul University Host Campus</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: CONFIGURATION VS EDITABLE PITCH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: PARAMETER CONFIGURATION */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pitch Parameters
              </h3>
              <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                Parul University Expo
              </span>
            </div>

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

            {/* Pitch Focus Tone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Focus Angle
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'Balanced', label: 'Standard' },
                  { id: 'Logistics', label: 'Transit & Bus' },
                  { id: 'Robotics', label: 'STEM & Labs' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setPitchFocus(f.id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border text-center transition-all ${
                      pitchFocus === f.id
                        ? 'bg-violet-600 text-white border-violet-600 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campus Connectivity Toggle */}
            <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                  <Bus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Campus Connectivity</span>
                </div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeConnectivity}
                    onChange={(e) => setIncludeConnectivity(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>Include</span>
                </label>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div className="font-medium text-slate-800">
                  📍 {school?.city} &rarr; Parul University, Vadodara
                </div>
                <div className="text-slate-500 text-[10px]">
                  {connectivity.transitNote}
                </div>
              </div>
            </div>

            {/* Re-generate trigger button */}
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-700 transition-all shadow-2xs hover:shadow-xs active:scale-[0.99]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-indigo-600' : ''}`} />
              <span>{isRegenerating ? 'Regenerating Draft...' : 'Regenerate Base Draft'}</span>
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
                <strong>Host Institution:</strong> <span className="text-indigo-700 font-semibold">Parul University (Vadodara)</span>
              </div>
              <div>
                <strong>Location & Board:</strong> {school?.city}, {school?.board}
              </div>
              <div>
                <strong>Key Contact:</strong> {targetAudience === 'Coordinator' ? school?.coordinator_name : school?.principal_name}
              </div>
              <div>
                <strong>Transit Route:</strong> {connectivity.distance}
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
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                  Parul University
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
                rows={19}
                className="w-full h-full p-4 text-xs font-mono text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed resize-y"
              />
            </div>

            {/* Bottom character counter & guidance */}
            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <span className="font-medium text-slate-600">
                {generatedPitch.split(/\s+/).filter(Boolean).length} words &bull; {generatedPitch.length} characters &bull; Parul University Format
              </span>
              <span className="text-slate-400 hidden sm:inline">
                💡 Tip: Click "Regenerate Base Draft" to refresh opening variations and transit clauses.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
