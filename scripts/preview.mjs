import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.env.PREVIEW_ROOT ?? 'dist/client');
const base = (process.env.PREVIEW_BASE ?? '').replace(/\/$/, '');
const port = Number(process.env.PORT ?? 4173);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.rsc':'text/x-component', '.woff2':'font/woff2', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.ics':'text/calendar; charset=utf-8' };

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    if (base && pathname !== base && !pathname.startsWith(`${base}/`)) { response.writeHead(404).end(); return; }
    const relative = base ? pathname.slice(base.length) : pathname;
    let file = path.resolve(root, `.${relative || '/'}`);
    if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) { response.writeHead(308, { Location: `${pathname}/` }).end(); return; }
      file = path.join(file, 'index.html');
    }
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Content-Length': data.length });
    response.end(data);
  } catch { response.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Invitation preview: http://127.0.0.1:${port}${base}/ (Ctrl+C to stop)`));
