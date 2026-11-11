import React, { useRef } from 'react';

export default function Sidebar({
  datasets,
  activeWorkspace,
  onSelectWorkspace,
  onSelectDataset,
  onUploadDataset,
  ingestionMode,
  setIngestionMode
}) {
  const fileInputRef = useRef(null);
  const availableDatasets = datasets?.available || [];

  const navItems = [
    { id: 'executive-analytics', label: 'Sales & Performance Dashboard', icon: 'monitoring' },
    { id: 'ai-analyst-multi-agent', label: 'AI Data Analyst', icon: 'chat' },
    { id: 'prescriptive-strategy', label: 'Smart Recommendations', icon: 'lightbulb' },
    { id: 'corporate-knowledge-rag', label: 'Company Documents & Guides', icon: 'menu_book' },
  ];

  const handleDatasetFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadDataset(file);
      e.target.value = '';
    }
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-80 z-40 bg-surface-container-lowest overflow-y-auto border-r border-surface-container-high/40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between p-space-md gap-space-md">
      <div className="space-y-space-md">
        {/* 1. Navigation Workspaces */}
        <div className="bg-surface-container-low p-space-sm rounded-xl border border-surface-container-high/40 shadow-sm">
          <span className="font-label-caps text-label-caps uppercase text-outline px-space-xs block mb-space-xs">
            Workspaces
          </span>
          <nav className="space-y-1">
            {navItems.map((navItem) => {
              const isActive = activeWorkspace === navItem.id;
              return (
                <button
                  key={navItem.id}
                  onClick={() => onSelectWorkspace(navItem.id)}
                  className={`w-full flex items-center justify-between p-space-sm rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-space-sm truncate">
                    <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-primary' : 'text-outline'}`}>
                      {navItem.icon}
                    </span>
                    <span className="font-body-sm text-body-sm truncate">{navItem.label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 2. Dataset Picker */}
        <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-sm border border-surface-container-high/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-outline">Dataset & Files</span>
            <span className="material-symbols-outlined text-[14px] text-outline">sync_alt</span>
          </div>

          <div className="grid grid-cols-2 gap-space-xs p-0.5 bg-surface-container rounded-lg">
            <button
              onClick={() => setIngestionMode('benchmark')}
              className={`px-space-xs py-1 rounded font-body-sm text-body-sm text-center transition-colors ${
                ingestionMode === 'benchmark'
                  ? 'bg-surface-container-high text-primary font-medium'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              Sample Data
            </button>
            <button
              onClick={() => setIngestionMode('upload')}
              className={`px-space-xs py-1 rounded font-body-sm text-body-sm text-center transition-colors ${
                ingestionMode === 'upload'
                  ? 'bg-surface-container-high text-primary font-medium'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
            >
              Upload Your File
            </button>
          </div>

          {ingestionMode === 'benchmark' ? (
            <div className="space-y-1">
              <label className="text-outline font-label-caps text-label-caps uppercase">Choose Active Dataset</label>
              <select
                onChange={(e) => onSelectDataset(e.target.value)}
                className="w-full bg-surface-container font-code-sm text-code-sm text-on-surface p-1.5 rounded border border-surface-container-high focus:outline-none cursor-pointer truncate"
              >
                {availableDatasets.map((ds) => (
                  <option key={ds} value={ds} className="bg-surface-container-high">
                    {ds}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleDatasetFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 border border-dashed border-primary/40 rounded-lg text-primary hover:bg-primary/10 font-body-sm text-body-sm flex items-center justify-center gap-1.5 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span>Select CSV / Excel File</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
