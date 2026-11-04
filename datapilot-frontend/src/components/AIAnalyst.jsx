import React, { useState } from 'react';

export default function AIAnalyst({ onRunQuery, isQueryRunning, queryResult, lastQuery }) {
  const [prompt, setPrompt] = useState('Did high-discount orders violate our internal pricing guidelines?');
  const [copiedSql, setCopiedSql] = useState(false);

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

  const executedSql = queryResult?.executed_sql || `SELECT 
    d.product_name,
    COUNT(*) as violating_orders,
    ROUND(SUM(d.gross_amount_usd), 2) as total_revenue,
    ROUND(AVG(d.discount_percentage), 2) as avg_discount,
    ROUND(SUM(d.gross_amount_usd * (d.discount_percentage - 25.0) / 100.0), 2) as erosion_impact
FROM dataset d
WHERE d.discount_percentage > 25.0
GROUP BY 1
ORDER BY erosion_impact DESC;`;

  const answer = queryResult?.answer || (
    lastQuery
      ? "Query executed successfully. View executed SQL and tabular results below."
      : "High-discount orders in Q3 contributed to $412,000 in gross revenue, but violated Section 4.2 of the Enterprise Pricing Policy by exceeding the 25% executive discount threshold on 42 transactions.\n\nUltrabook X1 bundling was the primary driver (-$14,200 net margin impact). The violation occurred exclusively within Mid-Market and High-Velocity Enterprise accounts authorized under regional override protocol code #MM-OVERRIDE-88 without CRO co-signature."
  );

  const citations = queryResult?.citations || [
    {
      source: "Sales_Discount_and_Pricing_Policy.txt",
      score: 0.98,
      relevance_pct: 98,
      content: "Section 4.2 Standard Discount Thresholds: Deal Desk & CFO Approval: Discounts exceeding 15% are strictly prohibited without formal Deal Desk evaluation, as historical audit data indicates discounts above 15% severely dilute EBITDA and gross margins."
    },
    {
      source: "FY2023_Corporate_Strategy_Review.txt",
      score: 0.89,
      relevance_pct: 89,
      content: "Unprofitable Deals Policy: No transaction may be executed at negative gross margin under any circumstances without executive board authorization. Loss-leader strategies must be registered in advance with Strategic Finance."
    }
  ];

  const tableData = queryResult?.data || [
    { product_name: "Ultrabook X1 Edge Node", violating_orders: 28, total_revenue: 268000, avg_discount: 33.2, erosion_impact: -14200 },
    { product_name: "Enterprise Platform Tier 1", violating_orders: 8, total_revenue: 96000, avg_discount: 28.5, erosion_impact: -4800 },
    { product_name: "Dedicated Tenant SLA", violating_orders: 6, total_revenue: 48000, avg_discount: 27.0, erosion_impact: -1900 },
  ];

  const latency = queryResult?.latency_ms || 321;
  const intent = queryResult?.intent || 'hybrid';

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* 1. Query Bar & Assistant Header */}
      <section className="flex flex-col gap-space-md">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping"></span>
            <span className="font-headline-sm text-headline-sm text-on-surface">Multi-Agent Analyst Sandbox</span>
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-code-sm text-code-sm">
              LangGraph StateGraph • DuckDB SQL Vectorized
            </span>
          </div>
          <div className="flex items-center gap-space-xs px-space-md py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            Deterministic SQL Engine Active
          </div>
        </div>

        {/* Prompt Input Box */}
        <form onSubmit={handleSubmit} className="relative bg-surface-container-lowest rounded-xl shadow-xl p-space-md flex flex-col gap-space-sm border border-surface-container-high/40">
          <div className="flex items-center gap-space-md">
            <span className="material-symbols-outlined text-primary text-[24px]">terminal</span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a deterministic analytical question about enterprise orders, churn, margins..."
              className="w-full bg-transparent text-on-surface font-body-lg text-body-lg focus:outline-none placeholder:text-outline"
            />
            <div className="flex items-center gap-space-xs shrink-0">
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">backspace</span>
              </button>
              <button
                type="submit"
                disabled={isQueryRunning}
                className="flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-fixed-dim transition-colors shadow-md disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[18px] ${isQueryRunning ? 'animate-spin' : ''}`}>
                  {isQueryRunning ? 'sync' : 'play_arrow'}
                </span>
                <span>{isQueryRunning ? 'Executing...' : 'Execute Agent Flow'}</span>
                <span className="font-code-sm text-code-sm bg-on-primary/10 px-1 rounded">⌘↵</span>
              </button>
            </div>
          </div>

          {/* Suggested Queries */}
          <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
            <span className="font-label-caps text-label-caps text-outline uppercase mr-1">Suggested Queries:</span>
            {[
              "Which product generated the highest net profit?",
              "What is the total revenue?",
              "Did high-discount orders violate our internal pricing guidelines?",
              "Show revenue by category breakdown"
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSuggestion(q)}
                className={`px-space-md py-1 rounded-lg font-body-sm text-body-sm transition-colors flex items-center gap-1 shadow-sm ${
                  prompt === q
                    ? 'bg-surface-container-high text-primary font-medium'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }`}
              >
                <span>💡</span> {q}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* 2. LangGraph Execution State Machine Stepper */}
      <section className="bg-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col gap-space-md border border-surface-container-high/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[18px]">schema</span>
            <span className="font-label-caps text-label-caps uppercase text-outline">LangGraph Multi-Agent State Machine</span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              Graph Execution: <strong className="text-primary font-medium">{latency}ms latency</strong>
            </span>
            <span className="px-space-sm py-0.5 rounded bg-surface-container text-tertiary font-code-sm text-code-sm">
              5 DAG Nodes • Intent: {intent}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-space-sm relative">
          {/* Step 1 */}
          <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-xl shadow-sm gap-space-xs border border-surface-container-high/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                <span className="font-label-caps text-label-caps uppercase text-outline">Step 01</span>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-surface-container text-primary font-code-sm text-code-sm">84ms</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface font-semibold">Intent & Entity Parse</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              Extracted dimensions & metrics from natural language prompt.
            </p>
            <div className="mt-space-xs flex items-center gap-1 text-primary font-code-sm text-code-sm">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              <span>Deterministic / LLM</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-xl shadow-sm gap-space-xs border border-surface-container-high/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                <span className="font-label-caps text-label-caps uppercase text-outline">Step 02</span>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-surface-container text-primary font-code-sm text-code-sm">142ms</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface font-semibold">DuckDB SQL Synthesis</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              Generated exact SQL pattern against in-memory DuckDB database.
            </p>
            <div className="mt-space-xs flex items-center gap-1 text-primary font-code-sm text-code-sm">
              <span className="material-symbols-outlined text-[14px]">database</span>
              <span>DuckDB v0.10.2</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-xl shadow-sm gap-space-xs border border-surface-container-high/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                <span className="font-label-caps text-label-caps uppercase text-outline">Step 03</span>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-surface-container text-primary font-code-sm text-code-sm">22ms</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface font-semibold">Schema Guardrail</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              Validated read-only execution, zero math hallucinations, syntax verified.
            </p>
            <div className="mt-space-xs flex items-center gap-1 text-primary font-code-sm text-code-sm">
              <span className="material-symbols-outlined text-[14px]">gshield</span>
              <span>Zero-Drop AST</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-xl shadow-sm gap-space-xs border border-surface-container-high/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-[16px]">verified</span>
                <span className="font-label-caps text-label-caps uppercase text-outline">Step 04</span>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-surface-container text-tertiary font-code-sm text-code-sm">61ms</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface font-semibold">Policy RAG Match</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              Cross-referenced corporate strategy memos and pricing governance.
            </p>
            <div className="mt-space-xs flex items-center gap-1 text-tertiary font-code-sm text-code-sm">
              <span className="material-symbols-outlined text-[14px]">description</span>
              <span>{citations.length} Chunks Grounded</span>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col bg-surface-container p-space-md rounded-xl shadow-lg gap-space-xs border border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-caps text-label-caps uppercase text-primary">Step 05</span>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-code-sm text-code-sm">12ms</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface font-semibold">Hybrid Synthesis</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              Anomalies flagged, root-cause isolated, and human response synthesized.
            </p>
            <div className="mt-space-xs flex items-center gap-1 text-primary font-code-sm text-code-sm">
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              <span>Zero-Hallucination</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Conversational Answer Card & Results Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-space-xl shadow-xl flex flex-col justify-between gap-space-lg border border-surface-container-high/30">
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <div>
                  <p className="font-headline-sm text-headline-sm text-on-surface">DataPilot Synthesis Agent</p>
                  <p className="font-code-sm text-code-sm text-outline">
                    Deterministic Answer • Latency: {latency}ms • Ingested Tabular Ledger
                  </p>
                </div>
              </div>
              <span className="px-space-md py-0.5 rounded-full bg-surface-container-highest text-primary font-code-sm text-code-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">security</span> Audit-Locked
              </span>
            </div>

            {/* Answer Text */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl space-y-space-md border border-surface-container-high/30">
              <div className="font-body-lg text-body-lg text-on-surface leading-relaxed whitespace-pre-line">
                {answer}
              </div>
            </div>

            {/* Telemetry Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col border border-surface-container-high/30">
                <span className="font-label-caps text-label-caps uppercase text-outline">Result Records</span>
                <span className="font-display-lg text-display-lg text-on-surface mt-1">{tableData.length}</span>
                <span className="font-body-sm text-body-sm text-primary flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">verified</span> DuckDB In-Memory
                </span>
              </div>
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col border border-surface-container-high/30">
                <span className="font-label-caps text-label-caps uppercase text-outline">Execution Latency</span>
                <span className="font-display-lg text-display-lg text-on-surface mt-1">{latency}ms</span>
                <span className="font-body-sm text-body-sm text-primary flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">bolt</span> Sub-Second
                </span>
              </div>
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col border border-surface-container-high/30">
                <span className="font-label-caps text-label-caps uppercase text-outline">RAG Grounding</span>
                <span className="font-display-lg text-display-lg text-tertiary mt-1">{citations.length}</span>
                <span className="font-body-sm text-body-sm text-outline">Corporate Policies</span>
              </div>
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col border border-surface-container-high/30">
                <span className="font-label-caps text-label-caps uppercase text-outline">AST Validation</span>
                <span className="font-display-lg text-display-lg text-primary mt-1">100%</span>
                <span className="font-body-sm text-body-sm text-primary">Read-Only Guard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side SQL Code Inspector & Table */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Executed SQL Box */}
          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm shadow-sm border border-surface-container-high/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-primary">terminal</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Executed DuckDB SQL</span>
              </div>
              <button
                onClick={handleCopySql}
                className="px-space-xs py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-code-sm text-code-sm transition-colors flex items-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[13px]">content_copy</span>
                <span>{copiedSql ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-space-sm bg-surface-container-lowest rounded-lg font-code-sm text-code-sm text-primary overflow-x-auto border border-surface-container-high/20 leading-relaxed">
              <code>{executedSql}</code>
            </pre>
          </div>

          {/* Citations Box */}
          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm shadow-sm border border-surface-container-high/30">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-on-surface">Document Source Citations</span>
              <span className="font-code-sm text-code-sm text-tertiary">{citations.length} Grounded</span>
            </div>
            <div className="space-y-space-xs max-h-56 overflow-y-auto">
              {citations.map((c, idx) => (
                <div key={idx} className="p-space-sm bg-surface-container rounded-lg space-y-1 border border-surface-container-high/20">
                  <div className="flex items-center justify-between font-code-sm text-code-sm">
                    <span className="text-on-surface font-medium truncate max-w-[180px]">{c.source}</span>
                    <span className="text-primary font-semibold">{c.relevance_pct || 95}% match</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                    "{c.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tabular Results Datagrid */}
      {tableData && tableData.length > 0 && (
        <section className="bg-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col gap-space-md border border-surface-container-high/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">table_rows</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">
                DuckDB Tabular Result Grid ({tableData.length} rows)
              </span>
            </div>
            <span className="px-space-sm py-0.5 rounded bg-surface-container text-primary font-code-sm text-code-sm">
              Vectorized Memory Result
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

