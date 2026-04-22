import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { C } from '../data';
import type { LunaCtx } from '../Layout';
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

const TempChart: React.FC<{ ctx: LunaCtx }> = ({ ctx }) => {
  const cycles = ctx.data.cycles;
  const [activeId, setActiveId] = useState(cycles[cycles.length - 1].id);
  const cycle = cycles.find(c => c.id === activeId) ?? cycles[0];
  const data = cycle.temps.map((t, i) => ({ d: i + 1, label: `D${i + 1}`, t }));
  const len = cycle.len;
  const ovDay = cycle.ovDay;
  const yMin = Math.floor(Math.min(...cycle.temps) * 10) / 10 - 0.2;
  const yMax = Math.ceil(Math.max(...cycle.temps) * 10) / 10 + 0.2;
  const ticks = [1, Math.round(len * 0.2), Math.round(len * 0.4), ovDay, Math.round(len * 0.7), len].filter((v, i, a) => a.indexOf(v) === i).sort((a,b)=>a-b);

  return (
    <div className="luna-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <Eyebrow>Skin temperature</Eyebrow>
          <div className="text-[15px] font-semibold text-slate-800 mt-1">Cycle {cycle.id} · {len} days</div>
        </div>
        <div className="flex gap-1">
          {cycles.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className="h-7 px-2.5 rounded text-[11.5px] font-medium transition-colors"
              style={{
                background: activeId === c.id ? C.indigo : '#F1F5F9',
                color: activeId === c.id ? '#fff' : '#475569',
              }}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-2">
        {[
          { c: C.menstrual, l: `Menstrual D1-${cycle.period}` },
          { c: C.follicular, l: `Follicular D${cycle.period+1}-${ovDay-1}` },
          { c: C.ovulation, l: `Ovulation D${ovDay}` },
          { c: C.luteal, l: `Luteal D${ovDay+1}-${len}` },
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
            <ReferenceArea x1={1} x2={cycle.period} fill={C.menstrual} fillOpacity={0.12} />
            <ReferenceArea x1={cycle.period + 1} x2={ovDay - 1} fill={C.follicular} fillOpacity={0.12} />
            <ReferenceArea x1={ovDay} x2={ovDay} fill={C.ovulation} fillOpacity={0.25} />
            <ReferenceArea x1={ovDay + 1} x2={len} fill={C.luteal} fillOpacity={0.12} />
            <XAxis
              dataKey="d"
              ticks={ticks}
              tickFormatter={(v) => `D${v}`}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              domain={[yMin, yMax]}
              tickFormatter={(v) => `${v}°`}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTip />} />
            <ReferenceLine
              x={ovDay}
              stroke={C.low}
              strokeWidth={2}
              strokeDasharray="4 3"
              label={{ value: `OV · ${cycle.ov}`, position: 'top', fontSize: 10, fill: C.low, fontWeight: 600 }}
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
        {ctx.data.cycleClinicalNote}
      </div>
    </div>
  );
};

const HistoryTable: React.FC<{ ctx: LunaCtx }> = ({ ctx }) => {
  const cycles = ctx.data.cycles;
  const lastId = cycles[cycles.length - 1].id;
  return (
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
            {cycles.map((c) => (
              <tr
                key={c.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                style={{ background: c.id === lastId ? 'rgb(238 242 255 / 0.4)' : undefined }}
              >
                <td className="py-2.5 pr-4 font-semibold text-slate-700">{c.id}</td>
                <td className="py-2.5 pr-4 mono text-slate-600">{c.start}</td>
                <td className="py-2.5 pr-4 mono text-slate-600">{c.end}</td>
                <td className="py-2.5 pr-4 mono" style={{ color: c.flag ? C.low : '#475569', fontWeight: c.flag ? 700 : 400 }}>{c.period}</td>
                <td className="py-2.5 pr-4 mono" style={{ color: c.flag ? C.low : '#475569', fontWeight: c.flag ? 700 : 400 }}>{c.len}</td>
                <td className="py-2.5 pr-4 mono text-slate-600">{c.ov}</td>
                <td className="py-2.5 pr-4 text-slate-500">{c.notes}</td>
              </tr>
            ))}
            <tr className="bg-slate-50">
              <td className="py-2.5 pr-4 font-semibold text-slate-600">AVG</td>
              <td className="py-2.5 pr-4" />
              <td className="py-2.5 pr-4" />
              <td className="py-2.5 pr-4 mono text-slate-700">{ctx.data.cycleAvg.period}</td>
              <td className="py-2.5 pr-4 mono text-slate-700">{ctx.data.cycleAvg.len}</td>
              <td className="py-2.5 pr-4" />
              <td className="py-2.5 pr-4" />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-[11px] text-slate-500">{ctx.data.cycleNote}</div>
    </div>
  );
};

const PhaseBars: React.FC<{ ctx: LunaCtx }> = ({ ctx }) => {
  const cycles = ctx.data.cycles;
  const phaseColors = [C.menstrual, C.follicular, C.ovulation, C.luteal];
  const phaseNames = ['Menstrual', 'Follicular', 'Ovulation', 'Luteal'];
  const phaseDays = (c: typeof cycles[number]) => {
    const period = c.period;
    const foll = Math.max(1, c.ovDay - period - 1);
    const ov = 1;
    const lut = c.len - period - foll - ov;
    return [period, foll, ov, lut];
  };
  const [hovered, setHovered] = useState<{ ci: number; pi: number } | null>(null);

  return (
    <div className="luna-card p-5">
      <Eyebrow className="mb-3">Phase distribution</Eyebrow>
      <div className="space-y-3">
        {cycles.map((c, ci) => {
          const segs = phaseDays(c);
          return (
            <div key={c.id} className="flex items-center gap-3">
              <div className="w-48 text-[12px] text-slate-600 shrink-0">
                <span className="font-semibold">{c.id}</span>{' '}
                <span className="mono text-slate-400">{c.len}d</span>
                <div className="mono text-[10.5px] text-slate-400 leading-tight mt-0.5">
                  {c.start} – {c.end}
                </div>
              </div>
              <div className="relative flex-1">
                <div className="h-5 rounded-lg overflow-hidden flex">
                  {segs.map((d, pi) => {
                    const isHov = hovered?.ci === ci && hovered?.pi === pi;
                    const dim = hovered && hovered.ci === ci && hovered.pi !== pi;
                    return (
                      <div
                        key={pi}
                        onMouseEnter={() => setHovered({ ci, pi })}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          width: `${(d / c.len) * 100}%`,
                          background: phaseColors[pi],
                          opacity: dim ? 0.4 : 1,
                          transform: isHov ? 'scaleY(1.15)' : 'scaleY(1)',
                          transformOrigin: 'center',
                          transition: 'opacity 150ms ease, transform 150ms ease',
                          cursor: 'pointer',
                        }}
                        title={`${phaseNames[pi]} · ${d} day${d===1?'':'s'}`}
                      />
                    );
                  })}
                </div>
                {hovered?.ci === ci && (
                  <div
                    className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-lg pointer-events-none whitespace-nowrap fade-in"
                  >
                    <span className="mono">{phaseNames[hovered.pi]}</span> · {segs[hovered.pi]} day{segs[hovered.pi]===1?'':'s'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-[11px] text-slate-400">Hover any segment to see exact day count</div>
    </div>
  );
};

export default function Cycle() {
  const ctx = useOutletContext<LunaCtx>();
  return (
    <div className="space-y-4">
      <TempChart ctx={ctx} />
      <HistoryTable ctx={ctx} />
      <PhaseBars ctx={ctx} />
    </div>
  );
}
