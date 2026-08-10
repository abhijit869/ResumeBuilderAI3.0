export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const valA = a[i] || 0;
    const valB = b[i] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Computes embeddings for an array of strings.
 * Safe dynamic import with lightweight frequency fallback to ensure zero runtime server crashes.
 */
export async function computeEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  try {
    const { pipeline, env } = await import("@xenova/transformers");
    env.allowLocalModels = false;
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { quantized: true });
    const output = await extractor(texts, { pooling: "mean", normalize: true });
    const embeddings: number[][] = [];
    const batchSize = output.dims[0];
    const embedDim = output.dims[1];
    for (let i = 0; i < batchSize; i++) {
      const vec: number[] = [];
      for (let j = 0; j < embedDim; j++) {
        vec.push(output.data[i * embedDim + j]);
      }
      embeddings.push(vec);
    }
    return embeddings;
  } catch {
    // Lightweight fallback token frequency vector generator
    return texts.map((text) => {
      const words = text.toLowerCase().split(/\W+/).filter(Boolean);
      const vec = new Array(64).fill(0);
      for (const word of words) {
        let hash = 0;
        for (let i = 0; i < word.length; i++) {
          hash = (hash << 5) - hash + word.charCodeAt(i);
          hash |= 0;
        }
        vec[Math.abs(hash) % 64] += 1;
      }
      return vec;
    });
  }
}
