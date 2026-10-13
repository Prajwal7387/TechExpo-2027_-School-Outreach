import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_CRITERIA_WEIGHTS, calculatePriorityScore } from '../../data/criteriaConfig';
import { SlidersHorizontal, ShieldAlert, Check, RotateCcw, Info, Sparkles, AlertCircle } from 'lucide-react';

export const WeightsView = () => {
  const {
    criteriaWeights,
    updateCriteriaWeights,
    resetCriteriaWeights,
    currentUser,
    schools,
    addToast,
  } = useApp();

  const [weightsDraft, setWeightsDraft] = useState(criteriaWeights);

  const isAdmin = currentUser.role === 'admin';

  const handleWeightChange = (key, val) => {
    const num = Math.max(0, Math.min(100, Number(val) || 0));
    setWeightsDraft((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        weight: num,
      },
    }));
  };

  const currentTotal = Object.values(weightsDraft).reduce(
    (sum, c) => sum + (Number(c.weight) || 0),
    0
  );

  const isValidTotal = currentTotal === 100;

  const handleSave = () => {
    if (!isAdmin) {
      addToast('error', 'Administrator permissions required to update scoring criteria weights.');
      return;
    }
    if (!isValidTotal) {
      addToast('error', `Criteria weights must sum to exactly 100 points (Current sum: ${currentTotal}).`);
      return;
    }

    updateCriteriaWeights(weightsDraft);
  };

  const handleReset = () => {
    setWeightsDraft(DEFAULT_CRITERIA_WEIGHTS);
    resetCriteriaWeights();
  };

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Priority Scoring Configuration</h2>
              <p className="text-xs text-slate-500">
                Calibrate point distributions across the 5 evaluation criteria (Authorized Admins only)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${isAdmin ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
              {isAdmin ? 'Admin Mode (Authorized)' : 'View-Only (Member Access)'}
            </span>
          </div>
        </div>
      </div>

      {!isAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-800">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Role Restriction Notice:</strong> You are currently signed in as a regular team member ({currentUser.name}). You can inspect the weight formulas, but modifying weights requires administrator credentials. Use the top profile switcher to test Admin capabilities.
          </div>
        </div>
      )}

      {/* MAIN CONFIGURATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CRITERIA SLIDERS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Evaluation Criteria Breakdown
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Total Sum:</span>
                <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${isValidTotal ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse'}`}>
                  {currentTotal} / 100 pts
                </span>
              </div>
            </div>

            <div className="space-y-5">
              {Object.entries(weightsDraft).map(([key, criterion]) => {
                const weight = Number(criterion.weight) || 0;

                return (
                  <div key={key} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{criterion.name}</span>
                        <p className="text-[11px] text-slate-500">{criterion.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          disabled={!isAdmin}
                          value={weight}
                          onChange={(e) => handleWeightChange(key, e.target.value)}
                          className="w-16 text-xs font-mono font-bold text-right p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-100"
                        />
                        <span className="text-xs text-slate-500 font-semibold">pts</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                        disabled={!isAdmin}
                        value={weight}
                        onChange={(e) => handleWeightChange(key, e.target.value)}
                        className="w-full accent-indigo-600 disabled:opacity-40 cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                disabled={!isAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!isAdmin || !isValidTotal}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save & Recalculate Directory</span>
              </button>
            </div>
          </div>
        </div>

        {/* SIMULATED IMPACT PREVIEW */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Live Ranking Impact Preview</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Scores recomputed in memory using draft weights
              </p>
            </div>

            <div className="space-y-3">
              {schools.slice(0, 5).map((s) => {
                const preview = calculatePriorityScore(s.scoring_data, weightsDraft);

                return (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="truncate pr-2">{s.name}</span>
                      <span className="font-mono text-indigo-600 shrink-0">
                        {preview.totalScore} / 100
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>{s.city}</span>
                      <span className="font-semibold text-slate-700">
                        Level: {preview.level}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
