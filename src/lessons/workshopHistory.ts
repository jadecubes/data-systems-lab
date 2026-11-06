// A lab's whole state is the list of events in its URL (?v=<revision>&events=send,req1-ok,…); replaying them rebuilds
// the state, so a shared link or a refresh restores everything and "Previous step" is one slice.

/** A finished question's history: everything up to the 'next' that left it. */
export function eventsThroughTask<E extends string>(events: readonly E[], task: number): E[] {
  let current = 0
  for (const [index, event] of events.entries()) {
    if (event !== 'next') continue
    if (current === task) return events.slice(0, index)
    current++
  }
  return [...events]
}

/** The query part of the URL; empty for a fresh start. */
export function lessonHref(revision: string, events: readonly string[]): string {
  // Events are [a-z0-9-] only, so the list needs no escaping and stays readable in a shared link.
  return events.length ? `?v=${revision}&events=${events.join(',')}` : ''
}

/**
 * No query is a fresh start. Any other query must name this revision and replay without error; anything else is
 * reported as an invalid link, never silently reinterpreted.
 */
export function readLessonLocation<E extends string>(revision: string, href: string, replay: (events: E[]) => unknown): { events: E[]; invalid: boolean } {
  try {
    const query = new URL(href).searchParams
    if (!query.has('v') && !query.has('events')) return { events: [], invalid: false }
    if (query.get('v') !== revision) throw new Error('unknown revision')
    const raw = query.get('events') ?? ''
    if (raw.length > 4000) throw new Error('history too long')
    const events = (raw ? raw.split(',') : []) as E[]
    replay(events)
    return { events, invalid: false }
  } catch {
    return { events: [], invalid: true }
  }
}
