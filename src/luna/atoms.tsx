import React from 'react';
import { C } from './data';

export const StatusPill: React.FC<{ s: string }> = ({ s }) => {
  const map: Record<string, { bg: string; fg: string; dot: string }> = {
    Optimal:        { bg: '#ECFDF5', fg: '#065F46', dot: C.ok },
    Normal:         { bg: '#F1F5F9', fg: '#334155', dot: C.normal },
    'Below Target': { bg: '#FFFBEB', fg: '#92400E', dot: C.low },
    Flag:           { bg: '#FEF2F2', fg: '#991B1B', dot: C.flag },
  };
  const m = map[s] ?? map.Normal;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ background: m.bg, color: m.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.dot }} />
      {s}
    </span>
  );
};

export const SevPill: React.FC<{ s: 'HIGH' | 'MED' | 'LOW' }> = ({ s }) => {
  const map = {
    HIGH: { bg: '#FEE2E2', fg: '#991B1B' },
    MED:  { bg: '#FEF3C7', fg: '#92400E' },
    LOW:  { bg: '#F1F5F9', fg: '#334155' },
  } as const;
  const m = map[s];
  return (
    <span
      className="rounded px-2 py-0.5 text-[10px] font-bold tracking-wide"
      style={{ background: m.bg, color: m.fg }}
    >
      {s}
    </span>
  );
};

export const AlertDot: React.FC<{ alert: 'green' | 'amber' | 'red'; size?: number }> = ({ alert, size = 8 }) => {
  const c = alert === 'red' ? C.flag : alert === 'amber' ? C.low : C.ok;
  return <span className="inline-block rounded-full" style={{ width: size, height: size, background: c }} />;
};

export const AdherenceBar: React.FC<{ value: number }> = ({ value }) => {
  const color = value >= 90 ? C.ok : value >= 80 ? C.low : C.flag;
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="mono text-[11px] text-slate-700 w-8 text-right">{value}%</span>
    </div>
  );
};

export const Eyebrow: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => (
  <div className={`eyebrow text-slate-500 ${className}`}>{children}</div>
);

export const GradientAvatar: React.FC<{ name: string; size?: number }> = ({ name, size = 28 }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `linear-gradient(135deg, ${C.indigo}, ${C.violet})`,
      }}
    >
      {initial}
    </div>
  );
};

export const LunaLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <defs>
      <linearGradient id="lunaRing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stopColor="#C4B5FD" />
        <stop offset="40%"  stopColor="#E9D5FF" />
        <stop offset="70%"  stopColor="#FBCFE8" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="13" fill="none" stroke="url(#lunaRing)" strokeWidth="5" strokeLinecap="round" />
  </svg>
);