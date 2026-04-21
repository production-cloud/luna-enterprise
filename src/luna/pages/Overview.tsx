import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { C, getPatientData, type Patient } from '../data';
import type { LunaCtx } from '../Layout';
import { Eyebrow } from '../atoms';
import { downloadPatientSummary } from '../pdf';

const AlertStrip: React.FC<{ ctx: LunaCtx }> = ({ ctx }) => {
  const sevColor = (s: string) =>
    s === 'HIGH' ? { color: C.flag, bg: '#FEF2F2' } :
    s === 'MED'  ? { color: C.low,  bg: '#FFFBEB' } :
                   { color: C.normal, bg: '#F1F5F9' };
  return (
    <div className="luna-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <Eyebrow>Active Alerts</Eyebrow>
        <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: C.flag }}>
          {ctx.data.alerts.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {ctx.data.alerts.map((a, i) => {
          const s = sevColor(a.sev);
          return (
            <div
              key={i}
              className="flex-1 min-w-[260px] flex items-start gap-3 p-3 rounded-lg"
              style={{ background: s.bg, borderLeft: `2px solid ${s.color}` }}
            >
              <span className="text-[10px] font-bold tracking-wide" style={{ color: s.color }}>{a.sev}</span>
              <span className="text-[12.5px] text-slate-700 leading-snug">{a.t}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PhaseRing: React.FC<{ ctx: LunaCtx }> = ({ ctx }) => {
  const { phase } = ctx.data;
  // derive period from current cycle data (most recent)
  const lastCycle = ctx.data.cycles[ctx.data.cycles.length - 1];
  const period = lastCycle?.period ?? 5;
  const follicular = Math.max(1, phase.ovDay - period);
  const luteal = Math.max(1, phase.len - phase.ovDay);
  const phases = [
    { name: 'Menstrual',  color: C.menstrual,  days: period },
    { name: 'Follicular', color: C.follicular, days: follicular },
    { name: 'Ovulation',  color: C.ovulation,  days: 1 },
    { name: 'Luteal',     color: C.luteal,     days: luteal },
  ];
  const total = phases.reduce((s, p) => s + p.days, 0);
  const r = 72;
  const circ = 2 * Math.PI * r;
  const gap = 3;
  let offset = 0;
  const activeIdx = phases.findIndex(p => p.name === phase.name);

  return (
    <div className="luna-card p-5">
      <Eyebrow className="mb-3">Cycle phase</Eyebrow>
      <div className="relative flex items-center justify-center" style={{ height: 200 }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
          {phases.map((p, i) => {
            const seg = (p.days / total) * circ;
            const len = Math.max(seg - gap, 6);
            const dash = `${len} ${circ}`;
            const dashOffset = -offset;
            offset += seg;
            return (
              <circle
                key={i}
                cx="100" cy="100" r={r}
                fill="none"
                stroke={p.color}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={dash}
                strokeDashoffset={dashOffset}
                opacity={i === activeIdx ? 1 : 0.35}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="eyebrow text-slate-400">Current phase</div>
          <div className="text-[22px] font-bold text-slate-800 leading-none mt-1">{phase.name}</div>
          <div className="text-[12px] mono mt-1" style={{ color: C.indigo }}>Day {phase.day}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {phases.map((p) => (
          <div key={p.name} className="flex items-center gap-2 text-[11.5px] text-slate-600">
            <span className="w-3 h-3 rounded-sm" style={{ background: p.color }} />
            {p.name}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
        Cycle {phase.cycleNo} · {phase.len} days · OV Day {phase.ovDay}
        <div className="mt-0.5">Based on skin temp + Luna sync</div>
      </div>
    </div>
  );
};

const BiomarkerSnapshot: React.FC<{ ctx: LunaCtx }> = ({ ctx }) => {
  const [range, setRange] = useState<'30d' | '60d' | '90d'>('30d');
  return (
    <div className="luna-card p-5">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Biomarker snapshot</Eyebrow>
        <div className="inline-flex bg-slate-100 rounded-md p-0.5">
          {(['30d', '60d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-2.5 py-1 text-[11px] font-medium rounded transition-all"
              style={{
                background: range === r ? '#fff' : 'transparent',
                color: range === r ? '#0F172A' : '#64748B',
                boxShadow: range === r ? '0 1px 2px rgba(0,0,0,0.06)' : undefined,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2.5">
        {ctx.data.snapshot.map((r) => (
          <div key={r.k} className="flex items-center justify-between py-1">
            <span className="text-[12.5px] text-slate-600 w-24">{r.k}</span>
            <span className="mono text-[15px] font-semibold text-slate-800 flex-1">{r.vals[range].v}</span>
            <span className="text-[11.5px]" style={{ color: r.vals[range].g ? C.ok : C.normal }}>{r.vals[range].d}</span>
          </div>
        ))}
      </div>
      <div
        className="mt-4 px-3 py-2 rounded-lg text-[12px] font-medium"
        style={{ background: '#ECFDF5', color: '#065F46' }}
      >
        {ctx.data.snapshotCallout}
      </div>
    </div>
  );
};

const SleepSummary: React.FC<{ ctx: LunaCtx }> = ({ ctx }) => {
  const data = ctx.data.sleep14.map((v, i) => ({ d: `D${i + 1}`, h: v }));
  const ss = ctx.data.sleepStats;
  const avg = (ctx.data.sleep14.reduce((s, v) => s + v, 0) / ctx.data.sleep14.length).toFixed(1);
  return (
    <div className="luna-card p-5">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Sleep · last 14 nights</Eyebrow>
        <span className="mono text-[11px] text-slate-400">avg {avg}h</span>
      </div>
      <div style={{ height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="d" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[4, 9]} tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'rgba(91,79,207,0.05)' }} contentStyle={{ fontSize: 11, borderRadius: 6 }} />
            <ReferenceLine y={7.5} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: 'Target 7.5h', fontSize: 9, fill: '#64748B', position: 'right' }} />
            <Bar dataKey="h" fill={C.indigo} barSize={10} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { l: 'Deep sleep', v: ss.deep, c: ss.deepFlag ? C.low : C.ok },
          { l: 'Sleep debt', v: ss.debt, c: ss.debtFlag ? C.low : C.ok },
          { l: 'Avg quality', v: ss.quality, c: C.normal },
        ].map((s) => (
          <div key={s.l}>
            <div className="text-[10.5px] text-slate-500">{s.l}</div>
            <div className="mono text-[13px] font-semibold" style={{ color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div
        className="mt-3 px-3 py-2 rounded-lg text-[12px]"
        style={{ background: '#FFFBEB', color: '#92400E' }}
      >
        {ctx.data.sleepCallout}
      </div>
    </div>
  );
};

const FooterStrip: React.FC<{ patient: Patient }> = ({ patient }) => {
  const data = getPatientData(patient.id);
  return (
    <div className="luna-card px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5 text-[12px] text-slate-600">
        <span className="luna-pulse inline-block w-2 h-2 rounded-full" style={{ background: C.ok }} />
        <span><span className="mono">{data.monitoring.days} days</span> continuous monitoring · Last synced <span className="mono">{data.monitoring.lastSync}</span></span>
      </div>
      <button
        onClick={() => {
          try { downloadPatientSummary(patient, data); toast.success(`Downloading ${patient.name.split(' ')[0]}'s summary`); }
          catch { toast.error('Failed to generate PDF'); }
        }}
        className="text-[12.5px] font-medium hover:underline"
        style={{ color: C.indigo }}
      >
        Download PDF Report →
      </button>
    </div>
  );
};

export default function Overview() {
  const ctx = useOutletContext<LunaCtx>();
  return (
    <div className="space-y-4">
      <AlertStrip ctx={ctx} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PhaseRing ctx={ctx} />
        <BiomarkerSnapshot ctx={ctx} />
        <SleepSummary ctx={ctx} />
      </div>
      <FooterStrip patient={ctx.patient} />
    </div>
  );
}
