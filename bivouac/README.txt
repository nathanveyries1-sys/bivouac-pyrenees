====================================================================
  BIVOUAC PYRÉNÉES 2025 — Guide d'installation en 15 minutes
====================================================================

Le site fonctionne SANS Firebase (les votes sont sauvegardés
localement sur ton ordinateur). Pour partager à tes amis et voir
leurs votes, il faut Firebase + Vercel. C'est gratuit et ça prend
15 minutes.

====================================================================
  ÉTAPE 1 — Créer une base de données Firebase (5 min)
====================================================================

1. Va sur https://console.firebase.google.com
2. Clique "Créer un projet"
   - Nom : bivouac-pyrenees-2025
   - Désactive Google Analytics (pas besoin)
   - Clique "Créer le projet"

3. Dans le menu de gauche, clique "Firestore Database"
   - Clique "Créer une base de données"
   - Choisis "Commencer en mode test" (pour les premiers tests)
   - Sélectionne "eur3 (Europe)" comme région
   - Clique "Activer"

4. Récupère ta configuration :
   - Clique l'icône ⚙️ (Paramètres du projet) en haut à gauche
   - Va dans "Paramètres du projet" > "Général"
   - Descends jusqu'à "Vos applications"
   - Clique l'icône </> (Web)
   - Nomme l'app : "bivouac-web"
   - Clique "Enregistrer l'application"
   - Tu verras un bloc de code avec toutes tes clés

5. Copie ces valeurs dans js/firebase-config.js :
   apiKey:            "ta-vraie-cle"
   authDomain:        "ton-projet.firebaseapp.com"
   projectId:         "ton-projet-id"
   storageBucket:     "ton-projet.appspot.com"
   messagingSenderId: "123456789"
   appId:             "1:123:web:abc"

6. Ajoute le SDK Firebase dans index.html, vote.html et admin.html.
   Juste avant </body>, ajoute ces 3 lignes :
   
   <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

   (à placer AVANT la ligne <script src="js/firebase-config.js">)

====================================================================
  ÉTAPE 2 — Mettre en ligne sur Vercel (5 min)
====================================================================

1. Va sur https://github.com et crée un compte (gratuit)

2. Crée un nouveau dépôt :
   - Clique "+" > "New repository"
   - Nom : bivouac-pyrenees
   - Visibilité : Public
   - Clique "Create repository"

3. Upload tes fichiers :
   - Clique "uploading an existing file"
   - Glisse-dépose TOUT le dossier bivouac/
   - Clique "Commit changes"

4. Va sur https://vercel.com
   - Clique "Sign up" > "Continue with GitHub"
   - Autorise Vercel à accéder à GitHub

5. Déploie :
   - Clique "Add New Project"
   - Sélectionne ton dépôt "bivouac-pyrenees"
   - Clique "Deploy" (pas besoin de changer les paramètres)
   - Attends 1-2 minutes...

6. Ton site est en ligne ! 🎉
   Tu auras une URL du type :
   https://bivouac-pyrenees.vercel.app

====================================================================
  ÉTAPE 3 — Partager à tes amis
====================================================================

Envoie leur simplement le lien :
https://bivouac-pyrenees.vercel.app/vote.html

Et pour voir les résultats :
https://bivouac-pyrenees.vercel.app/admin.html

====================================================================
  SANS FIREBASE — Mode test local
====================================================================

Sans configurer Firebase, le site fonctionne quand même :
- Les votes sont sauvegardés dans le navigateur (localStorage)
- Les résultats sur admin.html montrent les votes locaux
- ⚠️  Les votes ne sont PAS partagés entre différents navigateurs

Ce mode est parfait pour tester le site avant de le publier.

====================================================================
  STRUCTURE DES FICHIERS
====================================================================

bivouac/
├── index.html          ← Page d'accueil
├── vote.html           ← Formulaire de vote (4 étapes)
├── admin.html          ← Résultats et tableau de bord
├── css/
│   └── style.css       ← Tout le style
├── js/
│   ├── firebase-config.js  ← Config Firebase + données
│   ├── vote.js             ← Logique du formulaire
│   └── admin.js            ← Logique des résultats
└── README.txt          ← Ce guide

====================================================================
  MODIFIER LES DATES PROPOSÉES
====================================================================

Dans js/firebase-config.js, modifie le tableau DATES_DATA :

const DATES_DATA = [
  { id: "sep06", label: "Sam 6 – Dim 7 sept.", month: "sep" },
  ...
];

====================================================================
