export const C = {
  bg: '#FAFAF8',
  sidebar: '#0F172A',
  indigo: '#5B4FCF',
  violet: '#8B5CF6',
  menstrual: '#F4A7B9',
  follicular: '#C4B5FD',
  ovulation: '#FCD34D',
  luteal: '#5EEAD4',
  ok: '#10B981',
  normal: '#94A3B8',
  low: '#F59E0B',
  flag: '#EF4444',
};

export type Patient = {
  id: string; name: string; age: number; sync: string; days: number;
  alert: 'green' | 'amber' | 'red';
};

export const PATIENTS: Patient[] = [
  { id: 'priya',  name: 'Priya Sharma',  age: 31, sync: 'Apr 20 2026', days: 127, alert: 'amber' },
  { id: 'ananya', name: 'Ananya Mehta',  age: 28, sync: 'Apr 18 2026', days: 89,  alert: 'red'   },
  { id: 'deepa',  name: 'Deepa Nair',    age: 35, sync: 'Apr 15 2026', days: 203, alert: 'green' },
  { id: 'riya',   name: 'Riya Kapoor',   age: 33, sync: 'Apr 10 2026', days: 156, alert: 'green' },
];

export const SLEEP_14 = [7.2, 6.5, 6.8, 5.9, 7.1, 6.3, 7.4, 6.1, 6.9, 7.0, 6.2, 7.3, 6.7, 6.5];

export const TEMP_30 = [92.6,92.5,92.4,92.5,92.3,92.4,92.3,92.2,92.1,92.0,92.1,92.0,92.1,92.0,92.4,92.8,93.0,93.1,93.2,93.3,93.2,93.4,93.3,93.2,93.3,93.1,93.2,93.0,92.9,92.7];

export const CYCLES = [
  { id:'C1', start:'Dec 15 2025', end:'Dec 19', period:5, len:28, ov:'Dec 28', notes:'—', flag:false },
  { id:'C2', start:'Jan 12 2026', end:'Jan 17', period:6, len:29, ov:'Jan 25', notes:'Period +1d', flag:true },
  { id:'C3', start:'Feb 10 2026', end:'Feb 14', period:5, len:28, ov:'Feb 23', notes:'—', flag:false },
  { id:'C4', start:'Mar 10 2026', end:'Mar 15', period:6, len:30, ov:'Mar 24', notes:'Cycle +2d, Period +1d', flag:true },
];

export const BLOOD = [
  { k:'Vitamin D (25-OH)',    v:'48 ng/mL',   r:'30–60',     s:'Optimal' },
  { k:'HbA1c',                v:'5.2%',       r:'< 5.7%',    s:'Optimal' },
  { k:'TSH',                  v:'2.1 mIU/L',  r:'0.4–4.0',   s:'Normal'  },
  { k:'Ferritin',             v:'82 ng/mL',   r:'30–300',    s:'Normal'  },
  { k:'Total Cholesterol',    v:'185 mg/dL',  r:'< 200',     s:'Optimal' },
  { k:'Omega-3 Index',        v:'6.8%',       r:'> 8%',      s:'Below Target' },
  { k:'Testosterone (total)', v:'542 ng/dL',  r:'300–1000',  s:'Normal'  },
  { k:'FSH',                  v:'4.2 mIU/mL', r:'1.5–12.4',  s:'Normal'  },
  { k:'LH',                   v:'5.8 mIU/mL', r:'1.7–8.6',   s:'Normal'  },
  { k:'Prolactin',            v:'8.4 ng/mL',  r:'4.0–15.2',  s:'Normal'  },
  { k:'Estradiol',            v:'28 pg/mL',   r:'10–40',     s:'Normal'  },
  { k:'DHEA-S',               v:'380 ug/dL',  r:'211–492',   s:'Normal'  },
];

export const SUPPS: Array<{ k:string; d:string; a: number | null; aLabel?:string; i:string }> = [
  { k:'Magnesium glycinate', d:'400mg · morning',   a:93,   i:'+18 min deep sleep, +4ms HRV' },
  { k:'Vitamin D3 + K2',     d:'5000 IU · morning', a:95,   i:'D3: 28 → 48 ng/mL' },
  { k:'Omega-3 (EPA/DHA)',   d:'2g EPA · lunch',    a:88,   i:'Inflammation −22%' },
  { k:'Ashwagandha KSM-66',  d:'600mg · afternoon', a:91,   i:'Cortisol proxy −14%' },
  { k:'Zinc picolinate',     d:'30mg · evening',    a:90,   i:'Immune support' },
  { k:'Melatonin',           d:'0.3mg · pre-bed',   a:null, aLabel:'Travel only', i:'Jet lag −1.2 days' },
];

export const HABITS = [
  { k:'Caffeine (coffee)', f:'Daily · 7:30 AM',   amt:'2 cups/day',   impact:'After 3pm: −41 min deep sleep', pos:false },
  { k:'Walking',           f:'6x/week · 7:30 AM', amt:'22 min avg',   impact:'+6ms HRV on walk days',          pos:true  },
  { k:'Cold plunge',       f:'2x/week · Morning', amt:'2 min avg',    impact:'Cortisol −8% same day',          pos:true  },
  { k:'Alcohol',           f:'1x/week · Evening', amt:'2 drinks avg', impact:'RHR +6 bpm next morning',        pos:false },
  { k:'Meditation',        f:'3x/week · Evening', amt:'10 min avg',   impact:'Stress score −12% next day',     pos:true  },
  { k:'Massage',           f:'2x/month',          amt:'60 min',       impact:'HRV +8ms for 48hrs after',       pos:true  },
];

export const INSIGHTS = [
  { t:'Protein-first breakfasts raise Peak Score 7.2 pts', c:87 },
  { t:'HRV recovers 2 days faster with magnesium on travel days', c:82 },
  { t:'Stress down 21% over 90 days, Ashwagandha at 3pm correlating', c:79 },
  { t:'Biphasic shift regular across all 4 cycles, consistent progesterone pattern', c:94 },
  { t:'Walking 6x/week strongest HRV correlator, −6ms on rest days', c:85 },
  { t:'High-GI lunches correlate with 31% energy drop at 3pm', c:76 },
];

export const PARTNER = [
  { k:'Testosterone (total)', v:'542 ng/dL',  r:'300–1000', s:'Normal' },
  { k:'FSH',                  v:'4.2 mIU/mL', r:'1.5–12.4', s:'Normal' },
  { k:'LH',                   v:'5.8 mIU/mL', r:'1.7–8.6',  s:'Normal' },
  { k:'Prolactin',            v:'8.4 ng/mL',  r:'4.0–15.2', s:'Normal' },
  { k:'Estradiol',            v:'28 pg/mL',   r:'10–40',    s:'Normal' },
  { k:'DHEA-S',               v:'380 ug/dL',  r:'211–492',  s:'Normal' },
];

export const GAPS: Array<{ s:'HIGH'|'MED'|'LOW'; t:string; n:string }> = [
  { s:'MED', t:'Semen analysis',         n:'No results uploaded. Standard workup recommended.' },
  { s:'MED', t:'Medication history',     n:'Not logged. Verify with patient.' },
  { s:'LOW', t:'Genetic / genomic data', n:'Not uploaded. Consider carrier screening.' },
];

export const PAGES: Array<{ key: string; path: string; label: string }> = [
  { key: 'overview',   path: '/',          label: 'Overview' },
  { key: 'cycle',      path: '/cycle',     label: 'Cycle & Temperature' },
  { key: 'biomarkers', path: '/biomarkers',label: 'Biomarkers & Blood' },
  { key: 'lifestyle',  path: '/lifestyle', label: 'Lifestyle' },
  { key: 'insights',   path: '/insights',  label: 'AI Insights' },
  { key: 'partner',    path: '/partner',   label: 'Partner Health' },
];