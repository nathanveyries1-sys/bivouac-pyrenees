// ============================================================
//  ADMIN.JS — Affichage des résultats
// ============================================================

async function loadResults() {
  document.getElementById('totalVotes').textContent = 'Chargement…';

  try {
    const votes = await getAllVotes();
    renderResults(votes);
  } catch(e) {
    document.getElementById('totalVotes').textContent = 'Erreur de chargement.';
    console.error(e);
  }
}

// ============================================================
//  RENDU PRINCIPAL
// ============================================================
function renderResults(votes) {
  const total = votes.length;
  document.getElementById('totalVotes').textContent =
    total === 0 ? 'Aucun vote pour l\'instant' :
    total === 1 ? '1 personne a voté' :
    total + ' personnes ont voté';

  document.getElementById('participantCount').textContent = total;

  if (total === 0) {
    document.getElementById('winnerCard').style.display = 'none';
    document.getElementById('participantsBody').innerHTML =
      '<tr><td colspan="5" class="empty-row">🗳️ Aucun vote pour l\'instant. Partagez le lien à vos amis !</td></tr>';
    renderChartHikes({}, 0);
    renderChartDates({}, 0);
    return;
  }

  // Compter votes par itinéraire
  const hikeCount = {};
  Object.keys(HIKES_DATA).forEach(k => hikeCount[k] = 0);
  votes.forEach(v => (v.hikes || []).forEach(h => hikeCount[h] = (hikeCount[h] || 0) + 1));

  // Compter votes par date
  const dateCount = {};
  DATES_DATA.forEach(d => dateCount[d.id] = 0);
  votes.forEach(v => (v.dates || []).forEach(d => dateCount[d] = (dateCount[d] || 0) + 1));

  // Trouver le gagnant optimal
  const bestHikeId = Object.keys(hikeCount).sort((a,b) => hikeCount[b] - hikeCount[a])[0];
  const bestDateId = Object.keys(dateCount).sort((a,b) => dateCount[b] - dateCount[a])[0];

  if (bestHikeId && bestDateId) {
    const bestHike = HIKES_DATA[bestHikeId];
    const bestDate = DATES_DATA.find(d => d.id === bestDateId);
    const hikeVoters = votes.filter(v => (v.hikes||[]).includes(bestHikeId)).map(v => v.prenom);
    const dateVoters = votes.filter(v => (v.dates||[]).includes(bestDateId)).map(v => v.prenom);
    const common = hikeVoters.filter(p => dateVoters.includes(p));

    document.getElementById('winnerCard').style.display = 'flex';
    document.getElementById('winnerHike').textContent = bestHike.name;
    document.getElementById('winnerDate').textContent = bestDate ? bestDate.label : '—';
    document.getElementById('winnerDetail').textContent =
      `${hikeCount[bestHikeId]} vote(s) pour cet itinéraire · ` +
      `${dateCount[bestDateId]} personne(s) disponible(s) ce week-end` +
      (common.length ? ` · Commun : ${common.join(', ')}` : '');
  }

  renderChartHikes(hikeCount, total);
  renderChartDates(dateCount, total);
  renderTable(votes, hikeCount, dateCount);
}

// ============================================================
//  GRAPHIQUE ITINÉRAIRES
// ============================================================
function renderChartHikes(hikeCount, total) {
  const wrap = document.getElementById('chartHikes');
  wrap.innerHTML = '';

  const sorted = Object.keys(HIKES_DATA).sort((a,b) => (hikeCount[b]||0) - (hikeCount[a]||0));
  const maxVal = Math.max(...Object.values(hikeCount), 1);

  sorted.forEach(id => {
    const cnt = hikeCount[id] || 0;
    const pct = Math.round(cnt / maxVal * 100);
    const voters = []; // On n'a pas accès aux noms ici directement, OK

    const row = document.createElement('div');
    row.className = 'chart-row';
    row.innerHTML = `
      <div class="chart-label">
        <span class="chart-name">${HIKES_DATA[id].name}</span>
        <span class="chart-count">${cnt} vote${cnt>1?'s':''}</span>
      </div>
      <div class="chart-bar-bg">
        <div class="chart-bar" style="width:${pct}%"></div>
      </div>
    `;
    wrap.appendChild(row);
  });
}

// ============================================================
//  GRAPHIQUE DATES
// ============================================================
function renderChartDates(dateCount, total) {
  const wrap = document.getElementById('chartDates');
  wrap.innerHTML = '';

  const sorted = [...DATES_DATA].sort((a,b) => (dateCount[b.id]||0) - (dateCount[a.id]||0));
  const maxVal = Math.max(...Object.values(dateCount), 1);

  sorted.slice(0, 6).forEach(d => {
    const cnt = dateCount[d.id] || 0;
    const pct = Math.round(cnt / maxVal * 100);

    const row = document.createElement('div');
    row.className = 'chart-row';
    row.innerHTML = `
      <div class="chart-label">
        <span class="chart-name">${d.label}</span>
        <span class="chart-count">${cnt}/${total}</span>
      </div>
      <div class="chart-bar-bg">
        <div class="chart-bar blue" style="width:${pct}%"></div>
      </div>
    `;
    wrap.appendChild(row);
  });
}

// ============================================================
//  TABLEAU DES PARTICIPANTS
// ============================================================
function renderTable(votes, hikeCount, dateCount) {
  const tbody = document.getElementById('participantsBody');
  tbody.innerHTML = '';

  if (votes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Aucun vote pour l\'instant</td></tr>';
    return;
  }

  votes.forEach(v => {
    const hikesStr = (v.hikes || []).map(h => HIKES_DATA[h]?.name || h).join('<br>');
    const datesStr = (v.dates || []).map(id => DATES_DATA.find(d => d.id === id)?.label || id).join('<br>');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escHtml(v.prenom || '—')}</strong></td>
      <td>${hikesStr || '—'}</td>
      <td>${datesStr || '—'}</td>
      <td style="color:var(--text-muted);font-style:italic">${escHtml(v.comment || '')}</td>
      <td><button class="btn-delete" onclick="removeVote('${v.id}')">🗑️</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// ============================================================
//  SUPPRIMER UN VOTE
// ============================================================
async function removeVote(id) {
  if (!confirm('Supprimer ce vote ?')) return;
  try {
    await deleteVote(id);
    loadResults();
  } catch(e) { alert('Erreur lors de la suppression.'); }
}

// ============================================================
//  RESET TOTAL
// ============================================================
async function resetAll() {
  if (!confirm('Supprimer TOUS les votes ? Cette action est irréversible.')) return;
  try {
    await deleteAllVotes();
    loadResults();
  } catch(e) { alert('Erreur.'); }
}

// ============================================================
//  UTILITAIRES
// ============================================================
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Attendre que Firebase soit prêt
  setTimeout(loadResults, 500);
  // Actualisation auto toutes les 30s
  setInterval(loadResults, 30000);
});
