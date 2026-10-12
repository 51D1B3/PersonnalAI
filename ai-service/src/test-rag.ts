import { RagEngine, type DocumentContext } from './rag.js';

async function testRag() {
  console.log('\n=============================================');
  console.log('🧠 [TEST 4] TEST DU MOTEUR RAG (RÉPONSE AUGMENTÉE)');
  console.log('=============================================');

  const rag = new RagEngine();

  const documents: DocumentContext[] = [
    {
      id: 'doc-wifi',
      title: 'Notes Secrètes Maison.txt',
      type: 'NOTE',
      content: 'Le code wifi de la box salon est : SuperSecretKey2026! Ne pas partager.',
    },
    {
      id: 'doc-react',
      title: 'Formation React.pdf',
      type: 'PDF',
      content: 'useEffect permet d\'exécuter des effets de bord après le rendu du composant.',
    },
  ];

  const question = "Quel est le code du wifi de la maison ?";
  console.log(`Question posée : "${question}"\n`);

  const response = await rag.ask(question, documents);

  console.log('📋 SOURCES IDENTIFIÉES :');
  response.sources.forEach((s) => {
    console.log(`   - "${s.title}" (Score: ${s.similarity}%) -> Extrait : "${s.snippet}"`);
  });

  console.log('\n🤖 RÉPONSE DE L\'IA :');
  console.log(`"${response.answer}"`);
  console.log(`\n(Généré via Ollama : ${response.usedOllama ? 'OUI ✅' : 'NON (Mode Fallback) ℹ️'})`);
  console.log('=============================================\n');
}

testRag().catch(console.error);
