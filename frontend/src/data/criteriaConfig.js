// Default Configurable Priority Scoring Criteria & Weights
export const DEFAULT_CRITERIA_WEIGHTS = {
  recent_events: {
    id: 'recent_events',
    name: 'Recent Events',
    weight: 25,
    description: 'Participation in or hosting of recent science fairs, hackathons, or robotics exhibitions',
  },
  reputation: {
    id: 'reputation',
    name: 'Reputation',
    weight: 20,
    description: 'Academic prominence, historical board results, and community standing across Gujarat',
  },
  existing_connections: {
    id: 'existing_connections',
    name: 'Existing Connections',
    weight: 20,
    description: 'Alumni networks, prior TechExpo participation, advisory board linkages, or faculty ties',
  },
  technology_interest: {
    id: 'technology_interest',
    name: 'Technology Interest',
    weight: 20,
    description: 'Active Atal Tinkering Lab (ATL), AI/robotics clubs, coding curriculum, or maker spaces',
  },
  ease_of_coordination: {
    id: 'ease_of_coordination',
    name: 'Ease of Coordination',
    weight: 15,
    description: 'Administrative responsiveness, logistical accessibility from venue, and swift approval processes',
  },
};

/**
 * Calculates priority score out of 100 based on scoring data and current criteria weights.
 * scoringData format:
 * {
 *   recent_events: { rating: 0.8, isUnknown: false, evidence: "..." },
 *   reputation: { rating: 1.0, isUnknown: false, evidence: "..." },
 *   ...
 * }
 * where rating is 0.0 to 1.0 (or raw scale 0 to 10 mapped).
 */
export function calculatePriorityScore(scoringData = {}, weights = DEFAULT_CRITERIA_WEIGHTS) {
  let totalScore = 0;
  const breakdown = {};

  Object.entries(weights).forEach(([key, criterion]) => {
    const criterionData = scoringData[key] || { rating: 0, isUnknown: true, evidence: 'No evidence provided yet.' };
    const maxPoints = Number(criterion.weight) || 0;
    
    // If unknown, default rating contribution is 0, but noted
    const ratingFraction = criterionData.isUnknown ? 0 : Math.min(Math.max(Number(criterionData.rating) || 0, 0), 1);
    const earnedPoints = Number((ratingFraction * maxPoints).toFixed(1));
    
    totalScore += earnedPoints;
    breakdown[key] = {
      name: criterion.name,
      earned: earnedPoints,
      max: maxPoints,
      percentage: Math.round(ratingFraction * 100),
      isUnknown: Boolean(criterionData.isUnknown),
      evidence: criterionData.evidence || (criterionData.isUnknown ? 'Pending research verification' : 'Verified by outreach team'),
    };
  });

  const finalScore = Number(totalScore.toFixed(1));
  let level = 'Low';
  if (finalScore >= 75) {
    level = 'High';
  } else if (finalScore >= 50) {
    level = 'Medium';
  }

  return {
    totalScore: finalScore,
    level,
    breakdown,
  };
}

export const ALL_CATEGORIES = [
  { id: 'Recent Events', label: 'Recent Events', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Locally Famous', label: 'Locally Famous', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Good to Connect With', label: 'Good to Connect With', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Technology-Ready', label: 'Technology-Ready', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'Untapped Opportunity', label: 'Untapped Opportunity', color: 'bg-amber-50 text-amber-700 border-amber-200' },
];

export const OUTREACH_STATUSES = [
  'Not Contacted',
  'Contacted',
  'Call Scheduled',
  'Meeting Scheduled',
  'Proposal Sent',
  'Interested',
  'Confirmed',
  'Not Interested',
];

export const CHANNELS = [
  'Phone Call',
  'Email',
  'In-Person Visit',
  'WhatsApp',
  'Official Letter',
  'LinkedIn',
];

export const GUJARAT_CITIES = [
  'Ahmedabad',
  'Gandhinagar',
  'Vadodara',
  'Surat',
  'Rajkot',
  'Bhavnagar',
  'Jamnagar',
  'Anand',
  'Bharuch',
  'Mehsana',
];
