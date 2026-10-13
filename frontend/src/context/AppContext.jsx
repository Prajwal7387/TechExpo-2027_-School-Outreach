import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DEFAULT_CRITERIA_WEIGHTS, calculatePriorityScore } from '../data/criteriaConfig';
import { INITIAL_SCHOOLS, getInitialSchoolsWithScores } from '../data/sampleSchools';
import { TEAM_MEMBERS } from '../data/teamMembers';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  SCHOOLS: 'techexpo_schools_v4',
  WEIGHTS: 'techexpo_criteria_weights_v1',
  USER: 'techexpo_active_user_v1',
};

export const AppProvider = ({ children }) => {
  // 1. Criteria Weights State
  const [criteriaWeights, setCriteriaWeights] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      return saved ? JSON.parse(saved) : DEFAULT_CRITERIA_WEIGHTS;
    } catch {
      return DEFAULT_CRITERIA_WEIGHTS;
    }
  });

  // 3. Schools State with Automatic Verified Data Reconciliation & Clean Outreach
  const [schools, setSchools] = useState(() => {
    try {
      // Clear out obsolete storage versions
      localStorage.removeItem('techexpo_schools_v1');
      localStorage.removeItem('techexpo_schools_v2');
      localStorage.removeItem('techexpo_schools_v3');

      const saved = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const verifiedMap = new Map(INITIAL_SCHOOLS.map((item) => [item.id, item]));

        return parsed.map((s) => {
          const verified = verifiedMap.get(s.id);
          const cleanHistory = (s.outreach_history || []).filter((log) => !log.id.startsWith('log-0'));
          const merged = verified
            ? {
                ...s,
                name: verified.name,
                website: verified.website,
                principal_name: verified.principal_name,
                principal_phone: verified.principal_phone,
                principal_email: verified.principal_email,
                coordinator_name: verified.coordinator_name || s.coordinator_name,
                coordinator_phone: verified.coordinator_phone || s.coordinator_phone,
                coordinator_email: verified.coordinator_email || s.coordinator_email,
                address: verified.address,
                pincode: verified.pincode,
                evidence_links: verified.evidence_links,
                outreach_history: cleanHistory,
                outreach_status: cleanHistory.length === 0 ? 'Not Contacted' : s.outreach_status,
              }
            : {
                ...s,
                outreach_history: cleanHistory,
                outreach_status: cleanHistory.length === 0 ? 'Not Contacted' : s.outreach_status,
              };

          const { totalScore, level, breakdown } = calculatePriorityScore(merged.scoring_data, criteriaWeights);
          return {
            ...merged,
            priority_score: totalScore,
            priority_level: level,
            scoring_breakdown: breakdown,
          };
        });
      }
    } catch (e) {
      console.error('Failed to load schools from storage', e);
    }
    return getInitialSchoolsWithScores(criteriaWeights);
  });

  // 4. Team Members
  const [teamMembers, setTeamMembers] = useState(TEAM_MEMBERS);

  // 5. Active User & Role
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return TEAM_MEMBERS[0]; // Default: Prajwal Sharma (Admin)
  });

  // 6. Navigation View & Selection
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'directory', 'profile', 'outreach', 'pitch', 'weights', 'team'
  const [selectedSchoolId, setSelectedSchoolId] = useState('sch-001');

  // 7. Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 8. Persist Schools to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(schools));
    } catch (e) {
      console.error('Error saving schools to localStorage', e);
    }
  }, [schools]);

  // 9. Persist Weights to LocalStorage and Recalculate Schools
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(criteriaWeights));
    } catch (e) {
      console.error('Error saving weights to localStorage', e);
    }
  }, [criteriaWeights]);

  // 10. Persist Active User
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch (e) {}
  }, [currentUser]);

  // Recalculate all school scores when weights change
  const updateCriteriaWeights = (newWeights) => {
    setCriteriaWeights(newWeights);
    setSchools((prev) =>
      prev.map((school) => {
        const { totalScore, level, breakdown } = calculatePriorityScore(school.scoring_data, newWeights);
        return {
          ...school,
          priority_score: totalScore,
          priority_level: level,
          scoring_breakdown: breakdown,
        };
      })
    );
    addToast('success', 'Scoring criteria weights updated and all school priority scores recalculated.');
  };

  const resetCriteriaWeights = () => {
    updateCriteriaWeights(DEFAULT_CRITERIA_WEIGHTS);
    addToast('info', 'Criteria weights reset to default TechExpo values.');
  };

  // Add School
  const addSchool = (schoolData) => {
    const id = 'sch-' + Date.now();
    const { totalScore, level, breakdown } = calculatePriorityScore(schoolData.scoring_data, criteriaWeights);
    const newSchool = {
      ...schoolData,
      id,
      priority_score: totalScore,
      priority_level: level,
      scoring_breakdown: breakdown,
      is_archived: false,
      outreach_history: schoolData.outreach_history || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSchools((prev) => [newSchool, ...prev]);
    addToast('success', `Added "${newSchool.name}" to the School Intelligence directory.`);
    return newSchool;
  };

  // Update School
  const updateSchool = (id, updatedFields) => {
    setSchools((prev) =>
      prev.map((school) => {
        if (school.id !== id) return school;
        const mergedScoring = updatedFields.scoring_data || school.scoring_data;
        const { totalScore, level, breakdown } = calculatePriorityScore(mergedScoring, criteriaWeights);
        return {
          ...school,
          ...updatedFields,
          priority_score: totalScore,
          priority_level: level,
          scoring_breakdown: breakdown,
          updated_at: new Date().toISOString(),
        };
      })
    );
    addToast('success', 'School details updated successfully.');
  };

  // Archive & Unarchive School
  const archiveSchool = (id) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_archived: true, updated_at: new Date().toISOString() } : s))
    );
    addToast('info', 'School record archived.');
  };

  const unarchiveSchool = (id) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_archived: false, updated_at: new Date().toISOString() } : s))
    );
    addToast('success', 'School record restored to active directory.');
  };

  // Delete School (Admin only)
  const deleteSchool = (id) => {
    if (currentUser.role !== 'admin') {
      addToast('error', 'Only administrators have permission to permanently delete school records.');
      return false;
    }
    setSchools((prev) => prev.filter((s) => s.id !== id));
    addToast('warning', 'School permanently removed from directory.');
    return true;
  };

  // Log Outreach Activity
  const logOutreach = (schoolId, logData) => {
    const logId = 'log-' + Date.now();
    const newLog = {
      id: logId,
      date: logData.date || new Date().toISOString(),
      channel: logData.channel,
      contact_person: logData.contact_person,
      response_status: logData.response_status,
      meeting_status: logData.meeting_status || 'None',
      notes: logData.notes,
      pitch_used: logData.pitch_used || null,
      next_follow_up: logData.next_follow_up || null,
      is_completed: false,
      logged_by_name: currentUser.name,
    };

    setSchools((prev) =>
      prev.map((school) => {
        if (school.id !== schoolId) return school;
        
        // Map log response status to school outreach status
        let newStatus = school.outreach_status;
        if (logData.response_status === 'Confirmed Delegation') newStatus = 'Confirmed';
        else if (logData.response_status === 'Positive Interest') newStatus = 'Interested';
        else if (logData.response_status === 'Call Scheduled') newStatus = 'Call Scheduled';
        else if (logData.response_status === 'Meeting Scheduled') newStatus = 'Meeting Scheduled';
        else if (logData.response_status === 'Proposal Requested') newStatus = 'Proposal Sent';
        else if (logData.response_status === 'Declined') newStatus = 'Not Interested';
        else if (school.outreach_status === 'Not Contacted') newStatus = 'Contacted';

        return {
          ...school,
          outreach_status: newStatus,
          outreach_history: [newLog, ...(school.outreach_history || [])],
          updated_at: new Date().toISOString(),
        };
      })
    );

    addToast('success', `Outreach logged for ${newLog.contact_person} via ${newLog.channel}.`);
    return newLog;
  };

  // Mark Outreach Follow-up Completed
  const completeFollowUp = (schoolId, logId) => {
    setSchools((prev) =>
      prev.map((school) => {
        if (school.id !== schoolId) return school;
        const updatedHistory = (school.outreach_history || []).map((log) => {
          if (log.id === logId) return { ...log, is_completed: true };
          return log;
        });
        return {
          ...school,
          outreach_history: updatedHistory,
        };
      })
    );
    addToast('success', 'Follow-up marked as completed.');
  };

  // Import CSV Schools
  const importSchoolsFromCsv = (importedList) => {
    const formatted = importedList.map((item, idx) => {
      const scoring = item.scoring_data || {
        recent_events: { rating: 0.5, isUnknown: false, evidence: 'Imported via CSV record' },
        reputation: { rating: 0.7, isUnknown: false, evidence: 'Imported via CSV record' },
        existing_connections: { rating: 0.5, isUnknown: true, evidence: 'Pending verification' },
        technology_interest: { rating: 0.6, isUnknown: false, evidence: 'Imported via CSV record' },
        ease_of_coordination: { rating: 0.7, isUnknown: false, evidence: 'Imported via CSV record' },
      };
      const { totalScore, level, breakdown } = calculatePriorityScore(scoring, criteriaWeights);

      return {
        id: 'csv-' + Date.now() + '-' + idx,
        name: item.name,
        city: item.city || 'Ahmedabad',
        district: item.district || item.city || 'Ahmedabad',
        state: 'Gujarat',
        board: item.board || 'CBSE',
        student_strength: Number(item.student_strength) || 1000,
        address: item.address || '',
        pincode: item.pincode || '',
        website: item.website || '',
        principal_name: item.principal_name || 'School Principal',
        principal_phone: item.principal_phone || '',
        principal_email: item.principal_email || '',
        coordinator_name: item.coordinator_name || 'Science In-charge',
        coordinator_phone: item.coordinator_phone || '',
        coordinator_email: item.coordinator_email || '',
        categories: Array.isArray(item.categories) && item.categories.length > 0 ? item.categories : ['Good to Connect With'],
        scoring_data: scoring,
        priority_score: totalScore,
        priority_level: level,
        scoring_breakdown: breakdown,
        outreach_status: item.outreach_status || 'Not Contacted',
        assigned_to: currentUser.id,
        assigned_member_name: currentUser.name,
        research_notes: item.research_notes || 'Imported batch data',
        evidence_links: [],
        is_archived: false,
        outreach_history: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    setSchools((prev) => [...formatted, ...prev]);
    addToast('success', `Successfully imported ${formatted.length} schools into directory.`);
    return formatted.length;
  };

  // Reset to Sample Data
  const resetToSampleData = () => {
    const fresh = getInitialSchoolsWithScores(criteriaWeights);
    setSchools(fresh);
    localStorage.removeItem(STORAGE_KEYS.SCHOOLS);
    addToast('info', 'Reset directory to default Gujarat sample schools dataset.');
  };

  // Synchronize and update all schools with verified contact intelligence and official websites
  const syncVerifiedIntelligence = () => {
    localStorage.removeItem('techexpo_schools_v1');
    localStorage.removeItem('techexpo_schools_v2');
    localStorage.removeItem('techexpo_schools_v3');
    localStorage.removeItem(STORAGE_KEYS.SCHOOLS);
    const fresh = getInitialSchoolsWithScores(criteriaWeights);
    setSchools(fresh);
    addToast('success', 'Reset demo outreach logs while keeping all 20 verified school records and contacts.');
  };

  // Calculate Overdue Follow-ups
  const now = new Date();
  const overdueFollowUps = useMemo(() => {
    const list = [];
    schools.forEach((school) => {
      if (school.is_archived) return;
      (school.outreach_history || []).forEach((log) => {
        if (!log.is_completed && log.next_follow_up) {
          const followUpDate = new Date(log.next_follow_up);
          if (followUpDate < now) {
            list.push({
              schoolId: school.id,
              schoolName: school.name,
              city: school.city,
              assignedMember: school.assigned_member_name,
              logId: log.id,
              contactPerson: log.contact_person,
              channel: log.channel,
              nextFollowUp: log.next_follow_up,
              notes: log.notes,
            });
          }
        }
      });
    });
    return list;
  }, [schools, now]);

  // Selected School Object
  const selectedSchool = useMemo(() => {
    return schools.find((s) => s.id === selectedSchoolId) || schools[0];
  }, [schools, selectedSchoolId]);

  return (
    <AppContext.Provider
      value={{
        // State
        schools,
        criteriaWeights,
        teamMembers,
        currentUser,
        currentView,
        selectedSchoolId,
        selectedSchool,
        toasts,
        overdueFollowUps,

        // Actions
        setCurrentView,
        setSelectedSchoolId,
        setCurrentUser,
        updateCriteriaWeights,
        resetCriteriaWeights,
        addSchool,
        updateSchool,
        archiveSchool,
        unarchiveSchool,
        deleteSchool,
        logOutreach,
        completeFollowUp,
        importSchoolsFromCsv,
        resetToSampleData,
        syncVerifiedIntelligence,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
