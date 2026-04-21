import React from 'react';
import { C, INSIGHTS } from '../data';
import { Eyebrow } from '../atoms';
import { IconInfo } from '../icons';

const ALERTS = [
  { sev: 'HIGH', color: C.flag, bg: '#FEF2F2', title: 'Sleep debt 3.2h sustained over 14 days — flag for endocrine review' },
  { sev: 'MED',  color: C.low,  bg: '#FFFBEB', title: 'Omega-3 Index 6.8% below 8% optimal — supplementation outcome to retest Q3' },
  { sev: 'MED',  color: C.low,  bg: '#FFFBEB', title: 'Caffeine after 3pm strongly correlates with reduced REM and deep sleep' },
];

const STRENGTHS = [
  'Consistent biphasic temperature shift across all 4 cycles',
  'HRV trending up 26% over 90 days',
  'Stress score reduced 21% with high supplement adherence',
  'Cardio biomarkers (RHR, Cholesterol) optimal',
];
const CONCERNS = [
  'Chronic sleep debt averaging 3.2h/week',
  'Omega-3 Index below clinical target of 8%',
  'Cycle length variability +2d in C4',
  'Afternoon caffeine pattern impacting deep sleep',
];

export default function Insights() {
  return (
    <div className="space-y-4">
      <div
        className="flex items-start gap-2.5 px-4 py-2.5 rounded-lg text-[12px] text-slate-600"
        style={{ background: 'rgb(241 245 249 / 0.7)' }}
      >
        <span className="text-slate-400 mt-0.5"><IconInfo /></span>
        <span>AI-generated correlational observations from wearable + lifestyle data. Not diagnostic. Always interpret alongside clinical judgment.</span>
      </div>

      <div className="luna-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <Eyebrow>Action required</Eyebrow>
          <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: C.flag }}>3 alerts</span>
        </div>
        <div className="space-y-2.5">
          {ALERTS.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: a.bg, borderLeft: `4px solid ${a.color}` }}
            >
              <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: a.color }} />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-slate-800">{a.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">Flag severity: {a.sev} · Luna AI Engine</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="luna-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <Eyebrow>Pattern insights</Eyebrow>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: '#EEF2FF', color: C.indigo }}
          >
            6 insights
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INSIGHTS.map((i, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border transition-colors hover:border-indigo-300"
              style={{ background: 'rgb(238 242 255 / 0.4)', borderColor: '#E0E7FF' }}
            >
              <div className="flex items-start gap-2">
                <span className="text-base">💡</span>
                <div className="text-[12.5px] text-slate-700 leading-snug">{i.t}</div>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-indigo-100">
                  <div className="h-full rounded-full" style={{ width: `${i.c}%`, background: C.indigo }} />
                </div>
                <span className="mono text-[11px]" style={{ color: C.indigo }}>{i.c}% confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="luna-card p-5">
        <Eyebrow className="mb-3">Health clone summary</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-lg border" style={{ background: 'rgb(236 253 245 / 0.6)', borderColor: '#A7F3D0' }}>
            <div className="eyebrow text-emerald-700 mb-2">Strengths</div>
            <ul className="space-y-1.5 text-[12.5px] text-slate-700">
              {STRENGTHS.map((s) => (
                <li key={s}><span className="text-emerald-600 font-bold mr-1">✓</span>{s}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-lg border" style={{ background: 'rgb(254 243 199 / 0.6)', borderColor: '#FDE68A' }}>
            <div className="eyebrow text-amber-700 mb-2">Concerns</div>
            <ul className="space-y-1.5 text-[12.5px] text-slate-700">
              {CONCERNS.map((c) => (
                <li key={c}><span className="text-amber-600 font-bold mr-1">⚠</span>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}