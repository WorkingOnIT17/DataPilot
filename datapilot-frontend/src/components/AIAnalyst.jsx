import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';

export default function AIAnalyst({ onRunQuery, isQueryRunning, queryResult, lastQuery, status, analytics }) {
  const dynamicSuggestions = analytics?.charts?.suggested_queries || [
    'What are my top 5 selling products by revenue?',
    'Show total sales breakdown across all product categories',
    'Are there any unusually high or low transactions?',
    'What is our overall average order value and profit margin?'
  ];

  const [prompt, setPrompt] = useState(dynamicSuggestions[0] || 'What are the top 5 products by revenue?');
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (analytics?.charts?.suggested_queries?.length && !lastQuery) {
      setPrompt(analytics.charts.suggested_queries[0]);
    }
  }, [analytics, lastQuery]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (prompt.trim() && !isQueryRunning) {
      onRunQuery(prompt.trim());
    }
  };

  const handleSuggestion = (q) => {
    setPrompt(q);
    onRunQuery(q);
  };

  const handleCopySql = () => {
    if (queryResult?.executed_sql) {
      navigator.clipboard.writeText(queryResult.executed_sql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  const activeDataset = status?.active_dataset || 'Active Dataset';
  const rowCount = status?.rows ? Number(status.rows).toLocaleString() : '142,850';

  const executedSql = queryResult?.executed_sql || (
    lastQuery
      ? '-- Running data query...'
      : `-- Exact SQL Query Run on ${activeDataset}\nSELECT * FROM dataset LIMIT 10;`
  );

  const answer = queryResult?.answer || (
    lastQuery
      ? 'Analyzing your data and preparing a clear answer...'
      : `👋 Welcome! I am your AI Data Analyst, connected to ${activeDataset}.\n\nAsk me any question about your sales, best-selling products, profits, or customer trends in plain English.`
  );

  const renderedAnswerHtml = useMemo(() => {
    try {
      return marked.parse(answer || '');
    } catch (e) {
      return answer || '';
    }
  }, [answer]);

  const citations = queryResult?.citations || [];
  const tableData = queryResult?.data || [];
  const latency = queryResult?.latency_ms || 42;
  const intent = queryResult?.intent || 'data_only';

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* 1. Query Bar & Assistant Header */}
      <section className="flex flex-col gap-space-md">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-on-surface">AI Data Analyst</span>
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm truncate max-w-xs">
              {activeDataset}
            </span>
          </div>
        </div>

        {/* Prompt Input Box */}
        <form onSubmit={handleSubmit} className="relative bg-surface-container-lowest rounded-xl shadow-xl p-space-md flex flex-col gap-space-sm border border-surface-container-high/40">
          <div className="flex items-center gap-space-md">
            <span className="material-symbols-outlined text-primary text-[24px]">chat</span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask any question about your sales, top products, profits, or trends in plain English..."
              className="w-full bg-transparent text-on-surface font-body-lg text-body-lg focus:outline-none placeholder:text-outline"
            />
            <div className="flex items-center gap-space-xs shrink-0">
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="p-1 rounded hover:bg-surface-container text-outline hover:text-on-surface transition-colors"
                title="Clear"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              <button
                type="submit"
                disabled={isQueryRunning || !prompt.trim()}
                className="flex items-center gap-space-xs px-space-lg py-2 rounded-lg bg-primary hover:bg-surface-tint text-on-primary font-body-sm text-body-sm font-semibold transition-all shadow-md disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[16px] ${isQueryRunning ? 'animate-spin' : ''}`}>
                  {isQueryRunning ? 'refresh' : 'send'}
                </span>
                <span>{isQueryRunning ? 'Analyzing...' : 'Ask Analyst'}</span>
              </button>
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="flex flex-wrap items-center gap-space-xs pt-space-xs border-t border-surface-container-high/30">
            <span className="font-label-caps text-label-caps uppercase text-outline mr-1">Try Asking:</span>
            {dynamicSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestion(suggestion)}
                className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors border border-surface-container-high/40 text-left truncate max-w-md"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* 2. Conversational Answer Card & Results Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-space-xl shadow-xl flex flex-col justify-between gap-space-lg border border-surface-container-high/30">
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <div>
                  <p className="font-headline-sm text-headline-sm text-on-surface">DataPilot Analyst Briefing</p>
                  <p className="font-code-sm text-code-sm text-outline">
                    Dataset: {activeDataset}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Text Formatted with Markdown */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl space-y-space-md border border-surface-container-high/30">
              <div
                className="markdown-body font-body-lg text-body-lg text-on-surface leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderedAnswerHtml }}
              />
            </div>

            {/* Summary Numbers */}
            <div className="grid grid-cols-2 gap-space-sm">
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col border border-surface-container-high/30">
                <span className="font-label-caps text-label-caps uppercase text-outline">Rows in Result</span>
                <span className="font-display-lg text-display-lg text-on-surface mt-1">{tableData.length}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Matching records</span>
              </div>
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col border border-surface-container-high/30">
                <span className="font-label-caps text-label-caps uppercase text-outline">Referenced Documents</span>
                <span className="font-display-lg text-display-lg text-on-surface mt-1">{citations.length}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Sources consulted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Panel: Query Run & Document References (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Executed Query Box */}
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col gap-space-sm border border-surface-container-high/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Exact Query Run (SQL)</span>
              </div>
              <button
                type="button"
                onClick={handleCopySql}
                className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-code-sm text-code-sm flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedSql ? 'check' : 'content_copy'}
                </span>
                <span>{copiedSql ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-surface-container-lowest p-space-md rounded-lg font-code-sm text-code-sm text-primary overflow-x-auto border border-surface-container-high/20 leading-relaxed max-h-56">
              <code>{executedSql}</code>
            </pre>
          </div>

          {/* Citations Box */}
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col gap-space-sm border border-surface-container-high/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary text-[18px]">menu_book</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Referenced Documents</span>
              </div>
              <span className="font-code-sm text-code-sm text-outline">{citations.length} Referenced</span>
            </div>

            <div className="space-y-space-sm">
              {citations.length > 0 ? (
                citations.map((c, i) => (
                  <div key={i} className="p-space-sm rounded-lg bg-surface-container-lowest border border-surface-container-high/20 space-y-1">
                    <div className="flex items-center justify-between font-code-sm text-code-sm">
                      <span className="text-on-surface font-medium truncate max-w-[180px]">{c.source}</span>
                      <span className="text-primary font-semibold">{c.relevance_pct || 95}% match</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      "{c.content}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-outline font-body-sm text-body-sm py-2">
                  No company policy documents were needed for this question. The answer was calculated entirely from your data table.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tabular Results Table */}
      {tableData && tableData.length > 0 && (
        <section className="bg-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col gap-space-md border border-surface-container-high/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">table_rows</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Detailed Result Rows ({tableData.length} records)
              </span>
            </div>
            <span className="px-space-sm py-0.5 rounded bg-surface-container text-primary font-code-sm text-code-sm">
              From Your Dataset
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-surface-container-high/30">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container-lowest text-outline font-label-caps text-label-caps uppercase">
                <tr>
                  {Object.keys(tableData[0]).map((col) => (
                    <th key={col} className="py-space-sm px-space-md">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/20 font-code-md text-code-md">
                {tableData.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-primary/5 transition-colors">
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx} className="py-space-sm px-space-md text-on-surface">
                        {val != null ? (typeof val === 'number' ? (val < 0 ? <span className="text-error font-medium">{val.toLocaleString()}</span> : val.toLocaleString()) : String(val)) : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
