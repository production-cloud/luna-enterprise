import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { C, PAGES, PATIENTS, getPatientData, type Patient } from './data';
import { AlertDot, Eyebrow, GradientAvatar } from './atoms';
import { IconChevron, IconDownload } from './icons';
import { downloadPatientSummary } from './pdf';

type Props = {
  patient: Patient;
  onSelectPatient: (p: Patient) => void;
};

export const TopBar: React.FC<Props> = ({ patient, onSelectPatient }) => {
  const loc = useLocation();
  const page = PAGES.find((p) => p.path === loc.pathname)?.label ?? 'Overview';
  const [open, setOpen] = useState(false);

  const handleDownload = () => {
    try {
      downloadPatientSummary(patient, getPatientData(patient.id));
      toast.success(`Downloading ${patient.name}'s summary`);
    } catch (e) {
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="text-[12px] text-slate-500">
        <span>Patients</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-slate-700">{patient.name}</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-slate-500">{page}</span>
      </div>

      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="h-9 px-2.5 flex items-center gap-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <GradientAvatar name={patient.name} size={22} />
          <span className="text-[13px] font-medium text-slate-800">{patient.name}</span>
          <AlertDot alert={patient.alert} size={7} />
          <span className="text-slate-400"><IconChevron /></span>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className="absolute right-0 top-11 z-50 bg-white rounded-xl shadow-lg border border-slate-200 fade-in"
              style={{ width: 340 }}
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <Eyebrow>Your patients</Eyebrow>
                <span className="text-[11px] text-slate-400 mono">{PATIENTS.length}</span>
              </div>
              <div className="py-1">
                {PATIENTS.map((p) => {
                  const active = p.id === patient.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => { onSelectPatient(p); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors"
                      style={{ background: active ? 'rgb(238 242 255 / 0.5)' : undefined }}
                    >
                      <GradientAvatar name={p.name} size={32} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-slate-800 truncate">
                          {p.name} <span className="text-slate-400 font-normal">· {p.age}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mono">
                          {p.sync} · {p.days}d
                        </div>
                      </div>
                      <AlertDot alert={p.alert} />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleDownload}
          className="h-9 px-3 rounded-lg text-[13px] font-medium text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          style={{ background: `linear-gradient(135deg, ${C.indigo}, ${C.violet})` }}
        >
          <IconDownload /> Download PDF
        </button>
      </div>
    </header>
  );
};
