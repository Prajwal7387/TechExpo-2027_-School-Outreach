import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, StatusBadge, CategoryTag } from '../common/Badge';
import { ConfirmModal } from '../common/ConfirmModal';
import { ALL_CATEGORIES, GUJARAT_CITIES, OUTREACH_STATUSES } from '../../data/criteriaConfig';
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Eye,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  Sparkles,
  PhoneCall,
  LayoutGrid,
  List,
  MapPin,
  User,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  FileSpreadsheet
} from 'lucide-react';

export const SchoolDirectoryView = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenImportModal,
  onOpenOutreachModal,
}) => {
  const {
    schools,
    setCurrentView,
    setSelectedSchoolId,
    archiveSchool,
    unarchiveSchool,
    deleteSchool,
    teamMembers,
    currentUser,
    addToast,
    syncVerifiedIntelligence,
  } = useApp();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Confirm Modal state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
    confirmText: '',
    confirmButtonClass: '',
  });

  // Filtered schools
  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      // Archive toggle
      if (Boolean(school.is_archived) !== showArchived) return false;

      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = school.name.toLowerCase().includes(query);
        const matchesCity = school.city.toLowerCase().includes(query);
        const matchesPrincipal = (school.principal_name || '').toLowerCase().includes(query);
        const matchesCoordinator = (school.coordinator_name || '').toLowerCase().includes(query);
        if (!matchesName && !matchesCity && !matchesPrincipal && !matchesCoordinator) {
          return false;
        }
      }

      // City filter
      if (selectedCity && school.city !== selectedCity) return false;

      // Category filter
      if (selectedCategory && !(school.categories || []).includes(selectedCategory)) {
        return false;
      }

      // Priority filter
      if (selectedPriority && school.priority_level !== selectedPriority) return false;

      // Status filter
      if (selectedStatus && school.outreach_status !== selectedStatus) return false;

      // Member filter
      if (selectedMember && school.assigned_to !== selectedMember) return false;

      return true;
    });
  }, [
    schools,
    showArchived,
    searchQuery,
    selectedCity,
    selectedCategory,
    selectedPriority,
    selectedStatus,
    selectedMember,
  ]);

  // Sort by priority score descending by default
  const sortedSchools = useMemo(() => {
    return [...filteredSchools].sort((a, b) => b.priority_score - a.priority_score);
  }, [filteredSchools]);

  // Pagination
  const totalPages = Math.ceil(sortedSchools.length / pageSize) || 1;
  const paginatedSchools = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedSchools.slice(start, start + pageSize);
  }, [sortedSchools, currentPage, pageSize]);

  // Export to CSV
  const handleExportCsv = () => {
    if (sortedSchools.length === 0) {
      addToast('warning', 'No schools to export matching active filters.');
      return;
    }

    const headers = [
      'Name',
      'City',
      'Board',
      'Student Strength',
      'Priority Score',
      'Priority Level',
      'Outreach Status',
      'Assigned Member',
      'Principal Name',
      'Principal Phone',
      'Principal Email',
      'Coordinator Name',
      'Coordinator Phone',
      'Coordinator Email',
      'Categories',
      'Research Notes',
    ];

    const rows = sortedSchools.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.city}"`,
      `"${s.board}"`,
      s.student_strength || 0,
      s.priority_score,
      `"${s.priority_level}"`,
      `"${s.outreach_status}"`,
      `"${s.assigned_member_name || ''}"`,
      `"${(s.principal_name || '').replace(/"/g, '""')}"`,
      `"${s.principal_phone || ''}"`,
      `"${s.principal_email || ''}"`,
      `"${(s.coordinator_name || '').replace(/"/g, '""')}"`,
      `"${s.coordinator_phone || ''}"`,
      `"${s.coordinator_email || ''}"`,
      `"${(s.categories || []).join('; ')}"`,
      `"${(s.research_notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `techexpo_schools_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', `Exported ${sortedSchools.length} school records to CSV.`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedCategory('');
    setSelectedPriority('');
    setSelectedStatus('');
    setSelectedMember('');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedCity || selectedCategory || selectedPriority || selectedStatus || selectedMember
  );

  return (
    <div className="space-y-4">
      {/* ACTION BAR: SEARCH, EXPORT/IMPORT, ADD */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by school name, city, principal, coordinator..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'table' ? 'bg-white shadow-2xs text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'cards' ? 'bg-white shadow-2xs text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Archive Toggle */}
            <button
              onClick={() => {
                setShowArchived(!showArchived);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                showArchived
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {showArchived ? 'Viewing Archived' : 'Active Directory'}
            </button>

            {/* CSV Import */}
            <button
              onClick={onOpenImportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import CSV</span>
            </button>

            {/* CSV Export */}
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            {/* Sync Verified Data */}
            <button
              onClick={syncVerifiedIntelligence}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
              title="Synchronize and refresh verified contact details & live websites"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sync Verified Data</span>
            </button>

            {/* Add School */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add School</span>
            </button>
          </div>
        </div>

        {/* FILTER CONTROLS BAR */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-semibold pr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* City */}
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Cities ({GUJARAT_CITIES.length})</option>
            {GUJARAT_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Categories ({ALL_CATEGORIES.length})</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => {
              setSelectedPriority(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Priorities</option>
            <option value="High">High Priority (&ge;75)</option>
            <option value="Medium">Medium Priority (50-74)</option>
            <option value="Low">Low Priority (&lt;50)</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Outreach Statuses</option>
            {OUTREACH_STATUSES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Member */}
          <select
            value={selectedMember}
            onChange={(e) => {
              setSelectedMember(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-700 py-1 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Assigned Owners</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline ml-auto"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* RESULTS COUNT BANNER */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{paginatedSchools.length}</strong> of{' '}
          <strong className="text-slate-800">{sortedSchools.length}</strong> institutions
          {showArchived && ' (Archived)'}
        </span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* EMPTY STATE */}
      {paginatedSchools.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No schools found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'No schools matched your search criteria. Try clearing some filters or searching with a different term.'
              : 'There are currently no schools in this list.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">School & Location</th>
                  <th className="py-3 px-4">Priority Score</th>
                  <th className="py-3 px-4">Categories</th>
                  <th className="py-3 px-4">Outreach Status</th>
                  <th className="py-3 px-4">Key Contact</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedSchools.map((school) => (
                  <tr
                    key={school.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedSchoolId(school.id);
                      setCurrentView('profile');
                    }}
                  >
                    {/* School & Location */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {school.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {school.city}
                        </span>
                        <span>&bull;</span>
                        <span className="font-medium bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                          {school.board}
                        </span>
                        <span>&bull;</span>
                        <span>{school.student_strength} students</span>
                      </div>
                    </td>

                    {/* Priority Score */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {school.priority_score}
                        </span>
                        <PriorityBadge level={school.priority_level} />
                      </div>
                      {/* Mini breakdown preview */}
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Events: {school.scoring_breakdown?.recent_events?.earned || 0} &bull; Tech: {school.scoring_breakdown?.technology_interest?.earned || 0}
                      </div>
                    </td>

                    {/* Categories */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(school.categories || []).map((cat) => (
                          <CategoryTag key={cat} category={cat} />
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={school.outreach_status} />
                    </td>

                    {/* Key Contact */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium text-slate-800">
                        {school.coordinator_name || school.principal_name || 'Not Listed'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {school.coordinator_phone || school.principal_phone || school.principal_email || '-'}
                      </div>
                    </td>

                    {/* Assigned Owner */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                          {(school.assigned_member_name || 'U')[0]}
                        </div>
                        <span className="truncate">{school.assigned_member_name || 'Unassigned'}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedSchoolId(school.id);
                            setCurrentView('profile');
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100"
                          title="View Intelligence Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenOutreachModal(school.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100"
                          title="Log Outreach"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenEditModal(school)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {showArchived ? (
                          <button
                            onClick={() => unarchiveSchool(school.id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100"
                            title="Restore from Archive"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: `Archive ${school.name}?`,
                                message: 'This school will be moved to the archive list and hidden from active outreach reports.',
                                confirmText: 'Archive School',
                                confirmButtonClass: 'bg-amber-600 hover:bg-amber-700 text-white',
                                action: () => archiveSchool(school.id),
                              });
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded hover:bg-slate-100"
                            title="Archive Record"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: `Permanently Delete ${school.name}?`,
                                message: 'This action cannot be undone. All research notes, scoring evidence, and outreach logs will be permanently deleted.',
                                confirmText: 'Delete Record',
                                confirmButtonClass: 'bg-rose-600 hover:bg-rose-700 text-white',
                                action: () => deleteSchool(school.id),
                              });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                            title="Delete Record (Admin)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedSchools.map((school) => (
            <div
              key={school.id}
              onClick={() => {
                setSelectedSchoolId(school.id);
                setCurrentView('profile');
              }}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-900 line-clamp-2">
                    {school.name}
                  </span>
                  <PriorityBadge level={school.priority_level} score={school.priority_score} />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {school.city}
                  </span>
                  <span>&bull;</span>
                  <span className="bg-slate-100 px-1.5 py-0.2 rounded font-medium">{school.board}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {school.categories.map((cat) => (
                    <CategoryTag key={cat} category={cat} />
                  ))}
                </div>

                <div className="text-[11px] text-slate-600 mb-3 p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="font-semibold text-slate-800 truncate">
                    {school.coordinator_name || school.principal_name}
                  </div>
                  <div className="text-slate-500 truncate">
                    {school.coordinator_phone || school.principal_phone || 'No phone'}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <StatusBadge status={school.outreach_status} />
                <span className="text-[11px] text-slate-500 truncate max-w-[100px]">
                  {school.assigned_member_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-2xs text-xs">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-semibold text-xs transition-colors ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CONFIRM ACTION MODAL */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        confirmButtonClass={confirmDialog.confirmButtonClass}
        onConfirm={confirmDialog.action}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
