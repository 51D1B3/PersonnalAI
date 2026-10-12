import { OllamaClient } from './ollama.client.js';
import { aiConfig } from './config.js';

async function testStatus() {
  console.log('\n=============================================');
  console.log('🔍 [TEST 1] VÉRIFICATION DE LA CONNEXION OLLAMA');
  console.log('=============================================');
  console.log(`URL configurée : ${aiConfig.ollamaUrl}`);

  const client = new OllamaClient();
  const status = await client.getStatus();

  if (status.isOnline) {
    console.log('✅ Statut : EN LIGNE (Connecté)');
    console.log(`📦 Modèles installés (${status.models.length}) :`);
    status.models.forEach((m) => console.log(`   - ${m}`));
    console.log(`🎯 Modèle Embedding (${aiConfig.embeddingModel}) : ${status.hasEmbeddingModel ? '✅ Détecté' : '⚠️ Non trouvé (exécutez: ollama pull nomic-embed-text)'}`);
    console.log(`🧠 Modèle LLM (${aiConfig.llmModel}) : ${status.hasLlmModel ? '✅ Détecté' : '⚠️ Non trouvé (exécutez: ollama pull ' + aiConfig.llmModel + ')'}`);
  } else {
    console.log('⚠️ Statut : HORS LIGNE');
    console.log(`Message : ${status.message}`);
    console.log('\n💡 Pour démarrer Ollama :');
    console.log('   1. Ouvrez un terminal et tapez : ollama serve');
    console.log('   2. Ou lancez l\'application Ollama depuis Windows');
    console.log('   3. Téléchargez le modèle d\'embeddings : ollama pull nomic-embed-text');
  }
  console.log('=============================================\n');
}

testStatus().catch(console.error);
