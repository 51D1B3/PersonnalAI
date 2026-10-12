import { EmbeddingService } from './embedding.js';
import { SimilarityEngine } from './similarity.js';

async function testSearch() {
  console.log('\n=============================================');
  console.log('🔎 [TEST 3] TEST DE RECHERCHE SÉMANTIQUE VECTORIELLE');
  console.log('=============================================');

  const embeddingService = new EmbeddingService();

  const documents = [
    { id: '1', title: 'React Hooks Deep Dive.pdf', content: 'Guide complet sur useState, useEffect et useRef pour React' },
    { id: '2', title: 'Configuration Supabase & PostgreSQL.md', content: 'Mise en place de la base de données relationnelle et pgvector' },
    { id: '3', title: 'Recette de gâteau au chocolat.txt', content: 'Ingrédients : chocolat noir 200g, beurre, oeufs et farine' },
    { id: '4', title: 'Architecture NestJS Microservices.pdf', content: 'Mise en place de contrôleurs, modules et services injectables' },
  ];

  const query = "cours où j'ai appris la gestion d'état dans React";
  console.log(`Requête utilisateur : "${query}"\n`);
  console.log('📚 Documents dans la base :');
  documents.forEach((d) => console.log(`   - [${d.id}] ${d.title}`));

  console.log('\nCalcul des embeddings et similarités...');
  const queryEmb = await embeddingService.generate(query);

  const candidates = await Promise.all(
    documents.map(async (doc) => {
      const emb = await embeddingService.generate(`${doc.title} ${doc.content}`);
      return { item: doc, vector: emb.vector };
    })
  );

  const results = SimilarityEngine.rank(queryEmb.vector, candidates);

  console.log('\n📊 RÉSULTATS DU CLASSEMENT PAR PERTINENCE SÉMANTIQUE :');
  results.forEach((r, idx) => {
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '  ';
    console.log(`${medal} Rang #${idx + 1} | Score : ${r.percentage}% (${r.similarity}) -> ${r.item.title}`);
  });

  const top = results[0];
  if (top && top.item.id === '1') {
    console.log('\n✅ TEST RÉUSSI : Le document React Hooks a été identifié en 1ère position !');
  } else {
    console.log('\n⚠️ Le document attendu n\'est pas en 1ère position.');
  }
  console.log('=============================================\n');
}

testSearch().catch(console.error);
