import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { C, type TrendMetric } from '../data';
import type { LunaCtx } from '../Layout';
import { Eyebrow, StatusPill } from '../atoms';

const MetricCard: React.FC<{ m: TrendMetric }> = ({ m }) => {
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
