import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';
import { C, type TrendMetric } from '../data';
import type { LunaCtx } from '../Layout';
import { Eyebrow, StatusPill } from '../atoms';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';

const MetricCard: React.FC<{ m: TrendMetric }> = ({ m }) => {
  // Direction is inferred by comparing the first to the last value of the trend line.
  // For each column we approximate a delta vs the previous period in the cols array.
  const arrowFor = (idx: number): string => {
    if (idx === 0) return '→';
    const prev = parseFloat(m.cols[idx - 1].v);
    const curr = parseFloat(m.cols[idx].v);
    if (Number.isNaN(prev) || Number.isNaN(curr) || curr === prev) return '→';
    return curr > prev ? '↑' : '↓';
  };

  // Build chart data from the trend line. Map evenly across 90d → today.
  const n = m.line.length;
  const chartData = m.line.map((v, i) => {
    // i=0 is oldest (90d ago), i=n-1 is today
    const daysAgo = Math.round((1 - i / (n - 1)) * 90);
    const label =
      i === 0 ? '90d' :
      i === n - 1 ? 'now' :
      daysAgo <= 32 && daysAgo >= 28 ? '30d' :
      daysAgo <= 62 && daysAgo >= 58 ? '60d' : '';
    return { i, v, label, period: i === n - 1 ? 'today' : `${daysAgo}d ago` };
  });
  const min = Math.min(...m.line);
  const max = Math.max(...m.line);
  const pad = (max - min) * 0.25 || Math.abs(max) * 0.1 || 1;
  const baseline = m.line[0];
  const last = m.line[n - 1];
  const gradId = `grad-${m.label.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <div className="luna-card p-5">
      <Eyebrow>{m.label}</Eyebrow>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="mono text-[26px] font-semibold text-slate-800">{m.current}</span>
      </div>
      <span
        className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
        style={{ background: m.badgeColor.bg, color: m.badgeColor.fg }}
      >
        {m.badge}
      </span>
      <div className="mt-4 h-[80px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 28, bottom: 14, left: 28 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={m.stroke} stopOpacity={0.22} />
                <stop offset="100%" stopColor={m.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis hide domain={[min - pad, max + pad]} />
            <ReferenceLine
              y={baseline}
              stroke={m.stroke}
              strokeDasharray="2 3"
              strokeOpacity={0.35}
            />
            <Tooltip
              cursor={{ stroke: m.stroke, strokeOpacity: 0.3, strokeWidth: 1 }}
              contentStyle={{
                fontSize: 11,
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #E2E8F0',
                background: '#fff',
              }}
              labelFormatter={(_l, p) => (p && p[0] ? (p[0].payload as any).period : '')}
              formatter={(v: any) => [v, m.label]}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={m.stroke}
              strokeWidth={2}
              fill={`url(#${gradId})`}
              dot={false}
              activeDot={{ r: 3, fill: m.stroke }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <span
          className="absolute mono text-[10px] font-semibold"
          style={{ left: 0, top: 0, color: m.stroke }}
        >
          {baseline}
        </span>
        <span
          className="absolute mono text-[10px] font-semibold"
          style={{ right: 0, top: 0, color: m.stroke }}
        >
          {last}
        </span>
      </div>
      <div className="mt-5 pt-3 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-2">
          {m.cols.map((c, i) => (
            <div key={c.p} className="text-center">
              <div className="eyebrow text-slate-400">{c.p}</div>
              <div className="mono text-[14px] font-semibold text-slate-800 mt-1">{c.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Biomarkers() {
  const ctx = useOutletContext<LunaCtx>();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ctx.data.trends.map((m) => <MetricCard key={m.label} m={m} />)}
      </div>

      <div className="luna-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Eyebrow>Blood panel</Eyebrow>
            <div className="text-[15px] font-semibold text-slate-800 mt-1">{ctx.data.bloodDate}</div>
          </div>
          <button
            onClick={() => toast('Upload coming soon', { description: 'New panel uploads will be enabled in the next release.' })}
            className="text-[12.5px] font-medium hover:underline"
            style={{ color: C.indigo }}
          >
            + Upload new panel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-left text-[10.5px] uppercase tracking-wide text-slate-500 border-b border-slate-100">
                <th className="py-2 pr-4 font-semibold">Marker</th>
                <th className="py-2 pr-4 font-semibold">Result</th>
                <th className="py-2 pr-4 font-semibold">Reference Range</th>
                <th className="py-2 pr-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {ctx.data.blood.map((b) => (
                <tr key={b.k} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 pr-4 text-slate-700">{b.k}</td>
                  <td className="py-2.5 pr-4 mono font-semibold text-slate-800">{b.v}</td>
                  <td className="py-2.5 pr-4 mono text-slate-500">{b.r}</td>
                  <td className="py-2.5 pr-4"><StatusPill s={b.s} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {ctx.data.bloodWarning && (
          <div
            className="mt-4 p-3 rounded-lg text-[12.5px]"
            style={{ background: '#FFFBEB', borderLeft: `3px solid ${C.low}`, color: '#92400E' }}
          >
            {ctx.data.bloodWarning}
          </div>
        )}
      </div>
    </div>
  );
}
