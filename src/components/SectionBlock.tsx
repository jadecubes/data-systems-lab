import { ratingExceptions } from '../content/live'
import type { SectionMeta, SectionText, ZoneId } from '../content/types'
import { sectionTitle, type Content } from '../i18n/content'
import { expandPageRefs, formatPages, formatRoleRatings, interpolate } from '../i18n/format'
import { SequenceDiagram } from './SequenceDiagram'

export function SectionBlock({ content, meta, text, zone }: { content: Content; meta: SectionMeta; text: SectionText; zone: ZoneId }) {
  const { ui } = content
  const { title, bookTitle, ours } = sectionTitle(content, meta, text)
  const exceptions = ratingExceptions(meta, zone)
  const prose = (s: string) => expandPageRefs(s, content)
  return (
    <section id={meta.id} className="section-block" aria-labelledby={`${meta.id}-title`}>
      <h2 id={`${meta.id}-title`}>
        <span>{title}</span>
        {bookTitle && (
          <span className="book-title" lang="en">
            {bookTitle}
          </span>
        )}
      </h2>
      <p className="source-line">
        {ours && <span className="tag">{ui.fromChapter}</span>}
        <span>{interpolate(ui.sectionSource, { chapter: content.number(meta.chapter), pages: formatPages(meta.pages, content) })}</span>
      </p>
      {Object.keys(exceptions).length > 0 && (
        <p className="rating-exception">{interpolate(ui.ratingException, { ratings: formatRoleRatings(exceptions, content) })}</p>
      )}
      <dl className="facts">
        <dt>{ui.labels.conclusion}</dt>
        <dd>{prose(text.conclusion)}</dd>
        <dt>{ui.labels.tradeoff}</dt>
        <dd>{prose(text.tradeoff)}</dd>
      </dl>
      <div className="questions">
        <h3>{ui.labels.questions}</h3>
        <ul>
          {text.questions.map((q) => (
            <li key={q}>{prose(q)}</li>
          ))}
        </ul>
      </div>
      <h3>{ui.labels.examples}</h3>
      <ul className="examples">
        {text.examples.map((e) => (
          <li key={e.text}>{prose(e.text)}</li>
        ))}
      </ul>
      {text.diagram && <SequenceDiagram content={content} diagram={text.diagram} prose={prose} />}
    </section>
  )
}
