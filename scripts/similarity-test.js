import { OPENAI_API_KEY } from "../config.js";
import { TEST_GROUPS } from "../data/test-sentences.js";
import { embedTexts, cosineSimilarity } from "../lib/embeddings.js";

if (!OPENAI_API_KEY) {
  console.error("請在 .env 設定 OPENAI_API_KEY");
  process.exit(1);
}

/** 輸出 n 句兩兩相似度 */
function printPairwiseMatrix(label, sentences, vectors) {
  console.log(`\n=== ${label} ===\n`);
  for (let i = 0; i < sentences.length; i++) {
    console.log(`[${i + 1}] ${sentences[i]}`);
  }
  console.log("");

  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const score = cosineSimilarity(vectors[i], vectors[j]);
      console.log(
        `  (${i + 1}) ↔ (${j + 1}) 相似度：${score.toFixed(4)}  「${sentences[i].slice(0, 12)}…」↔「${sentences[j].slice(0, 12)}…」`,
      );
    }
  }
}

console.log("Embeddings 相似度實驗（text-embedding-3-small + 餘弦相似度）\n");

const summaryLines = [];

for (const group of TEST_GROUPS) {
  const vectors = await embedTexts(group.sentences);
  printPairwiseMatrix(group.name, group.sentences, vectors);

  const pairs = [];
  for (let i = 0; i < group.sentences.length; i++) {
    for (let j = i + 1; j < group.sentences.length; j++) {
      pairs.push(cosineSimilarity(vectors[i], vectors[j]));
    }
  }
  const avg = pairs.reduce((a, b) => a + b, 0) / pairs.length;
  summaryLines.push(`${group.name} 平均兩兩相似度：${avg.toFixed(4)}`);
}

console.log("\n--- 摘要 ---");
for (const line of summaryLines) {
  console.log(line);
}
console.log(`
預期：第1組（咖啡）兩兩相似度通常高於第2組（不相關主題）。
第3組（手搖飲）因都圍繞飲料偏好，相似度應介於第1組與第2組之間或接近第1組。
請將以上數值貼入 README.md 作業繳交。`);
