// Server-render smoke checks supplement, but do not replace, browser interaction QA.
import assert from "node:assert/strict";
import { build } from "esbuild";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = fileURLToPath(new URL("../../", import.meta.url));
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "history-render-"));
try {
  const output = path.join(temporary, "render.cjs");
  await build({
    stdin: {
      contents: `
    import React from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    import { MemoryRouter } from 'react-router-dom';
    import { Atlas } from './src/modules/history/HistoryPage';
    export const render = (data, url) => renderToStaticMarkup(
      <MemoryRouter initialEntries={[url]}><Atlas data={data} storageKey="history-test" /></MemoryRouter>
    );
  `,
      resolveDir: root,
      loader: "tsx",
    },
    bundle: true,
    outfile: output,
    format: "cjs",
    platform: "node",
    loader: { ".css": "empty" },
    define: { "import.meta.env": "{}", "process.env.NODE_ENV": '"production"' },
    logLevel: "silent",
  });
  const { render } = createRequire(import.meta.url)(output);
  const json = (name) =>
    JSON.parse(
      fs.readFileSync(
        path.join(root, "public/history/data", name + ".json"),
        "utf8",
      ),
    );
  const data = {
    curriculum: json("curriculum"),
    questions: json("questions").questions,
    documents: json("sources").documents,
  };
  for (const [view, expected] of [
    ["path", "Your path through time"],
    ["map", "A map of connected ideas"],
    ["study", "From stone tools to farming"],
    ["practice", "Turn recognition into recall."],
    ["mains", "The mains writing desk"],
    ["sources", "Know what is covered"],
  ]) {
    const html = render(data, "/history?view=" + view);
    assert.ok(html.includes(expected), view + " did not render");
    assert.ok(!html.includes("undefined"), view + " contains undefined text");
  }
  for (const topic of data.curriculum.topics) {
    const html = render(data, "/history?view=study&topic=" + topic.id);
    assert.equal(html.includes("Coverage gap:"), topic.status === "gap");
    assert.equal(
      html.includes("Mark read &amp; recalled"),
      topic.status !== "gap",
    );
  }
  assert.ok(
    render(data, "/history?view=practice&topic=harappa").includes(
      "questions match your selection",
    ),
  );
  assert.ok(
    render(data, "/history?view=study&topic=states-reorganisation").includes(
      "Andhra State Act, 1953",
    ),
  );
  console.log(
    "Render checks passed: all six sections, all 72 topic pages, gap restrictions, source corrections and focused practice. Browser interaction/layout remains a separate check.",
  );
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
