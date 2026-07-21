// ============================================================
//  VOTE.JS — Logique du formulaire de vote
// ============================================================

let currentStep = 1;
let selectedHikes = [];
let selectedDates = [];

const TOTAL_STEPS = 4;

// ============================================================
//  NAVIGATION ENTRE ÉTAPES
// ============================================================
function goStep(n) {
  // Validation étape 1
  if (currentStep === 1 && n > 1) {
    const prenom = document.getElementById('inputPrenom').value.trim();
    if (!prenom) {
      document.getElementById('inputPrenom').focus();
      document.getElementById('inputPrenom').style.borderColor = '#dc2626';
      return;
    }
    document.getElementById('inputPrenom').style.borderColor = '';
  }

  // Validation étape 2
  if (currentStep === 2 && n > 2) {
    if (selectedHikes.length === 0) {
      alert("Choisis au moins un itinéraire avant de continuer !");
      return;
    }
  }

  // Validation étape 3
  if (currentStep === 3 && n > 3) {
    if (selectedDates.length === 0) {
      alert("Coche au moins une date de disponibilité !");
      return;
    }
    buildRecap();
  }

  // Masquer étape courante
  document.getElementById('step' + currentStep).classList.remove('active');
  document.getElementById('pstep' + currentStep).classList.remove('active');
  document.getElementById('pstep' + currentStep).classList.add('done');

  currentStep = n;

  // Afficher nouvelle étape
  document.getElementById('step' + currentStep).classList.add('active');
  document.getElementById('pstep' + currentStep).classList.add('active');
  document.getElementById('pstep' + currentStep).classList.remove('done');

  // Mettre à jour la barre de progression
  const pct = ((currentStep - 1) / TOTAL_STEPS) * 100;
  document.getElementById('progressFill').style.width = pct + '%';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
//  GESTION DES ITINÉRAIRES
// ============================================================
function toggleHike(id) {
  const idx = selectedHikes.indexOf(id);
  if (idx === -1) {
    selectedHikes.push(id);
    document.getElementById('card-' + id).classList.add('selected');
    document.getElementById('sel-' + id).classList.add('selected');
    document.getElementById('sel-' + id).innerHTML = '<span class="sel-circle"></span> ✓ Sélectionné';
  } else {
    selectedHikes.splice(idx, 1);
    document.getElementById('card-' + id).classList.remove('selected');
    document.getElementById('sel-' + id).classList.remove('selected');
    document.getElementById('sel-' + id).innerHTML = '<span class="sel-circle"></span> Choisir';
  }
}

// ============================================================
//  CALENDRIER DES DATES
// ============================================================
function buildCalendar() {
  const gridSep = document.getElementById('datesGridSep');
  const gridOct = document.getElementById('datesGridOct');
  if (!gridSep || !gridOct) return;

  DATES_DATA.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'date-btn';
    btn.id = 'dbtn-' + d.id;
    btn.innerHTML = `
      <div class="date-day">${d.label.split(' ')[0]}</div>
      <div class="date-range">${d.label}</div>
      <div class="date-check" id="dchk-${d.id}"></div>
    `;
    btn.onclick = () => toggleDate(d.id);
    if (d.month === 'sep') gridSep.appendChild(btn);
    else gridOct.appendChild(btn);
  });
}

function toggleDate(id) {
  const idx = selectedDates.indexOf(id);
  const btn = document.getElementById('dbtn-' + id);
  const chk = document.getElementById('dchk-' + id);
  if (idx === -1) {
    selectedDates.push(id);
    btn.classList.add('selected');
    chk.textContent = '✓ Disponible';
  } else {
    selectedDates.splice(idx, 1);
    btn.classList.remove('selected');
    chk.textContent = '';
  }
}

// ============================================================
//  RÉCAPITULATIF AVANT ENVOI
// ============================================================
function buildRecap() {
  const prenom = document.getElementById('inputPrenom').value.trim();
  const hikesLabels = selectedHikes.map(h => HIKES_DATA[h]?.name || h).join(', ');
  const datesLabels = selectedDates.map(id => DATES_DATA.find(d => d.id === id)?.label || id).join(', ');

  document.getElementById('voteRecap').innerHTML = `
    <div class="recap-row">👤 <strong>Prénom :</strong> ${prenom}</div>
    <div class="recap-row">🏔️ <strong>Itinéraire(s) :</strong> ${hikesLabels}</div>
    <div class="recap-row">📅 <strong>Dates :</strong> ${datesLabels}</div>
  `;
}

// ============================================================
//  ENVOI DU VOTE
// ============================================================
async function submitVote() {
  const prenom = document.getElementById('inputPrenom').value.trim();
  const comment = document.getElementById('inputComment').value.trim();

  if (!prenom || selectedHikes.length === 0 || selectedDates.length === 0) {
    alert("Informations incomplètes !");
    return;
  }

  const btn = document.querySelector('.btn-send');
  btn.disabled = true;
  btn.textContent = '⏳ Envoi en cours…';

  try {
    await saveVote({
      prenom,
      hikes: selectedHikes,
      dates: selectedDates,
      comment,
    });

    // Afficher page succès
    document.getElementById('step4').classList.remove('active');
    document.getElementById('stepSuccess').classList.add('active');
    document.getElementById('progressFill').style.width = '100%';
    document.getElementById('successMsg').textContent =
      `Merci ${prenom} ! Ton vote a bien été enregistré. Tu peux voir les résultats en temps réel sur la page des résultats.`;

  } catch(e) {
    alert("Erreur lors de l'envoi. Réessaie !");
    btn.disabled = false;
    btn.textContent = '✅ Envoyer mon vote';
  }
}

// ============================================================
//  RÉINITIALISER POUR UN AUTRE VOTE
// ============================================================
function resetVote() {
  selectedHikes = [];
  selectedDates = [];
  currentStep = 1;
  document.getElementById('inputPrenom').value = '';
  document.getElementById('inputComment').value = '';

  // Réinitialiser cartes
  ['ayous', 'neouv', 'oo'].forEach(id => {
    document.getElementById('card-' + id)?.classList.remove('selected');
    const sel = document.getElementById('sel-' + id);
    if (sel) { sel.classList.remove('selected'); sel.innerHTML = '<span class="sel-circle"></span> Choisir'; }
  });

  // Réinitialiser dates
  DATES_DATA.forEach(d => {
    document.getElementById('dbtn-' + d.id)?.classList.remove('selected');
    const chk = document.getElementById('dchk-' + d.id);
    if (chk) chk.textContent = '';
  });

  document.getElementById('stepSuccess').classList.remove('active');
  document.getElementById('step1').classList.add('active');
  document.getElementById('progressFill').style.width = '0%';
  document.querySelectorAll('.pstep').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i === 0) el.classList.add('active');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
//  CARTES LEAFLET
// ============================================================
function initMaps() {
  if (typeof L === 'undefined') return;

  const maps = [
    {
      id: 'map-ayous',
      center: [42.878, -0.467],
      zoom: 12,
      start: [42.840, -0.432],
      bivouac: [42.901, -0.483],
      startLabel: 'Départ — Gabas',
      bivouacLabel: 'Bivouac — Lac Gentau',
      route: [[42.840, -0.432],[42.855, -0.445],[42.870, -0.460],[42.885, -0.472],[42.901, -0.483]]
    },
    {
      id: 'map-neouv',
      center: [42.835, 0.385],
      zoom: 12,
      start: [42.820, 0.395],
      bivouac: [42.848, 0.372],
      startLabel: 'Départ — Lac d\'Orédon',
      bivouacLabel: 'Bivouac — Lac d\'Aubert',
      route: [[42.820, 0.395],[42.830, 0.388],[42.840, 0.378],[42.848, 0.372]]
    },
    {
      id: 'map-oo',
      center: [42.805, 0.558],
      zoom: 12,
      start: [42.782, 0.567],
      bivouac: [42.820, 0.548],
      startLabel: 'Départ — Granges d\'Astau',
      bivouacLabel: 'Bivouac — Lac d\'Oô',
      route: [[42.782, 0.567],[42.793, 0.561],[42.806, 0.553],[42.820, 0.548]]
    }
  ];

  maps.forEach(m => {
    const el = document.getElementById(m.id);
    if (!el) return;

    const map = L.map(m.id, { zoomControl: true, scrollWheelZoom: false }).setView(m.center, m.zoom);
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap',
      maxZoom: 15
    }).addTo(map);

    // Tracé
    L.polyline(m.route, { color: '#2d6040', weight: 3, opacity: 0.8 }).addTo(map);

    // Marqueur départ (vert)
    const iconStart = L.divIcon({ className: '', html: '<div style="width:14px;height:14px;border-radius:50%;background:#22c55e;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>', iconSize: [14,14], iconAnchor: [7,7] });
    L.marker(m.start, { icon: iconStart }).addTo(map).bindPopup(m.startLabel);

    // Marqueur bivouac (orange)
    const iconBiv = L.divIcon({ className: '', html: '<div style="width:16px;height:16px;border-radius:50%;background:#f59e0b;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>', iconSize: [16,16], iconAnchor: [8,8] });
    L.marker(m.bivouac, { icon: iconBiv }).addTo(map).bindPopup(m.bivouacLabel);
  });
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  buildCalendar();
  // Attendre que Leaflet soit chargé
  setTimeout(initMaps, 300);

  // Enter sur le champ prénom
  const inp = document.getElementById('inputPrenom');
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') goStep(2); });
});
