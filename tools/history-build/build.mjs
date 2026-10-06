import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eras, topics, reviews, metadata } from "./curriculum.mjs";
import { questions } from "./questions.mjs";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const target = path.join(root, "public/history/data");
const { documents } = JSON.parse(
  fs.readFileSync(path.join(target, "sources.json"), "utf8"),
);
const pyqMapping = [
  ["colonial-economy", "league-revolutionaries"],
  ["revolt-1857", "colonial-economy", "ina"],
  ["wars-world", "integration", "states-reorganisation"],
  ["gandhi-early", "revolt-1857", "war-quit-india", "wars-world"],
  ["ambedkar", "gandhi-early", "states-reorganisation", "ideologies-world"],
  ["gandhi-early", "revolt-1857", "planning", "ideologies-world"],
  ["revenue-colonial", "women-students", "integration", "industrial-world"],
  ["revolt-1857", "swadeshi", "states-reorganisation", "ideologies-world"],
  ["colonial-economy", "gandhi-early", "congress", "partition-rehab"],
  ["ideologies-world", "swadeshi", "integration", "ideologies-world"],
  ["gupta", "reform-west", "gandhi-early"],
  ["states-reorganisation", "industrial-world", "harappa"],
  ["akbar-culture", "bhakti-sufi", "colonial-economy"],
  ["industrial-world", "wars-world"],
];
let year = null;
const mainsQuestions = [];
for (const slide of documents.find((d) => d.id === "mains-pyq").slides) {
  const paragraphs = [...slide.paragraphs];
  const match = paragraphs[0]?.match(/^(20\d{2})\b/);
  if (match) {
    year = Number(match[1]);
    paragraphs.shift();
  }
  if (paragraphs.length !== pyqMapping[slide.number - 1].length)
    throw new Error(`PYQ mapping mismatch at slide ${slide.number}`);
  paragraphs.forEach((prompt, index) =>
    mainsQuestions.push({
      id: `mains-${slide.number}-${index + 1}`,
      year,
      topicId: pyqMapping[slide.number - 1][index],
      prompt,
      sources: [
        { sourceId: "mains-pyq", from: slide.number, to: slide.number },
      ],
      provenance: "transcribed-from-supplied-deck",
      officialPaperVerified: false,
    }),
  );
}
const curriculum = { ...metadata, eras, topics, reviews, mainsQuestions };
fs.writeFileSync(
  path.join(target, "curriculum.json"),
  JSON.stringify(curriculum, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(target, "questions.json"),
  JSON.stringify({ schemaVersion: 1, questions }, null, 2) + "\n",
);
console.log(
  `Built ${eras.length} eras, ${topics.length} topics (${topics.filter((t) => t.status === "gap").length} gaps), ${questions.length} MCQs and ${mainsQuestions.length} mains prompts.`,
);
