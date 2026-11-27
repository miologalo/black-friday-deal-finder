// Bargain Beacon — Black Friday deal finder entry (Node 22, standard
// library only). The site lives in app/ as plain static files; this
// program hands it in: it copies app/ and screenshots/ beside this file
// into the output directory and writes dossier.json there, using the
// vendored make.fun library to build the dossier. The grader runs this
// program twice and both runs must write the same bytes. Outside the
// grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), {
    recursive: true,
  });
}

// Caps from the competition gate: the dossier text is capped, and the
// scorer refuses more than 4 screenshots, a screenshot over 256 KiB,
// more than 993 app files/directories, or app/ over 16 MiB.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
