import React, { useState, useRef, useEffect } from 'react';

export default function Header({
  status,
  analytics,
  smartHeader,
  setSmartHeader,
  onExportBrief
}) {
  const [showStatusDetails, setShowStatusDetails] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const statusRef = useRef(null);
  const settingsRef = useRef(null);

  const activeDataset = status?.active_dataset || 'Enterprise_SaaS_Revenue_2023_2024.csv';
  const rowCount = status?.rows ? Number(status.rows).toLocaleString() : '750';
  const colCount = status?.cols || '15';

  const anomalyCount = analytics?.anomalies_count ?? (status?.quality_score ? 14 : 0);
  const validationIssuesCount = analytics?.validation_issues_count ?? 0;
  const qualityScore = analytics?.quality_score?.score || status?.quality_score || 94;
  const qualityGrade = analytics?.quality_score?.grade || status?.quality_grade || 'Grade A';

  const isHealthy = anomalyCount === 0 && validationIssuesCount === 0;

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setShowStatusDetails(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/40">
      <div className="h-16 w-full px-margin flex items-center justify-between gap-space-lg">
        {/* Left: Brand */}
        <div className="flex items-center gap-space-md shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-on-primary-container text-[20px] font-bold">radar</span>
          </div>
          <span className="font-headline-md text-headline-md text-on-surface tracking-tight">DataPilot</span>
        </div>

        {/* Center: Dataset name + Status Dot + Muted dimensions */}
        <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-surface-container-high/30">
          <span className="material-symbols-outlined text-[16px] text-outline">database</span>
          <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate max-w-xs" title={activeDataset}>
            {activeDataset}
          </span>

          {/* Consolidated Single Status Dot with Hover/Click Details */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => setShowStatusDetails(!showStatusDetails)}
              onMouseEnter={() => setShowStatusDetails(true)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
              type="button"
              aria-label="Dataset status details"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isHealthy ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              ></span>
              {!isHealthy && (
                <span className="font-code-sm text-code-sm text-amber-300 font-medium">
                  {anomalyCount > 0
                    ? `${anomalyCount} unusual entries`
                    : `${validationIssuesCount} rule issues`}
                </span>
              )}
            </button>

            {/* Status Details Popover */}
            {showStatusDetails && (
              <div
                onMouseLeave={() => setShowStatusDetails(false)}
                className="absolute left-0 top-full mt-2 w-64 bg-surface-container-high rounded-xl p-3 shadow-xl border border-surface-container-highest z-50 text-left font-body-sm text-body-sm"
              >
                <div className="font-semibold text-on-surface mb-1 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isHealthy ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  ></span>
                  <span>{isHealthy ? 'Data Status: Healthy' : 'Data Review Recommended'}</span>
                </div>
                <div className="text-on-surface-variant space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Quality Score:</span>
                    <span className="text-on-surface font-medium">{qualityScore}% ({qualityGrade})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unusual Entries:</span>
                    <span className={anomalyCount > 0 ? 'text-amber-300 font-medium' : 'text-on-surface'}>
                      {anomalyCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Validation Issues:</span>
                    <span className="text-on-surface font-medium">{validationIssuesCount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Muted dimensions (shown once) */}
          <span className="text-outline font-code-sm text-code-sm pl-1 border-l border-surface-container-high/60">
            {rowCount} rows • {colCount} cols
          </span>
        </div>

        {/* Right: Settings Menu + Export Report + Avatar */}
        <div className="flex items-center gap-space-md shrink-0">
          {/* Settings Menu (Hosts Auto-Clean Table Headers) */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
              type="button"
              title="Settings"
              aria-label="Settings"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>

            {showSettingsMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-high rounded-xl p-3.5 shadow-xl border border-surface-container-highest z-50 text-left">
                <span className="font-label-caps text-label-caps uppercase text-outline block mb-2.5">
                  Ingestion Settings
                </span>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={smartHeader}
                    onChange={(e) => setSmartHeader(e.target.checked)}
                    className="accent-primary rounded mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="font-body-sm text-body-sm text-on-surface font-medium block">
                      Auto-Clean Table Headers
                    </span>
                    <span className="text-[12px] text-on-surface-variant leading-snug block mt-0.5">
                      Automatically detects true headers and strips title banner rows.
                    </span>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Export Report */}
          <button
            onClick={onExportBrief}
            className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary transition-colors shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">ios_share</span>
            <span className="font-body-sm text-body-sm font-semibold">Export Report</span>
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
