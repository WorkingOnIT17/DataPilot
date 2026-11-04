import React, { useRef } from 'react';

export default function Sidebar({
  status,
  datasets,
  activeWorkspace,
  onSelectWorkspace,
  onSelectDataset,
  onUploadDataset,
  onUploadDocument,
  onPingLLM,
  isPinging,
  smartHeader,
  setSmartHeader,
  ingestionMode,
  setIngestionMode
}) {
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);

  const availableDatasets = datasets?.available || [];
  const activeDataset = status?.active_dataset || '';
  const rowCount = status?.rows ? Number(status.rows).toLocaleString() : '142,850';
  const chunkCount = status?.rag_chunk_count || 11;
  const docCount = status?.rag_doc_count || 4;
  const llmProvider = status?.llm_provider || 'Google Gemini 1.5 Pro';

  const handleDatasetFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadDataset(file);
      e.target.value = '';
    }
  };

  const handleDocFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadDocument(file);
      e.target.value = '';
    }
  };

  const navItems = [
    { id: 'executive-analytics', label: 'Executive Analytics', icon: 'monitoring' },
    { id: 'ai-analyst-multi-agent', label: 'AI Analyst (Multi-Agent)', icon: 'hub' },
    { id: 'prescriptive-strategy', label: 'Prescriptive Strategy', icon: 'psychology' },
    { id: 'corporate-knowledge-rag', label: 'Corporate Knowledge RAG', icon: 'menu_book' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-80 z-40 bg-surface-container-lowest overflow-y-auto border-r border-surface-container-high/40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between p-space-md gap-space-md">
      <div className="space-y-space-md">
        {/* 1. Navigation Workspaces (Prominently at the Top) */}
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
                  className={`w-full flex items-center gap-space-sm px-space-md py-2 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm border border-primary/20'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-outline'}`}>
                    {navItem.icon}
                  </span>
                  <span className="font-body-md text-body-md truncate">{navItem.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 2. Dataset Ingestion */}
        <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-sm border border-surface-container-high/30">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-outline">Dataset Ingestion</span>
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
              Benchmark
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
              Upload File
            </button>
          </div>

          {ingestionMode === 'benchmark' ? (
            <div className="space-y-1">
              <label className="text-outline font-label-caps text-label-caps uppercase">Choose Active Dataset</label>
              <select
                value={activeDataset}
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

          <label className="flex items-center gap-space-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={smartHeader}
              onChange={(e) => setSmartHeader(e.target.checked)}
              className="accent-primary rounded cursor-pointer"
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant">Smart Header Detection</span>
          </label>

          <div className="px-space-sm py-1 rounded bg-surface-container text-primary font-code-sm text-code-sm flex items-center justify-between">
            <span>{rowCount} rows</span>
            <span className="text-tertiary">In-Memory DuckDB</span>
          </div>
        </div>

        {/* 3. Inference Engine */}
        <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-xs border border-surface-container-high/30">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-outline">Inference Engine</span>
            <span className="font-code-sm text-code-sm text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              {status?.llm_connected ? 'Live AI Mode' : 'Fast Deterministic'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs truncate">
              <span className="material-symbols-outlined text-primary text-[18px]">neurology</span>
              <span className="font-body-md text-body-md text-on-surface truncate">{llmProvider}</span>
            </div>
            <button
              onClick={onPingLLM}
              disabled={isPinging}
              className="px-space-sm py-0.5 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-code-sm text-code-sm transition-colors border border-surface-container-highest/30"
              type="button"
            >
              {isPinging ? '...' : 'Ping'}
            </button>
          </div>
        </div>

        {/* 4. Corporate Document RAG */}
        <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-sm border border-surface-container-high/30">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-outline">Corporate Document RAG</span>
            <span className="material-symbols-outlined text-[14px] text-outline">auto_stories</span>
          </div>

          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            onChange={handleDocFileChange}
            className="hidden"
          />

          <div
            onClick={() => docInputRef.current?.click()}
            className="p-space-md rounded-lg bg-surface-container text-center space-y-space-xs hover:bg-surface-container-high transition-colors cursor-pointer border border-dashed border-outline-variant/40"
          >
            <span className="material-symbols-outlined text-primary text-[24px]">upload_file</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Drop Strategy Memos, Pricing PDFs (.pdf, .docx, .md)
            </p>
          </div>

          <div className="px-space-sm py-1 rounded bg-surface-container text-tertiary font-code-sm text-code-sm flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>{chunkCount} chunks indexed from {docCount} docs</span>
          </div>
        </div>
      </div>

      {/* 5. DuckDB RAM Telemetry */}
      <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-sm shrink-0 border border-surface-container-high/30">
        <div className="flex items-center justify-between font-code-sm text-code-sm">
          <span className="text-outline">DuckDB RAM</span>
          <span className="text-primary font-medium">{status?.duckdb_ram || '1.2GB / 8GB'}</span>
        </div>
        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${status?.duckdb_ram_pct || 15}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between pt-space-xs">
          <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>Latency: {status?.latency_ms || 42}ms</span>
          </div>
          <span className="font-label-caps text-label-caps text-outline uppercase">
            {status?.tls_enc || 'TLS 1.3 ENC'}
          </span>
        </div>
      </div>
    </aside>
  );
}
