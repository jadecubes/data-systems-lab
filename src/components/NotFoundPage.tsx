import { routePath } from '../app/routes'
import type { Contents } from '../i18n/content'
import { langs } from '../i18n/langs'

/** The 404 page: one block per language, each marked with its own `lang`. */
export function NotFoundPage({ contents, base }: { contents: Contents; base: string }) {
  return (
    <div className="bilingual">
      {langs.map((lang) => {
        const t = contents[lang].ui.notFound
        return (
          <section key={lang} lang={lang}>
            <h1>{t.title}</h1>
            <p>{t.lead}</p>
            <a href={routePath({ kind: 'map', lang }, base)}>{t.link}</a>
          </section>
        )
      })}
    </div>
  )
}
