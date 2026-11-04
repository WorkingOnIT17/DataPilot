import React, { useState, useRef } from 'react';

export default function CorporateKnowledge({
  documentsData,
  onSearchDocuments,
  onUploadDocument,
  searchResults,
  isSearching,
  cleanedCsvUrl,
  reportHtmlUrl,
  onShowNotification
}) {
  const [searchQuery, setSearchQuery] = useState('discount policy');
  const fileInputRef = useRef(null);

  const docs = documentsData?.documents || [
    { name: "Sales_Discount_and_Pricing_Policy.txt", type: "TXT", chunks: 2, verified: true },
    { name: "FY2023_Corporate_Strategy_Review.txt", type: "TXT", chunks: 3, verified: true },
    { name: "SaaS_Enterprise_Expansion_Memo_2024.txt", type: "TXT", chunks: 3, verified: true },
    { name: "Pharma_Quality_and_Compliance_Guideline.txt", type: "TXT", chunks: 3, verified: true }
  ];

  const totalChunks = documentsData?.total_chunks || 11;

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      onSearchDocuments(searchQuery.trim());
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadDocument(file);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-space-xl">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-surface-container-low rounded-xl p-space-xl shadow-sm border border-surface-container-high/30">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg relative z-10">
          <div className="space-y-space-xs max-w-2xl">
            <div className="flex items-center gap-space-sm">
              <span className="px-space-sm py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase tracking-wider">
                Enterprise Intelligence Hub
              </span>
              <span className="text-outline font-label-caps text-label-caps">•</span>
              <span className="text-tertiary font-code-sm text-code-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Vector Index Synced
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
              Corporate RAG & Executive Reporting
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Semantically grounding DuckDB analytic runs against enterprise policy documentation, governance agreements, and automated executive reporting artifacts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm bg-surface-container p-space-sm rounded-xl shrink-0 border border-surface-container-high/30">
            <div className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-surface-container-high/20">
              <span className="font-label-caps text-label-caps text-outline block uppercase">Corpus Index</span>
              <span className="font-metric-val text-metric-val text-on-surface">{docs.length} Docs</span>
            </div>
            <div className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-surface-container-high/20">
              <span className="font-label-caps text-label-caps text-outline block uppercase">Embeddings</span>
              <span className="font-metric-val text-metric-val text-primary">{totalChunks} Chunks</span>
            </div>
            <div className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-surface-container-high/20">
              <span className="font-label-caps text-label-caps text-outline block uppercase">Recall Protocol</span>
              <span className="font-code-sm text-code-sm text-tertiary">Cosine TF-IDF</span>
            </div>
            <div className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-surface-container-high/20">
              <span className="font-label-caps text-label-caps text-outline block uppercase">Vector Backend</span>
              <span className="font-code-sm text-code-sm text-on-surface">In-Memory DuckDB</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Indexed Knowledge Corpus Grid */}
      <section className="space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[20px] text-primary">source_environment</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Indexed Corporate Knowledge Corpus</h2>
          </div>
          <div className="flex items-center gap-space-sm text-on-surface-variant font-code-sm text-code-sm">
            <span>Model: Cosine Similarity Matcher</span>
            <span className="text-outline">/</span>
            <span className="text-primary font-medium">{totalChunks} Total Chunks</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {docs.map((doc, idx) => (
            <div
              key={idx}
              className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-xl transition-all shadow-sm flex flex-col justify-between group border border-surface-container-high/30"
            >
              <div className="space-y-space-sm">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">
                      {doc.type === 'PDF' ? 'picture_as_pdf' : doc.type === 'DOCX' ? 'description' : 'article'}
                    </span>
                  </div>
                  <span className="px-space-sm py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">verified</span> Verified
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">
                    {doc.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                    Governance rules, discount thresholds, and corporate strategy guidelines.
                  </p>
                </div>
              </div>

              <div className="pt-space-md mt-space-md space-y-space-xs border-t border-surface-container-high/20">
                <div className="flex items-center justify-between font-code-sm text-code-sm text-outline">
                  <span>{doc.chunks || 3} chunks indexed</span>
                  <span className="text-on-surface-variant">{doc.type}</span>
                </div>
                <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Semantic Search & Passage Retrieval */}
      <section className="bg-surface-container-low p-space-lg rounded-xl shadow-md border border-surface-container-high/30 space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">search_insights</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Semantic Passage Search</h2>
          </div>
          <span className="font-code-sm text-code-sm text-outline">Real-Time Cosine Matcher</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-space-sm bg-surface-container-lowest p-space-sm rounded-xl border border-surface-container-high/40">
          <span className="material-symbols-outlined text-primary text-[20px] ml-2">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search governance policies, discount floors, or compliance rules..."
            className="w-full bg-transparent text-on-surface font-body-md text-body-md focus:outline-none placeholder:text-outline"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-surface-tint transition-colors shadow-sm disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search Corpus'}
          </button>
        </form>

        {/* Retrieved Passages */}
        <div className="space-y-space-sm">
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((item, i) => (
              <div
                key={i}
                className="p-space-md rounded-lg bg-surface-container-lowest border border-surface-container-high/30 space-y-1.5"
              >
                <div className="flex items-center justify-between font-code-sm text-code-sm">
                  <span className="text-primary font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">description</span>
                    {item.source}
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container text-tertiary font-semibold">
                    Relevance: {item.relevance_pct || 95}%
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  "{item.content}"
                </p>
              </div>
            ))
          ) : (
            <div className="p-space-md rounded-lg bg-surface-container-lowest text-center text-outline font-body-sm text-body-sm">
              Type a search query above to inspect matching passages from indexed corporate documents.
            </div>
          )}
        </div>
      </section>

      {/* 4. Executive Export Center */}
      <section className="bg-surface-container-low p-space-lg rounded-xl shadow-md border border-surface-container-high/30 space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">download</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Executive Export & Reporting Center</h2>
          </div>
          <span className="font-code-sm text-code-sm text-outline">Board-Ready Artifacts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {/* Export 1: Cleaned CSV */}
          <div className="p-space-md rounded-xl bg-surface-container flex flex-col justify-between gap-space-sm border border-surface-container-high/30">
            <div className="space-y-1">
              <span className="material-symbols-outlined text-primary text-[24px]">csv</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Cleaned Dataset (CSV)</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Normalized tabular dataset with duplicates removed, missing values imputed, and dates standardized.
              </p>
            </div>
            <a
              href={cleanedCsvUrl}
              download
              className="mt-space-sm flex items-center justify-center gap-space-xs py-2 px-space-md rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-body-sm text-body-sm font-semibold transition-colors border border-surface-container-highest/40"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Download Cleaned CSV</span>
            </a>
          </div>

          {/* Export 2: Executive HTML Report */}
          <div className="p-space-md rounded-xl bg-surface-container flex flex-col justify-between gap-space-sm border border-surface-container-high/30">
            <div className="space-y-1">
              <span className="material-symbols-outlined text-primary text-[24px]">html</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Executive HTML Report</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Standalone interactive report rendered with Jinja2, complete with KPI cards, charts, and recommendations.
              </p>
            </div>
            <a
              href={reportHtmlUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-space-sm flex items-center justify-center gap-space-xs py-2 px-space-md rounded-lg bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-body-sm text-body-sm font-semibold transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              <span>Open Executive Report (HTML)</span>
            </a>
          </div>

          {/* Export 3: Document Ingestion */}
          <div className="p-space-md rounded-xl bg-surface-container flex flex-col justify-between gap-space-sm border border-surface-container-high/30">
            <div className="space-y-1">
              <span className="material-symbols-outlined text-tertiary text-[24px]">upload_file</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Add Strategy Document</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Upload business guidelines or pricing policies (.pdf, .docx, .txt, .md) to vectorize into DuckDB memory.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-space-sm flex items-center justify-center gap-space-xs py-2 px-space-md rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold transition-colors border border-surface-container-highest/40"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

