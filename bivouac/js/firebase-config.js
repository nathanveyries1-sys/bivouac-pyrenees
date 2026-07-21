// ============================================================
//  CONFIGURATION FIREBASE
//  Remplace les valeurs ci-dessous par celles de ton projet Firebase
//  (Voir guide d'installation dans README.txt)
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyD1xHeVJBpHnjvm61s04bGaw9gwVVXvh40",
  authDomain: "bivouac-pyrenees-2026.firebaseapp.com",
  projectId: "bivouac-pyrenees-2026",
  storageBucket: "bivouac-pyrenees-2026.firebasestorage.app",
  messagingSenderId: "272841154045",
  appId: "1:272841154045:web:5c90bb53928ab3ff530d94"
};

// ============================================================
//  DONNÉES DES ITINÉRAIRES
// ============================================================
const HIKES_DATA = {
  ayous: { name: "Lacs d'Ayous", diff: "Intermédiaire", dist: "19 km", dplus: "1 100 m", duration: "2 jours" },
  neouv: { name: "Réserve du Néouvielle", diff: "Facile", dist: "16 km", dplus: "750 m", duration: "2 jours" },
  oo:    { name: "Lac d'Oô & Cirque de Cézy", diff: "Difficile", dist: "22 km", dplus: "1 400 m", duration: "2 jours" }
};

// ============================================================
//  DATES PROPOSÉES
// ============================================================
const DATES_DATA = [
  { id: "sep06", label: "Sam 6 – Dim 7 sept.", month: "sep" },
  { id: "sep13", label: "Sam 13 – Dim 14 sept.", month: "sep" },
  { id: "sep20", label: "Sam 20 – Dim 21 sept.", month: "sep" },
  { id: "sep27", label: "Sam 27 – Dim 28 sept.", month: "sep" },
  { id: "oct04", label: "Sam 4 – Dim 5 oct.", month: "oct" },
  { id: "oct11", label: "Sam 11 – Dim 12 oct.", month: "oct" },
  { id: "oct18", label: "Sam 18 – Dim 19 oct.", month: "oct" },
  { id: "oct25", label: "Sam 25 – Dim 26 oct.", month: "oct" }
];

// ============================================================
//  INITIALISATION FIREBASE
// ============================================================
let db = null;
let firebaseReady = false;

function initFirebase() {
  try {
    if (typeof firebase === 'undefined') return;
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    firebaseReady = true;
    console.log("✅ Firebase connecté");
  } catch(e) {
    console.warn("⚠️ Firebase non configuré — mode localStorage activé", e);
  }
}

// ============================================================
//  STOCKAGE : Firebase OU localStorage (fallback)
// ============================================================
async function saveVote(voteData) {
  if (firebaseReady && db) {
    try {
      await db.collection("votes").add({ ...voteData, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      return true;
    } catch(e) { console.warn("Firebase write error, fallback localStorage", e); }
  }
  // Fallback localStorage
  const votes = getLocalVotes();
  votes.push({ ...voteData, timestamp: Date.now(), id: Date.now().toString() });
  localStorage.setItem("biv_votes", JSON.stringify(votes));
  return true;
}

async function getAllVotes() {
  if (firebaseReady && db) {
    try {
      const snap = await db.collection("votes").orderBy("timestamp", "desc").get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch(e) { console.warn("Firebase read error, fallback localStorage", e); }
  }
  return getLocalVotes();
}

async function deleteVote(id) {
  if (firebaseReady && db) {
    try { await db.collection("votes").doc(id).delete(); return; } catch(e) {}
  }
  const votes = getLocalVotes().filter(v => v.id !== id);
  localStorage.setItem("biv_votes", JSON.stringify(votes));
}

async function deleteAllVotes() {
  if (firebaseReady && db) {
    try {
      const snap = await db.collection("votes").get();
      const batch = db.batch();
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      return;
    } catch(e) {}
  }
  localStorage.removeItem("biv_votes");
}

function getLocalVotes() {
  try { return JSON.parse(localStorage.getItem("biv_votes") || "[]"); }
  catch(e) { return []; }
}

// Init au chargement
window.addEventListener('DOMContentLoaded', initFirebase);
