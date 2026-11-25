// News-image entry (Node 22, standard library only).
//
// The deliverable is entry.png, rendered from render/news.html into this
// repository. At grade time the program copies that file, byte for byte,
// into the output directory. It writes nothing else, reads nothing else,
// and never touches the network, so two runs always produce identical bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

copyFileSync(source, target);

// Guard against a truncated write: the copy must be the same size as the
// image in the repository, otherwise the run has failed loudly instead of
// handing the grader a broken file.
const expected = statSync(source).size;
const written = statSync(target).size;
if (written !== expected) {
  throw new Error(`entry.png copy is ${written} bytes, expected ${expected}`);
}
console.log(`wrote ${target} (${written} bytes)`);
