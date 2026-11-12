// The lab's page structure, as the C++ lab's learner review settled it: progress strip, question header, controls
// with one hint that explains every disabled button.
import type { Content } from '../../i18n/content'
import { interpolate } from '../../i18n/format'
import { passedQuestion, type LabState } from '../../lessons/retryWorkshop'

/** checked · current · ready (looks like current; pressing it moves on) · locked; the one shown again says so. */
export function ProgressStrip({ content, live, viewing, onView, onNext }: { content: Content; live: LabState; viewing: number | null; onView: (index: number | null) => void; onNext: () => void }) {
  const t = content.labs.d1
  const total = t.questions.length
  const n = (i: number) => content.number(i + 1)
  const passed = passedQuestion(live, live.task)
  return (
    <ol className="lab-progress" aria-label={t.progress.label}>
      {t.questions.map((q, index) => {
        const kind =
          passedQuestion(live, index) ? 'checked'
          : index === live.task ? 'current'
          : index === live.task + 1 && passed ? 'ready'
          : 'locked'
        const status =
          viewing === index ? t.progress.viewing
          : kind === 'checked'
            ? index !== live.task ? t.progress.checked
              : index === total - 1 ? t.progress.complete
              : interpolate(t.progress.checkedHere, { n: n(index + 1) })
          : kind === 'current' ? t.progress.current
          : kind === 'ready' ? t.progress.ready
          : interpolate(t.progress.locked, { n: n(index - 1) })
        return (
          <li key={index}>
            <button
              type="button"
              className={`step-${kind}${viewing === index ? ' step-viewing' : ''}`}
              aria-current={index === live.task ? 'step' : undefined}
              onClick={() => (kind === 'ready' || (index === live.task && passed && index < total - 1) ? onNext() : onView(index === live.task ? null : index))}
            >
              <span className="step-number">{n(index)}</span>
              <span className="step-title">{q.title}</span>
              <small className="step-status">{status}</small>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export function LockedPreview({ content, index, liveTask, onBack }: { content: Content; index: number; liveTask: number; onBack: () => void }) {
  const t = content.labs.d1
  const n = (i: number) => content.number(i + 1)
  const q = t.questions[index]
  return (
    <section className="lab-preview" aria-labelledby="lab-preview-title">
      <p className="kicker">{interpolate(t.preview.kicker, { n: n(index), total: content.number(t.questions.length) })}</p>
      <h3 id="lab-preview-title">{q.title}</h3>
      {/* The question only: the instructions of later questions name earlier answers. */}
      <p>
        <strong>{q.question}</strong>
      </p>
      <p role="status" className="lab-preview-status">
        {interpolate(t.preview.locked, { n: n(index - 1) })}
        {(index === 3 || index === 4) && <> {t.preview.reuses}</>}
      </p>
      <button type="button" className="lab-primary" onClick={onBack}>
        {interpolate(t.preview.back, { n: n(liveTask) })}
      </button>
    </section>
  )
}

export function QuestionHeader({ content, index, readOnly }: { content: Content; index: number; readOnly: boolean }) {
  const t = content.labs.d1
  const q = t.questions[index]
  const n = content.number(index + 1)
  return (
    <header className="lab-question">
      <p className="kicker">{interpolate(t.questionKicker, { n, total: content.number(t.questions.length) })}</p>
      {readOnly && <p className="lab-readonly-note">{interpolate(t.readOnly, { n })}</p>}
      {/* Focusable, so leaving a question read again or previewed lands here, not on the page body. */}
      <h3 id="lab-question-title" tabIndex={-1}>
        {q.title}
      </h3>
      <p>
        <strong>{q.question}</strong>
      </p>
      <p>{q.instruction}</p>
    </header>
  )
}

export interface ControlsProps {
  content: Content
  readOnly: boolean
  liveTask: number
  canVerify: boolean
  checked: boolean
  hasVerdict: boolean
  hasNext: boolean
  /** Previous step and Reset this question: something has happened in this question. */
  canUndo: boolean
  canRestart: boolean
  hint: readonly string[]
  onBack: () => void
  onVerify: () => void
  onNext: () => void
  onUndo: () => void
  onReset: () => void
  onRestart: () => void
}

export function Controls(p: ControlsProps) {
  const t = p.content.labs.d1.controls
  if (p.readOnly) {
    return (
      <div className="lab-controls" role="group" aria-label={t.label}>
        <button type="button" className="lab-primary" onClick={p.onBack}>
          {interpolate(t.back, { n: p.content.number(p.liveTask + 1) })}
        </button>
      </div>
    )
  }
  return (
    <div className="lab-controls" role="group" aria-label={t.label}>
      {/* Two groups that wrap as wholes, so no button is left alone on a row. */}
      <div>
        <button type="button" id="lab-verify" className="lab-primary" disabled={!p.canVerify || p.hasVerdict} aria-describedby="controls-hint" onClick={p.onVerify}>
          {t.verify}
        </button>
        {p.hasNext && (
          <button type="button" disabled={!p.checked} aria-describedby="controls-hint" onClick={p.onNext}>
            {t.next}
          </button>
        )}
      </div>
      <div>
        <button type="button" disabled={!p.canUndo} aria-describedby="controls-hint" onClick={p.onUndo}>
          {t.undo}
        </button>
        <button type="button" disabled={!p.canUndo} aria-describedby="controls-hint" onClick={p.onReset}>
          {t.reset}
        </button>
        <button type="button" disabled={!p.canRestart} aria-describedby="controls-hint" onClick={p.onRestart}>
          {t.restart}
        </button>
      </div>
      <p id="controls-hint" className="lab-hint">
        {p.hint.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </p>
    </div>
  )
}

/**
 * The hint under the controls, one sentence per thing that matters now: it explains every disabled button and says
 * where to go.
 */
export function controlsHint(
  content: Content,
  s: {
    checked: boolean
    failedOn: 'build' | 'answer' | null
    /** What the run waits on; for the server, the 1-based request it must handle next. */
    needsSteps: 'empty' | 'waiting' | { server: number } | null
    needsAnswer: 'one' | 'both' | null
    hasNext: boolean
    canUndo: boolean
    canRestart: boolean
  },
): string[] {
  const t = content.labs.d1.hints
  const steps = (n: NonNullable<typeof s.needsSteps>) => (n === 'empty' ? t.empty : n === 'waiting' ? t.waiting : interpolate(t.unhandled, { n: content.number(n.server) }))
  const now = s.checked
    ? [s.hasNext ? t.checked : t.checkedLast]
    : s.failedOn
      ? [s.failedOn === 'build' ? t.failedBuild : t.failedAnswer]
      : s.needsSteps || s.needsAnswer
        ? [s.needsAnswer && (s.needsAnswer === 'one' ? t.choose : t.chooseBoth), s.needsSteps && steps(s.needsSteps)]
        : [t.ready]
  return [...now, s.hasNext && !s.checked && t.next, !s.canRestart ? t.undo : !s.canUndo && !s.checked && t.reset].filter((x): x is string => !!x)
}
