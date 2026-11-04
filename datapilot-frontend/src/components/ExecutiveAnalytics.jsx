import React, { useState } from 'react';

export default function ExecutiveAnalytics({
  status,
  analytics,
  onForceSync,
  onInspectColumn,
  onRunAnomalyScan,
  onDownloadCleanCsv,
  isSyncing,
  syncTimestamp,
}) {
  const [period, setPeriod] = useState('FY2024');
  const [tier, setTier] = useState('ENT');
  const [activeChartPill, setActiveChartPill] = useState('Temporal Trends');
  const [brushRange, setBrushRange] = useState('YTD');
  const [isProfilerOpen, setIsProfilerOpen] = useState(true);

  const kpis = analytics?.kpis || {};
  const quality = analytics?.quality_score || { score: status?.quality_score || 94, grade: status?.quality_grade || 'Grade A' };
  const profilerCols = analytics?.profiler_columns || [];
  const anomalyCount = analytics?.anomalies_count ?? 14;
  const validationIssuesCount = analytics?.validation_issues_count ?? 0;

  // Formatted KPI Numbers
  const totalRev = kpis.total_revenue != null
    ? (kpis.total_revenue > 1000000 ? `$${(kpis.total_revenue / 1000000).toFixed(2)}M` : `$${kpis.total_revenue.toLocaleString()}`)
    : '$48.29M';
  const totalProfit = kpis.total_profit != null
    ? (kpis.total_profit > 1000000 ? `$${(kpis.total_profit / 1000000).toFixed(2)}M` : `$${kpis.total_profit.toLocaleString()}`)
    : '$35.74M';
  const profitMargin = kpis.profit_margin_pct != null
    ? `${kpis.profit_margin_pct.toFixed(1)}%`
    : '74.0%';
  const aov = kpis.average_order_value != null
    ? `$${kpis.average_order_value.toFixed(2)}`
    : '$3,380';
  const rowCount = status?.rows ? Number(status.rows).toLocaleString() : '142,850';

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* TOP BAR: TELEMETRY & VIEW CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-low p-space-md rounded-xl shadow-sm border border-surface-container-high/30">
        <div className="flex items-center gap-space-md">
          <div className="p-space-xs rounded bg-surface-container-high text-primary">
            <span className="material-symbols-outlined text-[22px]">query_stats</span>
          </div>
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Executive Telemetry & Vector Flow
              </span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container text-tertiary font-label-caps text-label-caps uppercase">
                Batch v2.4.9
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Dual-engine vectorized analytics: DuckDB memory graph synchronized with live OLAP cluster
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-xs self-start lg:self-auto flex-wrap">
          <div className="flex items-center gap-1 bg-surface-container px-space-sm py-1 rounded font-code-sm text-code-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
            <span>As of {syncTimestamp}</span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container px-space-sm py-1 rounded font-code-sm text-code-sm text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span>Streaming 1.8k ops/s</span>
          </div>
          <button
            onClick={() => onForceSync('Presets loaded')}
            className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary">tune</span>
            <span>Presets</span>
          </button>
          <button
            onClick={onForceSync}
            disabled={isSyncing}
            className="flex items-center gap-space-xs px-space-md py-1 rounded bg-primary text-on-primary hover:bg-surface-tint font-body-sm text-body-sm font-semibold transition-colors shadow-sm"
            type="button"
          >
            <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>refresh</span>
            <span>{isSyncing ? 'Syncing...' : 'Force Sync'}</span>
          </button>
        </div>
      </div>

      {/* 1. TOP KPI SCORECARD GRID (5 CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-space-md">
        {/* Card 1: Total Revenue */}
        <div className="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm relative overflow-hidden group border border-surface-container-high/30 hover:border-primary/40 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps uppercase text-outline">Total Revenue (FY24 YTD)</span>
              <div className="font-metric-val text-metric-val text-on-surface tracking-tight">{totalRev}</div>
            </div>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-code-sm text-code-sm flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> +14.2%
            </span>
          </div>
          <div className="my-space-sm h-9 w-full">
            <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 160 36">
              <path
                d="M0,28 L14,26 L28,29 L42,22 L56,24 L70,18 L84,20 L98,14 L112,16 L126,9 L140,11 L160,3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
              <path
                d="M0,28 L14,26 L28,29 L42,22 L56,24 L70,18 L84,20 L98,14 L112,16 L126,9 L140,11 L160,3 L160,36 L0,36 Z"
                fill="currentColor"
                fillOpacity="0.08"
              />
            </svg>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm pt-space-xs bg-surface-container-lowest/40 -mx-space-md -mb-space-md px-space-md py-space-xs">
            <span className="text-outline">Avg Order: {aov}</span>
            <span className="text-primary font-medium">107.3% Attained</span>
          </div>
        </div>

        {/* Card 2: Gross Profit */}
        <div className="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm relative overflow-hidden group border border-surface-container-high/30 hover:border-tertiary/40 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps uppercase text-outline">Gross Profit Margin</span>
              <div className="font-metric-val text-metric-val text-on-surface tracking-tight">{totalProfit}</div>
            </div>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-tertiary font-code-sm text-code-sm">
              {profitMargin}
            </span>
          </div>
          <div className="my-space-sm space-y-1.5">
            <div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant">
              <span>EBITDA Yield: 28.4%</span>
              <span className="text-primary">+3.1% YoY</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden flex">
              <div className="bg-primary h-full rounded-full" style={{ width: '74%' }}></div>
              <div className="bg-surface-bright h-full" style={{ width: '26%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm pt-space-xs bg-surface-container-lowest/40 -mx-space-md -mb-space-md px-space-md py-space-xs">
            <span className="text-outline">Benchmark SaaS: 71.5%</span>
            <span className="text-tertiary">+250 bps spread</span>
          </div>
        </div>

        {/* Card 3: EBITDA Margin (Erosion Alert) */}
        <div className="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm relative overflow-hidden group border border-error-container/60 hover:border-error transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps uppercase text-outline">EBITDA Margin</span>
              <div className="font-metric-val text-metric-val text-on-surface tracking-tight">28.4%</div>
            </div>
            <span className="px-space-xs py-0.5 rounded bg-error-container text-error font-code-sm text-code-sm flex items-center gap-0.5 animate-pulse">
              <span className="material-symbols-outlined text-[12px]">warning</span> -1.8%
            </span>
          </div>
          <div className="my-space-sm p-space-xs rounded bg-surface-container-high/60 space-y-0.5 border border-error/20">
            <div className="flex items-center gap-1 font-label-caps text-label-caps uppercase text-error">
              <span className="material-symbols-outlined text-[13px]">priority_high</span>
              <span>Margin Erosion Alert</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">CAC expansion in Mid-Market segment</p>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm pt-space-xs bg-surface-container-lowest/40 -mx-space-md -mb-space-md px-space-md py-space-xs">
            <span className="text-outline">Run-rate: $13.71M</span>
            <span className="text-error">Trigger threshold</span>
          </div>
        </div>

        {/* Card 4: Net Retention Rate (NRR) */}
        <div className="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm relative overflow-hidden group border border-surface-container-high/30 hover:border-primary/40 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps uppercase text-outline">Net Retention Rate</span>
              <div className="font-metric-val text-metric-val text-on-surface tracking-tight">118.4%</div>
            </div>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-code-sm text-code-sm">
              Top Decile
            </span>
          </div>
          <div className="my-space-sm flex items-center justify-between gap-space-xs">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps uppercase text-outline">Expansion</span>
              <span className="font-code-sm text-code-sm text-primary">+22.1%</span>
            </div>
            <div className="w-px h-6 bg-surface-container-highest"></div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps uppercase text-outline">Contraction</span>
              <span className="font-code-sm text-code-sm text-on-surface-variant">-2.3%</span>
            </div>
            <div className="w-px h-6 bg-surface-container-highest"></div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps uppercase text-outline">Churn</span>
              <span className="font-code-sm text-code-sm text-error">-1.4%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm pt-space-xs bg-surface-container-lowest/40 -mx-space-md -mb-space-md px-space-md py-space-xs">
            <span className="text-outline">Cohort Health</span>
            <span className="text-primary font-medium">Optimal (LTV/CAC 4.8x)</span>
          </div>
        </div>

        {/* Card 5: Data Quality Health */}
        <div className="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm relative overflow-hidden group border border-surface-container-high/30 hover:border-primary/40 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps uppercase text-outline">Telemetry Pipeline</span>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-metric-val text-metric-val text-primary tracking-tight">{quality.score}%</span>
                <span className="font-code-sm text-code-sm text-on-surface font-semibold">{quality.grade}</span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
            </div>
          </div>
          <div className="my-space-sm space-y-1">
            <div className="flex items-center justify-between font-code-sm text-code-sm">
              <span className="text-on-surface-variant">{rowCount} clean rows</span>
              <span className="text-primary">100% clean</span>
            </div>
            <div className="flex items-center justify-between font-code-sm text-code-sm">
              <span className="text-on-surface-variant">{anomalyCount} anomalies flagged</span>
              <span className="text-tertiary">{validationIssuesCount} rules checked</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm pt-space-xs bg-surface-container-lowest/40 -mx-space-md -mb-space-md px-space-md py-space-xs">
            <span className="text-outline">DuckDB AST</span>
            <span className="text-primary">Verified In-RAM</span>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE CHART WORKSPACE */}
      <div className="flex flex-col gap-space-md bg-surface-container-low p-space-md rounded-xl shadow-sm border border-surface-container-high/30">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md pb-space-md bg-surface-container-lowest/30 -mx-space-md -mt-space-md p-space-md rounded-t-xl border-b border-surface-container-high/30">
          <div className="flex items-center gap-space-sm flex-wrap">
            <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-1.5 rounded-lg border border-surface-container-high/40">
              <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
              <span className="font-label-caps text-label-caps uppercase text-outline">Period:</span>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-transparent font-code-sm text-code-sm text-on-surface focus:outline-none cursor-pointer"
              >
                <option className="bg-surface-container" value="FY2024">FY2024 YTD</option>
                <option className="bg-surface-container" value="Q3_2024">Q3 2024 Close</option>
                <option className="bg-surface-container" value="TTM">TTM (Trailing 12M)</option>
              </select>
            </div>

            <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-1.5 rounded-lg border border-surface-container-high/40">
              <span className="material-symbols-outlined text-[16px] text-tertiary">corporate_fare</span>
              <span className="font-label-caps text-label-caps uppercase text-outline">Tier:</span>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="bg-transparent font-code-sm text-code-sm text-on-surface focus:outline-none cursor-pointer"
              >
                <option className="bg-surface-container" value="ALL">All Segments (Consolidated)</option>
                <option className="bg-surface-container" value="ENT">Enterprise Tier ($100k+)</option>
                <option className="bg-surface-container" value="MM">Mid-Market ($20k-$100k)</option>
                <option className="bg-surface-container" value="SMB">SMB Self-Serve (&lt;$20k)</option>
              </select>
            </div>

            <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1.5 rounded-lg border border-surface-container-high/40">
              <span className="material-symbols-outlined text-[16px] text-outline">monetization_on</span>
              <span className="font-code-sm text-code-sm text-on-surface">$ USD</span>
            </div>
          </div>

          <div className="flex items-center bg-surface-container-lowest p-1 rounded-lg overflow-x-auto border border-surface-container-high/30">
            {[
              'Ranked SKUs',
              'Category Breakdown',
              'Temporal Trends',
              'Correlation Matrix',
              'Regressions & Clustering',
              'Anomaly Boxplots',
            ].map((pill) => {
              const isSelected = activeChartPill === pill;
              return (
                <button
                  key={pill}
                  onClick={() => setActiveChartPill(pill)}
                  className={`px-space-md py-1 rounded font-body-sm text-body-sm whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN VISUALIZATION ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Main Dual-Axis Chart (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container p-space-md rounded-xl flex flex-col justify-between gap-space-md shadow-sm border border-surface-container-high/30">
            <div className="flex items-start justify-between flex-wrap gap-space-sm">
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface">Dual-Axis Temporal Trajectory</span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-code-sm text-code-sm">
                    12-Month Inferred Rollup
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Monthly Gross Revenue ($M) juxtaposed against Gross Margin % trajectory with automated anomaly vector markers
                </p>
              </div>
              <div className="flex items-center gap-space-md flex-wrap">
                <div className="flex items-center gap-1.5 font-code-sm text-code-sm">
                  <span className="w-3 h-1.5 rounded-full bg-primary inline-block"></span>
                  <span className="text-on-surface-variant">Revenue ($M)</span>
                </div>
                <div className="flex items-center gap-1.5 font-code-sm text-code-sm">
                  <span className="w-3 h-0.5 bg-tertiary inline-block"></span>
                  <span className="text-on-surface-variant">Margin (%)</span>
                </div>
                <div className="flex items-center gap-1.5 font-code-sm text-code-sm">
                  <span className="w-2 h-2 rounded-full bg-error inline-block animate-pulse"></span>
                  <span className="text-error font-medium">Anomaly Point</span>
                </div>
              </div>
            </div>

            {/* SVG Trajectory Canvas */}
            <div className="w-full relative h-72 flex items-end">
              <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 760 260">
                <line stroke="#31353e" strokeDasharray="3 3" strokeWidth="0.75" x1="40" x2="740" y1="30" y2="30"></line>
                <line stroke="#31353e" strokeDasharray="3 3" strokeWidth="0.75" x1="40" x2="740" y1="85" y2="85"></line>
                <line stroke="#31353e" strokeDasharray="3 3" strokeWidth="0.75" x1="40" x2="740" y1="140" y2="140"></line>
                <line stroke="#31353e" strokeDasharray="3 3" strokeWidth="0.75" x1="40" x2="740" y1="195" y2="195"></line>
                <line stroke="#3e484f" strokeWidth="1" x1="40" x2="740" y1="230" y2="230"></line>

                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="32" y="34">$6.0M</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="32" y="89">$4.5M</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="32" y="144">$3.0M</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="32" y="199">$1.5M</text>

                <text fill="#a1d2ff" fontFamily="JetBrains Mono" fontSize="10" textAnchor="start" x="748" y="34">85%</text>
                <text fill="#a1d2ff" fontFamily="JetBrains Mono" fontSize="10" textAnchor="start" x="748" y="89">75%</text>
                <text fill="#a1d2ff" fontFamily="JetBrains Mono" fontSize="10" textAnchor="start" x="748" y="144">65%</text>
                <text fill="#a1d2ff" fontFamily="JetBrains Mono" fontSize="10" textAnchor="start" x="748" y="199">55%</text>

                <rect fill="#38bdf8" fillOpacity="0.35" height="100" rx="3" width="30" x="60" y="130" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>
                <rect fill="#38bdf8" fillOpacity="0.35" height="110" rx="3" width="30" x="118" y="120" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>
                <rect fill="#38bdf8" fillOpacity="0.45" height="125" rx="3" width="30" x="176" y="105" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>
                <rect fill="#38bdf8" fillOpacity="0.45" height="132" rx="3" width="30" x="234" y="98" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>
                <rect fill="#38bdf8" fillOpacity="0.5" height="140" rx="3" width="30" x="292" y="90" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>
                <rect fill="#38bdf8" fillOpacity="0.6" height="150" rx="3" width="30" x="350" y="80" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>
                <rect fill="#38bdf8" fillOpacity="0.6" height="155" rx="3" width="30" x="408" y="75" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>
                <rect fill="#38bdf8" fillOpacity="0.65" height="165" rx="3" width="30" x="466" y="65" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>
                <rect fill="#38bdf8" fillOpacity="0.7" height="170" rx="3" width="30" x="524" y="60" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>
                <rect fill="#38bdf8" fillOpacity="0.75" height="178" rx="3" width="30" x="582" y="52" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>
                <rect fill="#38bdf8" fillOpacity="0.85" height="192" rx="3" width="30" x="640" y="38" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>
                <rect fill="#38bdf8" fillOpacity="0.8" height="186" rx="3" width="30" x="698" y="44" className="hover:opacity-100 transition-opacity cursor-pointer"></rect>

                <path
                  d="M75,98 L133,92 L191,85 L249,82 L307,80 L365,74 L423,73 L481,71 L539,69 L597,67 L655,125 L713,70"
                  stroke="#a1d2ff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <path
                  d="M75,98 L133,92 L191,85 L249,82 L307,80 L365,74 L423,73 L481,71 L539,69 L597,67 L655,125 L713,70 L713,230 L75,230 Z"
                  fill="#a1d2ff"
                  fillOpacity="0.05"
                />

                <circle cx="655" cy="125" fill="#690005" r="7" stroke="#ffb4ab" strokeWidth="2"></circle>
                <circle cx="655" cy="125" fill="#ffb4ab" fillOpacity="0.25" r="14">
                  <animate attributeName="r" dur="2s" repeatCount="indefinite" values="10;18;10"></animate>
                  <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="0.6;0;0.6"></animate>
                </circle>

                <g transform="translate(560, 138)">
                  <rect fill="#181c24" height="34" rx="4" stroke="#ffb4ab" strokeWidth="1" width="135" x="0" y="0"></rect>
                  <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600" x="8" y="14">
                    NOV DISCOUNT BREACH
                  </text>
                  <text fill="#bdc8d1" fontFamily="Geist" fontSize="9" x="8" y="27">
                    Margin dipped to 58.2% (-15.8%)
                  </text>
                </g>

                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="75" y="247">Jan</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="133" y="247">Feb</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="191" y="247">Mar</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="249" y="247">Apr</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="307" y="247">May</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="365" y="247">Jun</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="423" y="247">Jul</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="481" y="247">Aug</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="539" y="247">Sep</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="597" y="247">Oct</text>
                <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" textAnchor="middle" x="655" y="247">Nov*</text>
                <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="713" y="247">Dec</text>
              </svg>
            </div>

            <div className="flex items-center justify-between gap-space-md pt-space-xs bg-surface-container-low p-space-sm rounded-lg border border-surface-container-high/20">
              <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">drag_indicator</span>
                <span>
                  Brush Selection:{' '}
                  <span className="text-on-surface font-semibold">Jan 01, 2024 - Dec 31, 2024</span>
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                {['1M', '3M', '6M', 'YTD', 'ALL'].map((range) => {
                  const isSelected = brushRange === range;
                  return (
                    <button
                      key={range}
                      onClick={() => setBrushRange(range)}
                      className={`px-space-xs py-0.5 rounded font-code-sm text-code-sm transition-colors ${
                        isSelected
                          ? 'bg-primary-container text-on-primary-container font-semibold'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                      }`}
                      type="button"
                    >
                      {range}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Secondary Panels (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between gap-space-sm shadow-sm border border-surface-container-high/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">format_list_numbered</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Top SKUs Margin Mix</span>
                </div>
                <span className="font-code-sm text-code-sm text-outline">Q4 Contribution</span>
              </div>

              <div className="space-y-space-sm pt-space-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-code-sm text-code-sm">
                    <span className="text-on-surface font-medium truncate">Enterprise Platform Tier 1</span>
                    <span className="text-primary">$18.4M • <span className="text-tertiary">84% GM</span></span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden flex">
                    <div className="bg-primary h-full rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-code-sm text-code-sm">
                    <span className="text-on-surface font-medium truncate">Cloud AI Vector Add-on</span>
                    <span className="text-primary">$11.2M • <span className="text-tertiary">78% GM</span></span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden flex">
                    <div className="bg-tertiary h-full rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-code-sm text-code-sm">
                    <span className="text-on-surface font-medium truncate">Dedicated Tenant SLA</span>
                    <span className="text-primary">$8.6M • <span className="text-tertiary">66% GM</span></span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden flex">
                    <div className="bg-tertiary h-full rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>

                <div className="space-y-1 p-space-xs bg-error-container/30 rounded-lg border border-error/20">
                  <div className="flex justify-between font-code-sm text-code-sm">
                    <span className="text-error font-semibold truncate flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">arrow_downward</span>
                      Ultrabook X1 Edge Node
                    </span>
                    <span className="text-error font-medium">$4.1M • <span className="underline">-12% GM</span></span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden flex">
                    <div className="bg-error h-full rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="font-code-sm text-code-sm text-error/90 block pt-0.5">
                    ⚠️ Loss Leader: Subsidized edge hardware contract
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-code-sm text-code-sm">
                    <span className="text-on-surface font-medium truncate">Professional Migrations</span>
                    <span className="text-on-surface-variant">$3.2M • <span className="text-on-surface-variant">42% GM</span></span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden flex">
                    <div className="bg-surface-bright h-full rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* MRR Cohort Decomposition */}
            <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between gap-space-sm shadow-sm border border-surface-container-high/30">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface">MRR Cohort Decomposition</span>
                <span className="font-code-sm text-code-sm text-primary">+$1.48M Net</span>
              </div>
              <div className="flex items-center gap-space-md">
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" fill="transparent" r="14" stroke="#262a33" strokeWidth="3.5"></circle>
                    <circle
                      cx="18"
                      cy="18"
                      fill="transparent"
                      r="14"
                      stroke="#38bdf8"
                      strokeDasharray="57.1 88"
                      strokeDashoffset="0"
                      strokeWidth="3.5"
                    ></circle>
                    <circle
                      cx="18"
                      cy="18"
                      fill="transparent"
                      r="14"
                      stroke="#a1d2ff"
                      strokeDasharray="22 88"
                      strokeDashoffset="-57.1"
                      strokeWidth="3.5"
                    ></circle>
                    <circle
                      cx="18"
                      cy="18"
                      fill="transparent"
                      r="14"
                      stroke="#ffb4ab"
                      strokeDasharray="8.8 88"
                      strokeDashoffset="-79.1"
                      strokeWidth="3.5"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-label-caps text-label-caps uppercase text-outline">Net</span>
                    <span className="font-code-sm text-code-sm text-on-surface font-semibold">+82%</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 font-code-sm text-code-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-on-surface-variant">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Expansions
                    </span>
                    <span className="text-on-surface font-medium">$1.12M (65%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-on-surface-variant">
                      <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span> New Acquisition
                    </span>
                    <span className="text-on-surface font-medium">$430k (25%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-on-surface-variant">
                      <span className="w-2 h-2 rounded-full bg-error inline-block"></span> Net Churn & Downgrade
                    </span>
                    <span className="text-error font-medium">-$170k (10%)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-code-sm text-code-sm bg-surface-container-lowest/40 -mx-space-md -mb-space-md px-space-md py-space-xs rounded-b-xl">
                <span>Net Gross Retention: 98.6%</span>
                <span className="text-tertiary">Quick Ratio: 9.1x</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COLLAPSIBLE DATA PROFILER DRAWER */}
      <div className="flex flex-col bg-surface-container-low rounded-xl shadow-sm overflow-hidden border border-surface-container-high/30">
        <div
          onClick={() => setIsProfilerOpen(!isProfilerOpen)}
          className="flex flex-col md:flex-row md:items-center justify-between gap-space-md p-space-md bg-surface-container cursor-pointer select-none hover:bg-surface-container-high transition-colors"
        >
          <div className="flex items-center gap-space-md">
            <div className="p-space-xs rounded bg-surface-container-highest text-primary">
              <span className="material-symbols-outlined text-[20px]">database</span>
            </div>
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Data Profiler & In-Memory Schema Diagnostics
                </span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-code-sm text-code-sm">
                  table: {status?.active_dataset || 'dataset'}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {profilerCols.length} inferred schema attributes • {rowCount} rows processed • SIMD vectorized DuckDB execution engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onRunAnomalyScan}
              className="flex items-center gap-space-xs px-space-md py-1 rounded bg-primary text-on-primary hover:bg-surface-tint font-body-sm text-body-sm font-semibold transition-colors shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">radar</span>
              <span>Run Anomaly Scan</span>
            </button>
            <span
              onClick={() => setIsProfilerOpen(!isProfilerOpen)}
              className="material-symbols-outlined text-outline transition-transform duration-200 cursor-pointer"
              style={{ transform: isProfilerOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
            >
              expand_less
            </span>
          </div>
        </div>

        {isProfilerOpen && (
          <div className="p-space-md flex flex-col gap-space-md transition-all">
            <div className="overflow-x-auto rounded-lg shadow-sm border border-surface-container-high/30">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container-lowest text-outline font-label-caps text-label-caps uppercase">
                  <tr>
                    <th className="py-space-sm px-space-md">Column Identifier</th>
                    <th className="py-space-sm px-space-md">Data Type</th>
                    <th className="py-space-sm px-space-md">Null Count (%)</th>
                    <th className="py-space-sm px-space-md">Cardinality (Distinct)</th>
                    <th className="py-space-sm px-space-md">Mean / Center</th>
                    <th className="py-space-sm px-space-md">IQR (Spread)</th>
                    <th className="py-space-sm px-space-md">Outlier Status</th>
                    <th className="py-space-sm px-space-md text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest/20 font-code-md text-code-md">
                  {profilerCols.map((col) => (
                    <tr key={col.id} className="hover:bg-primary/5 transition-colors">
                      <td className="py-space-sm px-space-md text-on-surface font-semibold flex items-center gap-1.5">
                        <span className={`material-symbols-outlined text-[14px] ${col.iconColor}`}>{col.icon}</span>
                        {col.id}
                      </td>
                      <td className="py-space-sm px-space-md text-primary">{col.type}</td>
                      <td className="py-space-sm px-space-md text-on-surface-variant">{col.nullCount}</td>
                      <td className="py-space-sm px-space-md text-on-surface">{col.cardinality}</td>
                      <td className="py-space-sm px-space-md text-on-surface">{col.mean}</td>
                      <td className="py-space-sm px-space-md text-on-surface-variant">{col.iqr}</td>
                      <td className="py-space-sm px-space-md">
                        <span className={`px-space-xs py-0.5 rounded font-code-sm text-code-sm ${col.outlierClass}`}>
                          {col.outlier}
                        </span>
                      </td>
                      <td className="py-space-sm px-space-md text-right">
                        <button
                          onClick={() => onInspectColumn(col)}
                          className="text-tertiary hover:underline font-code-sm text-code-sm cursor-pointer"
                          type="button"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between p-space-md rounded-lg bg-surface-container-lowest gap-space-md border border-surface-container-high/30">
              <div className="flex items-center gap-space-md">
                <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-error shrink-0">
                  <span className="material-symbols-outlined text-[18px]">rule</span>
                </div>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      Automated Anomaly Resolution Agent
                    </span>
                    <span className="px-space-xs py-0.5 rounded bg-surface-container text-primary font-code-sm text-code-sm">
                      LangGraph Guardrail
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {anomalyCount} runtime anomalies detected via Z-score & IQR outlier detection.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-sm shrink-0">
                <button
                  onClick={onDownloadCleanCsv}
                  className="px-space-md py-1 rounded bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-body-sm text-body-sm font-semibold transition-colors"
                  type="button"
                >
                  Download Clean CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

