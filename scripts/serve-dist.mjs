// Serves dist/ the way GitHub Pages does, for the e2e tests: only under BASE_PATH; a directory without a
// trailing slash redirects to one; anything missing gets 404.html with status 404, and so does a path in the
// wrong letter case, as on GitHub Pages (macOS disks would find it). Nothing is cached, so a reload (or Back)
// after a rebuild always shows the new pages.
import { readFile, realpath, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const base = process.env.BASE_PATH ?? '/'
const port = Number(process.env.PORT ?? 4173)
const dist = await realpath(fileURLToPath(new URL('../dist', import.meta.url)))
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' }

async function find(pathname) {
  if (!`${pathname}/`.startsWith(base)) return null
  let rel
  try {
    rel = decodeURIComponent(pathname.slice(base.length))
  } catch {
    return null
  }
  const file = normalize(join(dist, rel)).replace(/\/$/, '')
  if (file !== dist && !file.startsWith(dist + sep)) return null
  const info = await stat(file).catch(() => null)
  if (info && (await realpath(file)) !== file) return null
  // A file is not a directory: `page.html/` is not found, as on GitHub Pages.
  if (info?.isFile() && pathname.endsWith('/')) return null
  if (info?.isDirectory()) {
    if (!pathname.endsWith('/')) return { redirect: `${pathname}/` }
    return (await stat(join(file, 'index.html')).catch(() => null)) ? { file: join(file, 'index.html') } : null
  }
  return info ? { file } : null
}

createServer(async (req, res) => {
  const { pathname, search } = new URL(req.url, 'http://localhost')
  const found = await find(pathname)
  if (found?.redirect) {
    res.writeHead(301, { location: found.redirect + search }).end()
    return
  }
  const file = found?.file ?? join(dist, '404.html')
  res.writeHead(found ? 200 : 404, { 'content-type': types[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' })
  res.end(await readFile(file))
}).listen(port, '127.0.0.1', () => console.log(`serving dist under ${base} on ${port}`))
