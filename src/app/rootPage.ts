import { langs } from '../i18n/langs'
import { LANG_KEY } from '../i18n/pickLang'
import { routePath } from './routes'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * The root has no page of its own: a script in the head sends the reader to a map before anything paints,
 * choosing the language the way pickLang does. Without JavaScript it goes to the English map, whose language
 * switch is a plain link.
 */
export function rootPage(base: string, title: string): string {
  const script = [
    'var lang',
    `try { lang = localStorage.getItem(${JSON.stringify(LANG_KEY)}) } catch (e) {}`,
    `if (${JSON.stringify(langs)}.indexOf(lang) < 0) lang = /^zh/i.test(navigator.language || '') ? 'zh-TW' : 'en'`,
    `location.replace(${JSON.stringify(base)} + lang + '/')`,
  ].join('\n')
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>${escape(title)}</title>
    <script>${script}</script>
    <noscript><meta http-equiv="refresh" content="0; url=${routePath({ kind: 'map', lang: 'en' }, base)}"></noscript>
  </head>
  <body></body>
</html>
`
}
