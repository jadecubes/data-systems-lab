import { routePath } from '../app/routes'
import { isLiveTopic } from '../content/live'
import type { TopicId } from '../content/sections'
import { labs } from '../content/structure'
import type { LabId, Phase } from '../content/types'
import type { Content } from '../i18n/content'
import { passedQuestion, replay } from '../lessons/retryWorkshop'
import { RetryWorkshop } from './lab/RetryWorkshop'
import { useLabHistory } from './lab/useLabHistory'

/**
 * The setup, the idea table and the background render without JavaScript; the workshop needs it, so it appears once
 * the page runs, and the prerendered page says so instead of showing buttons that would do nothing.
 */
export function LabPage({ content, lab, phase, base }: { content: Content; lab: LabId; phase: Phase; base: string }) {
  const t = content.labs.d1
  const history = useLabHistory()
  const live = replay(history.location.events)
  // The idea table's other columns answer questions 3 to 5.
  const open = passedQuestion(live, 4)
  const topicLinks = (topics: readonly TopicId[]) =>
    topics
      .filter((topic) => isLiveTopic(topic, phase))
      .map((topic) => (
        <li key={topic}>
          <a href={routePath({ kind: 'topic', lang: content.lang, topic }, base)}>{content.topics[topic]!.title}</a>
        </li>
      ))
  return (
    <>
      <h1>{t.title}</h1>
      <p className="lead">{t.lead}</p>
      <div className="learn">
        <span id="practises-label" className="learn-label">
          {t.practises}
        </span>
        <ul className="lab-topic-links" aria-labelledby="practises-label">
          {topicLinks(labs[lab].topics)}
        </ul>
      </div>

      <section aria-labelledby="setup-title">
        <h2 id="setup-title">{t.setupLabel}</h2>
        <dl className="lab-setup">
          {t.setup.map(({ term, detail }) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="idea-title">
        <h2 id="idea-title">{t.idea.heading}</h2>
        <div className="table-scroll" tabIndex={0} role="group" aria-labelledby="idea-title">
          <table className="lab-idea">
            <caption>{t.idea.caption}</caption>
            <thead>
              <tr>
                <th scope="col">{t.idea.columns.pattern}</th>
                {open && (
                  <>
                    <th scope="col">{t.idea.columns.rightWhen}</th>
                    <th scope="col">{t.idea.columns.wrongWhen}</th>
                    <th scope="col">{t.idea.columns.problem}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {t.idea.rows.map((row) => (
                <tr key={row.pattern}>
                  <th scope="row">
                    <strong>{row.pattern}</strong>
                    <span>{row.meaning}</span>
                  </th>
                  {open && (
                    <>
                      <td>{row.rightWhen}</td>
                      <td>{row.wrongWhen}</td>
                      <td>{row.problem}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!open && <p className="lab-caption">{t.idea.locked}</p>}
        <details className="lab-anchors">
          <summary>{t.anchors.summary}</summary>
          <ul>
            {t.anchors.items.map(({ kind, text }) => (
              <li key={kind}>
                <strong>{kind}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <p className="lab-caption">{t.anchors.note}</p>
        </details>
      </section>

      {history.mounted ? (
        <RetryWorkshop content={content} history={history} live={live} />
      ) : (
        <noscript>
          <p className="lab-alert">{t.noscript}</p>
        </noscript>
      )}

      <nav className="lab-related" aria-labelledby="related-title">
        <h2 id="related-title">{t.related}</h2>
        <ul>{topicLinks(labs[lab].related)}</ul>
      </nav>
    </>
  )
}
