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
  { id: 'priya',  name: 'Jane Doe 1',  age: 31, sync: 'Apr 20 2026', days: 127, alert: 'amber' },
  { id: 'ananya', name: 'Jane Doe 2',  age: 28, sync: 'Apr 18 2026', days: 89,  alert: 'red'   },
  { id: 'deepa',  name: 'Jane Doe 3',  age: 35, sync: 'Apr 15 2026', days: 203, alert: 'green' },
  { id: 'riya',   name: 'Jane Doe 4',  age: 33, sync: 'Apr 10 2026', days: 156, alert: 'green' },
];

export type Cycle = {
  id: string; start: string; end: string; period: number; len: number; ov: string;
  ovDay: number; notes: string; flag: boolean;
  temps: number[]; // length === len
};

export type Alert = { sev: 'HIGH' | 'MED' | 'LOW'; t: string };

export type Snapshot = {
  k: string;
  vals: {
    '30d': { v: string; d: string; g: boolean };
    '60d': { v: string; d: string; g: boolean };
    '90d': { v: string; d: string; g: boolean };
  };
};

export type TrendMetric = {
  label: string; current: string; badge: string; badgeColor: { bg: string; fg: string };
  cols: Array<{ p: string; v: string }>; line: number[]; stroke: string;
};

export type Supp = { k: string; d: string; a: number | null; aLabel?: string; i: string };
export type Habit = { k: string; f: string; amt: string; impact: string; pos: boolean };
export type Bio = { k: string; v: string; r: string; s: string };
export type Gap = { s: 'HIGH' | 'MED' | 'LOW'; t: string; n: string };
export type Insight = { t: string; c: number };

export type PatientData = {
  alerts: Alert[];
  phase: { name: string; day: number; cycleNo: number; len: number; ovDay: number };
  snapshot: Snapshot[];
  snapshotCallout: string;
  sleep14: number[];
  sleepStats: { deep: string; debt: string; quality: string; deepFlag: boolean; debtFlag: boolean };
  sleepCallout: string;
  monitoring: { days: number; lastSync: string };
  cycles: Cycle[];
  cycleAvg: { period: string; len: string; sd: string };
  cycleNote: string;
  cycleClinicalNote: string;
  trends: TrendMetric[];
  blood: Bio[];
  bloodDate: string;
  bloodWarning?: string;
  supps: Supp[];
  suppsAvg: number;
  habits: Habit[];
  insights: Insight[];
  insightsAlerts: Array<{ sev: string; title: string }>;
  strengths: string[];
  concerns: string[];
  partner: Bio[];
  partnerDate: string;
  partnerStatus: string;
  gaps: Gap[];
};

// --- helpers to build temp arrays ---
const buildTemps = (len: number, ovDay: number, baseLow: number, baseHigh: number, jitter = 0.1): number[] => {
  const arr: number[] = [];
  for (let i = 1; i <= len; i++) {
    let t: number;
    if (i < ovDay) {
      // follicular: drift down to nadir at ovDay-1
      const f = (ovDay - i) / ovDay;
      t = baseLow + 0.3 * f;
    } else if (i === ovDay) {
      t = baseLow - 0.05;
    } else {
      // luteal: rise
      const f = Math.min(1, (i - ovDay) / 4);
      t = baseLow + (baseHigh - baseLow) * (0.6 + 0.4 * f);
    }
    t += (Math.sin(i * 1.3) * jitter);
    arr.push(Math.round(t * 10) / 10);
  }
  return arr;
};

// =====================================================
// PRIYA SHARMA — 31, amber, mild sleep debt + low omega-3
// =====================================================
const PRIYA: PatientData = {
  alerts: [
    { sev: 'HIGH', t: 'Sleep averaging ~3h below target across the last 14 nights' },
    { sev: 'MED',  t: 'On days creatine was taken, sleep latency appeared a few minutes longer than baseline' },
    { sev: 'MED',  t: 'Caffeine after 3pm could be linked to reduced deep sleep on the same night' },
  ],
  phase: { name: 'Luteal', day: 12, cycleNo: 4, len: 30, ovDay: 15 },
  snapshot: [
    { k:'Resting HR',    vals:{ '30d':{v:'62 bpm',d:'stable',g:false}, '60d':{v:'63 bpm',d:'↓ −1 bpm',g:true},  '90d':{v:'64 bpm',d:'↓ −2 bpm',g:true}  } },
    { k:'HRV',           vals:{ '30d':{v:'48 ms', d:'↑ +9%',  g:true},  '60d':{v:'45 ms', d:'↑ +18%', g:true},  '90d':{v:'40 ms', d:'↑ +26%', g:true}  } },
    { k:'Sleep Quality', vals:{ '30d':{v:'74%',   d:'↑ +4%',  g:true},  '60d':{v:'72%',   d:'↑ +2%',  g:true},  '90d':{v:'70%',   d:'baseline',g:false} } },
    { k:'Stress Score',  vals:{ '30d':{v:'41',    d:'↓ −8%',  g:true},  '60d':{v:'46',    d:'↓ −14%', g:true},  '90d':{v:'52',    d:'↓ −21%', g:true}  } },
    { k:'SpO₂',          vals:{ '30d':{v:'96.4%', d:'stable', g:false}, '60d':{v:'96.3%', d:'stable', g:false}, '90d':{v:'96.5%', d:'stable', g:false} } },
  ],
  snapshotCallout: '🏆 HRV up 26% over 90 days',
  sleep14: [7.2, 6.5, 6.8, 5.9, 7.1, 6.3, 7.4, 6.1, 6.9, 7.0, 6.2, 7.3, 6.7, 6.5],
  sleepStats: { deep: '68 min', debt: '3.2h', quality: '73%', deepFlag: true, debtFlag: true },
  sleepCallout: '☕ Caffeine after 3pm costs 41 min deep sleep',
  monitoring: { days: 127, lastSync: 'Apr 20, 2026' },
  cycles: [
    { id:'C1', start:'Dec 15 2025', end:'Jan 11 2026', period:5, len:28, ov:'Dec 28', ovDay:14, notes:'—', flag:false,
      temps: buildTemps(28, 14, 92.0, 93.2) },
    { id:'C2', start:'Jan 12 2026', end:'Feb 9 2026', period:6, len:29, ov:'Jan 25', ovDay:14, notes:'Period +1d', flag:true,
      temps: buildTemps(29, 14, 92.1, 93.3) },
    { id:'C3', start:'Feb 10 2026', end:'Mar 9 2026', period:5, len:28, ov:'Feb 23', ovDay:14, notes:'—', flag:false,
      temps: buildTemps(28, 14, 92.0, 93.1) },
    { id:'C4', start:'Mar 10 2026', end:'Apr 8 2026', period:6, len:30, ov:'Mar 24', ovDay:15, notes:'Cycle +2d, Period +1d', flag:true,
      temps: [92.6,92.5,92.4,92.5,92.3,92.4,92.3,92.2,92.1,92.0,92.1,92.0,92.1,92.0,92.4,92.8,93.0,93.1,93.2,93.3,93.2,93.4,93.3,93.2,93.3,93.1,93.2,93.0,92.9,92.7] },
  ],
  cycleAvg: { period: '5.5', len: '28.75 (SD 0.96)', sd: '0.96' },
  cycleNote: 'SD 0.96 — within normal clinical range',
  cycleClinicalNote: 'Clear biphasic shift at Day 15. Pre-ovulatory nadir 92.0°F → luteal rise to 93.2–93.4°F (+0.6°F). Consistent with healthy progesterone response.',
  trends: [
    { label:'HRV', current:'48 ms', badge:'+26% improvement', badgeColor:{bg:'#ECFDF5',fg:'#065F46'},
      cols:[{p:'90d',v:'40'},{p:'60d',v:'44'},{p:'30d',v:'48'}],
      line:[40,41,42,43,44,45,46,47,48], stroke:C.ok },
    { label:'Resting HR', current:'62 bpm', badge:'Stable, healthy', badgeColor:{bg:'#EEF2FF',fg:'#3730A3'},
      cols:[{p:'90d',v:'64'},{p:'60d',v:'63'},{p:'30d',v:'62'}],
      line:[64,64,63,63,62,63,62,62,62], stroke:C.indigo },
    { label:'Stress Score', current:'41', badge:'−21% over 90d', badgeColor:{bg:'#FFFBEB',fg:'#92400E'},
      cols:[{p:'90d',v:'52'},{p:'60d',v:'46'},{p:'30d',v:'41'}],
      line:[52,50,48,47,46,44,43,42,41], stroke:C.low },
  ],
  blood: [
    { k:'Vitamin D (25-OH)',    v:'48 ng/mL',   r:'30–60',     s:'Optimal' },
    { k:'HbA1c',                v:'5.2%',       r:'< 5.7%',    s:'Optimal' },
    { k:'TSH',                  v:'2.1 mIU/L',  r:'0.4–4.0',   s:'Normal'  },
    { k:'Ferritin',             v:'82 ng/mL',   r:'30–300',    s:'Normal'  },
    { k:'Total Cholesterol',    v:'185 mg/dL',  r:'< 200',     s:'Optimal' },
    { k:'Testosterone (total)', v:'42 ng/dL',   r:'15–70',     s:'Normal'  },
    { k:'FSH',                  v:'4.2 mIU/mL', r:'1.5–12.4',  s:'Normal'  },
    { k:'LH',                   v:'5.8 mIU/mL', r:'1.7–8.6',   s:'Normal'  },
    { k:'Prolactin',            v:'8.4 ng/mL',  r:'4.0–15.2',  s:'Normal'  },
    { k:'Estradiol',            v:'128 pg/mL',  r:'30–400',    s:'Normal'  },
    { k:'AMH',                  v:'2.4 ng/mL',  r:'1.0–4.0',   s:'Normal'  },
  ],
  bloodDate: 'Jan 12, 2026',
  bloodWarning: undefined,
  supps: [
    { k:'Magnesium glycinate', d:'400mg · morning',   a:93,   i:'+18 min deep sleep, +4ms HRV' },
    { k:'Vitamin D3 + K2',     d:'5000 IU · morning', a:95,   i:'D3: 28 → 48 ng/mL' },
    { k:'Creatine monohydrate', d:'5g · morning',     a:88,   i:'Strength + cognitive support' },
    { k:'Ashwagandha KSM-66',  d:'600mg · afternoon', a:91,   i:'Cortisol proxy −14%' },
    { k:'Zinc picolinate',     d:'30mg · evening',    a:90,   i:'Immune support' },
    { k:'Melatonin',           d:'0.3mg · pre-bed',   a:null, aLabel:'Travel only', i:'Jet lag −1.2 days' },
  ],
  suppsAvg: 91,
  habits: [
    { k:'Caffeine (coffee)', f:'Daily · 7:30 AM',   amt:'2 cups/day',   impact:'After 3pm: −41 min deep sleep', pos:false },
    { k:'Walking',           f:'6x/week · 7:30 AM', amt:'22 min avg',   impact:'+6ms HRV on walk days',          pos:true  },
    { k:'Cold plunge',       f:'2x/week · Morning', amt:'2 min avg',    impact:'Cortisol −8% same day',          pos:true  },
    { k:'Alcohol',           f:'1x/week · Evening', amt:'2 drinks avg', impact:'RHR +6 bpm next morning',        pos:false },
    { k:'Meditation',        f:'3x/week · Evening', amt:'10 min avg',   impact:'Stress score −12% next day',     pos:true  },
    { k:'Massage',           f:'2x/month',          amt:'60 min',       impact:'HRV +8ms for 48hrs after',       pos:true  },
  ],
  insights: [
    { t:'Mornings starting with a protein-first meal tend to coincide with higher Readiness Scores later that day', c:87 },
    { t:'HRV recovers 2 days faster with magnesium on travel days', c:82 },
    { t:'Stress trending lower over the last 90 days; Ashwagandha taken mid-afternoon on most of those days', c:79 },
    { t:'Biphasic shift regular across all 4 cycles, consistent progesterone pattern', c:94 },
    { t:'Walking 6x/week strongest HRV correlator, −6ms on rest days', c:85 },
    { t:'On days creatine was taken, sleep latency appeared a few minutes longer than baseline', c:76 },
  ],
  insightsAlerts: [
    { sev:'HIGH', title:'Sleep averaging ~3h below target across the last 14 nights' },
    { sev:'MED',  title:'On days creatine was taken, sleep latency appeared a few minutes longer than baseline' },
    { sev:'MED',  title:'Caffeine after 3pm could be linked to reduced deep sleep on the same night' },
  ],
  strengths: [
    'Biphasic temperature shift appears consistent across the last 4 cycles',
    'HRV has been trending upward over the last 90 days',
    'Stress scores have been moving lower alongside steady supplement use',
    'Cardio biomarkers (RHR, Cholesterol) sitting in optimal range',
  ],
  concerns: [
    'Sleep duration has been running below target across recent nights',
    'Sleep latency appears slightly longer on creatine days',
    'Cycle length in C4 looks a couple of days longer than the prior 3',
    'Afternoon caffeine pattern coincides with reduced deep sleep',
  ],
  partner: [
    { k:'Testosterone (total)', v:'542 ng/dL',  r:'300–1000', s:'Normal' },
    { k:'FSH',                  v:'4.2 mIU/mL', r:'1.5–12.4', s:'Normal' },
    { k:'LH',                   v:'5.8 mIU/mL', r:'1.7–8.6',  s:'Normal' },
    { k:'Prolactin',            v:'8.4 ng/mL',  r:'4.0–15.2', s:'Normal' },
    { k:'Estradiol',            v:'28 pg/mL',   r:'10–40',    s:'Normal' },
    { k:'DHEA-S',               v:'380 ug/dL',  r:'211–492',  s:'Normal' },
  ],
  partnerDate: 'Feb 3, 2026 · External lab',
  partnerStatus: 'All Normal',
  gaps: [
    { s:'MED', t:'Semen analysis',         n:'No results uploaded. Standard workup recommended.' },
    { s:'MED', t:'Medication history',     n:'Not logged. Verify with patient.' },
    { s:'LOW', t:'Genetic / genomic data', n:'Not uploaded. Consider carrier screening.' },
  ],
};

// =====================================================
// ANANYA MEHTA — 28, red, irregular cycles, low ferritin/D
// =====================================================
const ANANYA: PatientData = {
  alerts: [
    { sev:'HIGH', t:'Cycle length has been varying by ~6 days across the last 4 cycles' },
    { sev:'HIGH', t:'Ferritin observed at 18 ng/mL across recent panels' },
    { sev:'MED',  t:'Vitamin D observed at 19 ng/mL — below the typical reference range' },
  ],
  phase: { name: 'Follicular', day: 9, cycleNo: 4, len: 36, ovDay: 21 },
  snapshot: [
    { k:'Resting HR',    vals:{ '30d':{v:'71 bpm',d:'↑ +2 bpm',g:false}, '60d':{v:'69 bpm',d:'↑ +3 bpm',g:false}, '90d':{v:'67 bpm',d:'↑ +4 bpm',g:false} } },
    { k:'HRV',           vals:{ '30d':{v:'32 ms', d:'↓ −6%',  g:false}, '60d':{v:'34 ms', d:'↓ −9%',  g:false}, '90d':{v:'36 ms', d:'↓ −12%', g:false} } },
    { k:'Sleep Quality', vals:{ '30d':{v:'62%',   d:'↓ −2%',  g:false}, '60d':{v:'64%',   d:'↓ −4%',  g:false}, '90d':{v:'66%',   d:'↓ −6%',  g:false} } },
    { k:'Stress Score',  vals:{ '30d':{v:'68',    d:'↑ +6%',  g:false}, '60d':{v:'63',    d:'↑ +12%', g:false}, '90d':{v:'58',    d:'↑ +18%', g:false} } },
    { k:'SpO₂',          vals:{ '30d':{v:'97.1%', d:'stable', g:false}, '60d':{v:'97.0%', d:'stable', g:false}, '90d':{v:'97.2%', d:'stable', g:false} } },
  ],
  snapshotCallout: '⚠ HRV trending down — review stress + sleep',
  sleep14: [5.8, 6.1, 5.5, 6.4, 5.9, 5.2, 6.0, 5.8, 6.2, 5.4, 5.9, 6.1, 5.7, 6.0],
  sleepStats: { deep: '52 min', debt: '5.8h', quality: '62%', deepFlag: true, debtFlag: true },
  sleepCallout: '⚠ Average 5.9h sleep — endocrine impact likely',
  monitoring: { days: 89, lastSync: 'Apr 18, 2026' },
  cycles: [
    { id:'C1', start:'Dec 02 2025', end:'Jan 2 2026', period:7, len:32, ov:'Dec 19', ovDay:18, notes:'Long cycle', flag:true,
      temps: buildTemps(32, 18, 92.2, 92.9, 0.15) },
    { id:'C2', start:'Jan 03 2026', end:'Feb 9 2026', period:7, len:38, ov:'Jan 24', ovDay:22, notes:'Cycle +6d, variability noted', flag:true,
      temps: buildTemps(38, 22, 92.3, 92.7, 0.18) },
    { id:'C3', start:'Feb 10 2026', end:'Mar 14 2026', period:6, len:33, ov:'Feb 28', ovDay:19, notes:'Biphasic shift less defined', flag:true,
      temps: buildTemps(33, 19, 92.1, 92.8, 0.2) },
    { id:'C4', start:'Mar 15 2026', end:'Apr 19 2026', period:7, len:36, ov:'Apr 04', ovDay:21, notes:'Variable across cycles', flag:true,
      temps: buildTemps(36, 21, 92.2, 92.8, 0.18) },
  ],
  cycleAvg: { period: '6.75', len: '34.75 (SD 2.63)', sd: '2.63' },
  cycleNote: 'SD 2.63 — above normal clinical range, recommend hormone workup',
  cycleClinicalNote: 'Inconsistent biphasic shift across cycles. Luteal rise muted (Δ ~0.5°F). Suggest progesterone testing day 21 + ultrasound for ovulation confirmation.',
  trends: [
    { label:'HRV', current:'32 ms', badge:'−12% over 90d', badgeColor:{bg:'#FEF2F2',fg:'#991B1B'},
      cols:[{p:'90d',v:'36'},{p:'60d',v:'34'},{p:'30d',v:'32'}],
      line:[36,36,35,34,34,33,33,32,32], stroke:C.flag },
    { label:'Resting HR', current:'71 bpm', badge:'Elevated', badgeColor:{bg:'#FFFBEB',fg:'#92400E'},
      cols:[{p:'90d',v:'67'},{p:'60d',v:'69'},{p:'30d',v:'71'}],
      line:[67,68,68,69,69,70,70,71,71], stroke:C.low },
    { label:'Stress Score', current:'68', badge:'↑ +18% over 90d', badgeColor:{bg:'#FEF2F2',fg:'#991B1B'},
      cols:[{p:'90d',v:'58'},{p:'60d',v:'63'},{p:'30d',v:'68'}],
      line:[58,60,61,62,63,65,66,67,68], stroke:C.flag },
  ],
  blood: [
    { k:'Vitamin D (25-OH)',    v:'19 ng/mL',   r:'30–60',     s:'Below Target' },
    { k:'HbA1c',                v:'5.6%',       r:'< 5.7%',    s:'Normal'  },
    { k:'TSH',                  v:'3.8 mIU/L',  r:'0.4–4.0',   s:'Normal'  },
    { k:'Ferritin',             v:'18 ng/mL',   r:'30–300',    s:'Below Target' },
    { k:'Total Cholesterol',    v:'192 mg/dL',  r:'< 200',     s:'Normal' },
    { k:'Testosterone (total)', v:'68 ng/dL',   r:'15–70',     s:'Normal'  },
    { k:'FSH',                  v:'8.4 mIU/mL', r:'1.5–12.4',  s:'Normal'  },
    { k:'LH',                   v:'12.1 mIU/mL',r:'1.7–8.6',   s:'Flag'  },
    { k:'Prolactin',            v:'14.2 ng/mL', r:'4.0–15.2',  s:'Normal'  },
    { k:'Estradiol',            v:'42 pg/mL',   r:'30–400',    s:'Normal'  },
    { k:'AMH',                  v:'4.8 ng/mL',  r:'1.0–4.0',   s:'Flag' },
  ],
  bloodDate: 'Mar 28, 2026',
  bloodWarning: 'LH:FSH ratio and AMH values fall outside the typical range; the pattern is one often associated with PCOS in the literature.',
  supps: [
    { k:'Iron bisglycinate',   d:'25mg · morning',    a:78,  i:'Ferritin 14 → 18 ng/mL' },
    { k:'Vitamin D3 + K2',     d:'5000 IU · morning', a:84,  i:'D3 trending up slowly' },
    { k:'Creatine monohydrate', d:'3g · morning',     a:72,  i:'Recently introduced' },
    { k:'Inositol (myo+d-chiro)', d:'4g · 2x/day',    a:81,  i:'Cycle regularity goal' },
    { k:'Magnesium glycinate', d:'400mg · evening',   a:74,  i:'Sleep onset −12 min' },
    { k:'Melatonin',           d:'0.5mg · pre-bed',   a:null, aLabel:'As needed', i:'Sleep latency aid' },
  ],
  suppsAvg: 78,
  habits: [
    { k:'Caffeine (coffee)', f:'Daily · 8 AM, 2 PM', amt:'3 cups/day',   impact:'HRV −4ms on high-caf days',     pos:false },
    { k:'Walking',           f:'2x/week',           amt:'15 min avg',   impact:'+3ms HRV, low frequency',        pos:true  },
    { k:'Yoga',              f:'1x/week',           amt:'45 min',        impact:'Stress score −9% next day',      pos:true  },
    { k:'Alcohol',           f:'2x/week · Evening', amt:'2 drinks avg', impact:'RHR +8 bpm, sleep quality −12%', pos:false },
    { k:'Screen time pre-bed', f:'Daily',           amt:'90 min avg',   impact:'Sleep onset +22 min',            pos:false },
    { k:'Meditation',        f:'1x/week',           amt:'8 min avg',    impact:'Limited frequency for impact',   pos:true  },
  ],
  insights: [
    { t:'Biphasic shift appears less defined in 3 of 4 recent cycles', c:91 },
    { t:'Evening alcohol days tend to coincide with higher next-morning resting HR', c:88 },
    { t:'Inositol has only been logged for a short window so cycle changes are not yet observable', c:62 },
    { t:'Ferritin has been recovering slowly since iron supplementation began', c:74 },
    { t:'Sleep duration over the last 14 nights has been averaging well below target', c:89 },
    { t:'Stress scores have been trending upward over the last 90 days', c:80 },
  ],
  insightsAlerts: [
    { sev:'HIGH', title:'LH:FSH ratio, AMH and cycle variability together resemble a PCOS-like pattern' },
    { sev:'HIGH', title:'Ferritin observed at 18 ng/mL — sitting below the typical reference range' },
    { sev:'MED',  title:'Lower sleep duration and higher stress scores have been observed alongside declining HRV' },
  ],
  strengths: [
    'Consistently engaged with the supplement regimen (~78% adherence)',
    'TSH sitting within the normal range',
    'Glycemic markers (HbA1c 5.6%) within range',
    'Inositol recently introduced as part of cycle support',
  ],
  concerns: [
    'LH:FSH ratio, elevated AMH and irregular cycles co-occurring',
    'Ferritin and Vitamin D both observed below the typical range',
    'HRV and stress scores have been trending in opposite directions to baseline',
    'Short sleep, evening screen time and alcohol appearing together in recent logs',
  ],
  partner: [
    { k:'Testosterone (total)', v:'412 ng/dL',  r:'300–1000', s:'Normal' },
    { k:'FSH',                  v:'5.1 mIU/mL', r:'1.5–12.4', s:'Normal' },
    { k:'LH',                   v:'4.2 mIU/mL', r:'1.7–8.6',  s:'Normal' },
    { k:'Prolactin',            v:'11.2 ng/mL', r:'4.0–15.2', s:'Normal' },
    { k:'Estradiol',            v:'24 pg/mL',   r:'10–40',    s:'Normal' },
    { k:'DHEA-S',               v:'298 ug/dL',  r:'211–492',  s:'Normal' },
  ],
  partnerDate: 'Mar 18, 2026 · External lab',
  partnerStatus: 'All Normal',
  gaps: [
    { s:'HIGH', t:'Semen analysis',         n:'Not on file. Strongly recommended given female-side findings.' },
    { s:'MED',  t:'Thyroid antibodies',     n:'Anti-TPO not tested. Consider given PCOS workup.' },
    { s:'LOW',  t:'Genetic / genomic data', n:'Not uploaded. Consider carrier screening.' },
  ],
};

// =====================================================
// DEEPA NAIR — 35, green, clean panel, regular cycles
// =====================================================
const DEEPA: PatientData = {
  alerts: [
    { sev:'LOW', t:'All biomarkers currently sitting within the typical optimal range' },
    { sev:'LOW', t:'Current regimen appears to be holding markers steady over the last 6 months' },
    { sev:'LOW', t:'AMH could be tracked annually given age, useful for fertility planning context' },
  ],
  phase: { name: 'Follicular', day: 8, cycleNo: 4, len: 28, ovDay: 14 },
  snapshot: [
    { k:'Resting HR',    vals:{ '30d':{v:'56 bpm',d:'↓ −1 bpm',g:true},  '60d':{v:'57 bpm',d:'↓ −1 bpm',g:true},  '90d':{v:'58 bpm',d:'↓ −2 bpm',g:true}  } },
    { k:'HRV',           vals:{ '30d':{v:'68 ms', d:'↑ +3%',  g:true},   '60d':{v:'66 ms', d:'↑ +5%',  g:true},   '90d':{v:'63 ms', d:'↑ +8%',  g:true}  } },
    { k:'Sleep Quality', vals:{ '30d':{v:'88%',   d:'↑ +1%',  g:true},   '60d':{v:'87%',   d:'↑ +2%',  g:true},   '90d':{v:'85%',   d:'↑ +3%',  g:true}  } },
    { k:'Stress Score',  vals:{ '30d':{v:'28',    d:'↓ −3%',  g:true},   '60d':{v:'30',    d:'↓ −6%',  g:true},   '90d':{v:'31',    d:'↓ −9%',  g:true}  } },
    { k:'SpO₂',          vals:{ '30d':{v:'97.8%', d:'stable', g:false},  '60d':{v:'97.7%', d:'stable', g:false},  '90d':{v:'97.8%', d:'stable', g:false} } },
  ],
  snapshotCallout: '🏆 All biomarkers in optimal zone',
  sleep14: [7.8, 8.1, 7.9, 8.2, 7.7, 8.0, 7.9, 8.3, 7.8, 8.0, 8.1, 7.9, 8.2, 7.8],
  sleepStats: { deep: '108 min', debt: '0h', quality: '88%', deepFlag: false, debtFlag: false },
  sleepCallout: '✓ Consistent 8h sleep, deep sleep above target',
  monitoring: { days: 203, lastSync: 'Apr 15, 2026' },
  cycles: [
    { id:'C1', start:'Dec 18 2025', end:'Jan 14 2026', period:5, len:28, ov:'Dec 31', ovDay:14, notes:'—', flag:false,
      temps: buildTemps(28, 14, 91.9, 93.4) },
    { id:'C2', start:'Jan 15 2026', end:'Feb 11 2026', period:5, len:28, ov:'Jan 28', ovDay:14, notes:'—', flag:false,
      temps: buildTemps(28, 14, 92.0, 93.5) },
    { id:'C3', start:'Feb 12 2026', end:'Mar 11 2026', period:5, len:28, ov:'Feb 25', ovDay:14, notes:'—', flag:false,
      temps: buildTemps(28, 14, 91.9, 93.3) },
    { id:'C4', start:'Mar 12 2026', end:'Apr 8 2026', period:5, len:28, ov:'Mar 25', ovDay:14, notes:'—', flag:false,
      temps: buildTemps(28, 14, 92.0, 93.4) },
  ],
  cycleAvg: { period: '5.0', len: '28.0 (SD 0.0)', sd: '0.0' },
  cycleNote: 'SD 0.0 — textbook regularity across all 4 cycles',
  cycleClinicalNote: 'Textbook biphasic pattern. Pre-ovulatory nadir 91.9°F → luteal plateau 93.3–93.5°F (+1.5°F). Strong progesterone signature.',
  trends: [
    { label:'HRV', current:'68 ms', badge:'+8% steady gain', badgeColor:{bg:'#ECFDF5',fg:'#065F46'},
      cols:[{p:'90d',v:'63'},{p:'60d',v:'66'},{p:'30d',v:'68'}],
      line:[63,64,64,65,66,66,67,68,68], stroke:C.ok },
    { label:'Resting HR', current:'56 bpm', badge:'Excellent', badgeColor:{bg:'#ECFDF5',fg:'#065F46'},
      cols:[{p:'90d',v:'58'},{p:'60d',v:'57'},{p:'30d',v:'56'}],
      line:[58,58,57,57,57,56,57,56,56], stroke:C.ok },
    { label:'Stress Score', current:'28', badge:'−9% over 90d', badgeColor:{bg:'#EEF2FF',fg:'#3730A3'},
      cols:[{p:'90d',v:'31'},{p:'60d',v:'30'},{p:'30d',v:'28'}],
      line:[31,30,30,29,29,29,28,28,28], stroke:C.indigo },
  ],
  blood: [
    { k:'Vitamin D (25-OH)',    v:'58 ng/mL',   r:'30–60',     s:'Optimal' },
    { k:'HbA1c',                v:'4.9%',       r:'< 5.7%',    s:'Optimal' },
    { k:'TSH',                  v:'1.6 mIU/L',  r:'0.4–4.0',   s:'Optimal' },
    { k:'Ferritin',             v:'124 ng/mL',  r:'30–300',    s:'Optimal' },
    { k:'Total Cholesterol',    v:'168 mg/dL',  r:'< 200',     s:'Optimal' },
    { k:'Testosterone (total)', v:'48 ng/dL',   r:'15–70',     s:'Normal'  },
    { k:'FSH',                  v:'6.8 mIU/mL', r:'1.5–12.4',  s:'Normal'  },
    { k:'LH',                   v:'4.2 mIU/mL', r:'1.7–8.6',   s:'Normal'  },
    { k:'Prolactin',            v:'9.1 ng/mL',  r:'4.0–15.2',  s:'Normal'  },
    { k:'Estradiol',            v:'142 pg/mL',  r:'30–400',    s:'Normal'  },
    { k:'AMH',                  v:'1.6 ng/mL',  r:'1.0–4.0',   s:'Normal'  },
  ],
  bloodDate: 'Feb 22, 2026',
  bloodWarning: undefined,
  supps: [
    { k:'Vitamin D3 + K2',     d:'2000 IU · morning', a:98,  i:'Maintenance dose, D3 stable 58' },
    { k:'Creatine monohydrate', d:'5g · morning',     a:96,  i:'Strength + cognitive support' },
    { k:'Magnesium glycinate', d:'300mg · evening',   a:97,  i:'Deep sleep 108 min avg' },
    { k:'CoQ10',               d:'200mg · morning',   a:94,  i:'Mitochondrial / egg quality' },
    { k:'Methylfolate',        d:'400mcg · morning',  a:95,  i:'Preconception support' },
  ],
  suppsAvg: 96,
  habits: [
    { k:'Strength training', f:'4x/week · 6 AM',    amt:'45 min avg',   impact:'+12ms HRV vs baseline',          pos:true  },
    { k:'Walking',           f:'Daily · evening',   amt:'40 min avg',   impact:'Stress −18% on walk days',       pos:true  },
    { k:'Sauna',             f:'3x/week',           amt:'20 min',       impact:'Sleep onset −8 min',             pos:true  },
    { k:'Caffeine',          f:'Daily · 8 AM only', amt:'1 cup/day',    impact:'No measurable impact',           pos:true  },
    { k:'Meditation',        f:'Daily · 6 PM',      amt:'15 min',       impact:'Stress score −12% sustained',    pos:true  },
    { k:'Alcohol',           f:'Rare',              amt:'<1 drink/week',impact:'Negligible impact',              pos:true  },
  ],
  insights: [
    { t:'All 4 recent cycles came in at ~28 days with a clear luteal temperature rise', c:96 },
    { t:'Strength training 4x/week appears to be the strongest HRV correlator in the log', c:92 },
    { t:'AMH 1.6 sits within a typical range observed at this age', c:88 },
    { t:'Daily meditation days tend to coincide with the lowest stress scores in the log', c:90 },
    { t:'On days creatine was taken, sleep latency appeared a few minutes longer than baseline', c:78 },
    { t:'Sleep duration has been very consistent (~8h) over the last 14 nights, alongside steady HRV gains', c:87 },
  ],
  insightsAlerts: [
    { sev:'LOW', title:'No active flags observed across recent biomarker and lifestyle data' },
    { sev:'LOW', title:'AMH could be re-checked annually given age' },
    { sev:'LOW', title:'Folate dose worth a routine review at the next visit' },
  ],
  strengths: [
    '28-day cycles observed across all 4 recent cycles with a clear biphasic shift',
    'Every blood marker currently sitting in the optimal range',
    'HRV (~68ms) sitting at the higher end of the cohort',
    'Sleep, stress and supplement adherence all looking consistent',
  ],
  concerns: [
    'AMH at 1.6 — worth tracking year-on-year for context',
    'Natural age-related shifts to keep in view',
    'No active concerns observed in recent data',
    'Regimen looks stable; no changes appear indicated from data alone',
  ],
  partner: [
    { k:'Testosterone (total)', v:'628 ng/dL',  r:'300–1000', s:'Normal' },
    { k:'FSH',                  v:'3.8 mIU/mL', r:'1.5–12.4', s:'Normal' },
    { k:'LH',                   v:'5.2 mIU/mL', r:'1.7–8.6',  s:'Normal' },
    { k:'Prolactin',            v:'7.9 ng/mL',  r:'4.0–15.2', s:'Normal' },
    { k:'Estradiol',            v:'31 pg/mL',   r:'10–40',    s:'Normal' },
    { k:'DHEA-S',               v:'412 ug/dL',  r:'211–492',  s:'Normal' },
  ],
  partnerDate: 'Jan 28, 2026 · External lab',
  partnerStatus: 'All Normal',
  gaps: [
    { s:'LOW', t:'Semen analysis',         n:'Last 14 months ago. Recheck recommended for current planning.' },
    { s:'LOW', t:'Genetic / genomic data', n:'Carrier screening complete; no further action.' },
    { s:'LOW', t:'Lifestyle log',          n:'Partner lifestyle data not synced.' },
  ],
};

// =====================================================
// RIYA KAPOOR — 33, green, slightly long luteal phase
// =====================================================
const RIYA: PatientData = {
  alerts: [
    { sev:'LOW', t:'Luteal phase 16-17 days — slightly long but within physiological range' },
    { sev:'LOW', t:'All bloods in normal range, retest in 6 months' },
    { sev:'LOW', t:'Consider mid-luteal progesterone confirmation if planning conception' },
  ],
  phase: { name: 'Luteal', day: 8, cycleNo: 4, len: 30, ovDay: 13 },
  snapshot: [
    { k:'Resting HR',    vals:{ '30d':{v:'59 bpm',d:'stable', g:false}, '60d':{v:'59 bpm',d:'↓ −1 bpm',g:true},  '90d':{v:'60 bpm',d:'↓ −1 bpm',g:true}  } },
    { k:'HRV',           vals:{ '30d':{v:'58 ms', d:'↑ +5%',  g:true},  '60d':{v:'55 ms', d:'↑ +8%',  g:true},   '90d':{v:'51 ms', d:'↑ +14%', g:true}  } },
    { k:'Sleep Quality', vals:{ '30d':{v:'82%',   d:'↑ +2%',  g:true},  '60d':{v:'80%',   d:'↑ +4%',  g:true},   '90d':{v:'77%',   d:'↑ +6%',  g:true}  } },
    { k:'Stress Score',  vals:{ '30d':{v:'34',    d:'↓ −5%',  g:true},  '60d':{v:'37',    d:'↓ −10%', g:true},   '90d':{v:'40',    d:'↓ −15%', g:true}  } },
    { k:'SpO₂',          vals:{ '30d':{v:'97.4%', d:'stable', g:false}, '60d':{v:'97.3%', d:'stable', g:false},  '90d':{v:'97.4%', d:'stable', g:false} } },
  ],
  snapshotCallout: '✓ HRV +14%, recovery markers strong',
  sleep14: [7.6, 7.4, 7.8, 7.5, 7.7, 7.3, 7.9, 7.6, 7.5, 7.8, 7.4, 7.6, 7.7, 7.5],
  sleepStats: { deep: '92 min', debt: '0.4h', quality: '82%', deepFlag: false, debtFlag: false },
  sleepCallout: '✓ Sleep architecture solid, minor deep sleep variability',
  monitoring: { days: 156, lastSync: 'Apr 10, 2026' },
  cycles: [
    { id:'C1', start:'Dec 20 2025', end:'Dec 24', period:5, len:30, ov:'Jan 02', ovDay:14, notes:'Long luteal 16d', flag:false,
      temps: buildTemps(30, 14, 92.0, 93.4) },
    { id:'C2', start:'Jan 19 2026', end:'Jan 23', period:5, len:30, ov:'Feb 01', ovDay:14, notes:'Long luteal 16d', flag:false,
      temps: buildTemps(30, 14, 92.0, 93.5) },
    { id:'C3', start:'Feb 18 2026', end:'Feb 22', period:5, len:30, ov:'Mar 02', ovDay:13, notes:'Long luteal 17d', flag:false,
      temps: buildTemps(30, 13, 91.9, 93.4) },
    { id:'C4', start:'Mar 20 2026', end:'Mar 24', period:5, len:30, ov:'Apr 01', ovDay:13, notes:'Long luteal 17d', flag:false,
      temps: buildTemps(30, 13, 92.0, 93.5) },
  ],
  cycleAvg: { period: '5.0', len: '30.0 (SD 0.0)', sd: '0.0' },
  cycleNote: 'SD 0.0 — highly regular, consistent extended luteal phase',
  cycleClinicalNote: 'Strong biphasic shift, ovulation Day 13-14, luteal plateau 93.4-93.5°F sustained 16-17 days. Suggests robust progesterone production.',
  trends: [
    { label:'HRV', current:'58 ms', badge:'+14% over 90d', badgeColor:{bg:'#ECFDF5',fg:'#065F46'},
      cols:[{p:'90d',v:'51'},{p:'60d',v:'55'},{p:'30d',v:'58'}],
      line:[51,52,53,54,55,55,56,57,58], stroke:C.ok },
    { label:'Resting HR', current:'59 bpm', badge:'Healthy', badgeColor:{bg:'#EEF2FF',fg:'#3730A3'},
      cols:[{p:'90d',v:'60'},{p:'60d',v:'59'},{p:'30d',v:'59'}],
      line:[60,60,59,60,59,59,59,58,59], stroke:C.indigo },
    { label:'Stress Score', current:'34', badge:'−15% over 90d', badgeColor:{bg:'#ECFDF5',fg:'#065F46'},
      cols:[{p:'90d',v:'40'},{p:'60d',v:'37'},{p:'30d',v:'34'}],
      line:[40,39,38,37,36,36,35,35,34], stroke:C.ok },
  ],
  blood: [
    { k:'Vitamin D (25-OH)',    v:'52 ng/mL',   r:'30–60',     s:'Optimal' },
    { k:'HbA1c',                v:'5.1%',       r:'< 5.7%',    s:'Optimal' },
    { k:'TSH',                  v:'1.9 mIU/L',  r:'0.4–4.0',   s:'Optimal' },
    { k:'Ferritin',             v:'94 ng/mL',   r:'30–300',    s:'Optimal' },
    { k:'Total Cholesterol',    v:'176 mg/dL',  r:'< 200',     s:'Optimal' },
    { k:'Omega-3 Index',        v:'8.6%',       r:'> 8%',      s:'Optimal' },
    { k:'Testosterone (total)', v:'38 ng/dL',   r:'15–70',     s:'Normal'  },
    { k:'FSH',                  v:'5.4 mIU/mL', r:'1.5–12.4',  s:'Normal'  },
    { k:'LH',                   v:'4.8 mIU/mL', r:'1.7–8.6',   s:'Normal'  },
    { k:'Prolactin',            v:'10.2 ng/mL', r:'4.0–15.2',  s:'Normal'  },
    { k:'Estradiol',            v:'118 pg/mL',  r:'30–400',    s:'Normal'  },
    { k:'AMH',                  v:'2.9 ng/mL',  r:'1.0–4.0',   s:'Normal'  },
  ],
  bloodDate: 'Feb 14, 2026',
  bloodWarning: undefined,
  supps: [
    { k:'Vitamin D3 + K2',     d:'3000 IU · morning', a:94,  i:'D3 stable at 52 ng/mL' },
    { k:'Omega-3 (EPA/DHA)',   d:'1.5g EPA · lunch',  a:92,  i:'Index 8.6% — at target' },
    { k:'Magnesium glycinate', d:'400mg · evening',   a:95,  i:'+12 min deep sleep' },
    { k:'B-complex (active)',  d:'1 cap · morning',   a:91,  i:'Energy + methylation support' },
    { k:'Probiotic',           d:'10B CFU · morning', a:88,  i:'Gut + immune' },
    { k:'CoQ10',               d:'100mg · morning',   a:89,  i:'Egg quality / preconception' },
  ],
  suppsAvg: 92,
  habits: [
    { k:'Pilates',           f:'4x/week · 7 AM',    amt:'50 min avg',   impact:'+8ms HRV on workout days',       pos:true  },
    { k:'Walking',           f:'Daily',             amt:'30 min avg',   impact:'Stress −10% on walk days',       pos:true  },
    { k:'Caffeine',          f:'Daily · 9 AM',      amt:'1.5 cups/day', impact:'No measurable sleep impact',     pos:true  },
    { k:'Cold shower',       f:'4x/week · Morning', amt:'90 sec avg',   impact:'Alertness +18% AM',              pos:true  },
    { k:'Meditation',        f:'5x/week · Evening', amt:'12 min avg',   impact:'Stress score −9% same day',      pos:true  },
    { k:'Alcohol',           f:'1x/week · Social',  amt:'1 drink avg',  impact:'No measurable next-day impact',  pos:true  },
  ],
  insights: [
    { t:'Long luteal phase (16-17d) consistent across 4 cycles — strong progesterone signal', c:91 },
    { t:'Pilates 4x/week best HRV correlator (+8ms on workout days)', c:86 },
    { t:'Stress trending down 15% with daily meditation routine', c:84 },
    { t:'Omega-3 index reached 8.6% target after 5 months supplementation', c:88 },
    { t:'Sleep consistency 7.5-7.9h driving steady HRV gains', c:82 },
    { t:'No identified negative habits in current logging period', c:78 },
  ],
  insightsAlerts: [
    { sev:'LOW', title:'Long luteal phase noted — consider mid-luteal progesterone if planning' },
    { sev:'LOW', title:'No active concerns — annual recheck cadence appropriate' },
    { sev:'LOW', title:'Continue preconception supplement stack' },
  ],
  strengths: [
    'Robust biphasic shift across all 4 cycles',
    'All blood markers optimal',
    'Extended luteal phase suggests strong progesterone',
    'Supplement adherence 92%, lifestyle balanced',
  ],
  concerns: [
    'Long luteal phase — monitor if conception planned',
    'No major modifiable risk factors identified',
    'Maintain current regimen',
    'Re-evaluate AMH in 12 months',
  ],
  partner: [
    { k:'Testosterone (total)', v:'584 ng/dL',  r:'300–1000', s:'Normal' },
    { k:'FSH',                  v:'4.6 mIU/mL', r:'1.5–12.4', s:'Normal' },
    { k:'LH',                   v:'4.9 mIU/mL', r:'1.7–8.6',  s:'Normal' },
    { k:'Prolactin',            v:'8.8 ng/mL',  r:'4.0–15.2', s:'Normal' },
    { k:'Estradiol',            v:'29 pg/mL',   r:'10–40',    s:'Normal' },
    { k:'DHEA-S',               v:'358 ug/dL',  r:'211–492',  s:'Normal' },
  ],
  partnerDate: 'Feb 8, 2026 · External lab',
  partnerStatus: 'All Normal',
  gaps: [
    { s:'LOW', t:'Semen analysis',         n:'Within last 6 months, current. No action needed.' },
    { s:'LOW', t:'Medication history',     n:'Logged and current.' },
    { s:'LOW', t:'Genetic / genomic data', n:'Not uploaded. Optional carrier screening.' },
  ],
};

const PATIENT_DATA: Record<string, PatientData> = {
  priya: PRIYA,
  ananya: ANANYA,
  deepa: DEEPA,
  riya: RIYA,
};

export const getPatientData = (id: string): PatientData => PATIENT_DATA[id] ?? PRIYA;

export const PAGES: Array<{ key: string; path: string; label: string }> = [
  { key: 'overview',   path: '/',          label: 'Overview' },
  { key: 'cycle',      path: '/cycle',     label: 'Cycle & Temperature' },
  { key: 'biomarkers', path: '/biomarkers',label: 'Biomarkers & Blood' },
  { key: 'lifestyle',  path: '/lifestyle', label: 'Lifestyle' },
  { key: 'insights',   path: '/insights',  label: 'AI Insights' },
  { key: 'partner',    path: '/partner',   label: 'Partner Health' },
];
