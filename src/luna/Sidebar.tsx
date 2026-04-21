import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { C, PAGES } from './data';
import { LunaLogo } from './atoms';
import { IconOverview, IconCycle, IconBio, IconLifestyle, IconSparkle, IconPartner, IconSettings, IconHelp } from './icons';

const ICONS: Record<string, React.FC> = {
  overview: IconOverview,
  cycle: IconCycle,
  biomarkers: IconBio,
  lifestyle: IconLifestyle,
  insights: IconSparkle,
  partner: IconPartner,
};

type Props = { expanded: boolean; onHover: (v: boolean) => void };

export const Sidebar: React.FC<Props> = ({ expanded, onHover }) => {
  const loc = useLocation();
  return (
    <aside
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col text-slate-400"
      style={{
        width: expanded ? 200 : 64,
        background: C.sidebar,
        transition: 'width 300ms ease',
      }}
    >
      <div className="h-16 flex items-center px-4 gap-3 border-b border-white/5">
        <LunaLogo size={26} />
        <div
          className="overflow-hidden whitespace-nowrap"
          style={{ opacity: expanded ? 1 : 0, transition: 'opacity 200ms ease' }}
        >
          <div className="text-white text-[13px] font-semibold leading-tight">Luna LifeOS</div>
          <div className="eyebrow text-slate-500 leading-tight">Clinical</div>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {PAGES.map((p) => {
          const Icon = ICONS[p.key];
          const active = loc.pathname === p.path;
          return (
            <Link
              key={p.key}
              to={p.path}
              className="flex items-center gap-3 h-10 rounded-lg px-3 transition-colors"
              style={{
                background: active ? C.indigo : 'transparent',
                color: active ? '#fff' : undefined,
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '';
                }
              }}
            >
              <span className="shrink-0 flex items-center justify-center w-[18px]">
                <Icon />
              </span>
              <span
                className="text-[13px] font-medium whitespace-nowrap overflow-hidden"
                style={{ opacity: expanded ? 1 : 0, transition: 'opacity 200ms ease' }}
              >
                {p.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="py-3 px-2 space-y-1 border-t border-white/5">
        {[{ I: IconSettings, l: 'Settings' }, { I: IconHelp, l: 'Help' }].map(({ I, l }) => (
          <button
            key={l}
            className="w-full flex items-center gap-3 h-10 rounded-lg px-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="shrink-0 flex items-center justify-center w-[18px]"><I /></span>
            <span
              className="text-[13px] font-medium whitespace-nowrap overflow-hidden"
              style={{ opacity: expanded ? 1 : 0, transition: 'opacity 200ms ease' }}
            >
              {l}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
};