import { useState } from 'react'
import { outcome, scenarios, tasks, throughFirstTimeout, type Q3Answer, type StepEvent, type Version } from '../../lessons/retryWorkshop'
import type { Content } from '../../i18n/content'
import { interpolate } from '../../i18n/format'
import { Timeline } from './Timeline'

const naive = tasks[0].setup

/** Questions 1 and 2 side by side up to the first timeout: the browser's column is the same in both. */
export function Worlds({ content, q1Trace, q2Trace }: { content: Content; q1Trace: readonly StepEvent[]; q2Trace: readonly StepEvent[] }) {
  const t = content.labs.d1.worlds
  return (
    <section className="lab-worlds" aria-labelledby="worlds-title">
      <h4 id="worlds-title">{t.heading}</h4>
      <p className="lab-caption">{t.caption}</p>
      <div className="worlds-pair">
        <Timeline content={content} setup={naive} trace={throughFirstTimeout(q1Trace)} title={t.first} browserOnly />
        <Timeline content={content} setup={naive} trace={throughFirstTimeout(q2Trace)} title={t.second} browserOnly />
      </div>
    </section>
  )
}

/** Question 3's reveal: the chosen message against what really happened in each world (a passed question 1 wrote its first request). */
export function Q3Reveal({ content, answer }: { content: Content; answer: Q3Answer }) {
  const t = content.labs.d1
  const r = t.answers.q3.reveal
  const worlds = [
    { name: t.worlds.first, written: true },
    { name: t.worlds.second, written: false },
  ]
  // Silence is never false, but in the world where the order exists the background resend duplicates it.
  const bad = (written: boolean) => (answer === 'silent' ? written : answer !== 'unknown' && (answer === 'placed') !== written)
  const text = (written: boolean) => (answer === 'silent' ? (written ? r.silentDuplicate : r.silent) : bad(written) ? r.false : r.true)
  return (
    <div className="table-scroll lab-reveal" tabIndex={0} role="group" aria-labelledby="reveal-caption">
      <table>
        <caption id="reveal-caption">{interpolate(r.caption, { answer: t.answers.q3.options[answer] })}</caption>
        <thead>
          <tr>
            <th scope="col">{r.world}</th>
            <th scope="col">{r.written}</th>
            <th scope="col">{r.verdict}</th>
          </tr>
        </thead>
        <tbody>
          {worlds.map(({ name, written }) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              <td>{written ? r.yes : r.no}</td>
              <td className={bad(written) ? 'verdict-bad' : undefined}>{text(written)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Every case of the first send, under each version the reader has reached; later columns would give answers away. */
export function DryRun({ content, showClient, showServer, explainLate }: { content: Content; showClient: boolean; showServer: boolean; explainLate: boolean }) {
  const t = content.labs.d1.dryRun
  const versions: Version[] = ['none', ...(showServer ? (['server'] as const) : []), ...(showClient ? (['client'] as const) : [])]
  return (
    <section className="lab-dry-run" aria-labelledby="dry-run-title">
      <h3 id="dry-run-title">{t.heading}</h3>
      <p>{t.intro}</p>
      {!(showClient && showServer) && <p className="lab-caption">{t.pending}</p>}
      <div className="table-scroll" tabIndex={0} role="group" aria-labelledby="dry-run-title">
        <table>
          <caption>{t.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{t.columns.request}</th>
              <th scope="col">{t.columns.response}</th>
              <th scope="col">{t.columns.resend}</th>
              {versions.map((v) => (
                <th key={v} scope="col">
                  {t.columns[v]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s, i) => (
              <tr key={i}>
                <td>{t.request[s.request]}</td>
                <td>{t.response[s.response ?? 'none']}</td>
                <td>{s.resend ? t.resend.yes : t.resend.no}</td>
                {versions.map((v) => {
                  const { orders, why } = outcome(v, s.trace)
                  return (
                    <td key={v} className={orders > 1 ? 'verdict-bad' : undefined}>
                      <strong>{interpolate(t.count, { count: content.number(orders) })}</strong>
                      <small>{t.why[why]}</small>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {explainLate && <p className="lab-point">{t.late}</p>}
    </section>
  )
}

const DRAFT_KEY = 'data-systems-lab.d1.criterion'
type Draft = { text: string; checks: boolean[] }

function readDraft(): Draft {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null') as Draft | null
    if (saved && typeof saved.text === 'string' && Array.isArray(saved.checks)) return saved
  } catch {
    // Storage blocked or unreadable: start empty.
  }
  return { text: '', checks: [] }
}

/**
 * Question 6 B: write an acceptance criterion, tick a checklist, then compare with a sample. Nothing is graded. The
 * workshop renders only once scripts run, so the draft is read on the first render; there is no prerendered one to match.
 */
export function FinalCriterion({ content }: { content: Content }) {
  const t = content.labs.d1.final
  const [draft, setDraft] = useState(readDraft)
  const [shown, setShown] = useState(false)
  const save = (next: Draft) => {
    setDraft(next)
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next))
    } catch {
      // The draft still works on this page; it just is not kept.
    }
  }
  const empty = !draft.text.trim()
  return (
    <section className="lab-final" aria-labelledby="final-title">
      <p className="lab-point">{t.done}</p>
      <h3 id="final-title">{t.heading}</h3>
      <p>{t.prompt}</p>
      <label className="lab-field">
        <span>{t.label}</span>
        <textarea rows={5} value={draft.text} onChange={(e) => save({ ...draft, text: e.target.value })} aria-describedby="final-saved" />
      </label>
      <p id="final-saved" className="lab-caption">
        {t.saved}
      </p>
      <fieldset className="lab-checklist">
        <legend>{t.rubric}</legend>
        {t.checks.map((check, i) => (
          <label key={check}>
            <input type="checkbox" checked={!!draft.checks[i]} onChange={(e) => save({ ...draft, checks: Object.assign([...draft.checks], { [i]: e.target.checked }) })} />
            {check}
          </label>
        ))}
      </fieldset>
      <div className="lab-action">
        <button type="button" disabled={empty} aria-describedby={empty ? 'final-why' : undefined} aria-expanded={shown && !empty} onClick={() => setShown(!shown)}>
          {shown && !empty ? t.hide : t.show}
        </button>
        {empty && <small id="final-why">{t.disabled}</small>}
      </div>
      {shown && !empty && <p className="lab-sample">{t.answer}</p>}
    </section>
  )
}
