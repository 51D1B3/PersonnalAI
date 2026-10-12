# 🧠 PersonalAI — Service IA (Module Autonome)

Ce dossier `ai-service/` contient le moteur d'Intelligence Artificielle de **PersonalAI**. Il est conçu pour être testé et utilisé de manière **100% indépendante**, puis relié directement au backend NestJS et au frontend React.

---

## 📋 Fonctionnalités

1. **Détection Ollama locale** : Vérifie l'état du serveur local Ollama et la présence des modèles.
2. **Génération d'Embeddings sémantiques** : Transforme n'importe quel texte en vecteur de dimension 1536 (compatible PostgreSQL pgvector).
3. **Moteur de recherche sémantique** : Calcule la similarité cosinus entre une requête et des documents.
4. **Moteur RAG (Retrieval-Augmented Generation)** : Trouve les extraits pertinents et synthétise une réponse personnalisée basée sur vos documents privés.
5. **Microservice HTTP (port 5000)** : Serveur léger autonome avec API REST.

---

## 🚀 Guide de démarrage rapide

### Étape 1 : Installer les dépendances du dossier IA
Dans un terminal, placez-vous dans ce dossier :
```bash
cd c:\Users\SIDIBE\Projects\React\PersonnalAI\ai-service
npm install
```

### Étape 2 : Lancer et préparer Ollama (sur votre machine)
1. Démarrez Ollama dans un terminal séparé :
   ```bash
   ollama serve
   ```
2. Téléchargez les modèles recommandés :
   ```bash
   # Modèle d'embeddings sémantiques (rapide, ~274 MB)
   ollama pull nomic-embed-text

   # Modèle LLM pour le texte et le RAG (au choix selon votre RAM) :
   ollama pull llama3
   # OU une version ultra légère et rapide :
   # ollama pull qwen2.5:1.5b
   ```

*(Note : Même si Ollama n'est pas encore lancé, le service possède un moteur vectoriel autonome déterministe pour fonctionner sans interruption.)*

---

## 🧪 Commandes de Test Autonomes

Vous pouvez tester chaque composant indépendamment sans lancer le reste du projet :

```bash
# 1. Tester la connexion Ollama & détection des modèles
npm run test:status

# 2. Tester la génération d'embeddings (vecteur 1536 dim)
npm run test:embedding

# 3. Tester la recherche sémantique (similarité cosinus)
npm run test:search

# 4. Tester le RAG (question / réponse sur document)
npm run test:rag

# 5. Lancer tous les tests d'un coup
npm run test:all
```

---

## 🌐 Lancer le microservice IA (Optionnel)

Pour faire tourner le service IA sur le port 5000 :
```bash
npm run start
```
Endpoints disponibles :
- `GET http://localhost:5000/status` : Statut du service et d'Ollama
- `POST http://localhost:5000/embedding` : `{ "text": "mon texte" }`
- `POST http://localhost:5000/search` : `{ "query": "react", "documents": [...] }`
- `POST http://localhost:5000/rag` : `{ "question": "mot de passe wifi", "documents": [...] }`
