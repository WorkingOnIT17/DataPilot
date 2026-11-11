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
      e.target.value = '';
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
                Document Knowledge Hub
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
              Company Documents & Executive Reports
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Search your company policies, pricing guidelines, and business documents. When you ask questions, DataPilot combines these documents with your sales data to give complete business answers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm bg-surface-container p-space-sm rounded-xl shrink-0 border border-surface-container-high/30">
            <div className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-surface-container-high/20">
              <span className="font-label-caps text-label-caps text-outline block uppercase">Documents</span>
              <span className="font-metric-val text-metric-val text-on-surface">{docs.length} Files</span>
            </div>
            <div className="px-space-md py-space-sm rounded-lg bg-surface-container-low border border-surface-container-high/20">
              <span className="font-label-caps text-label-caps text-outline block uppercase">Searchable Sections</span>
              <span className="font-metric-val text-metric-val text-primary">{totalChunks} Sections</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Indexed Knowledge Corpus Grid */}
      <section className="space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[20px] text-primary">source_environment</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Uploaded Company Documents</h2>
          </div>
          <div className="flex items-center gap-space-sm text-on-surface-variant font-code-sm text-code-sm">
            <span>Fast Semantic Search</span>
            <span className="text-outline">/</span>
            <span className="text-primary font-medium">{totalChunks} Searchable Sections</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {docs.map((doc, idx) => (
            <div
              key={idx}
              className="bg-surface-container-low p-space-md rounded-xl shadow-sm border border-surface-container-high/30 hover:border-primary/40 transition-all flex flex-col justify-between gap-space-sm"
            >
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="px-space-xs py-0.5 rounded bg-surface-container text-primary font-code-sm text-code-sm uppercase">
                    {doc.type || 'TXT'}
                  </span>
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate" title={doc.name}>
                  {doc.name}
                </h3>
              </div>
              <div className="flex items-center justify-between font-code-sm text-code-sm text-outline pt-space-xs border-t border-surface-container-high/30">
                <span>{doc.chunks || 2} Sections</span>
                <span className="text-primary font-medium">Ready</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Search and Upload Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Document Search (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-low p-space-lg rounded-xl shadow-sm border border-surface-container-high/30 space-y-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">search</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Search Document Knowledge</h3>
            </div>
            <span className="font-code-sm text-code-sm text-outline">Relevant Policy & Strategy Citations</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-space-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company policies (e.g., discount limit, pricing rules, refund terms)..."
              className="w-full bg-surface-container text-on-surface font-body-md text-body-md p-2 rounded-lg border border-surface-container-high focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-space-lg py-2 rounded-lg bg-primary hover:bg-surface-tint text-on-primary font-body-sm text-body-sm font-semibold transition-colors shadow-sm shrink-0"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Search Results Preview */}
          <div className="space-y-space-sm pt-space-xs">
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((res, i) => (
                <div key={i} className="p-space-md rounded-lg bg-surface-container space-y-1 border border-surface-container-high/40">
                  <div className="flex items-center justify-between font-code-sm text-code-sm">
                    <span className="text-primary font-semibold">{res.source}</span>
                    <span className="text-outline">{res.relevance_pct || 90}% match</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    "{res.content}"
                  </p>
                </div>
              ))
            ) : (
              <div className="p-space-md rounded-lg bg-surface-container/50 text-center space-y-1">
                <p className="font-body-sm text-body-sm text-outline">
                  Try searching for <span className="text-primary">"discount policy"</span> or <span className="text-primary">"enterprise strategy"</span> to view matched excerpts.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload & Reports Box (4 cols) */}
        <div className="lg:col-span-4 space-y-space-md">
          {/* Upload Document Box */}
          <div className="bg-surface-container-low p-space-lg rounded-xl shadow-sm border border-surface-container-high/30 space-y-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">upload_file</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Add Document</h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Upload PDF, Word, or text files to add business rules or background memos.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-space-md border border-dashed border-primary/50 hover:bg-primary/10 rounded-lg text-primary font-body-sm text-body-sm font-semibold flex items-center justify-center gap-space-xs transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Select Document File</span>
            </button>
          </div>

          {/* Export Executive Reports Box */}
          <div className="bg-surface-container-low p-space-lg rounded-xl shadow-sm border border-surface-container-high/30 space-y-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-tertiary text-[20px]">download</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Reports & Downloads</h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Download clean data or open the executive summary HTML report.
            </p>
            <div className="space-y-space-xs pt-space-xs">
              <a
                href={cleanedCsvUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-body-sm text-body-sm flex items-center justify-between transition-colors border border-surface-container-high/40"
              >
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">table_view</span>
                  <span>Cleaned Data (CSV)</span>
                </div>
                <span className="material-symbols-outlined text-[14px] text-outline">open_in_new</span>
              </a>
              <a
                href={reportHtmlUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-space-md bg-primary hover:bg-surface-tint text-on-primary rounded-lg font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  <span>Executive HTML Report</span>
                </div>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
