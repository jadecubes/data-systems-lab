import { flushSync } from 'react-dom'
import { possibleSteps, simulate, type Setup, type StepEvent } from '../../lessons/retryWorkshop'
import type { Content } from '../../i18n/content'
import { interpolate } from '../../i18n/format'

/** The three roles as cards, each with the steps it can take now; a step that cannot happen says why beside it. */
export function Roles({ content, setup, trace, interactive, onStep }: { content: Content; setup: Setup; trace: readonly StepEvent[]; interactive: boolean; onStep: (event: StepEvent) => void }) {
  const t = content.labs.d1
  const run = simulate(setup, trace)
  const possible = possibleSteps(setup, trace)
  const n = (i: number) => content.number(i + 1)

  function browserReason(event: 'send' | 'timeout' | 'resend'): string | null {
    if (possible.includes(event)) return null
    if (event === 'send') return t.reasons.sent
    if (run.browser === 'idle') return t.reasons.notSent
    if (event === 'timeout') return t.reasons.notWaiting
    if (run.browser === 'waiting') return t.reasons.stillWaiting
    if (run.browser === 'done') return t.reasons.placed
    return setup.resender === 'user' ? t.reasons.userLimit : t.reasons.appLimit
  }
  const action = (id: string, event: StepEvent, label: string, reason: string | null) => (
    <div key={id} className="lab-action">
      <button type="button" disabled={!!reason} aria-describedby={`${id}-why`} onClick={(e) => take(event, e.currentTarget)}>
        {label}
      </button>
      <small id={`${id}-why`}>{reason ?? t.reasons.you}</small>
    </div>
  )

  const inFlight = run.attempts.flatMap((a, i) => [
    ...(a.request === 'flight' ? [{ kind: 'req' as const, i, label: interpolate(t.messages.request, { n: n(i) }) }] : []),
    ...(a.response === 'flight' ? [{ kind: 'res' as const, i, label: interpolate(t.messages.response, { n: n(i) }) }] : []),
  ])
  const waiting = run.queue[0] ?? -1
  // A step's button can turn itself off (Place order) or go (a message once it has a fate); then focus moves to its
  // card's heading rather than to the page body.
  const take = (event: StepEvent, button: HTMLButtonElement) => {
    const heading = button.closest('section')?.querySelector('h4')
    flushSync(() => onStep(event))
    if (!button.isConnected || button.disabled) heading?.focus()
  }

  return (
    <div className="lab-roles">
      <section className="lab-role" data-actor="browser" aria-labelledby="role-browser">
        <h4 id="role-browser" tabIndex={-1}>{t.actors.browser.name}</h4>
        <p>{t.actors.browser.role}</p>
        {interactive && (
          <>
            {action('act-send', 'send', t.buttons.send, browserReason('send'))}
            {action('act-timeout', 'timeout', t.buttons.timeout, browserReason('timeout'))}
            {action('act-resend', 'resend', t.buttons.resend[setup.resender], browserReason('resend'))}
          </>
        )}
      </section>
      <section className="lab-role" data-actor="network" aria-labelledby="role-network">
        <h4 id="role-network" tabIndex={-1}>{t.actors.network.name}</h4>
        <p>{t.actors.network.role}</p>
        {inFlight.length ? (
          <ul className="lab-messages" aria-label={t.messages.label}>
            {inFlight.map(({ kind, i, label }) => (
              <li key={`${kind}${i}`}>
                <span>{label}</span>
                {interactive && (
                  <span className="lab-message-actions">
                    <button type="button" aria-label={interpolate(t.messages.deliver, { message: label })} onClick={(e) => take(`${kind}${i + 1}-ok`, e.currentTarget)}>
                      {t.buttons.deliver}
                    </button>
                    <button type="button" aria-label={interpolate(t.messages.lose, { message: label })} onClick={(e) => take(`${kind}${i + 1}-lost`, e.currentTarget)}>
                      {t.buttons.lose}
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="lab-quiet">{t.messages.empty}</p>
        )}
      </section>
      <section className="lab-role" data-actor="server" aria-labelledby="role-server">
        <h4 id="role-server" tabIndex={-1}>{t.actors.server.name}</h4>
        <p>{t.actors.server.role}</p>
        {interactive &&
          action('act-process', 'process', waiting < 0 ? t.buttons.processNone : interpolate(t.buttons.process, { n: n(waiting) }), waiting < 0 ? t.reasons.nothingToProcess : null)}
      </section>
    </div>
  )
}
