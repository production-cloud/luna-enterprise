import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { C, SLEEP_14 } from '../data';
import { Eyebrow } from '../atoms';

const AlertStrip = () => (
  <div className="luna-card p-4">
    <div className="flex items-center gap-3 mb-3">
      <Eyebrow>Active Alerts</Eyebrow>
      <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: C.flag }}>3</span>
    </div>
    <div className="flex flex-wrap gap-3">
      {[
        { sev: 'HIGH', color: C.flag, bg: '#FEF2F2', t: 'Sleep debt 3.2h — may impact reproductive hormone regulation' },
        { sev: 'MED',  color: C.low,  bg: '#FFFBEB', t: 'Omega-3 index 6.8% — below 8% optimal. Retest in 6 months' },
        { sev: 'MED',  color: C.low,  bg: '#FFFBEB', t: 'Caffeine after 3pm linked to reduced deep sleep' },
      ].map((a, i) => (
        <div
          key={i}
          className="flex-1 min-w-[260px] flex items-start gap-3 p-3 rounded-lg"
          style={{ background: a.bg, borderLeft: `2px solid ${a.color}` }}
        >
          <span className="text-[10px] font-bold tracking-wide" style={{ color: a.color }}>{a.sev}</span>
          <span className="text-[12.5px] text-slate-700 leading-snug">{a.t}</span>
        </div>
      ))}
    </div>
  </div>
);

const PhaseRing = () => {
  const phases = [
    { name: 'Menstrual',  color: C.menstrual,  days: 5 },
    { name: 'Follicular', color: C.follicular, days: 9 },
    { name: 'Ovulation',  color: C.ovulation,  days: 1 },
    { name: 'Luteal',     color: C.luteal,     days: 15 },
  ];
  const total = 30;
  const r = 72;
  const circ = 2 * Math.PI * r;
  const gap = 3;
  let offset = 0;
  const activeIdx = 3;

  return (
    <div className="luna-card p-5">
      <Eyebrow className="mb-3">Cycle phase</Eyebrow>
      <div className="relative flex items-center justify-center" style={{ height: 200 }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
          {phases.map((p, i) => {
            const len = (p.days / total) * circ - gap;
            const dash = `${Math.max(len, 1)} ${circ}`;
            const dashOffset = -offset;
            offset += (p.days / total) * circ;
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
          <div className="text-[22px] font-bold text-slate-800 leading-none mt-1">Luteal</div>
          <div className="text-[12px] mono mt-1" style={{ color: C.indigo }}>Day 12</div>
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
        Cycle 4 · 30 days · OV Day 15
        <div className="mt-0.5">Based on skin temp + Luna sync</div>
      </div>
    </div>
  );
};

const BiomarkerSnapshot = () => {
  const [range, setRange] = useState<'30d' | '60d' | '90d'>('30d');
  const rows = [
    { k: 'Resting HR',    v: '62 bpm',   d: 'stable',       g: false },
    { k: 'HRV',           v: '48 ms',    d: '↑ +26% 90d',  g: true  },
    { k: 'Sleep Quality', v: '74%',      d: '↑ +4%',        g: true  },
    { k: 'Stress Score',  v: '41',       d: '↓ −21%',       g: true  },
    { k: 'SpO₂',          v: '96.4%',    d: 'stable',       g: false },
  ];
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
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between py-1">
            <span className="text-[12.5px] text-slate-600 w-24">{r.k}</span>
            <span className="mono text-[15px] font-semibold text-slate-800 flex-1">{r.v}</span>
            <span className="text-[11.5px]" style={{ color: r.g ? C.ok : C.normal }}>{r.d}</span>
          </div>
        ))}
      </div>
      <div
        className="mt-4 px-3 py-2 rounded-lg text-[12px] font-medium"
        style={{ background: '#ECFDF5', color: '#065F46' }}
      >
        🏆 HRV up 26% over 90 days
      </div>
    </div>
  );
};

const SleepSummary = () => {
  const data = SLEEP_14.map((v, i) => ({ d: `D${i + 1}`, h: v }));
  return (
    <div className="luna-card p-5">
      <Eyebrow className="mb-3">Sleep · last 14 nights</Eyebrow>
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
          { l: 'Deep sleep', v: '68 min', c: C.low },
          { l: 'Sleep debt', v: '3.2h',   c: C.low },
          { l: 'Avg quality', v: '73%',   c: C.normal },
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
        ☕ Caffeine after 3pm costs 41 min deep sleep
      </div>
    </div>
  );
};

const FooterStrip = () => (
  <div className="luna-card px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2.5 text-[12px] text-slate-600">
      <span className="luna-pulse inline-block w-2 h-2 rounded-full" style={{ background: C.ok }} />
      <span><span className="mono">127 days</span> continuous monitoring · Last synced <span className="mono">Apr 20, 2026</span></span>
    </div>
    <button className="text-[12.5px] font-medium hover:underline" style={{ color: C.indigo }}>
      Download PDF Report →
    </button>
  </div>
);

export default function Overview() {
  return (
    <div className="space-y-4">
      <AlertStrip />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PhaseRing />
        <BiomarkerSnapshot />
        <SleepSummary />
      </div>
      <FooterStrip />
    </div>
  );
}