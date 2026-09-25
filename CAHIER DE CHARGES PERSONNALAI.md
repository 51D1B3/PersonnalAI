📘 Cahier des charges — PersonalAI

Nom



PersonalAI



Slogan proposé



« Ma mémoire numérique, intelligente et privée. »



Identité visuelle

Mode principal : 🌑 sombre

Couleur principale : #51D1B3

Texte : blanc / gris clair

Style : minimaliste, moderne, professionnel

Interface responsive : ordinateur + téléphone

1\. 🎯 Objectif du projet



PersonalAI est une plateforme web privée permettant à son propriétaire de centraliser, organiser, sécuriser et retrouver intelligemment ses ressources personnelles.



L'utilisateur pourra conserver :



📄 PDF

📝 documents

🖼️ images et captures d'écran

🎥 vidéos

🔗 liens Internet

💻 logiciels et ressources

📚 cours

📝 notes personnelles

🤖 ressources liées aux IA

🔐 informations confidentielles



Au lieu de parcourir manuellement ses fichiers, l'utilisateur pourra écrire une description naturelle :



« Retrouve-moi le cours PDF où j'ai appris les hooks React. »



PersonalAI recherchera alors les éléments correspondant à la demande.



2\. 👤 Utilisateurs



La première version est volontairement personnelle.



Comptes autorisés



Seulement deux adresses email prédéfinies pourront accéder à PersonalAI.



Compte 1 → ✅ Autorisé

Compte 2 → ✅ Autorisé

Autre email → ❌ Refusé



Il n'y aura donc pas d'inscription publique.



3\. 🏠 Tableau de bord



Après connexion :



┌───────────────────────────────────────────┐

│ PersonalAI                 🔍   👤   ⚙️  │

├─────────────┬─────────────────────────────┤

│             │                             │

│ 🏠 Accueil │   Bonjour Sidibé 👋          │

│             │                             │

│ 📄 Documents│  🔎 Que recherches-tu ?    │

│             │                             │

│ 🖼️ Images  │                             │

│             │   Résultats                 │

│ 🎥 Vidéos  │                             │

│             │   📄 React Hooks.pdf       │

│ 🔗 Liens   │   🖼️ capture-react.png     │

│             │   🔗 Documentation React   │

│ 📝 Notes   │                             │

│             │                             │

│ 🤖 Recherche│                            │

└─────────────┴─────────────────────────────┘

4\. 📂 Gestion des ressources



Chaque ressource aura des informations comme :



Titre

Description

Type

Catégorie

Tags

Date d'ajout

Date de modification

Emplacement

Fichier



Exemple :



Titre : React Hooks

Type : PDF

Catégorie : Développement Web

Tags : React, JavaScript, Hooks

Description : Cours sur useState et useEffect

5\. 🔎 Recherche classique



Avant même d'utiliser l'IA, PersonalAI devra permettre :



recherche par nom

recherche par catégorie

recherche par type

recherche par tag

recherche par date



Exemple :



React



→ tous les éléments associés à React.



6\. 🤖 Recherche intelligente



C'est le cœur du projet.



L'utilisateur écrit :



« Je cherche mon cours sur la gestion de l'état avec React »



PersonalAI comprend le sens de la demande et recherche dans :



titres

descriptions

tags

texte des PDF

texte des images

transcriptions vidéo



Puis retourne les résultats les plus pertinents.



7\. 🧠 Intelligence artificielle



Pour rester gratuit au départ :



IA locale



Ollama



Elle permettra d'utiliser des modèles IA directement sur ton ordinateur.



Architecture :



Recherche utilisateur

&#x20;       ↓

Backend

&#x20;       ↓

Modèle IA

&#x20;       ↓

Recherche vectorielle

&#x20;       ↓

Résultats

8\. 🔢 Recherche vectorielle



On utilisera :



PostgreSQL + pgvector



Chaque contenu important pourra être transformé en embedding.



Document

&#x20;  ↓

Extraction du contenu

&#x20;  ↓

Embedding

&#x20;  ↓

pgvector



Puis :



"cours sur React Hooks"

&#x20;          ↓

&#x20;      embedding

&#x20;          ↓

&#x20;   recherche vectorielle

&#x20;          ↓

&#x20;  documents similaires

9\. 📄 Gestion des PDF



Lorsqu'un PDF est ajouté :



Upload PDF

&#x20;   ↓

Extraction du texte

&#x20;   ↓

Découpage

&#x20;   ↓

Embedding

&#x20;   ↓

Stockage



Cela permettra de rechercher à l'intérieur du PDF.



10\. 🖼️ Gestion des images



Pour les captures d'écran :



Image

&#x20;↓

OCR

&#x20;↓

Texte détecté

&#x20;↓

Embedding

&#x20;↓

Recherche



Technologie proposée :



Tesseract OCR



Exemple :



Une capture contient :



Prisma P1001 Database unreachable



Tu recherches :



« ma capture concernant une erreur Prisma »



PersonalAI pourra retrouver l'image.



11\. 🎥 Gestion des vidéos



Cette fonctionnalité viendra plus tard.



Vidéo

&#x20;↓

Audio

&#x20;↓

Whisper

&#x20;↓

Transcription

&#x20;↓

Embedding



Tu pourrais ensuite chercher :



« vidéo où j'apprends NestJS »



12\. 🔗 Gestion des liens



Tu pourras enregistrer :



Nom

URL

Description

Catégorie

Tags



Exemple :



Nom : Supabase

URL : ...

Catégorie : Backend

Tags : PostgreSQL, Cloud, Auth

13\. 📝 Gestion des notes



PersonalAI aura un système de notes :



titre

contenu

tags

catégorie

date



Exemple :



Configuration Supabase



SUPABASE\_URL=...

DATABASE\_URL=...

JWT\_SECRET=...



⚠️ Pour les vrais secrets, il faudra prévoir un coffre-fort chiffré séparé, plutôt que de les stocker comme une simple note.



14\. 🔐 Sécurité



La sécurité est une priorité.



Authentification

deux emails autorisés

mot de passe sécurisé

sessions sécurisées

possibilité de 2FA

Protection

HTTPS

JWT/session sécurisée

rate limiting

validation des fichiers

limitation des tailles

protection contre les injections

protection XSS

protection CSRF selon l'architecture

logs de sécurité

15\. 🗄️ Architecture technique finale



Je recommande :



PERSONALAI

│

├── Frontend

│   ├── React

│   ├── Vite

│   ├── TypeScript

│   └── Tailwind CSS

│

├── Backend

│   ├── NestJS

│   ├── TypeScript

│   └── API REST

│

├── Database

│   ├── PostgreSQL

│   └── pgvector

│

├── Storage

│   └── Supabase Storage

│

├── Authentication

│   └── Supabase Auth / backend sécurisé

│

├── AI

│   └── Ollama

│

├── OCR

│   └── Tesseract

│

└── Video

&#x20;   └── Whisper

🚀 ORDRE EXACT DE RÉALISATION



C'est la partie la plus importante.



Ne commence pas par l'IA.



PHASE 1 — Préparation

Étape 1



Définir le projet et son architecture.



Étape 2



Créer le dépôt GitHub :



PersonalAI

Étape 3



Créer :



PersonalAI/

├── frontend/

└── backend/

Étape 4



Installer/configurer :



Node.js

Git

VS Code

PostgreSQL/Supabase

éventuellement Docker

Ollama plus tard

PHASE 2 — Frontend

Étape 5



Créer le projet React/Vite.



Étape 6



Configurer TypeScript.



Étape 7



Installer Tailwind CSS.



Étape 8



Créer le thème Dark + #51D1B3.



Étape 9



Créer :



Login

Dashboard

Sidebar

Header

SearchBar

Étape 10



Créer les pages :



Accueil

Documents

Images

Vidéos

Liens

Notes

Recherche

Paramètres



À ce stade, l'interface existe mais aucune donnée réelle n'est encore connectée.



PHASE 3 — Backend

Étape 11



Créer NestJS.



Étape 12



Configurer :



Controllers

Services

Modules

Guards

DTO

Étape 13



Créer l'API.



Exemple :



POST   /auth/login

GET    /documents

POST   /documents

DELETE /documents/:id



GET    /images

POST   /images



GET    /links

POST   /links



GET    /notes

POST   /notes

PHASE 4 — Base de données

Étape 14



Créer le projet Supabase.



Étape 15



Créer PostgreSQL.



Étape 16



Créer les tables.



users

documents

images

videos

links

notes

tags

Étape 17



Ajouter les relations.



Étape 18



Ajouter pgvector.



PHASE 5 — Authentification

Étape 19



Créer les deux comptes autorisés.



Étape 20



Bloquer toute autre adresse.



Étape 21



Créer la connexion.



Étape 22



Créer la déconnexion.



Étape 23



Ajouter protection des routes.



PHASE 6 — Upload

Étape 24



Permettre l'upload des PDF.



Étape 25



Permettre les images.



Étape 26



Permettre les fichiers autorisés.



Étape 27



Stocker les fichiers dans Storage.



Étape 28



Enregistrer leurs métadonnées dans PostgreSQL.



PHASE 7 — Recherche classique

Étape 29



Créer :



Recherche par nom

Recherche par catégorie

Recherche par tag

Recherche par type

Étape 30



Ajouter filtres et tri.



À ce stade, PersonalAI est déjà utilisable sans IA.



PHASE 8 — 🧠 IA



Maintenant seulement on ajoute l'intelligence.



Étape 31



Installer Ollama.



Étape 32



Installer un modèle local adapté.



Étape 33



Tester l'IA indépendamment du site.



Étape 34



Installer/configurer le modèle d'embeddings.



Étape 35



Créer le service :



EmbeddingService

Étape 36



Transformer les documents en embeddings.



Étape 37



Stocker les embeddings dans pgvector.



Étape 38



Créer :



POST /search/semantic

PHASE 9 — Recherche intelligente

Étape 39



L'utilisateur écrit :



« cours où j'ai appris les hooks React »



Étape 40



Backend :



Question

&#x20;↓

Embedding

&#x20;↓

pgvector

&#x20;↓

Résultats

Étape 41



Afficher les résultats avec un score de pertinence.



PHASE 10 — OCR

Étape 42



Installer Tesseract.



Étape 43



Analyser les captures.



Étape 44



Extraire leur texte.



Étape 45



Créer leurs embeddings.



Étape 46



Permettre la recherche dans les images.



PHASE 11 — Vidéos



Plus tard.



Étape 47



Installer Whisper.



Étape 48



Extraire les transcriptions.



Étape 49



Créer les embeddings.



Étape 50



Recherche dans les vidéos.



PHASE 12 — Sécurité avancée

Étape 51



Rate limiting.



Étape 52



Validation stricte des fichiers.



Étape 53



Protection des API.



Étape 54



Journal des connexions.



Étape 55



Journal des suppressions/téléchargements.



Étape 56



2FA.



Étape 57



Chiffrement des informations réellement sensibles.



PHASE 13 — Tests



Tester :



Connexion

Déconnexion

Upload

Suppression

Téléchargement

Recherche

Recherche IA

OCR

Permissions

Sécurité

Responsive



Tester également :



Compte autorisé → ✅



Compte non autorisé → ❌



PHASE 14 — Déploiement



Quand tout fonctionne localement :



Frontend → Vercel

Backend → Cloud Run / autre serveur

Database → Supabase

Storage → Supabase

IA → serveur personnel/local



⚠️ Pour une application contenant tes données personnelles, je ne mettrais pas immédiatement l'IA locale sur un serveur public. On décidera plus tard où elle doit tourner selon ton ordinateur et tes besoins.



🎯 Les versions du projet



Je te conseille de faire exactement ceci :



PersonalAI V1



Gestionnaire personnel



✅ Login

✅ Deux comptes

✅ Dashboard

✅ PDF

✅ Images

✅ Liens

✅ Notes

✅ Recherche classique

✅ Dark mode

✅ #51D1B3



PersonalAI V2



Recherche intelligente



✅ Ollama

✅ Embeddings

✅ pgvector

✅ Recherche sémantique

✅ Recherche dans PDF



PersonalAI V3



Mémoire multimédia



✅ OCR

✅ Recherche dans images

✅ Whisper

✅ Recherche dans vidéos



PersonalAI V4



Coffre-fort



✅ 2FA

✅ Chiffrement

✅ Logs

✅ Sécurité renforcée

✅ Sauvegardes

✅ Permissions avancées




Ne commence surtout pas par installer Ollama, pgvector, Whisper, OCR, etc.



On va construire PersonalAI étape par étape, mais avec une architecture propre dès le départ.



Premier objectif : obtenir PersonalAI V1 fonctionnel avec React + NestJS + Supabase, connexion des deux comptes, dashboard sombre #51D1B3 et gestion des PDF/images/liens/notes.



Ensuite seulement, on branche l'IA.

