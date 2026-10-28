import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = path.resolve(process.env.PAGES_OUTPUT_DIR ?? 'dist/client');
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const ownerName = process.env.GITHUB_REPOSITORY?.split('/')[0] ?? '';
const defaultBasePath =
  repositoryName && repositoryName !== `${ownerName}.github.io`
    ? `/${repositoryName}`
    : '';
const basePath = (process.env.PAGES_BASE_PATH ?? defaultBasePath).replace(/\/$/, '');
const relativeBasePath = basePath.replace(/^\//, '');
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.rsc']);

async function rewriteDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteDirectory(filePath);
    } else if (textExtensions.has(path.extname(entry.name))) {
      const source = await readFile(filePath, 'utf8');
      const rewritten = source
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
