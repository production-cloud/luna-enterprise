import React from 'react';
import { C, SUPPS, HABITS } from '../data';
import { AdherenceBar, Eyebrow } from '../atoms';

export default function Lifestyle() {
  return (
    <div className="space-y-4">
      <div className="luna-card p-5">
        <div className="flex items-center justify-between mb-3">
          <Eyebrow>Supplements</Eyebrow>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: '#ECFDF5', color: '#065F46' }}
          >
            Avg adherence 91%
          </span>
        </div>
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-[10.5px] uppercase tracking-wide text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-4 font-semibold">Supplement</th>
              <th className="py-2 pr-4 font-semibold">Adherence</th>
              <th className="py-2 pr-4 font-semibold">Observed impact</th>
            </tr>
          </thead>
          <tbody>
            {SUPPS.map((s) => (
              <tr key={s.k} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 pr-4">
                  <div className="font-semibold text-slate-800">{s.k}</div>
                  <div className="text-[11px] text-slate-500">{s.d}</div>
                </td>
                <td className="py-3 pr-4 w-48">
                  {s.a !== null ? (
                    <AdherenceBar value={s.a} />
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">{s.aLabel}</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-[12px]" style={{ color: '#065F46' }}>{s.i}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="luna-card p-5">
        <Eyebrow className="mb-3">Logged lifestyle habits</Eyebrow>
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-[10.5px] uppercase tracking-wide text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-4 font-semibold">Habit</th>
              <th className="py-2 pr-4 font-semibold">Frequency</th>
              <th className="py-2 pr-4 font-semibold">Amount</th>
              <th className="py-2 pr-4 font-semibold">Observed Impact</th>
            </tr>
          </thead>
          <tbody>
            {HABITS.map((h) => (
              <tr key={h.k} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-2.5 pr-4 font-semibold text-slate-700">{h.k}</td>
                <td className="py-2.5 pr-4 text-slate-500">{h.f}</td>
                <td className="py-2.5 pr-4 mono text-slate-600">{h.amt}</td>
                <td className="py-2.5 pr-4" style={{ color: h.pos ? '#047857' : '#92400E' }}>
                  {h.pos ? '✓ ' : '⚠ '}{h.impact}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}