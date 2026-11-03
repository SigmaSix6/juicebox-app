/**
 * One-off helper: downloads the static assets exported by the Figma MCP
 * server into /public/figma. The URLs are temporary (they expire ~7 days
 * after export), so the downloaded files are committed to the repo and this
 * script only needs to run once.
 *
 *   node scripts/fetch-figma-assets.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const HOME = "https://www.figma.com/api/mcp/asset/5ed27c20-2eb7-4009-8ecc-55d7f4265c0c";
const SLIDE = "https://www.figma.com/api/mcp/asset/9e031895-f629-4d8f-b0a1-3569d6b67b74";
const FORM = "https://www.figma.com/api/mcp/asset/1617ac8e-228c-4ba2-a2b2-a0ba5e562152";

const assets = {
  "orb.png": `${HOME}/a3ece.png`,
  "orb-md.png": `${SLIDE}/cce63.png`,
  "hexagon.png": `${FORM}/9a83c.png`,
  "icon-refresh.svg": `${HOME}/829ad.svg`,
  "icon-arrow-left.svg": `${SLIDE}/ae67f.svg`,
  "icon-arrow-up.svg": `${FORM}/97363.svg`,
  "logo-1.svg": `${HOME}/cc3ff.svg`,
  "logo-2.svg": `${HOME}/a8e13.svg`,
  "logo-3.svg": `${HOME}/5bbdf.svg`,
  "logo-4.svg": `${HOME}/8268c.svg`,
  "logo-5.svg": `${HOME}/991fb.svg`,
  "logo-6.svg": `${HOME}/a59e1.svg`,
  "logo-7.svg": `${HOME}/3c4a0.svg`,
  "logo-8.svg": `${HOME}/ed07f.svg`,
  "logo-9.svg": `${HOME}/3c89b.svg`,
  "logo-10.svg": `${HOME}/4b52d.svg`,
};

const outDir = path.join(process.cwd(), "public", "figma");
await mkdir(outDir, { recursive: true });

let failed = 0;
for (const [name, url] of Object.entries(assets)) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(path.join(outDir, name), buf);
    console.log(`✓ ${name} (${buf.length} bytes)`);
  } catch (err) {
    failed++;
    console.error(`✗ ${name}: ${err.message}`);
  }
}
process.exitCode = failed ? 1 : 0;
