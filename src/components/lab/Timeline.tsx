import { useId } from 'react'
import { simulate, type Setup, type Step, type StepEvent } from '../../lessons/retryWorkshop'
import type { Content } from '../../i18n/content'
import { interpolate } from '../../i18n/format'
import { actors, stepText } from './describe'

/**
 * The run so far, one row per step, top to bottom; the column is who took the step. With `browserOnly` (the two
 * worlds, each drawn through its first timeout) the browser's steps are the send and that timeout: everything between
 * is one greyed row with its count that opens to those steps, and step numbers and tags (an outsider's view) are left
 * out, so the browser's rows line up in two worlds side by side.
 */
export function Timeline({ content, setup, trace, title, caption, browserOnly = false }: { content: Content; setup: Setup; trace: readonly StepEvent[]; title: string; caption?: string; browserOnly?: boolean }) {
  const t = content.labs.d1
  const { steps } = simulate(setup, trace)
  const id = useId()
  const lying = (i: number) => i >= 0 && steps[i].claimAfter === 'failed' && steps[i].ordersAfter > 0
  const rows: ({ i: number; step: Step } | { i: number; hidden: Step[] })[] = browserOnly
    ? [{ i: 0, step: steps[0] }, { i: -1, hidden: steps.slice(1, -1) }, { i: steps.length - 1, step: steps.at(-1)! }]
    : steps.map((step, i) => ({ i, step }))
  return (
    <figure className="lab-timeline" aria-labelledby={id}>
      <figcaption>
        <strong id={id}>{title}</strong>
        {caption && <span>{caption}</span>}
      </figcaption>
      <div className="timeline-body">
        <div className="timeline-head" aria-hidden="true">
          {actors.map((actor) => (
            <span key={actor} data-actor={actor} className={browserOnly && actor !== 'browser' ? 'hidden-from-browser' : undefined}>
              {t.actors[actor].name}
              {browserOnly && actor !== 'browser' && <small>{t.worlds.hidden}</small>}
            </span>
          ))}
        </div>
        {steps.length ? (
          <ol className="timeline-steps">
            {rows.map((row) =>
              'hidden' in row ? (
                <li key={row.i} className="hidden-from-browser">
                  {row.hidden.length ? (
                    <details className="timeline-box">
                      <summary>{interpolate(t.worlds.hiddenSteps, { count: content.number(row.hidden.length) })}</summary>
                      <ul>
                        {row.hidden.map((step, j) => (
                          <li key={j}>
                            {interpolate(t.timeline.actor, { actor: t.actors[step.actor].name })}
                            {stepText(content, setup, step)}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <span className="timeline-box">{interpolate(t.worlds.hiddenSteps, { count: content.number(0) })}</span>
                  )}
                </li>
              ) : (
                <li key={row.i} data-actor={row.step.actor}>
                  {!browserOnly && <span className="timeline-number">{interpolate(t.timeline.step, { n: content.number(row.i + 1) })}</span>}
                  <span className="timeline-box">
                    <span className="visually-hidden">{interpolate(t.timeline.actor, { actor: t.actors[row.step.actor].name })}</span>
                    {stepText(content, setup, row.step)}
                    {!browserOnly && (
                      <>
                        {row.step.late && <span className="tag tag-late">{t.timeline.late}</span>}
                        {lying(row.i) && !lying(row.i - 1) && <span className="tag tag-bad">{t.timeline.lie}</span>}
                        {row.step.ordersAfter > Math.max(1, steps[row.i - 1]?.ordersAfter ?? 0) && <span className="tag tag-bad">{t.timeline.duplicate}</span>}
                      </>
                    )}
                  </span>
                </li>
              ),
            )}
          </ol>
        ) : (
          <p className="timeline-empty">{t.timeline.empty}</p>
        )}
      </div>
    </figure>
  )
}
