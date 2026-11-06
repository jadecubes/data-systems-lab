// The D1 lab model: a browser sends "place order", the network decides each message's fate, the server writes.
// It returns codes and numbers only; every word the reader sees comes from src/content/<lang>/labs/d1.ts.
import { eventsThroughTask as throughTask, readLessonLocation, lessonHref } from './workshopHistory'

/** How the server recognises a resend: not at all, by an ID it makes on arrival, or by an ID the browser made. */
export type Version = 'none' | 'server' | 'client'
/** What the screen says on a timeout: the common naive "failed", or the honest "cannot confirm". */
export type Screen = 'naive' | 'honest'
/** Who resends after a timeout: the user (one resend), or an app that retries by itself up to three times. */
export type Resender = 'user' | 'app'
export type Setup = { readonly version: Version; readonly screen: Screen; readonly resender: Resender }

export type Actor = 'browser' | 'network' | 'server'
type Kind = 'req' | 'res'
export type MessageEvent = `${Kind}${number}-${'ok' | 'lost'}`
export type StepEvent = 'send' | 'timeout' | 'resend' | 'process' | MessageEvent
export type AnswerEvent =
  | `q3-${Q3Answer}`
  | `q4-${Q4Answer}`
  | `q5-${Q5Answer}`
  | `q6-${'none' | 'client'}-${MaxOrders}`
export type LabEvent = StepEvent | AnswerEvent | 'verify' | 'next'

export const q3Answers = ['failed', 'placed', 'unknown', 'silent'] as const
export const q4Answers = ['second-order', 'blocked', 'tcp', 'transaction'] as const
export const q5Answers = ['one', 'two', 'network'] as const
export const maxOrders = [1, 2, 3, 4] as const
export type Q3Answer = (typeof q3Answers)[number]
export type Q4Answer = (typeof q4Answers)[number]
export type Q5Answer = (typeof q5Answers)[number]
export type MaxOrders = (typeof maxOrders)[number]

/** Every order is for the same amount; the SQL test writes it too. */
export const ORDER_AMOUNT = 1280
/** The ID the browser makes before the first send; examples/order_retry.sql shows the same one. */
export const CLIENT_REQUEST_ID = 'r-7f3a'
/** IDs the server makes, one per request it handles. */
export const SERVER_REQUEST_IDS = ['s-1c9e', 's-84b2', 's-3d07', 's-e651'] as const
const MAX_ATTEMPTS: Record<Resender, number> = { user: 2, app: 4 }

export type Fate = 'flight' | 'delivered' | 'lost'
export interface Attempt {
  request: Fate
  /** Set when the server handles it: the order written, or for a blocked resend the original order returned. */
  orderId: number | null
  /** The uniqueness constraint stopped this request: its transaction was rolled back. */
  blocked: boolean
  response: Fate | null
  /** The browser gave up waiting for this attempt. */
  timedOut: boolean
}
/** What the screen tells the user: nothing yet (the button or a spinner), "failed", "cannot confirm", or "placed". */
export type Claim = 'none' | 'failed' | 'unknown' | 'placed'
export type Browser = 'idle' | 'waiting' | 'timed-out' | 'done'

export interface Step {
  event: StepEvent
  actor: Actor
  /** 1-based: which send this step belongs to. */
  attempt: number
  /** A message delivered after the browser had given up on its attempt. */
  late: boolean
  /** A response the screen did not act on: the naive screen drops late ones, and the user already saw "placed". */
  ignored: boolean
  orderId: number | null
  blocked: boolean
  requestId: string | null
  claimAfter: Claim
  ordersAfter: number
}

export interface RequestRow { requestId: string; orderId: number; blocked: boolean }
export interface Run {
  steps: Step[]
  attempts: Attempt[]
  browser: Browser
  claim: Claim
  orders: number[]
  /** The request log; a blocked insert is listed (marked) but not stored. */
  requests: RequestRow[]
  /** Requests that reached the server and wait to be handled, as attempt indexes in arrival order. */
  queue: number[]
}

const actorOf = (event: StepEvent): Actor =>
  event === 'process' ? 'server' : event === 'send' || event === 'timeout' || event === 'resend' ? 'browser' : 'network'

function parseMessage(event: string): { kind: Kind; attempt: number; fate: 'delivered' | 'lost' } | null {
  const m = /^(req|res)([1-9])-(ok|lost)$/.exec(event)
  return m ? { kind: m[1] as Kind, attempt: Number(m[2]), fate: m[3] === 'ok' ? 'delivered' : 'lost' } : null
}

/** Runs a trace; an event that cannot happen at that point throws. */
export function simulate(setup: Setup, trace: readonly StepEvent[]): Run {
  const run: Run = { steps: [], attempts: [], browser: 'idle', claim: 'none', orders: [], requests: [], queue: [] }
  const fail = (event: string): never => {
    throw new Error(`${event} cannot happen here`)
  }
  for (const event of trace) {
    const { attempts } = run
    const current = attempts.length
    const step: Step = { event, actor: actorOf(event), attempt: current, late: false, ignored: false, orderId: null, blocked: false, requestId: null, claimAfter: run.claim, ordersAfter: 0 }
    const message = parseMessage(event)
    if (event === 'send' || event === 'resend') {
      if (event === 'send' ? run.browser !== 'idle' : run.browser !== 'timed-out' || current >= MAX_ATTEMPTS[setup.resender]) fail(event)
      attempts.push({ request: 'flight', orderId: null, blocked: false, response: null, timedOut: false })
      run.browser = 'waiting'
      run.claim = 'none'
      step.attempt = attempts.length
    } else if (event === 'timeout') {
      if (run.browser !== 'waiting') fail(event)
      attempts[current - 1].timedOut = true
      run.browser = 'timed-out'
      run.claim = setup.screen === 'naive' ? 'failed' : 'unknown'
    } else if (event === 'process') {
      // The server handles requests in the order they arrived.
      const index = run.queue.shift() ?? fail(event)
      const attempt = attempts[index]
      step.attempt = index + 1
      const requestId = setup.version === 'client' ? CLIENT_REQUEST_ID : setup.version === 'server' ? SERVER_REQUEST_IDS[run.requests.length] : null
      const original = setup.version === 'client' ? run.requests.find((r) => r.requestId === requestId && !r.blocked) : undefined
      if (original) {
        attempt.blocked = true
        attempt.orderId = original.orderId
        run.requests.push({ requestId: requestId!, orderId: original.orderId, blocked: true })
      } else {
        attempt.orderId = run.orders.length + 1
        run.orders.push(attempt.orderId)
        if (requestId) run.requests.push({ requestId, orderId: attempt.orderId, blocked: false })
      }
      attempt.response = 'flight'
      Object.assign(step, { orderId: attempt.orderId, blocked: attempt.blocked, requestId })
    } else if (message) {
      const attempt = attempts[message.attempt - 1]
      const fate = message.kind === 'req' ? attempt?.request : attempt?.response
      if (fate !== 'flight') fail(event)
      if (message.kind === 'req') attempt.request = message.fate
      else attempt.response = message.fate
      if (message.kind === 'req' && message.fate === 'delivered') run.queue.push(message.attempt - 1)
      step.attempt = message.attempt
      step.late = message.fate === 'delivered' && attempt.timedOut
      if (message.kind === 'res' && message.fate === 'delivered') {
        step.orderId = attempt.orderId
        // The naive screen drops a response that comes after it said "failed"; the honest one corrects itself.
        const heard = run.browser !== 'done' && (!attempt.timedOut || setup.screen === 'honest')
        step.ignored = !heard
        if (heard) {
          run.browser = 'done'
          run.claim = 'placed'
        }
      }
    } else fail(event)
    step.claimAfter = run.claim
    step.ordersAfter = run.orders.length
    run.steps.push(step)
  }
  return run
}

/** Nothing is still on its way, and the browser is not waiting: the run can be judged. */
export function settled(run: Run): boolean {
  return (
    run.browser !== 'idle' &&
    run.browser !== 'waiting' &&
    run.attempts.every((a) => a.request !== 'flight' && !(a.request === 'delivered' && a.response === null) && a.response !== 'flight')
  )
}

/** The screen says something the database contradicts. */
export function screenLies(run: Run): boolean {
  return (run.claim === 'failed' && run.orders.length > 0) || (run.claim === 'placed' && run.orders.length === 0)
}

/** Every step that could happen next, in a stable order. */
export function possibleSteps(setup: Setup, trace: readonly StepEvent[]): StepEvent[] {
  const run = simulate(setup, trace)
  const messages = run.attempts.flatMap((_, i): MessageEvent[] => [`req${i + 1}-ok`, `req${i + 1}-lost`, `res${i + 1}-ok`, `res${i + 1}-lost`])
  const candidates: StepEvent[] = ['send', 'timeout', 'resend', 'process', ...messages]
  return candidates.filter((event) => {
    try {
      simulate(setup, [...trace, event])
      return true
    } catch {
      return false
    }
  })
}

/** Questions in order; the setup is the code the simulation and replays run under. */
export const tasks = [
  { kind: 'build', setup: { version: 'none', screen: 'naive', resender: 'user' } },
  { kind: 'build', setup: { version: 'none', screen: 'naive', resender: 'user' } },
  { kind: 'answer', setup: { version: 'none', screen: 'naive', resender: 'user' } },
  { kind: 'answer', setup: { version: 'client', screen: 'honest', resender: 'user' } },
  { kind: 'answer', setup: { version: 'server', screen: 'honest', resender: 'user' } },
  { kind: 'build-and-answer', setup: { version: 'none', screen: 'honest', resender: 'app' } },
] as const satisfies readonly { kind: 'build' | 'answer' | 'build-and-answer'; setup: Setup }[]
export const builds = (task: number) => tasks[task].kind !== 'answer'

/** The standard answer to question 1, also replayed when the reader's own trace cannot run under later code. */
export const STANDARD_Q1: readonly StepEvent[] = ['send', 'req1-ok', 'process', 'res1-lost', 'timeout', 'resend', 'req2-ok', 'process', 'res2-ok']
const guided: Record<number, readonly StepEvent[]> = {
  0: STANDARD_Q1,
  1: ['send', 'req1-lost', 'timeout', 'resend', 'req2-ok', 'process', 'res2-ok'],
  5: ['send', ...[1, 2, 3].flatMap((n): StepEvent[] => [`req${n}-ok`, 'process', `res${n}-lost`, 'timeout', 'resend']), 'req4-ok', 'process', 'res4-ok'],
}

/**
 * Question 1's trace replayed under question 4's or 5's code. On that code a response that arrives late turns the
 * screen to "placed": a later timeout no longer happens and is left out, and a later resend cannot happen at all, so
 * then the standard answer stands in.
 */
export function replayTrace(q1Trace: readonly StepEvent[], setup: Setup): { trace: readonly StepEvent[]; substituted: boolean; dropped: boolean } {
  const kept: StepEvent[] = []
  for (const event of q1Trace) {
    try {
      simulate(setup, [...kept, event])
      kept.push(event)
    } catch {
      if (event !== 'timeout') return { trace: STANDARD_Q1, substituted: true, dropped: false }
    }
  }
  return { trace: kept, substituted: false, dropped: kept.length < q1Trace.length }
}

/** The events up to and including the first timeout: all the browser sees before it must say something. */
export function throughFirstTimeout(trace: readonly StepEvent[]): StepEvent[] {
  const at = trace.indexOf('timeout')
  return at < 0 ? [...trace] : trace.slice(0, at + 1)
}

/** Step numbers are 1-based, as on the timeline. */
export type Verdict =
  | { ok: true; code: 'response-lost'; writtenAt: number; lostAt: number }
  | { ok: true; code: 'response-late'; writtenAt: number; arrivedAt: number }
  | { ok: true; code: 'request-late'; timeoutAt: number; arrivedAt: number }
  | { ok: true; code: 'q2' | 'q6' }
  | { ok: boolean; code: 'answer'; answer: string }
  | { ok: false; code: 'answered-in-time' | 'no-resend' | 'first-request-lost' | 'first-request-arrived' | 'resend-lost' | 'none-wrong' | 'client-wrong' }
  | { ok: false; code: 'too-few'; count: number }

const stepOf = (run: Run, predicate: (s: Step) => boolean) => run.steps.findIndex(predicate) + 1

function judgeQ1(run: Run): Verdict {
  const [first, second] = run.attempts
  if (!first.timedOut) return { ok: false, code: 'answered-in-time' }
  if (first.request === 'lost') return { ok: false, code: 'first-request-lost' }
  if (!second) return { ok: false, code: 'no-resend' }
  if (second.request === 'lost') return { ok: false, code: 'resend-lost' }
  const written = stepOf(run, (s) => s.event === 'process' && s.attempt === 1)
  const arrived = stepOf(run, (s) => s.event === 'req1-ok')
  if (run.steps[arrived - 1].late) return { ok: true, code: 'request-late', timeoutAt: stepOf(run, (s) => s.event === 'timeout'), arrivedAt: arrived }
  if (first.response === 'lost') return { ok: true, code: 'response-lost', writtenAt: written, lostAt: stepOf(run, (s) => s.event === 'res1-lost') }
  return { ok: true, code: 'response-late', writtenAt: written, arrivedAt: stepOf(run, (s) => s.event === 'res1-ok') }
}

function judgeQ2(run: Run): Verdict {
  const [first, second] = run.attempts
  if (first.request !== 'lost') return { ok: false, code: 'first-request-arrived' }
  if (!second) return { ok: false, code: 'no-resend' }
  if (second.request === 'lost') return { ok: false, code: 'resend-lost' }
  return { ok: true, code: 'q2' }
}

const correct = { 2: 'q3-unknown', 3: 'q4-blocked', 4: 'q5-two' } as Record<number, string>

function judge(state: LabState): Verdict {
  const run = simulate(tasks[state.task].setup, state.trace)
  if (state.task === 0) return judgeQ1(run)
  if (state.task === 1) return judgeQ2(run)
  if (state.task === 5) {
    if (state.answers[0] !== 'q6-none-4') return { ok: false, code: 'none-wrong' }
    if (state.answers[1] !== 'q6-client-1') return { ok: false, code: 'client-wrong' }
    return run.orders.length === 4 ? { ok: true, code: 'q6' } : { ok: false, code: 'too-few', count: run.orders.length }
  }
  return { ok: state.answers[0] === correct[state.task], code: 'answer', answer: state.answers[0].replace(/^q\d-/, '') }
}

export interface LabState {
  task: number
  /** This question's trace; empty for the answer-only questions. */
  trace: StepEvent[]
  /** Saved when questions 1 and 2 pass; later questions refer back to them. */
  q1Trace: StepEvent[]
  q2Trace: StepEvent[]
  /** Chosen answers: one per question, or for question 6 [orders without an ID, orders with the browser's ID]. */
  answers: string[]
  verdict: Verdict | null
  completed: number[]
  /** Index of the first event of this question, for "Reset this question". */
  taskStart: number
}

/** Every answer the question asks for is chosen; questions 1 and 2 ask for none. */
export function answered(state: LabState): boolean {
  return state.task === 5 ? !!(state.answers[0] && state.answers[1]) : tasks[state.task].kind === 'build' || !!state.answers[0]
}

/** Is the question ready to check: the run is over and every answer is chosen. */
export function canVerify(state: LabState): boolean {
  return answered(state) && (!builds(state.task) || settled(simulate(tasks[state.task].setup, state.trace)))
}

/** Question 6 has two answers: orders without an ID, then with the browser's ID. */
const answerGroup = (event: string) => (event.startsWith('q6-client') ? 1 : 0)
const answersFor: Record<number, readonly string[]> = {
  2: q3Answers.map((a) => `q3-${a}`),
  3: q4Answers.map((a) => `q4-${a}`),
  4: q5Answers.map((a) => `q5-${a}`),
  5: maxOrders.flatMap((n) => [`q6-none-${n}`, `q6-client-${n}`]),
}

export function replay(events: readonly LabEvent[]): LabState {
  if (events.length > HISTORY_LIMIT) throw new Error('history too long')
  const state: LabState = { task: 0, trace: [], q1Trace: [], q2Trace: [], answers: [], verdict: null, completed: [], taskStart: 0 }
  for (const [index, event] of events.entries()) {
    if (event === 'next') {
      if (!state.verdict?.ok || state.task === tasks.length - 1) throw new Error('not ready to advance')
      if (state.task === 0) state.q1Trace = state.trace
      if (state.task === 1) state.q2Trace = state.trace
      state.completed.push(state.task++)
      Object.assign(state, { trace: [], answers: [], verdict: null, taskStart: index + 1 })
    } else if (event === 'verify') {
      if (state.verdict || !canVerify(state)) throw new Error('not ready to check')
      state.verdict = judge(state)
    } else if (answersFor[state.task]?.includes(event)) {
      if (state.verdict?.ok) throw new Error('already checked')
      state.answers[answerGroup(event)] = event
      state.verdict = null
    } else {
      if (!builds(state.task) || state.verdict?.ok) throw new Error('no steps at this point')
      simulate(tasks[state.task].setup, [...state.trace, event as StepEvent])
      state.trace = [...state.trace, event as StepEvent]
      state.verdict = null
    }
  }
  return state
}

/** The next step "Run the next step for me" takes, while the reader's trace still follows the standard one. */
export function guidedNext(state: LabState): StepEvent | null {
  const order = guided[state.task]
  if (!order || state.verdict?.ok || state.trace.length >= order.length) return null
  return state.trace.every((event, i) => event === order[i]) ? order[state.trace.length] : null
}

/** Every case of the dry run (design §5): the first request's and response's fate, and whether the user resends. */
export type RequestCase = 'lost' | 'on-time' | 'late'
export type ResponseCase = 'on-time' | 'lost' | 'late' | 'any' | null
export interface Scenario { request: RequestCase; response: ResponseCase; resend: boolean; trace: readonly StepEvent[] }
const resendOk: StepEvent[] = ['resend', 'req2-ok', 'process', 'res2-ok']
export const scenarios: readonly Scenario[] = [
  { request: 'lost', response: null, resend: false, trace: ['send', 'req1-lost', 'timeout'] },
  { request: 'lost', response: null, resend: true, trace: ['send', 'req1-lost', 'timeout', ...resendOk] },
  { request: 'on-time', response: 'on-time', resend: false, trace: ['send', 'req1-ok', 'process', 'res1-ok'] },
  { request: 'on-time', response: 'lost', resend: false, trace: ['send', 'req1-ok', 'process', 'res1-lost', 'timeout'] },
  { request: 'on-time', response: 'lost', resend: true, trace: ['send', 'req1-ok', 'process', 'res1-lost', 'timeout', ...resendOk] },
  { request: 'on-time', response: 'late', resend: false, trace: ['send', 'req1-ok', 'process', 'timeout', 'res1-ok'] },
  { request: 'on-time', response: 'late', resend: true, trace: ['send', 'req1-ok', 'process', 'timeout', 'resend', 'res1-ok', 'req2-ok', 'process', 'res2-ok'] },
  { request: 'late', response: 'any', resend: false, trace: ['send', 'timeout', 'req1-ok', 'process', 'res1-ok'] },
  { request: 'late', response: 'any', resend: true, trace: ['send', 'timeout', 'resend', 'req1-ok', 'process', 'res1-ok', 'req2-ok', 'process', 'res2-ok'] },
]

/** Why a dry-run case ends with its count, as a code. */
export type Outcome = 'never-arrived' | 'one-arrived' | 'both-written' | 'new-server-id' | 'blocked'
export function outcome(version: Version, trace: readonly StepEvent[]): { orders: number; why: Outcome } {
  const run = simulate({ version, screen: 'naive', resender: 'user' }, trace)
  const orders = run.orders.length
  const why: Outcome = run.attempts.some((a) => a.blocked) ? 'blocked' : orders === 0 ? 'never-arrived' : orders === 1 ? 'one-arrived' : version === 'server' ? 'new-server-id' : 'both-written'
  return { orders, why }
}

export const HISTORY_LIMIT = 160
export const eventsThroughTask: (events: readonly LabEvent[], task: number) => LabEvent[] = throughTask
export const labHref = (events: readonly LabEvent[]) => lessonHref('1', events)
export const readLabLocation = (href: string) => readLessonLocation<LabEvent>('1', href, replay)
