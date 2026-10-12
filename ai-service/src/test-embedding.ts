import { EmbeddingService } from './embedding.js';

async function testEmbedding() {
  console.log('\n=============================================');
  console.log('📐 [TEST 2] TEST DE GÉNÉRATION D\'EMBEDDINGS');
  console.log('=============================================');

  const service = new EmbeddingService();
  const samplePhrase = "Cours complet sur les React Hooks useState et useEffect";
  console.log(`Texte d'entrée : "${samplePhrase}"`);

  const startTime = Date.now();
  const result = await service.generate(samplePhrase);
  const elapsed = Date.now() - startTime;

  console.log(`⏱️ Temps de génération : ${elapsed} ms`);
  console.log(`📡 Source : ${result.source}`);
  console.log(`🏷️ Modèle utilisé : ${result.model}`);
  console.log(`📏 Dimensions du vecteur : ${result.dimensions}`);
  console.log(`🔬 Échantillon des 5 premières dimensions : [${result.vector.slice(0, 5).join(', ')}]`);

  if (result.dimensions === 1536) {
    console.log('✅ Compatibilité pgvector Supabase (1536 dim) : VALIDÉ');
  } else {
    console.log(`⚠️ Dimensions : ${result.dimensions}`);
  }
  console.log('=============================================\n');
}

testEmbedding().catch(console.error);
