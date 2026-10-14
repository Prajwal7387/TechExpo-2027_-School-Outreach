import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { DataManagementModal } from './components/common/DataManagementModal';

// Modals
import { SchoolModal } from './components/modals/SchoolModal';
import { LogOutreachModal } from './components/modals/LogOutreachModal';
import { CsvImportModal } from './components/modals/CsvImportModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { SchoolDirectoryView } from './components/schools/SchoolDirectoryView';
import { SchoolProfileView } from './components/schools/SchoolProfileView';
import { OutreachManagementView } from './components/outreach/OutreachManagementView';
import { PitchAssistantView } from './components/pitch/PitchAssistantView';
import { WeightsView } from './components/admin/WeightsView';
import { TeamManagementView } from './components/admin/TeamManagementView';

const MainAppContent = () => {
  const { currentView } = useApp();

  // Modal States
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [isOutreachModalOpen, setIsOutreachModalOpen] = useState(false);
  const [outreachTargetSchoolId, setOutreachTargetSchoolId] = useState('');
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);

  const handleOpenOutreach = (schoolId = '') => {
    setOutreachTargetSchoolId(schoolId);
    setIsOutreachModalOpen(true);
  };

  const handleOpenEdit = (school) => {
    setEditingSchool(school);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar onOpenDataManagementModal={() => setIsDataManagementOpen(true)} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Navigation */}
        <Header
          onOpenAddModal={() => setIsAddSchoolOpen(true)}
          onOpenOutreachModal={() => handleOpenOutreach()}
          onOpenDataManagementModal={() => setIsDataManagementOpen(true)}
        />

        {/* View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
              <DashboardView onOpenOutreachModal={handleOpenOutreach} />
            )}

            {currentView === 'directory' && (
              <SchoolDirectoryView
                onOpenAddModal={() => setIsAddSchoolOpen(true)}
                onOpenEditModal={handleOpenEdit}
                onOpenImportModal={() => setIsCsvImportOpen(true)}
                onOpenOutreachModal={handleOpenOutreach}
              />
            )}

            {currentView === 'profile' && (
              <SchoolProfileView
                onOpenEditModal={handleOpenEdit}
                onOpenOutreachModal={handleOpenOutreach}
              />
            )}

            {currentView === 'outreach' && (
              <OutreachManagementView onOpenOutreachModal={handleOpenOutreach} />
            )}

            {currentView === 'pitch' && (
              <PitchAssistantView onOpenOutreachModal={handleOpenOutreach} />
            )}

            {currentView === 'weights' && <WeightsView />}

            {currentView === 'team' && <TeamManagementView />}
          </div>
        </main>
      </div>

      {/* Modals */}
      <SchoolModal
        isOpen={isAddSchoolOpen}
        onClose={() => setIsAddSchoolOpen(false)}
        initialSchool={null}
      />

      <SchoolModal
        isOpen={Boolean(editingSchool)}
        onClose={() => setEditingSchool(null)}
        initialSchool={editingSchool}
      />

      <LogOutreachModal
        isOpen={isOutreachModalOpen}
        onClose={() => setIsOutreachModalOpen(false)}
        initialSchoolId={outreachTargetSchoolId}
      />

      <CsvImportModal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
      />

      <DataManagementModal
        isOpen={isDataManagementOpen}
        onClose={() => setIsDataManagementOpen(false)}
      />

      {/* Toast Feedback Alerts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
