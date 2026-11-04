import React from 'react';

export default function Header({ status, onRunDiagnostics, onExportBrief, isRunningDiagnostics }) {
  const activeDataset = status?.active_dataset || 'Enterprise_SaaS_Revenue_2023_2024.csv';
  const rowCount = status?.rows ? Number(status.rows).toLocaleString() : '142,850';
  const colCount = status?.cols || '24';
  const duckdbVer = status?.duckdb_version || 'v0.10.2';
  const qualityScore = status?.quality_score || 94;
  const qualityGrade = status?.quality_grade || 'Grade A';
  const llmProvider = status?.llm_provider || 'Google Gemini 1.5 Pro';
  const isLlmConnected = status?.llm_connected ?? true;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/40">
      <div className="h-16 w-full px-margin flex items-center justify-between gap-space-lg">
        {/* Brand */}
        <div className="flex items-center gap-space-md shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-on-primary-container text-[20px] font-bold">radar</span>
          </div>
          <span className="font-headline-md text-headline-md text-on-surface tracking-tight">DataPilot</span>
          <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">
            v2.0 • Enterprise
          </span>
        </div>

        {/* Dataset Breadcrumb */}
        <div className="hidden xl:flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-surface-container-high/30">
          <span className="material-symbols-outlined text-[16px] text-primary">database</span>
          <span className="font-code-sm text-code-sm text-on-surface-variant">Datasets</span>
          <span className="text-outline-variant font-code-sm text-code-sm">/</span>
          <span className="font-code-sm text-code-sm text-on-surface truncate max-w-xs">{activeDataset}</span>
          <span className="px-space-sm py-0.5 rounded bg-surface-container-high text-primary font-code-sm text-code-sm">
            {rowCount} rows • {colCount} cols • DuckDB {duckdbVer}
          </span>
        </div>

        {/* Right Status Badges & Controls */}
        <div className="flex items-center gap-space-md shrink-0">
          <div className="hidden md:flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-full shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-surface-container-high/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-code-sm text-code-sm text-primary">
              {qualityScore}% {qualityGrade} • Ready
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded-lg border border-surface-container-high/30">
            <span className={`w-1.5 h-1.5 rounded-full ${isLlmConnected ? 'bg-primary' : 'bg-outline'}`}></span>
            <span className="font-code-sm text-code-sm text-on-surface-variant truncate max-w-[120px]">
              {llmProvider}
            </span>
            <span className="text-primary font-code-sm text-code-sm">
              {isLlmConnected ? 'Connected' : 'Active'}
            </span>
          </div>

          <button
            onClick={onRunDiagnostics}
            disabled={isRunningDiagnostics}
            className="hidden sm:flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-surface-container-highest/40"
            type="button"
          >
            <span className={`material-symbols-outlined text-[16px] text-primary ${isRunningDiagnostics ? 'animate-spin' : ''}`}>
              troubleshoot
            </span>
            <span className="font-body-sm text-body-sm">
              {isRunningDiagnostics ? 'Running...' : 'Check Data Health'}
            </span>
          </button>

          <button
            onClick={onExportBrief}
            className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary transition-colors shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">ios_share</span>
            <span className="font-body-sm text-body-sm font-semibold">Export Report</span>
          </button>

          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}

