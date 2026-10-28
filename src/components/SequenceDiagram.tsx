import type { CSSProperties, ReactNode } from 'react'
import type { SequenceDiagram as Diagram } from '../content/types'
import type { Content } from '../i18n/content'
import { interpolate } from '../i18n/format'

/**
 * Lanes are columns and time runs downwards. A message spans the lanes it crosses, with its arrow drawn
 * between the lane lines; a note sits on its lane and the next one. Each step also says in words who sends to
 * whom, so the order survives without the picture. A note is wider than one lane, so it names its lane on screen
 * too.
 */
export function SequenceDiagram({ content, diagram, prose }: { content: Content; diagram: Diagram; prose: (s: string) => ReactNode }) {
  const { ui } = content
  const column = (lane: Diagram['lanes'][number]) => diagram.lanes.indexOf(lane) + 1
  return (
    <figure className="sequence" style={{ '--lanes': diagram.lanes.length } as CSSProperties}>
      <figcaption>{prose(diagram.caption)}</figcaption>
      <div className="sequence-lanes" aria-hidden="true">
        {diagram.lanes.map((lane) => (
          <span key={lane}>{ui.laneNames[lane]}</span>
        ))}
      </div>
      <ol className="sequence-steps">
        {diagram.steps.map((step) => {
          if ('at' in step) {
            const at = column(step.at)
            const start = at === diagram.lanes.length ? at - 1 : at
            return (
              <li key={step.text} className="sequence-note" style={{ gridColumn: `${start} / span 2` }}>
                <span className="note-lane">{interpolate(ui.diagram.note, { lane: ui.laneNames[step.at] })}</span>
                <span>{prose(step.text)}</span>
              </li>
            )
          }
          const [from, to] = [column(step.from), column(step.to)]
          const span = Math.abs(to - from) + 1
          const direction = to > from ? 'rightward' : 'leftward'
          return (
            <li
              key={step.text}
              className={`sequence-message ${direction}${step.fate ? ` ${step.fate}` : ''}`}
              style={{ gridColumn: `${Math.min(from, to)} / span ${span}`, '--span': span } as CSSProperties}
            >
              <span className="visually-hidden">
                {interpolate(ui.diagram.message, { from: ui.laneNames[step.from], to: ui.laneNames[step.to] })}
              </span>
              <span>{prose(step.text)}</span>
              <span className="arrow" aria-hidden="true" />
            </li>
          )
        })}
      </ol>
    </figure>
  )
}
