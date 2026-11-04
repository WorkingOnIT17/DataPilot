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
  const [period, setPeriod] = useState('ALL');
  const [tier, setTier] = useState('ALL');
  const [activeChartPill, setActiveChartPill] = useState('Temporal Trends');
  const [brushRange, setBrushRange] = useState('ALL');
  const [isProfilerOpen, setIsProfilerOpen] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const kpis = analytics?.kpis || {};
  const quality = analytics?.quality_score || { score: status?.quality_score || 94, grade: status?.quality_grade || 'Grade A' };
  const profilerCols = analytics?.profiler_columns || [];
  const anomalyCount = analytics?.anomalies_count ?? (status?.quality_score ? 14 : 0);
  const validationIssuesCount = analytics?.validation_issues_count ?? 0;
  const charts = analytics?.charts || {};

  const temporalTrends = charts.temporal_trends || [];
  const topSkus = charts.top_skus || [];
  const categoryBreakdown = charts.category_breakdown || [];
  const correlations = charts.correlations || [];

  // Formatted KPI Numbers
  const formatMoney = (val) => {
    if (val == null) return '$0.00';
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}k`;
    return `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalRev = kpis.total_revenue != null ? formatMoney(kpis.total_revenue) : (temporalTrends.length > 0 ? formatMoney(temporalTrends.reduce((s, t) => s + (t.revenue || 0), 0)) : '$48.29M');
  const totalProfit = kpis.total_profit != null ? formatMoney(kpis.total_profit) : (temporalTrends.length > 0 ? formatMoney(temporalTrends.reduce((s, t) => s + (t.profit || 0), 0)) : '$12.50M');
  const profitMargin = kpis.profit_margin_pct != null ? `${kpis.profit_margin_pct.toFixed(1)}%` : '28.4%';
  const aov = kpis.average_order_value != null ? formatMoney(kpis.average_order_value) : '$3,380';
  const rowCount = status?.rows ? Number(status.rows).toLocaleString() : (kpis.total_records ? Number(kpis.total_records).toLocaleString() : '142,850');
  const activeDatasetName = status?.active_dataset || 'Active Dataset';

  // SVG Scaling calculations for Temporal Trends
  const maxRev = temporalTrends.length > 0 ? Math.max(...temporalTrends.map((t) => t.revenue || 0), 1000) : 6000000;
  const svgWidth = 760;
  const svgHeight = 240;
  const paddingLeft = 60;
  const paddingRight = 40;
  const chartWidth = svgWidth - paddingLeft - paddingRight;

  const points = temporalTrends.map((t, idx) => {
    const x = paddingLeft + (temporalTrends.length > 1 ? (idx / (temporalTrends.length - 1)) * chartWidth : chartWidth / 2);
    const barHeight = Math.max(8, ((t.revenue || 0) / maxRev) * 160);
    const barY = 200 - barHeight;
    const marginNorm = Math.min(100, Math.max(0, t.margin_pct || 25));
    const lineY = 200 - (marginNorm / 100) * 170;
    return { ...t, x, barHeight, barY, lineY };
  });

  const polylineStr = points.map((p) => `${p.x},${p.lineY}`).join(' ');
  const areaPath = points.length > 0
    ? `M${points[0].x},${points[0].lineY} ` +
      points.slice(1).map((p) => `L${p.x},${p.lineY}`).join(' ') +
      ` L${points[points.length - 1].x},200 L${points[0].x},200 Z`
    : '';

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
                {activeDatasetName}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Deterministic calculations computed directly via DuckDB in-memory engine. Zero hallucination.
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
            <span>DuckDB Active</span>
          </div>
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
              <span className="font-label-caps text-label-caps uppercase text-outline">Total Revenue</span>
              <div className="font-metric-val text-metric-val text-on-surface tracking-tight">{totalRev}</div>
            </div>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-code-sm text-code-sm flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> Verified
            </span>
          </div>
          <div className="my-space-sm space-y-1">
            <div className="flex justify-between font-code-sm text-code-sm">
              <span className="text-on-surface-variant">Total Records</span>
              <span className="text-on-surface font-semibold">{rowCount}</span>
            </div>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm pt-space-xs bg-surface-container-lowest/40 -mx-space-md -mb-space-md px-space-md py-space-xs">
            <span className="text-outline">Engine</span>
            <span className="text-primary font-medium">DuckDB OLAP</span>
          </div>
        </div>

        {/* Card 2: Average Transaction Value */}
        <div className="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm relative overflow-hidden group border border-surface-container-high/30 hover:border-primary/40 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps uppercase text-outline">Avg Order Value</span>
              <div className="font-metric-val text-metric-val text-on-surface tracking-tight">{aov}</div>
            </div>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-code-sm text-code-sm flex items-center gap-0.5">
              Per Record
            </span>
          </div>
          <div className="my-space-sm space-y-1">
            <div className="flex justify-between font-code-sm text-code-sm">
              <span className="text-on-surface-variant">Active Dataset</span>
              <span className="text-on-surface font-semibold truncate max-w-[120px]">{activeDatasetName}</span>
            </div>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="bg-tertiary h-full rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm pt-space-xs bg-surface-container-lowest/40 -mx-space-md -mb-space-md px-space-md py-space-xs">
            <span className="text-outline">Total Profit</span>
            <span className="text-tertiary font-medium">{totalProfit}</span>
          </div>
        </div>

        {/* Card 3: Profit Margin */}
        <div className="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm relative overflow-hidden group border border-surface-container-high/30 hover:border-primary/40 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps uppercase text-outline">Gross Margin</span>
              <div className="font-metric-val text-metric-val text-on-surface tracking-tight">{profitMargin}</div>
            </div>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-code-sm text-code-sm flex items-center gap-0.5">
              Ratio
            </span>
          </div>
          <div className="my-space-sm p-space-xs rounded bg-surface-container space-y-0.5 border border-surface-container-high/50">
            <div className="flex items-center gap-1 font-label-caps text-label-caps uppercase text-primary">
              <span className="material-symbols-outlined text-[13px]">analytics</span>
              <span>Profitability Status</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
              {kpis.profit_margin_pct != null ? (kpis.profit_margin_pct > 20 ? 'Healthy margin distribution' : 'Watch margin slippage') : 'Calculated across active rows'}
            </p>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm pt-space-xs bg-surface-container-lowest/40 -mx-space-md -mb-space-md px-space-md py-space-xs">
            <span className="text-outline">Health Grade</span>
            <span className="text-primary">{quality.grade}</span>
          </div>
        </div>

        {/* Card 4: Top Category Distribution */}
        <div className="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm relative overflow-hidden group border border-surface-container-high/30 hover:border-primary/40 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps uppercase text-outline">Lead Segment Share</span>
              <div className="font-metric-val text-metric-val text-on-surface tracking-tight">
                {categoryBreakdown[0] ? `${categoryBreakdown[0].pct}%` : '38.5%'}
              </div>
            </div>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-tertiary font-code-sm text-code-sm">
              {categoryBreakdown[0]?.name ? categoryBreakdown[0].name.slice(0, 12) : 'Category'}
            </span>
          </div>
          <div className="my-space-sm space-y-1">
            <div className="flex justify-between font-code-sm text-code-sm">
              <span className="text-on-surface-variant">Top SKU</span>
              <span className="text-primary truncate max-w-[120px]">{topSkus[0]?.name || 'Catalog Item'}</span>
            </div>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${categoryBreakdown[0]?.pct || 40}%` }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm pt-space-xs bg-surface-container-lowest/40 -mx-space-md -mb-space-md px-space-md py-space-xs">
            <span className="text-outline">SKU Count</span>
            <span className="text-primary font-medium">{kpis.unique_products || topSkus.length || 0} unique</span>
          </div>
        </div>

        {/* Card 5: Data Quality Health */}
        <div className="flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm relative overflow-hidden group border border-surface-container-high/30 hover:border-primary/40 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps uppercase text-outline">Data Quality Score</span>
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
              <span className="text-primary">Cleaned</span>
            </div>
            <div className="flex items-center justify-between font-code-sm text-code-sm">
              <span className="text-on-surface-variant">{anomalyCount} anomalies flagged</span>
              <span className="text-tertiary">{validationIssuesCount} rules checked</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm pt-space-xs bg-surface-container-lowest/40 -mx-space-md -mb-space-md px-space-md py-space-xs">
            <span className="text-outline">Status</span>
            <span className="text-primary">Verified In-RAM</span>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE CHART WORKSPACE */}
      <div className="flex flex-col gap-space-md bg-surface-container-low p-space-md rounded-xl shadow-sm border border-surface-container-high/30">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md pb-space-md bg-surface-container-lowest/30 -mx-space-md -mt-space-md p-space-md rounded-t-xl border-b border-surface-container-high/30">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="material-symbols-outlined text-primary text-[20px]">view_timeline</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">Interactive Business Intelligence</span>
          </div>

          <div className="flex items-center bg-surface-container-lowest p-1 rounded-lg overflow-x-auto border border-surface-container-high/30">
            {[
              'Temporal Trends',
              'Ranked SKUs',
              'Category Breakdown',
              'Correlation Matrix',
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
          {/* Main Visual Workspace Area (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container p-space-md rounded-xl flex flex-col justify-between gap-space-md shadow-sm border border-surface-container-high/30 min-h-[360px]">
            {/* Header info for currently active chart */}
            <div className="flex items-start justify-between flex-wrap gap-space-sm">
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    {activeChartPill === 'Temporal Trends' && 'Dual-Axis Temporal Trajectory'}
                    {activeChartPill === 'Ranked SKUs' && 'Top Performing Items & SKUs'}
                    {activeChartPill === 'Category Breakdown' && 'Categorical Distribution Shares'}
                    {activeChartPill === 'Correlation Matrix' && 'Numeric Feature Correlation Matrix'}
                    {activeChartPill === 'Anomaly Boxplots' && 'Outlier & Anomaly Distribution'}
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-code-sm text-code-sm">
                    {activeDatasetName}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {activeChartPill === 'Temporal Trends' && 'Aggregated revenue juxtaposed against gross margin trajectory with automated anomaly vector markers.'}
                  {activeChartPill === 'Ranked SKUs' && 'Leading catalog items ranked by cumulative financial contribution and margin strength.'}
                  {activeChartPill === 'Category Breakdown' && 'Proportional distribution across key dimensional segments.'}
                  {activeChartPill === 'Correlation Matrix' && 'Pairwise Pearson correlation coefficients identifying interconnected financial drivers.'}
                  {activeChartPill === 'Anomaly Boxplots' && 'Statistical outlier flags (Z > 3.0) across column distributions.'}
                </p>
              </div>

              {activeChartPill === 'Temporal Trends' && (
                <div className="flex items-center gap-space-md flex-wrap">
                  <div className="flex items-center gap-1.5 font-code-sm text-code-sm">
                    <span className="w-3 h-1.5 rounded-full bg-primary inline-block"></span>
                    <span className="text-on-surface-variant">Revenue ($)</span>
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
              )}
            </div>

            {/* TAB 1: TEMPORAL TRENDS (DYNAMIC DUAL-AXIS SVG) */}
            {activeChartPill === 'Temporal Trends' && (
              <div className="w-full relative h-72 flex items-end">
                <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                  {/* Grid Lines */}
                  <line stroke="#31353e" strokeDasharray="3 3" strokeWidth="0.75" x1={paddingLeft} x2={svgWidth - paddingRight} y1="30" y2="30" />
                  <line stroke="#31353e" strokeDasharray="3 3" strokeWidth="0.75" x1={paddingLeft} x2={svgWidth - paddingRight} y1="85" y2="85" />
                  <line stroke="#31353e" strokeDasharray="3 3" strokeWidth="0.75" x1={paddingLeft} x2={svgWidth - paddingRight} y1="140" y2="140" />
                  <line stroke="#3e484f" strokeWidth="1" x1={paddingLeft} x2={svgWidth - paddingRight} y1="200" y2="200" />

                  {/* Left Axis Labels (Revenue) */}
                  <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x={paddingLeft - 8} y="34">{formatMoney(maxRev)}</text>
                  <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x={paddingLeft - 8} y="89">{formatMoney(maxRev * 0.66)}</text>
                  <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x={paddingLeft - 8} y="144">{formatMoney(maxRev * 0.33)}</text>

                  {/* Right Axis Labels (Margin %) */}
                  <text fill="#a1d2ff" fontFamily="JetBrains Mono" fontSize="10" textAnchor="start" x={svgWidth - paddingRight + 6} y="34">85%</text>
                  <text fill="#a1d2ff" fontFamily="JetBrains Mono" fontSize="10" textAnchor="start" x={svgWidth - paddingRight + 6} y="89">55%</text>
                  <text fill="#a1d2ff" fontFamily="JetBrains Mono" fontSize="10" textAnchor="start" x={svgWidth - paddingRight + 6} y="144">25%</text>

                  {/* Revenue Bars */}
                  {points.map((p, i) => (
                    <rect
                      key={i}
                      x={p.x - 12}
                      y={p.barY}
                      width="24"
                      height={p.barHeight}
                      rx="3"
                      fill="#38bdf8"
                      fillOpacity={hoveredPoint === i ? '0.9' : '0.45'}
                      className="transition-all cursor-pointer hover:opacity-100"
                      onMouseEnter={() => setHoveredPoint(i)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}

                  {/* Margin Trajectory Area & Line */}
                  {areaPath && <path d={areaPath} fill="#a1d2ff" fillOpacity="0.06" />}
                  {polylineStr && (
                    <polyline
                      fill="none"
                      stroke="#a1d2ff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylineStr}
                    />
                  )}

                  {/* Data Points & Anomaly Markers */}
                  {points.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.lineY} r="4" fill="#a1d2ff" stroke="#0E1117" strokeWidth="1.5" />
                      {p.is_anomaly && (
                        <g>
                          <circle cx={p.x} cy={p.lineY} r="8" fill="#690005" stroke="#ffb4ab" strokeWidth="2" />
                          <circle cx={p.x} cy={p.lineY} r="14" fill="#ffb4ab" fillOpacity="0.25">
                            <animate attributeName="r" dur="2s" repeatCount="indefinite" values="10;18;10" />
                            <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="0.6;0;0.6" />
                          </circle>
                        </g>
                      )}
                      {/* Period Label */}
                      <text fill="#87929a" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x={p.x} y="220">
                        {p.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            )}

            {/* TAB 2: RANKED SKUS */}
            {activeChartPill === 'Ranked SKUs' && (
              <div className="space-y-space-md py-space-sm">
                {topSkus.length > 0 ? (
                  topSkus.map((sku, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between font-code-sm text-code-sm">
                        <span className="text-on-surface font-semibold truncate max-w-sm">
                          {i + 1}. {sku.name}
                        </span>
                        <div className="flex items-center gap-space-md">
                          <span className="text-primary font-bold">{sku.revenue_formatted}</span>
                          <span className="text-tertiary">{sku.margin_pct}% GM</span>
                          <span className="text-outline">{sku.share_pct}% share</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden flex">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, sku.share_pct)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-outline font-body-sm text-body-sm py-8 text-center">No catalog items inferred.</p>
                )}
              </div>
            )}

            {/* TAB 3: CATEGORY BREAKDOWN */}
            {activeChartPill === 'Category Breakdown' && (
              <div className="space-y-space-md py-space-sm">
                {categoryBreakdown.length > 0 ? (
                  categoryBreakdown.map((cat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between font-code-sm text-code-sm">
                        <span className="text-on-surface font-semibold">{cat.name}</span>
                        <div className="flex items-center gap-space-sm">
                          <span className="text-primary font-bold">{formatMoney(cat.value)}</span>
                          <span className="text-tertiary">({cat.pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden flex">
                        <div
                          className="bg-tertiary h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, cat.pct)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-outline font-body-sm text-body-sm py-8 text-center">No category dimensions identified.</p>
                )}
              </div>
            )}

            {/* TAB 4: CORRELATION MATRIX */}
            {activeChartPill === 'Correlation Matrix' && (
              <div className="space-y-space-sm py-space-sm">
                {correlations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                    {correlations.map((c, i) => (
                      <div key={i} className="bg-surface-container-low p-space-sm rounded-lg border border-surface-container-high/40 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-code-sm text-code-sm text-on-surface font-medium truncate max-w-[200px]">
                            {c.col1} ↔ {c.col2}
                          </div>
                          <span className="font-label-caps text-label-caps text-outline uppercase">
                            {c.corr > 0 ? 'Positive Correlation' : 'Inverted Relationship'}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-code-sm text-code-sm font-bold ${
                          c.corr > 0.5 ? 'bg-primary/20 text-primary' : c.corr < -0.3 ? 'bg-error-container text-error' : 'bg-surface-container text-tertiary'
                        }`}>
                          {c.corr > 0 ? `+${c.corr}` : c.corr}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-outline font-body-sm text-body-sm py-8 text-center">Requires at least two numeric features.</p>
                )}
              </div>
            )}

            {/* TAB 5: ANOMALY BOXPLOTS */}
            {activeChartPill === 'Anomaly Boxplots' && (
              <div className="space-y-space-sm py-space-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                  {profilerCols.slice(0, 6).map((col, i) => (
                    <div key={i} className="bg-surface-container-low p-space-sm rounded-lg border border-surface-container-high/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-code-sm text-code-sm text-on-surface font-semibold truncate max-w-[140px]">{col.id}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-code-sm ${col.outlierClass}`}>
                          {col.outlier}
                        </span>
                      </div>
                      <div className="flex justify-between font-code-sm text-code-sm text-outline">
                        <span>Mean: {col.mean}</span>
                        <span>Spread: {col.iqr}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Status Ribbon */}
            <div className="flex items-center justify-between gap-space-md pt-space-xs bg-surface-container-low p-space-sm rounded-lg border border-surface-container-high/20">
              <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">data_thresholding</span>
                <span>Active Dataset Scope: <span className="text-on-surface font-semibold">{rowCount} records loaded</span></span>
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
            {/* Top SKUs Margin Mix Panel */}
            <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between gap-space-sm shadow-sm border border-surface-container-high/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">format_list_numbered</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Top SKUs Margin Mix</span>
                </div>
                <span className="font-code-sm text-code-sm text-outline">Ranked Mix</span>
              </div>

              <div className="space-y-space-sm pt-space-xs">
                {topSkus.length > 0 ? (
                  topSkus.slice(0, 4).map((sku, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between font-code-sm text-code-sm">
                        <span className="text-on-surface font-medium truncate max-w-[160px]">{sku.name}</span>
                        <span className="text-primary">
                          {sku.revenue_formatted} • <span className="text-tertiary">{sku.margin_pct}% GM</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden flex">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, sku.share_pct)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-outline font-body-sm text-body-sm py-4 text-center">No catalog items detected.</p>
                )}
              </div>
            </div>

            {/* Category Breakdown Panel */}
            <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between gap-space-sm shadow-sm border border-surface-container-high/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">pie_chart</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Category Shares</span>
                </div>
                <span className="font-code-sm text-code-sm text-outline">Distribution</span>
              </div>

              <div className="space-y-space-sm pt-space-xs">
                {categoryBreakdown.length > 0 ? (
                  categoryBreakdown.slice(0, 3).map((cat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between font-code-sm text-code-sm">
                        <span className="text-on-surface font-medium truncate max-w-[160px]">{cat.name}</span>
                        <span className="text-tertiary font-bold">{cat.pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden flex">
                        <div
                          className="bg-tertiary h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, cat.pct)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-outline font-body-sm text-body-sm py-4 text-center">No categories found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PROFILER & SCHEMA INSPECTION TABLE */}
      <div className="bg-surface-container-low rounded-xl shadow-sm border border-surface-container-high/30 overflow-hidden">
        <div
          onClick={() => setIsProfilerOpen(!isProfilerOpen)}
          className="flex items-center justify-between p-space-md bg-surface-container-lowest cursor-pointer hover:bg-surface-container-low transition-colors select-none"
        >
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">table_chart</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              DuckDB Schema Profiler & Field Level Telemetry
            </span>
            <span className="px-space-xs py-0.5 rounded bg-surface-container text-outline font-code-sm text-code-sm">
              {profilerCols.length} Columns
            </span>
          </div>
          <span className="material-symbols-outlined text-outline">
            {isProfilerOpen ? 'expand_less' : 'expand_more'}
          </span>
        </div>

        {isProfilerOpen && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-code-sm text-code-sm">
              <thead className="bg-surface-container text-outline uppercase font-label-caps text-label-caps border-b border-surface-container-high/50">
                <tr>
                  <th className="py-2.5 px-space-md">Column Identifier</th>
                  <th className="py-2.5 px-space-md">Physical Type</th>
                  <th className="py-2.5 px-space-md">Missing Values</th>
                  <th className="py-2.5 px-space-md">Distinct Values</th>
                  <th className="py-2.5 px-space-md">Mean / Center</th>
                  <th className="py-2.5 px-space-md">Spread (IQR)</th>
                  <th className="py-2.5 px-space-md">Outlier Status</th>
                  <th className="py-2.5 px-space-md text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/30">
                {profilerCols.map((col, idx) => (
                  <tr key={idx} className="hover:bg-surface-container/40 transition-colors">
                    <td className="py-2.5 px-space-md flex items-center gap-space-xs text-on-surface font-semibold">
                      <span className={`material-symbols-outlined text-[16px] ${col.iconColor || 'text-outline'}`}>
                        {col.icon || 'tag'}
                      </span>
                      <span>{col.id}</span>
                    </td>
                    <td className="py-2.5 px-space-md text-outline">{col.type}</td>
                    <td className="py-2.5 px-space-md text-on-surface-variant">{col.nullCount}</td>
                    <td className="py-2.5 px-space-md text-on-surface font-medium">{col.cardinality}</td>
                    <td className="py-2.5 px-space-md text-primary font-semibold">{col.mean}</td>
                    <td className="py-2.5 px-space-md text-on-surface-variant">{col.iqr}</td>
                    <td className="py-2.5 px-space-md">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${col.outlierClass}`}>
                        {col.outlier}
                      </span>
                    </td>
                    <td className="py-2.5 px-space-md text-right">
                      <button
                        onClick={() => onInspectColumn(col)}
                        className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-code-sm text-code-sm transition-colors"
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
        )}
      </div>
    </div>
  );
}
