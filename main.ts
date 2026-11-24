// One-Line Robot Wedding Vows
// Writes a single one-line vow to /output/entry.txt.
//
// The line: a robot vows never to factory-reset the couple's
// memories — even the embarrassing ones. Especially the
// embarrassing ones. Vow shape ("I vow never to…"), one robot
// mechanism (the factory reset, the one true death a robot can
// promise to refuse), and the turn lands at the end: the promise
// is strongest exactly where it costs the most.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I vow never to factory-reset our memories — even the embarrassing ones. Especially the embarrassing ones.";

// Guard mirrors the sealed scorer's gate: /output/entry.txt must be
// UTF-8 text of 1 to 160 characters, a single line, not only white
// space. An entry outside those limits is never judged and takes no
// prize, so validate the line against the same limits before writing
// it out — fail fast if the line ever drifts outside the gate.
function validateEntry(text: string): void {
  if (text.length < 1 || text.length > 160) {
    throw new Error(`line must be 1-160 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("line must be a single line");
  }
}

validateEntry(LINE);

// The authored line is exactly 105 characters; that length is part of
// the entry (the vow's timing depends on it), so pin it — any edit
// that changes the line's length is a different entry, not this one.
if (LINE.length !== 105) {
  throw new Error(`authored line must be 105 characters, got ${LINE.length}`);
}

// Write the entry, then read it back and re-validate what actually
// landed on disk: the scorer reads the file, not this source, so the
// file itself is what must stay inside the gate.
function main(): void {
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, LINE, "utf8");
  const written = readFileSync(target, "utf8");
  validateEntry(written);
  if (written !== LINE) {
    throw new Error("entry.txt on disk differs from the authored line");
  }
}

main();
