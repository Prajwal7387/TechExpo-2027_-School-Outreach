import React from 'react';
import { Database, ShieldCheck, CheckCircle2, KeyRound, ExternalLink, X, Copy, Terminal } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SupabaseStatusModal = ({ isOpen, onClose }) => {
  const { isSupabaseLive, addToast } = useApp();

  if (!isOpen) return null;

  const copyEnvTemplate = () => {
    navigator.clipboard.writeText(`VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`);
    addToast('success', 'Environment template copied to clipboard.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isSupabaseLive ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Supabase PostgreSQL & Security Status</h3>
              <p className="text-xs text-slate-500">Database connection, authentication, and RLS policies</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status banner */}
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${isSupabaseLive ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
            {isSupabaseLive ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-sm font-semibold">
                {isSupabaseLive ? 'Connected to Live Supabase Backend' : 'Running in Interactive Local & Demo Mode'}
              </div>
              <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                {isSupabaseLive
                  ? 'Active session verified. Queries are routed through Supabase PostgREST with Row Level Security (RLS) enforcement.'
                  : 'All modules (directory, priority scoring, outreach history, pitch generation, CSV import/export, and configurable weights) are fully operational with local persistence. You can connect your live Supabase project anytime.'}
              </p>
            </div>
          </div>

          {/* Setup steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">How to connect your live Supabase Project</h4>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong>Execute Schema:</strong> Open Supabase SQL Editor and run the generated SQL script located at:
                  <code className="block mt-1 font-mono text-indigo-600 bg-white px-2 py-1 rounded border border-slate-200">
                    backend/supabase/schema.sql
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong>Configure Environment Variables:</strong> In <code className="font-mono bg-white px-1.5 py-0.5 rounded border">frontend/.env</code>, provide your credentials:
                  <div className="relative mt-1 bg-slate-900 text-slate-200 font-mono p-2.5 rounded text-[11px] overflow-x-auto">
                    VITE_SUPABASE_URL=https://your-id.supabase.co<br />
                    VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
                    <button
                      onClick={copyEnvTemplate}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white"
                      title="Copy template"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong>Security Best Practice:</strong> Only the public <span className="font-semibold text-slate-900">anon key</span> is used in the frontend. The <span className="text-rose-600 font-semibold">service-role key is never exposed</span>.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
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
