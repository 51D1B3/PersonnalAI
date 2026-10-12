export interface ScoredItem<T> {
  item: T;
  similarity: number; // 0 à 1 (ou pourcentage 0% à 100%)
  percentage: number;
}

export class SimilarityEngine {
  /**
   * Calcule la similarité cosinus entre deux vecteurs numériques
   */
  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
    const len = Math.min(vecA.length, vecB.length);

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < len; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    if (denom === 0) return 0;

    const sim = dot / denom;
    // Borner entre 0 et 1 pour des vecteurs normalisés
    return Math.max(0, Math.min(1, sim));
  }

  /**
   * Trie une liste d'éléments vectorisés selon leur proximité avec un vecteur de requête
   */
  static rank<T>(
    queryVector: number[],
    candidates: Array<{ item: T; vector: number[] }>,
    limit = 10,
    threshold = 0.1
  ): ScoredItem<T>[] {
    const scored: ScoredItem<T>[] = candidates.map((c) => {
      const sim = this.cosineSimilarity(queryVector, c.vector);
      return {
        item: c.item,
        similarity: Number(sim.toFixed(4)),
        percentage: Math.round(sim * 100),
      };
    });

    return scored
      .filter((s) => s.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
}
