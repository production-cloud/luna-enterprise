import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { C, BLOOD } from '../data';
import { Eyebrow, StatusPill } from '../atoms';

type Metric = {
  label: string; current: string; badge: string; badgeColor: { bg: string; fg: string };
  cols: Array<{ p: string; v: string }>; line: number[]; stroke: string;
};

const METRICS: Metric[] = [
  {
    label: 'HRV', current: '48 ms',
    badge: '+26% improvement', badgeColor: { bg: '#ECFDF5', fg: '#065F46' },
    cols: [{ p: '90d', v: '40' }, { p: '60d', v: '44' }, { p: '30d', v: '48' }],
    line: [40, 41, 42, 43, 44, 45, 46, 47, 48], stroke: C.ok,
  },
  {
    label: 'Resting HR', current: '62 bpm',
    badge: 'Stable, healthy', badgeColor: { bg: '#EEF2FF', fg: '#3730A3' },
    cols: [{ p: '90d', v: '64' }, { p: '60d', v: '63' }, { p: '30d', v: '62' }],
    line: [64, 64, 63, 63, 62, 63, 62, 62, 62], stroke: C.indigo,
  },
  {
    label: 'Stress Score', current: '41',
    badge: '−21% over 90d', badgeColor: { bg: '#FFFBEB', fg: '#92400E' },
    cols: [{ p: '90d', v: '52' }, { p: '60d', v: '46' }, { p: '30d', v: '41' }],
    line: [52, 50, 48, 47, 46, 44, 43, 42, 41], stroke: C.low,
  },
];

const MetricCard: React.FC<{ m: Metric }> = ({ m }) => {
  const data = m.line.map((v, i) => ({ i, v }));
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
      <div className="grid grid-cols-3 gap-2 mt-4">
        {m.cols.map((c) => (
          <div key={c.p} className="text-center">
            <div className="eyebrow text-slate-400">{c.p}</div>
            <div className="mono text-[13px] font-semibold text-slate-700 mt-0.5">{c.v}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 50 }} className="mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="v" stroke={m.stroke} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function Biomarkers() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {METRICS.map((m) => <MetricCard key={m.label} m={m} />)}
      </div>

      <div className="luna-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Eyebrow>Blood panel</Eyebrow>
            <div className="text-[15px] font-semibold text-slate-800 mt-1">Jan 12, 2026</div>
          </div>
          <button className="text-[12.5px] font-medium hover:underline" style={{ color: C.indigo }}>
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
              {BLOOD.map((b) => (
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
        <div
          className="mt-4 p-3 rounded-lg text-[12.5px]"
          style={{ background: '#FFFBEB', borderLeft: `3px solid ${C.low}`, color: '#92400E' }}
        >
          ⚠ Omega-3 Index 6.8% is below 8% optimal. Consider increasing EPA/DHA intake; retest in 6 months.
        </div>
      </div>
    </div>
  );
}