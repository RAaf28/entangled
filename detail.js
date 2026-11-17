// Drives Detail.html: step 0 = pick a PR, 1 = linked, 2 = merged.
const INK = '#14201C', PAPER = '#F1F2EC', MUTED = '#4D5953', BLUE = '#1B3BC4';
const MONO = "font-family: 'IBM Plex Mono', monospace";
const PRS = [
  { n: 17, title: 'feat: halaman login', author: 'Rafa', taken: true },
  { n: 18, title: 'feat: endpoint hasil panen', author: 'Enggar', taken: false },
  { n: 19, title: 'fix: validasi form', author: 'Dimas', taken: false }
];
let step = 0, picked = null;
const $ = (id) => document.getElementById(id);

function render() {
  const pr = PRS.find((p) => p.n === picked) || PRS[1];

  const vias = ['', 'saat PR ditautkan', 'saat PR di-merge'];
  $('stations').innerHTML = ['To Do', 'In Progress', 'Done'].map((name, i) =>
    '<li style="display: flex; align-items: center; gap: 12px">' +
    (i ? '<span style="min-width: 150px; padding-bottom: 4px; border-bottom: 2px solid ' + INK + '; ' + MONO + '; font-size: 12px; color: ' + MUTED + '; text-align: center">' + vias[i] + '</span>' : '') +
    '<span' + (i === step ? ' aria-current="step"' : '') + ' style="display: inline-flex; align-items: center; min-height: 44px; padding: 0 18px; border: 2px solid ' + INK + '; font-weight: 600; background: ' + (i === step ? INK : 'transparent') + '; color: ' + (i === step ? PAPER : i < step ? INK : MUTED) + '; text-decoration: ' + (i < step ? 'line-through' : 'none') + '">' + name + '</span></li>'
  ).join('');

  $('statusLine').textContent = [
    'Status sekarang: To Do. Belum ada bukti kerja yang tertaut.',
    'Status sekarang: In Progress. Mengikuti PR #' + pr.n + ' yang masih terbuka.',
    'Status sekarang: Done, terverifikasi dari merge PR #' + pr.n + '.'
  ][step];

  $('prs').innerHTML = PRS.map((p) =>
    '<label style="display: flex; align-items: flex-start; gap: 14px; min-height: 56px; padding: 14px 0; box-sizing: border-box; border-bottom: 1px solid #C3C8BD; cursor: pointer; color: ' + (p.taken ? MUTED : INK) + '">' +
    '<input type="radio" name="pr" value="' + p.n + '"' + (p.n === picked ? ' checked' : '') + (p.taken ? ' disabled' : '') + ' style="width: 20px; height: 20px; margin: 2px 0 0; accent-color: ' + INK + '; flex-shrink: 0">' +
    '<span style="display: flex; flex-direction: column; gap: 2px">' +
    '<span style="display: flex; flex-wrap: wrap; gap: 4px 12px; align-items: baseline"><span style="' + MONO + '">PR #' + p.n + '</span><span style="font-weight: 600">' + p.title + '</span><span style="font-size: 14px">oleh ' + p.author + '</span></span>' +
    (p.taken ? '<span style="font-size: 14px; color: #A63D08; font-weight: 500">Tidak bisa dipilih: sudah tertaut ke ENT-11 · Halaman login. <a href="#ent-11" style="color: #A63D08; font-weight: 600">Buka ENT-11</a></span>' : '') +
    '</span></label>'
  ).join('');

  $('consequence').textContent = picked
    ? 'Yang akan terjadi: ENT-14 pindah ke In Progress sekarang. Saat PR #' + picked + ' di-merge di GitHub, ENT-14 pindah ke Done otomatis dan tercatat di Log Aktivitas.'
    : 'Pilih satu PR untuk melihat apa yang akan terjadi pada status item ini.';

  const link = $('link');
  link.disabled = !picked;
  link.textContent = picked ? 'Tautkan PR #' + picked : 'Pilih PR dulu';
  link.style.background = picked ? INK : '#C3C8BD';
  link.style.color = picked ? PAPER : '#3A443F';

  [0, 1, 2].forEach((i) => { $('p' + i).hidden = i !== step; });
  document.querySelectorAll('.prN').forEach((e) => { e.textContent = pr.n; });
  document.querySelectorAll('.prTitle').forEach((e) => { e.textContent = pr.title; });
  document.querySelectorAll('.prAuthor').forEach((e) => { e.textContent = pr.author; });

  const feed = [];
  if (step >= 2) feed.push(['10.02', 'GitHub', BLUE, pr.author + ' me-merge PR #' + pr.n + ' · In Progress → Done, otomatis']);
  if (step >= 1) feed.push(['09.40', 'Anggota', INK, 'Enggar menautkan PR #' + pr.n + ' · To Do → In Progress']);
  feed.push(['09.31', 'Anggota', INK, 'Enggar membuat work item ini']);
  $('feed').innerHTML = feed.map((f) =>
    '<li style="display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid #C3C8BD; font-size: 15px">' +
    '<span style="' + MONO + '; font-size: 13px; color: ' + MUTED + '; flex-shrink: 0; padding-top: 2px">' + f[0] + '</span>' +
    '<span><span style="font-weight: 600; color: ' + f[2] + '">' + f[1] + '</span> · ' + f[3] + '</span></li>'
  ).join('');
}

$('prs').addEventListener('change', (e) => { picked = Number(e.target.value); render(); });
$('link').onclick = () => { if (picked) { step = 1; render(); } };
$('unlink').onclick = () => { step = 0; render(); };
$('merge').onclick = () => { step = 2; render(); };
$('reset').onclick = () => { step = 0; picked = null; render(); };
render();
