import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { C, PAGES, PATIENTS, getPatientData, type Patient, type PatientData } from './data';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export type LunaCtx = { patient: Patient; data: PatientData };

export const LunaLayout: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [patient, setPatient] = useState<Patient>(PATIENTS[0]);
  const loc = useLocation();

  useEffect(() => {
    const key = PAGES.find((p) => p.path === loc.pathname)?.key;
    if (key) localStorage.setItem('luna.page', key);
  }, [loc.pathname]);

  const data = getPatientData(patient.id);

  return (
    <div className="min-h-screen luna-shell" style={{ background: C.bg }}>
      <Sidebar expanded={expanded} onHover={setExpanded} />
      <div style={{ marginLeft: 64 }}>
        <TopBar patient={patient} onSelectPatient={setPatient} />
        <main key={loc.pathname + patient.id} className="px-6 py-6 fade-in">
          <Outlet context={{ patient, data } satisfies LunaCtx} />
        </main>
      </div>
    </div>
  );
};
