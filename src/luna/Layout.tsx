import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { C, PAGES, PATIENTS, type Patient } from './data';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export type LunaCtx = { patient: Patient };

export const LunaLayout: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [patient, setPatient] = useState<Patient>(PATIENTS[0]);
  const loc = useLocation();

  useEffect(() => {
    const key = PAGES.find((p) => p.path === loc.pathname)?.key;
    if (key) localStorage.setItem('luna.page', key);
  }, [loc.pathname]);

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <Sidebar expanded={expanded} onHover={setExpanded} />
      <div style={{ marginLeft: 64 }}>
        <TopBar patient={patient} onSelectPatient={setPatient} />
        <main key={loc.pathname} className="px-6 py-6 fade-in">
          <Outlet context={{ patient } satisfies LunaCtx} />
        </main>
      </div>
    </div>
  );
};