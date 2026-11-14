import type { Actor, Setup, Step } from '../../lessons/retryWorkshop'
import type { Content } from '../../i18n/content'
import { interpolate } from '../../i18n/format'

/** One step in the lab's own words, the same wording on the timeline and in the worlds comparison. */
export function stepText(content: Content, setup: Setup, step: Step): string {
  const t = content.labs.d1.timeline
  const { claims } = content.labs.d1
  const n = content.number(step.attempt)
  const order = step.orderId === null ? '' : content.number(step.orderId)
  const id = step.requestId === null ? '' : content.code.d1.ids[step.requestId]
  switch (step.event) {
    case 'send':
      return interpolate(t.send, { n })
    case 'resend':
      return interpolate(t.resend[setup.resender], { n })
    case 'timeout':
      return interpolate(t.timeout, { claim: claims[step.claimAfter as 'failed' | 'unknown'] })
    case 'process':
      if (step.blocked) return interpolate(t.blocked, { id, order, n })
      if (setup.version === 'none') return interpolate(t.write, { order, n })
      return interpolate(setup.version === 'server' ? t.writeServerId : t.writeClientId, { id, order, n })
  }
  const kind = step.event.startsWith('req') ? 'request' : 'response'
  const lost = step.event.endsWith('lost')
  if (kind === 'request') return interpolate(lost ? t.requestLost : t.requestOk, { n })
  if (lost) return interpolate(t.responseLost, { n })
  if (!step.ignored) return interpolate(t.responseOk, { n, claim: claims.placed })
  return step.claimAfter === 'placed' ? interpolate(t.responseAfterPlaced, { n, claim: claims.placed }) : interpolate(t.responseIgnored, { n })
}

export const actors: readonly Actor[] = ['browser', 'network', 'server']
