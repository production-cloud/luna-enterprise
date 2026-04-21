import { jsPDF } from 'jspdf';
import { type Patient, type PatientData } from './data';

export function downloadPatientSummary(patient: Patient, data: PatientData) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const ensureSpace = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const h1 = (t: string) => {
    ensureSpace(28);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(15, 23, 42);
    doc.text(t, margin, y); y += 22;
  };
  const h2 = (t: string) => {
    ensureSpace(22);
    y += 6;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(91, 79, 207);
    doc.text(t.toUpperCase(), margin, y); y += 14;
    doc.setDrawColor(226, 232, 240); doc.line(margin, y - 6, pageW - margin, y - 6);
  };
  const p = (t: string, color: [number, number, number] = [51, 65, 85]) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(t, pageW - margin * 2);
    ensureSpace(lines.length * 12 + 2);
    doc.text(lines, margin, y); y += lines.length * 12 + 2;
  };
  const kv = (k: string, v: string) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(71, 85, 105);
    doc.text(k, margin, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(15, 23, 42);
    doc.text(v, margin + 140, y); y += 14;
  };

  // Header
  doc.setFillColor(91, 79, 207);
  doc.rect(0, 0, pageW, 6, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(91, 79, 207);
  doc.text('LUNA LIFEOS · CLINICAL SUMMARY', margin, y); y += 18;
  h1(`${patient.name} · Age ${patient.age}`);
  p(`Last sync: ${patient.sync}  ·  ${patient.days} days continuous monitoring`, [100, 116, 139]);
  p(`Generated: ${new Date().toLocaleString()}`, [148, 163, 184]);

  // Active Alerts
  h2('Active alerts');
  data.alerts.forEach(a => {
    const color: [number, number, number] = a.sev === 'HIGH' ? [239, 68, 68] : a.sev === 'MED' ? [245, 158, 11] : [148, 163, 184];
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...color);
    ensureSpace(14);
    doc.text(`[${a.sev}]`, margin, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(a.t, pageW - margin * 2 - 50);
    doc.text(lines, margin + 50, y); y += Math.max(14, lines.length * 12);
  });

  // Cycle summary
  h2('Cycle history (last 4 cycles)');
  kv('Average period', `${data.cycleAvg.period} days`);
  kv('Average length', `${data.cycleAvg.len}`);
  kv('Current phase', `${data.phase.name} · Day ${data.phase.day} (Cycle ${data.phase.cycleNo})`);
  y += 4;
  data.cycles.forEach(c => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(15, 23, 42);
    doc.text(`${c.id}`, margin, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(71, 85, 105);
    doc.text(`${c.start} → period ${c.period}d, length ${c.len}d, OV ${c.ov}${c.notes !== '—' ? ' · ' + c.notes : ''}`, margin + 30, y);
    y += 13;
  });
  p(data.cycleClinicalNote, [55, 65, 81]);

  // Blood panel
  h2(`Blood panel · ${data.bloodDate}`);
  data.blood.forEach(b => {
    ensureSpace(13);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(51, 65, 85);
    doc.text(b.k, margin, y);
    doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    doc.text(b.v, margin + 180, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 116, 139);
    doc.text(`(${b.r})`, margin + 270, y);
    const sColor: [number, number, number] = b.s === 'Optimal' ? [16, 185, 129] : b.s === 'Below Target' ? [245, 158, 11] : b.s === 'Flag' ? [239, 68, 68] : [100, 116, 139];
    doc.setTextColor(...sColor); doc.setFont('helvetica', 'bold');
    doc.text(b.s, margin + 380, y);
    y += 13;
  });
  if (data.bloodWarning) p(data.bloodWarning, [146, 64, 14]);

  // Supplements
  h2(`Supplements · avg adherence ${data.suppsAvg}%`);
  data.supps.forEach(s => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(15, 23, 42);
    doc.text(s.k, margin, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 116, 139);
    doc.text(s.d, margin + 160, y);
    doc.setTextColor(15, 23, 42);
    doc.text(s.a !== null ? `${s.a}%` : (s.aLabel ?? ''), margin + 300, y);
    doc.setTextColor(6, 95, 70);
    const lines = doc.splitTextToSize(s.i, 180);
    doc.text(lines, margin + 350, y);
    y += Math.max(14, lines.length * 11);
  });

  // Insights
  h2('AI insights');
  data.insights.forEach(i => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(91, 79, 207);
    doc.text(`${i.c}%`, margin, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(i.t, pageW - margin * 2 - 40);
    doc.text(lines, margin + 40, y);
    y += Math.max(13, lines.length * 12);
  });

  // Footer on last page
  doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(148, 163, 184);
  ensureSpace(20);
  y += 10;
  doc.text('Luna LifeOS · AI-generated correlational summary. Not diagnostic. Interpret alongside clinical judgment.', margin, y);

  doc.save(`Luna_${patient.name.replace(/\s+/g, '_')}_Summary.pdf`);
}
