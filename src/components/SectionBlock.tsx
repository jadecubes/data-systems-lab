import type { SectionMeta, SectionText } from '../content/types'
import { sectionTitle, type Content } from '../i18n/content'
import { SequenceDiagram } from './SequenceDiagram'

export function SectionBlock({ content, meta, text }: { content: Content; meta: SectionMeta; text: SectionText }) {
  const { ui } = content
  const { title, bookTitle } = sectionTitle(content, meta, text)
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
      <dl className="facts">
        <dt>{ui.labels.conclusion}</dt>
        <dd>{text.conclusion}</dd>
        <dt>{ui.labels.tradeoff}</dt>
        <dd>{text.tradeoff}</dd>
      </dl>
      <div className="questions">
        <h3>{ui.labels.questions}</h3>
        <ul>
          {text.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>
      <h3>{ui.labels.examples}</h3>
      <ul className="examples">
        {text.examples.map((e) => (
          <li key={e.text}>{e.text}</li>
        ))}
      </ul>
      {text.diagram && <SequenceDiagram content={content} diagram={text.diagram} />}
    </section>
  )
}
