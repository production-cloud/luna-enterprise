import React from 'react';
import { GAPS, PARTNER } from '../data';
import { Eyebrow, SevPill, StatusPill } from '../atoms';
import { IconInfo } from '../icons';

export default function Partner() {
  return (
    <div className="space-y-4">
      <div
        className="flex items-start gap-2.5 px-4 py-2.5 rounded-lg text-[12px] text-slate-600"
        style={{ background: 'rgb(241 245 249 / 0.7)' }}
      >
        <span className="text-slate-400 mt-0.5"><IconInfo /></span>
        <span>Partner health data is supplementary and optional. Synced via Kindbody integration.</span>
      </div>

      <div className="luna-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Eyebrow>Partner hormone panel</Eyebrow>
            <div className="text-[13px] text-slate-500 mt-1">Feb 3, 2026 · Kindbody</div>
          </div>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: '#ECFDF5', color: '#065F46' }}
          >
            All Normal
          </span>
        </div>
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
            {PARTNER.map((b) => (
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

      <div className="luna-card p-5">
        <Eyebrow className="mb-3">Data gaps</Eyebrow>
        <div className="space-y-2.5">
          {GAPS.map((g) => (
            <div key={g.t} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
              <SevPill s={g.s} />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-slate-800">{g.t}</div>
                <div className="text-[11.5px] text-slate-500">{g.n}</div>
              </div>
              <button className="h-8 px-3 border border-slate-200 rounded-md text-[12px] font-medium text-slate-700 hover:bg-white transition-colors">
                Request
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}