import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { C } from '../data';
import type { LunaCtx } from '../Layout';
import { Eyebrow } from '../atoms';
import { IconInfo } from '../icons';

export default function Insights() {
  const ctx = useOutletContext<LunaCtx>();
  const sevColor = (s: string) =>
    s === 'HIGH' ? { color: C.flag,   panel: 'luna-soft-panel-danger' } :
    s === 'MED'  ? { color: C.low,    panel: 'luna-soft-panel-warn'   } :
                   { color: C.normal, panel: 'luna-soft-panel'        };
  return (
    <div className="space-y-4">
      <div
        className="luna-soft-panel flex items-start gap-2.5 px-4 py-2.5 rounded-lg text-[12px]"
      >
        <span className="mt-0.5 luna-soft-panel-meta"><IconInfo /></span>
        <span>AI-generated correlational observations from wearable + lifestyle data. Not diagnostic. Always interpret alongside clinical judgment.</span>
      </div>

      <div className="luna-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <Eyebrow>Action required</Eyebrow>
          <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: C.flag }}>
            {ctx.data.insightsAlerts.length} alerts
          </span>
        </div>
        <div className="space-y-2.5">
          {ctx.data.insightsAlerts.map((a, i) => {
            const s = sevColor(a.sev);
            return (
              <div
                key={i}
                className={`${s.panel} flex items-start gap-3 p-3 rounded-lg`}
                style={{ borderLeft: `4px solid ${s.color}` }}
              >
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: s.color }} />
                <div className="flex-1">
                  <div className="text-[13px] luna-soft-panel-title">{a.title}</div>
                  <div className="text-[11px] luna-soft-panel-meta mt-1">Flag severity: {a.sev} · Luna AI Engine</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="luna-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <Eyebrow>Pattern insights</Eyebrow>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: '#EEF2FF', color: C.indigo }}
          >
            {ctx.data.insights.length} insights
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ctx.data.insights.map((i, idx) => (
            <div
              key={idx}
              className="luna-soft-panel-info p-3.5 rounded-lg border transition-colors hover:border-indigo-300"
              style={{ borderColor: '#E0E7FF' }}
            >
              <div className="flex items-start gap-2">
                <span className="text-base">💡</span>
                <div className="text-[12.5px] leading-snug luna-soft-panel-title">{i.t}</div>
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
          <div className="luna-soft-panel-success p-4 rounded-lg border" style={{ borderColor: '#A7F3D0' }}>
            <div className="eyebrow text-emerald-700 mb-2">Strengths</div>
            <ul className="space-y-1.5 text-[12.5px] luna-soft-panel-title">
              {ctx.data.strengths.map((s) => (
                <li key={s}><span className="text-emerald-600 font-bold mr-1">✓</span>{s}</li>
              ))}
            </ul>
          </div>
          <div className="luna-soft-panel-warn p-4 rounded-lg border" style={{ borderColor: '#FDE68A' }}>
            <div className="eyebrow text-amber-700 mb-2">Concerns</div>
            <ul className="space-y-1.5 text-[12.5px] luna-soft-panel-title">
              {ctx.data.concerns.map((c) => (
                <li key={c}><span className="text-amber-600 font-bold mr-1">⚠</span>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
