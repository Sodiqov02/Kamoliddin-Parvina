import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pagesBase } from './pages-base.mjs';

const outputDirectory = path.resolve(process.env.PAGES_OUTPUT_DIR ?? 'dist/client');
const basePath = pagesBase();
const relativeBasePath = basePath.replace(/^\//, '');
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.rsc']);

async function rewriteDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteDirectory(filePath);
    } else if (textExtensions.has(path.extname(entry.name))) {
      const source = await readFile(filePath, 'utf8');
      // Normalize our own prefix first so repeating preparation is harmless.
      const normalized = basePath
        ? source
            .replaceAll(`${basePath}/_next/`, '/_next/')
            .replaceAll(`"${relativeBasePath}/_next/`, '"_next/')
            .replaceAll(`'${relativeBasePath}/_next/`, "'_next/")
        : source;
      const rewritten = normalized
        .replaceAll('/_next/', `${basePath}/_next/`)
        .replaceAll('"_next/', `"${relativeBasePath}/_next/`)
        .replaceAll("'_next/", `'${relativeBasePath}/_next/`);
      if (rewritten !== source) await writeFile(filePath, rewritten);
    }
  }
}

await rewriteDirectory(outputDirectory);
await writeFile(path.join(outputDirectory, '.nojekyll'), '');
console.log(`Prepared ${outputDirectory} for GitHub Pages at ${basePath || '/'}`);
