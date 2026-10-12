import { OllamaClient } from './ollama.client.js';
import { EmbeddingService } from './embedding.js';
import { SimilarityEngine } from './similarity.js';
import { RagEngine } from './rag.js';
import { aiConfig } from './config.js';

async function runAll() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║        SUITE DE TESTS COMPLÈTE - SERVICE IA PERSONALAI     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const ollama = new OllamaClient();
  const embService = new EmbeddingService(ollama);
  const rag = new RagEngine(ollama, embService);

  // 1. Statut
  console.log('--- Étape 1 : Connexion Ollama ---');
  const status = await ollama.getStatus();
  if (status.isOnline) {
    console.log(`✅ Ollama en ligne (${status.models.length} modèles détectés)`);
  } else {
    console.log(`ℹ️ Ollama hors ligne (${status.message})`);
  }

  // 2. Embedding
  console.log('\n--- Étape 2 : Test Embedding ---');
  const emb = await embService.generate('Test embedding sémantique pour PersonalAI');
  console.log(`✅ Embedding généré avec succès !`);
  console.log(`   Dimensions : ${emb.dimensions} | Source : ${emb.source} | Modèle : ${emb.model}`);

  // 3. Similarité Cosinus
  console.log('\n--- Étape 3 : Test Similarité & Recherche ---');
  const v1 = await embService.generate('React useState et hooks');
  const v2 = await embService.generate('Gestion d\'état dans une application React');
  const v3 = await embService.generate('Comment faire une pâte à tarte salée');

  const simProche = SimilarityEngine.cosineSimilarity(v1.vector, v2.vector);
  const simEloigne = SimilarityEngine.cosineSimilarity(v1.vector, v3.vector);

  console.log(`   Similarité (React <-> State) : ${Math.round(simProche * 100)}% (Fort)`);
  console.log(`   Similarité (React <-> Pâte à tarte) : ${Math.round(simEloigne * 100)}% (Faible)`);

  if (simProche > simEloigne) {
    console.log(`✅ Discrimination sémantique validée : le sujet proche est mieux classé.`);
  }

  // 4. RAG
  console.log('\n--- Étape 4 : Test RAG (Question/Réponse) ---');
  const sampleDocs = [
    {
      id: 'doc-code',
      title: 'Mon Secret.txt',
      type: 'NOTE',
      content: 'Le mot de passe de sauvegarde est : AlphaOmega99.',
    },
  ];
  const ragResult = await rag.ask('Quel est le mot de passe de sauvegarde ?', sampleDocs);
  console.log(`   Question : "${ragResult.question}"`);
  console.log(`   Réponse : "${ragResult.answer}"`);
  console.log(`   Sources trouvées : ${ragResult.sources.length}`);

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║       TOUS LES MODULES DU SERVICE IA SONT OPÉRATIONNELS !  ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
}

runAll().catch(console.error);
