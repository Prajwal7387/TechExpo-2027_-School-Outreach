import React, { useRef, useState } from 'react';
import {
  HardDrive,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  X,
  Database,
  FolderSync,
  Cloud,
  CloudCheck,
  RefreshCw,
  Zap,
  Info,
  Server
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DataManagementModal = ({ isOpen, onClose }) => {
  const {
    schools,
    addToast,
    resetToSampleData,
    syncVerifiedIntelligence,
    criteriaWeights,
    isKVConnected,
    kvLatency,
    isCloudSyncing,
    lastCloudSyncTime,
    syncToCloudNow,
    pullFromCloudNow,
    checkKVHealth,
  } = useApp();

  const fileInputRef = useRef(null);
  const [isTestingKV, setIsTestingKV] = useState(false);
  const [showVercelGuide, setShowVercelGuide] = useState(false);

  if (!isOpen) return null;

  const activeSchools = schools.filter((s) => !s.is_archived).length;
  const archivedSchools = schools.filter((s) => s.is_archived).length;
  const totalLogs = schools.reduce((acc, s) => acc + (s.outreach_history || []).length, 0);

  // Calculate storage usage
  let storageBytes = 0;
  try {
    for (let key in localStorage) {
      if (key.startsWith('techexpo_')) {
        storageBytes += (localStorage.getItem(key) || '').length * 2; // UTF-16
      }
    }
  } catch {}
  const storageKB = (storageBytes / 1024).toFixed(1);

  const handleTestKV = async () => {
    setIsTestingKV(true);
    const res = await checkKVHealth();
    setIsTestingKV(false);
    if (res.ok) {
      addToast('success', `Vercel KV Connected! Latency: ${res.latency}ms`);
    } else {
      addToast('error', `Vercel KV Connection failed: ${res.error}`);
    }
  };

  const handleExportJSON = () => {
    const backup = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      app: 'TechExpo 2027 School Intelligence & Outreach System',
      data: {
        schools,
        criteriaWeights,
      },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techexpo-2027-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('success', `Exported ${schools.length} schools and all settings to JSON backup file.`);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported?.data?.schools && Array.isArray(imported.data.schools)) {
          localStorage.setItem('techexpo_schools_v4', JSON.stringify(imported.data.schools));
          if (imported.data.criteriaWeights) {
            localStorage.setItem('techexpo_criteria_weights_v1', JSON.stringify(imported.data.criteriaWeights));
          }
          addToast('success', `Imported ${imported.data.schools.length} schools from backup. Refreshing...`);
          setTimeout(() => window.location.reload(), 1200);
        } else {
          addToast('error', 'Invalid backup file. Expected { data: { schools: [...] } } format.');
        }
      } catch (err) {
        addToast('error', `Failed to parse backup file: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (window.confirm('⚠️ This will permanently delete ALL your school data, outreach logs, and settings. This action cannot be undone.\n\nAre you sure?')) {
      localStorage.removeItem('techexpo_schools_v4');
      localStorage.removeItem('techexpo_criteria_weights_v1');
      localStorage.removeItem('techexpo_active_user_v1');
      addToast('warning', 'All local data cleared. Reloading with fresh sample data...');
      setTimeout(() => window.location.reload(), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Database & Storage Management</h3>
              <p className="text-xs text-slate-500">Vercel KV Cloud Database & Local Storage</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Cloud Database (Vercel KV / Upstash Redis) Status */}
          <div className={`p-4 rounded-xl border transition-all ${
            isKVConnected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isKVConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">
                      {isKVConnected ? 'Vercel KV / Upstash Redis Active' : 'Vercel KV / Upstash Cloud Database'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isKVConnected
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-indigo-200 text-indigo-800'
                    }`}>
                      {isKVConnected ? 'ONLINE' : 'FREE TIER READY'}
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                    {isKVConnected
                      ? `Connected over REST API with ${kvLatency ? `${kvLatency}ms latency` : 'active link'}. ${lastCloudSyncTime ? `Last synced at ${lastCloudSyncTime}.` : 'Ready to sync.'}`
                      : 'Accepts 100% free Vercel KV / Upstash Redis (10,000 requests/day, no credit card required). Operates seamlessly on local storage and auto-syncs when configured.'}
                  </p>
                </div>
              </div>

              {isKVConnected ? (
                <button
                  onClick={handleTestKV}
                  disabled={isTestingKV}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingKV ? 'animate-spin' : ''}`} />
                  <span>{isTestingKV ? 'Pinging...' : 'Ping KV'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowVercelGuide(!showVercelGuide)}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{showVercelGuide ? 'Hide Guide' : 'Connect KV'}</span>
                </button>
              )}
            </div>

            {/* Vercel KV Cloud Actions (when connected) */}
            {isKVConnected && (
              <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center gap-2">
                <button
                  onClick={syncToCloudNow}
                  disabled={isCloudSyncing}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Upload className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-bounce' : ''}`} />
                  <span>{isCloudSyncing ? 'Syncing...' : 'Push to Vercel KV'}</span>
                </button>
                <button
                  onClick={pullFromCloudNow}
                  disabled={isCloudSyncing}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pull from Vercel KV</span>
                </button>
              </div>
            )}

            {/* Quick Vercel Setup Guide dropdown */}
            {showVercelGuide && !isKVConnected && (
              <div className="mt-3 pt-3 border-t border-indigo-200 text-xs text-slate-700 space-y-2 bg-white/70 p-3 rounded-lg">
                <div className="font-semibold text-indigo-900">How to attach free Vercel KV:</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>In your Vercel Dashboard, navigate to the <b>Storage</b> tab.</li>
                  <li>Click <b>Create Database</b> &rarr; Select <b>KV (Upstash Redis)</b> &rarr; Choose Free Tier.</li>
                  <li>In Project Settings &rarr; Environment Variables, copy the REST URL and Token as:
                    <div className="mt-1 font-mono text-[11px] bg-slate-800 text-emerald-300 p-2 rounded">
                      VITE_KV_REST_API_URL=https://...upstash.io<br />
                      VITE_KV_REST_API_TOKEN=AX...
                    </div>
                  </li>
                  <li>Redeploy on Vercel — data will instantly synchronize to the cloud across all devices!</li>
                </ol>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Active Schools', value: activeSchools, color: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
              { label: 'Archived', value: archivedSchools, color: 'text-slate-600 bg-slate-50 border-slate-200' },
              { label: 'Outreach Logs', value: totalLogs, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
              { label: 'Storage Used', value: `${storageKB} KB`, color: 'text-amber-700 bg-amber-50 border-amber-100' },
            ].map((stat) => (
              <div key={stat.label} className={`p-3 rounded-lg border text-center ${stat.color}`}>
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-[10px] font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Data Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Local Backup & Restore</h4>

            <div className="grid grid-cols-2 gap-3">
              {/* Export JSON */}
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">Export Backup</div>
                  <div className="text-[11px] text-slate-500">Download all data as JSON file</div>
                </div>
              </button>

              {/* Import JSON */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">Import Backup</div>
                  <div className="text-[11px] text-slate-500">Restore data from JSON file</div>
                </div>
              </button>

              {/* Reset to Sample */}
              <button
                onClick={() => {
                  syncVerifiedIntelligence();
                  onClose();
                }}
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-200 transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-200 transition-colors">
                  <FolderSync className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">Reset to Defaults</div>
                  <div className="text-[11px] text-slate-500">Restore original 17 verified schools</div>
                </div>
              </button>

              {/* Clear All */}
              <button
                onClick={handleClearAll}
                className="flex items-center gap-3 p-4 rounded-lg border border-rose-100 bg-white hover:bg-rose-50 hover:border-rose-200 transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-rose-100 text-rose-600 group-hover:bg-rose-200 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">Clear All Data</div>
                  <div className="text-[11px] text-rose-500">Permanently delete everything</div>
                </div>
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">💡 Free Vercel KV provides cloud sync with 0 maintenance</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
