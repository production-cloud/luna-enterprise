import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { C, CYCLES, TEMP_30 } from '../data';
import { Eyebrow } from '../atoms';

const CustomTip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 shadow-md text-[11px] mono">
      D{p.d} — {p.t}°F
    </div>
  );
};

const TempChart = () => {
  const [active, setActive] = useState('C4');
  const data = TEMP_30.map((t, i) => ({ d: i + 1, label: `D${i + 1}`, t }));
  return (
    <div className="luna-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <Eyebrow>Skin temperature</Eyebrow>
          <div className="text-[15px] font-semibold text-slate-800 mt-1">Cycle C4 · 30 days</div>
        </div>
        <div className="flex gap-1">
          {['C1', 'C2', 'C3', 'C4'].map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className="h-7 px-2.5 rounded text-[11.5px] font-medium transition-colors"
              style={{
                background: active === c ? C.indigo : '#F1F5F9',
                color: active === c ? '#fff' : '#475569',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-2">
        {[
          { c: C.menstrual, l: 'Menstrual D1-5' },
          { c: C.follicular, l: 'Follicular D6-14' },
          { c: C.ovulation, l: 'Ovulation D15' },
          { c: C.luteal, l: 'Luteal D16-30' },
        ].map((p) => (
          <div key={p.l} className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="w-3 h-3 rounded-sm" style={{ background: p.c }} />{p.l}
          </div>
        ))}
      </div>

      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.indigo} stopOpacity={0.15} />
                <stop offset="100%" stopColor={C.indigo} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E2E8F0" vertical={false} />
            <ReferenceArea x1={1} x2={5} fill={C.menstrual} fillOpacity={0.12} />
            <ReferenceArea x1={6} x2={14} fill={C.follicular} fillOpacity={0.12} />
            <ReferenceArea x1={15} x2={15} fill={C.ovulation} fillOpacity={0.25} />
            <ReferenceArea x1={16} x2={30} fill={C.luteal} fillOpacity={0.12} />
            <XAxis
              dataKey="d"
              ticks={[1, 5, 10, 15, 20, 25, 30]}
              tickFormatter={(v) => `D${v}`}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              domain={[91.5, 94.2]}
              tickFormatter={(v) => `${v}°`}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTip />} />
            <ReferenceLine
              x={15}
              stroke={C.low}
              strokeWidth={2}
              strokeDasharray="4 3"
              label={{ value: 'OV · Mar 24', position: 'top', fontSize: 10, fill: C.low, fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="t"
              stroke={C.indigo}
              strokeWidth={2.5}
              fill="url(#tempFill)"
              dot={{ r: 2.5, fill: C.indigo, stroke: 'none' }}
              activeDot={{ r: 5, fill: C.indigo, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div
        className="mt-4 p-3 rounded-lg text-[12.5px] leading-relaxed"
        style={{ background: '#EEF2FF', borderLeft: `3px solid ${C.indigo}`, color: '#3730A3' }}
      >
        Clear biphasic shift at Day 15. Pre-ovulatory nadir <span className="mono">92.0°F</span> → luteal rise to <span className="mono">93.2–93.4°F</span> (<span className="mono">+0.6°F</span>). Consistent with healthy progesterone response.
      </div>
    </div>
  );
};

const HistoryTable = () => (
  <div className="luna-card p-5">
    <Eyebrow className="mb-3">Cycle history · last 4 cycles</Eyebrow>
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="text-left text-[10.5px] uppercase tracking-wide text-slate-500 border-b border-slate-100">
            {['Cycle', 'Start', 'End', 'Period (d)', 'Length (d)', 'Ovulation', 'Notes'].map((h) => (
              <th key={h} className="py-2 pr-4 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CYCLES.map((c) => (
            <tr
              key={c.id}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              style={{ background: c.id === 'C4' ? 'rgb(238 242 255 / 0.4)' : undefined }}
            >
              <td className="py-2.5 pr-4 font-semibold text-slate-700">{c.id}</td>
              <td className="py-2.5 pr-4 mono text-slate-600">{c.start}</td>
              <td className="py-2.5 pr-4 mono text-slate-600">{c.end}</td>
              <td className="py-2.5 pr-4 mono" style={{ color: c.period === 6 ? C.low : '#475569', fontWeight: c.period === 6 ? 700 : 400 }}>{c.period}</td>
              <td className="py-2.5 pr-4 mono" style={{ color: c.len === 30 ? C.low : '#475569', fontWeight: c.len === 30 ? 700 : 400 }}>{c.len}</td>
              <td className="py-2.5 pr-4 mono text-slate-600">{c.ov}</td>
              <td className="py-2.5 pr-4 text-slate-500">{c.notes}</td>
            </tr>
          ))}
          <tr className="bg-slate-50">
            <td className="py-2.5 pr-4 font-semibold text-slate-600">AVG</td>
            <td className="py-2.5 pr-4" />
            <td className="py-2.5 pr-4" />
            <td className="py-2.5 pr-4 mono text-slate-700">5.5</td>
            <td className="py-2.5 pr-4 mono text-slate-700">28.75 (SD 0.96)</td>
            <td className="py-2.5 pr-4" />
            <td className="py-2.5 pr-4" />
          </tr>
        </tbody>
      </table>
    </div>
    <div className="mt-3 text-[11px] text-slate-500">SD 0.96 — within normal clinical range</div>
  </div>
);

const PhaseBars = () => {
  const phaseColors = [C.menstrual, C.follicular, C.ovulation, C.luteal];
  const phaseDays = (len: number, period: number) => {
    const ov = 1;
    const foll = Math.max(1, Math.round(len * 0.45) - period);
    const lut = len - period - foll - ov;
    return [period, foll, ov, lut];
  };
  return (
    <div className="luna-card p-5">
      <Eyebrow className="mb-3">Phase distribution</Eyebrow>
      <div className="space-y-3">
        {CYCLES.map((c) => {
          const segs = phaseDays(c.len, c.period);
          return (
            <div key={c.id} className="flex items-center gap-3">
              <div className="w-20 text-[12px] text-slate-600">
                <span className="font-semibold">{c.id}</span> <span className="mono text-slate-400">{c.len}d</span>
              </div>
              <div className="flex-1 h-5 rounded-lg overflow-hidden flex">
                {segs.map((d, i) => (
                  <div key={i} style={{ width: `${(d / c.len) * 100}%`, background: phaseColors[i] }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Cycle() {
  return (
    <div className="space-y-4">
      <TempChart />
      <HistoryTable />
      <PhaseBars />
    </div>
  );
}