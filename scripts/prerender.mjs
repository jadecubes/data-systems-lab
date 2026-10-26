// After `vite build`: writes one HTML file per live path, a root that only redirects, and a script-free
// bilingual 404.html.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const base = process.env.BASE_PATH ?? '/'
const dist = new URL('../dist/', import.meta.url)
const template = readFileSync(new URL('index.html', dist), 'utf8')
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', base, logLevel: 'error' })
try {
  const { renderPage, renderRoot, paths } = await vite.ssrLoadModule('/src/entry-server.tsx')
  const fill = ({ html, title, lang }) =>
    template
      .replace('<html lang="en">', () => `<html lang="${lang}">`)
      .replace('<title></title>', () => `<title>${escape(title)}</title>`)
      .replace('<!--app-->', () => html)
  for (const path of paths(base)) {
    const dir = new URL(path.slice(base.length), dist)
    mkdirSync(dir, { recursive: true })
    writeFileSync(new URL('index.html', dir), fill(renderPage(path, base)))
  }
  writeFileSync(new URL('index.html', dist), renderRoot(base))
  // The 404 page is served at any depth and needs no JavaScript (design §5.4).
  const notFound = fill(renderPage(null, base))
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>\s*/g, '')
    .replace(/<link rel="modulepreload"[^>]*>\s*/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
  writeFileSync(new URL('404.html', dist), notFound)
  console.log(`prerendered ${paths(base).length} pages, the root redirect and 404.html under ${base}`)
} finally {
  await vite.close()
}
