import { expect, test } from 'vitest'
import {
  STANDARD_Q1,
  addEvent,
  canVerify,
  eventsThroughTask,
  guidedNext,
  labHref,
  outcome,
  possibleSteps,
  readLabLocation,
  replay,
  replayTrace,
  scenarios,
  screenLies,
  settled,
  simulate,
  tasks,
  throughFirstTimeout,
  undoStep,
  type LabEvent,
  type Setup,
  type StepEvent,
} from './retryWorkshop'

const naive: Setup = { version: 'none', screen: 'naive', resender: 'user' }
const honest = (version: Setup['version']): Setup => ({ version, screen: 'honest', resender: 'user' })

test.each<[string, StepEvent[]]>([
  ['a second send', ['send', 'send']],
  ['a resend while still waiting', ['send', 'resend']],
  ['a timeout before sending', ['timeout']],
  ['a second timeout', ['send', 'timeout', 'timeout']],
  ['processing a request that has not arrived', ['send', 'process']],
  ['delivering a lost request', ['send', 'req1-lost', 'req1-ok']],
  ['a response before the server handled the request', ['send', 'req1-ok', 'res1-ok']],
  ['a message of a request never sent', ['send', 'req2-ok']],
  ['a second user resend', ['send', 'timeout', 'resend', 'timeout', 'resend']],
  ['a resend once the screen says the order is placed', ['send', 'req1-ok', 'process', 'res1-ok', 'resend']],
  ['an unknown step', ['send', 'teleport' as StepEvent]],
])('%s cannot happen', (_, trace) => {
  expect(() => simulate(naive, trace)).toThrow()
})

test('the standard answer: the response is lost, the user resends, two orders; the naive screen lied in between', () => {
  const run = simulate(naive, STANDARD_Q1)
  expect(run.orders).toEqual([1, 2])
  expect(run.claim).toBe('placed')
  expect(settled(run)).toBe(true)
  const atTimeout = simulate(naive, STANDARD_Q1.slice(0, 5))
  expect(atTimeout.claim).toBe('failed')
  expect(screenLies(atTimeout)).toBe(true)
})

test('the naive screen ignores a late response; the honest one turns to "placed", so the user no longer resends', () => {
  const late: StepEvent[] = ['send', 'req1-ok', 'process', 'timeout', 'res1-ok']
  const before = simulate(naive, late)
  expect(before.claim).toBe('failed')
  expect(before.steps.at(-1)).toMatchObject({ late: true, ignored: true })
  const after = simulate(honest('none'), late)
  expect(after.claim).toBe('placed')
  expect(after.steps.at(-1)).toMatchObject({ late: true, ignored: false })
  expect(possibleSteps(honest('none'), late)).not.toContain('resend')
})

test('a request delivered after the timeout is marked late', () => {
  const run = simulate(naive, ['send', 'timeout', 'req1-ok'])
  expect(run.steps.at(-1)).toMatchObject({ actor: 'network', attempt: 1, late: true })
})

test('with the browser-made ID, the resend is blocked by the uniqueness constraint and gets the first order back', () => {
  const run = simulate(honest('client'), STANDARD_Q1)
  expect(run.orders).toEqual([1])
  expect(run.requests).toEqual([
    { requestId: 'r-7f3a', orderId: 1, blocked: false },
    { requestId: 'r-7f3a', orderId: 1, blocked: true },
  ])
  expect(run.steps.filter((s) => s.event === 'process').map((s) => s.blocked)).toEqual([false, true])
})

test('with an ID the server makes, each request gets a new one, so nothing is blocked', () => {
  const run = simulate(honest('server'), STANDARD_Q1)
  expect(run.orders).toEqual([1, 2])
  expect(run.requests.map((r) => r.requestId)).toEqual(['s-1c9e', 's-84b2'])
})

test('the app resends by itself up to three times', () => {
  const app: Setup = { version: 'none', screen: 'honest', resender: 'app' }
  const lostThrice = ['send', ...[1, 2, 3].flatMap((n) => [`req${n}-ok`, 'process', `res${n}-lost`, 'timeout', 'resend'])] as StepEvent[]
  expect(simulate(app, [...lostThrice, 'req4-ok', 'process', 'res4-ok']).orders).toHaveLength(4)
  expect(() => simulate(app, [...lostThrice, 'req4-ok', 'process', 'res4-lost', 'timeout', 'resend'])).toThrow()
})

test('only the steps that can happen are offered', () => {
  expect(possibleSteps(naive, [])).toEqual(['send'])
  expect(possibleSteps(naive, ['send'])).toEqual(['timeout', 'req1-ok', 'req1-lost'])
  expect(possibleSteps(naive, ['send', 'req1-ok'])).toEqual(['timeout', 'process'])
})

// Questions 1 and 2 are built step by step; each finished question needs 'verify' then 'next'.
const pass = (trace: readonly StepEvent[]): LabEvent[] => [...trace, 'verify', 'next']
const Q2: StepEvent[] = ['send', 'req1-lost', 'timeout', 'resend', 'req2-ok', 'process', 'res2-ok']

test.each<[string, StepEvent[], object]>([
  ['the response lost', STANDARD_Q1 as StepEvent[], { ok: true, code: 'response-lost', writtenAt: 3, lostAt: 4 }],
  ['the response late', ['send', 'req1-ok', 'process', 'timeout', 'res1-ok', 'resend', 'req2-ok', 'process', 'res2-ok'], { ok: true, code: 'response-late', writtenAt: 3, arrivedAt: 5 }],
  ['the request late', ['send', 'timeout', 'resend', 'req1-ok', 'process', 'res1-ok', 'req2-ok', 'process', 'res2-ok'], { ok: true, code: 'request-late', timeoutAt: 2, arrivedAt: 4 }],
  ['an answer in time', ['send', 'req1-ok', 'process', 'res1-ok'], { ok: false, code: 'answered-in-time' }],
  ['no resend', ['send', 'req1-ok', 'process', 'res1-lost', 'timeout'], { ok: false, code: 'no-resend' }],
  ['the first request lost', Q2, { ok: false, code: 'first-request-lost' }],
  ['the resend lost', ['send', 'req1-ok', 'process', 'res1-lost', 'timeout', 'resend', 'req2-lost', 'timeout'], { ok: false, code: 'resend-lost' }],
])('question 1 judges a run with %s by its own steps', (_, trace, verdict) => {
  expect(replay([...trace, 'verify']).verdict).toEqual(verdict)
})

test('question 1 cannot be checked while a message is still on its way or the browser is waiting', () => {
  expect(canVerify(replay(['send', 'req1-ok', 'process']))).toBe(false)
  expect(canVerify(replay(['send', 'req1-ok', 'process', 'res1-lost']))).toBe(false)
  expect(() => replay(['send', 'req1-ok', 'process', 'verify'])).toThrow()
})

test('question 2 passes only when the first request is lost and the resend arrives', () => {
  expect(replay([...pass(STANDARD_Q1), ...Q2, 'verify']).verdict).toEqual({ ok: true, code: 'q2' })
  expect(replay([...pass(STANDARD_Q1), ...STANDARD_Q1, 'verify']).verdict).toEqual({ ok: false, code: 'first-request-arrived' })
  expect(replay([...pass(STANDARD_Q1), 'send', 'req1-lost', 'timeout', 'resend', 'req2-lost', 'timeout', 'verify']).verdict).toEqual({ ok: false, code: 'resend-lost' })
})

const throughQ2: LabEvent[] = [...pass(STANDARD_Q1), ...pass(Q2)]

test('questions 3 to 5 judge the chosen answer; steps are not available there', () => {
  expect(replay([...throughQ2, 'q3-failed', 'verify']).verdict).toEqual({ ok: false, code: 'answer', answer: 'failed' })
  expect(replay([...throughQ2, 'q3-failed', 'verify', 'q3-unknown', 'verify']).verdict).toEqual({ ok: true, code: 'answer', answer: 'unknown' })
  expect(() => replay([...throughQ2, 'send'])).toThrow()
  expect(() => replay([...throughQ2, 'verify'])).toThrow()
  expect(() => replay([...throughQ2, 'q4-blocked'])).toThrow()
  const q5 = replay([...throughQ2, 'q3-unknown', 'verify', 'next', 'q4-blocked', 'verify', 'next', 'q5-two', 'verify'])
  expect(q5).toMatchObject({ task: 4, completed: [0, 1, 2, 3], verdict: { ok: true } })
  expect(q5.q1Trace).toEqual(STANDARD_Q1)
  expect(q5.q2Trace).toEqual(Q2)
})

const throughQ5: LabEvent[] = [...throughQ2, 'q3-unknown', 'verify', 'next', 'q4-blocked', 'verify', 'next', 'q5-two', 'verify', 'next']
const fourOrders = guidedTrace(throughQ5)

/** The steps "Run the next step for me" takes, pressed until it stops, after `before`. */
function guidedTrace(before: readonly LabEvent[]) {
  const events = [...before]
  for (let next = guidedNext(replay(events)); next; next = guidedNext(replay(events))) events.push(next)
  return events.slice(before.length) as StepEvent[]
}

test('question 6 needs both numbers right and a run with four orders to prove the first', () => {
  const app = tasks[5].setup
  expect(simulate(app, fourOrders).orders).toHaveLength(4)
  expect(replay([...throughQ5, 'q6-none-3', 'q6-client-1', ...fourOrders, 'verify']).verdict).toEqual({ ok: false, code: 'none-wrong' })
  expect(replay([...throughQ5, 'q6-none-4', 'q6-client-2', ...fourOrders, 'verify']).verdict).toEqual({ ok: false, code: 'client-wrong' })
  const two: StepEvent[] = ['send', 'req1-ok', 'process', 'res1-lost', 'timeout', 'resend', 'req2-ok', 'process', 'res2-ok']
  expect(replay([...throughQ5, 'q6-none-4', 'q6-client-1', ...two, 'verify']).verdict).toEqual({ ok: false, code: 'too-few', count: 2 })
  // Changing an answer replaces the one in its group.
  const done = replay([...throughQ5, 'q6-none-3', 'q6-none-4', 'q6-client-1', ...fourOrders, 'verify'])
  expect(done.verdict).toEqual({ ok: true, code: 'q6' })
  expect(() => replay([...throughQ5, 'q6-none-4', 'q6-client-1', ...fourOrders, 'verify', 'next'])).toThrow()
})

test('"run the next step for me" follows the standard trace and stops once the reader leaves it', () => {
  expect(guidedTrace([])).toEqual(STANDARD_Q1)
  expect(guidedTrace(pass(STANDARD_Q1))).toEqual(Q2)
  expect(guidedNext(replay(['send', 'req1-lost']))).toBeNull()
  expect(guidedNext(replay([...STANDARD_Q1, 'verify']))).toBeNull()
})

test('question 4 and 5 replay the reader\'s trace, or the standard one when a late response would have stopped the resend', () => {
  const own: StepEvent[] = ['send', 'timeout', 'resend', 'req1-ok', 'process', 'res1-lost', 'req2-ok', 'process', 'res2-ok']
  expect(replayTrace(own, tasks[3].setup)).toEqual({ trace: own, substituted: false, dropped: false })
  const lateFirst: StepEvent[] = ['send', 'req1-ok', 'process', 'timeout', 'res1-ok', 'resend', 'req2-ok', 'process', 'res2-ok']
  expect(replayTrace(lateFirst, tasks[3].setup)).toEqual({ trace: STANDARD_Q1, substituted: true, dropped: false })
  expect(replayTrace(lateFirst, tasks[4].setup)).toEqual({ trace: STANDARD_Q1, substituted: true, dropped: false })
})

test('the browser sees the same thing in both worlds up to its first timeout', () => {
  const sees = (trace: readonly StepEvent[]) => simulate(naive, throughFirstTimeout(trace)).steps.filter((s) => s.actor === 'browser').map((s) => s.event)
  expect(throughFirstTimeout(STANDARD_Q1)).toEqual(['send', 'req1-ok', 'process', 'res1-lost', 'timeout'])
  expect(sees(STANDARD_Q1)).toEqual(['send', 'timeout'])
  expect(sees(Q2)).toEqual(sees(STANDARD_Q1))
})

// Design §5's table: request, response, resend → orders without an ID, with a server-made ID, with the browser's ID.
test('the dry run has the nine cases of the design, with their counts', () => {
  const table = scenarios.map((s) => [s.request, s.response, s.resend, ...(['none', 'server', 'client'] as const).map((v) => outcome(v, s.trace).orders)])
  expect(table).toEqual([
    ['lost', null, false, 0, 0, 0],
    ['lost', null, true, 1, 1, 1],
    ['on-time', 'on-time', false, 1, 1, 1],
    ['on-time', 'lost', false, 1, 1, 1],
    ['on-time', 'lost', true, 2, 2, 1],
    ['on-time', 'late', false, 1, 1, 1],
    ['on-time', 'late', true, 2, 2, 1],
    ['late', 'any', false, 1, 1, 1],
    ['late', 'any', true, 2, 2, 1],
  ])
  for (const s of scenarios) for (const screen of ['naive', 'honest'] as const) expect(settled(simulate({ version: 'none', screen, resender: 'user' }, s.trace))).toBe(true)
  expect(outcome('client', scenarios[4].trace).why).toBe('blocked')
  expect(outcome('server', scenarios[4].trace).why).toBe('new-server-id')
  expect(outcome('none', scenarios[4].trace).why).toBe('both-written')
  expect(outcome('none', scenarios[0].trace).why).toBe('never-arrived')
})

test('the URL round-trips; a bad link is reported, not reinterpreted', () => {
  const events: LabEvent[] = [...throughQ2, 'q3-unknown']
  expect(readLabLocation(`https://x.test/en/labs/d1/${labHref(events)}`)).toEqual({ events, invalid: false })
  expect(readLabLocation('https://x.test/en/labs/d1/')).toEqual({ events: [], invalid: false })
  expect(labHref([])).toBe('')
  for (const bad of ['?v=0&events=send', '?v=1&events=send,send', '?v=1&events=nonsense', '?events=send']) {
    expect(readLabLocation(`https://x.test/en/labs/d1/${bad}`)).toEqual({ events: [], invalid: true })
  }
})

test('a finished question can be read again from its own events', () => {
  const events: LabEvent[] = [...throughQ2, 'q3-unknown']
  expect(replay(eventsThroughTask(events, 0))).toMatchObject({ task: 0, trace: STANDARD_Q1, verdict: { ok: true } })
  expect(replay(eventsThroughTask(events, 1))).toMatchObject({ task: 1, trace: Q2, verdict: { ok: true } })
})

test('the server handles requests in the order they arrived, not the order they were sent', () => {
  const trace: StepEvent[] = ['send', 'timeout', 'resend', 'timeout', 'req2-ok', 'req1-ok', 'process', 'process']
  const run = simulate(honest('client'), trace)
  expect(run.steps.filter((s) => s.event === 'process').map((s) => [s.attempt, s.blocked])).toEqual([
    [2, false],
    [1, true],
  ])
})

test('question 4 replays the reader\'s own order, leaving out timeouts that cannot happen once the screen says "placed"', () => {
  const lateRequest: StepEvent[] = ['send', 'timeout', 'resend', 'req1-ok', 'process', 'res1-ok', 'timeout', 'req2-ok', 'process', 'res2-ok']
  expect(replayTrace(lateRequest, tasks[3].setup)).toEqual({
    trace: ['send', 'timeout', 'resend', 'req1-ok', 'process', 'res1-ok', 'req2-ok', 'process', 'res2-ok'],
    substituted: false,
    dropped: true,
  })
})

test('question 1 names the lost first request even before the reader resends', () => {
  expect(replay(['send', 'req1-lost', 'timeout', 'verify']).verdict).toEqual({ ok: false, code: 'first-request-lost' })
})

test('question 6: a response the honest screen hears stops the app resending, unless request 4 has already gone', () => {
  const app = tasks[5].setup
  expect(possibleSteps(app, ['send', 'req1-ok', 'process', 'timeout', 'res1-ok'])).not.toContain('resend')
  const sent4 = ['send', ...[1, 2, 3].flatMap((n) => [`req${n}-ok`, 'process', 'timeout', 'resend']), 'req4-ok', 'process'] as StepEvent[]
  expect(simulate(app, [...sent4, 'res1-ok', 'res2-ok', 'res3-ok', 'res4-ok']).orders).toHaveLength(4)
})

const toQ3: LabEvent[] = [...STANDARD_Q1, 'verify', 'next', 'send', 'req1-lost', 'timeout', 'resend', 'req2-ok', 'process', 'res2-ok', 'verify', 'next']
const toQ6: LabEvent[] = [...toQ3, 'q3-unknown', 'verify', 'next', 'q4-blocked', 'verify', 'next', 'q5-two', 'verify', 'next']

test('changing an answer replaces the earlier choice in its group and the failed check after it, so the link stays short', () => {
  expect(addEvent([...toQ3, 'q3-failed', 'verify'], 'q3-placed')).toEqual([...toQ3, 'q3-placed'])
  expect(addEvent([...toQ6, 'send', 'q6-none-1', 'q6-client-2', 'verify'], 'q6-none-3')).toEqual([...toQ6, 'send', 'q6-client-2', 'q6-none-3'])
  // A step in between keeps the earlier choice, so Previous step can go back past it.
  expect(addEvent([...toQ6, 'q6-none-1', 'send'], 'q6-none-2')).toEqual([...toQ6, 'q6-none-1', 'send', 'q6-none-2'])
  expect(addEvent([...toQ6, 'send'], 'req1-ok')).toEqual([...toQ6, 'send', 'req1-ok'])
})

test('Previous step takes back the last step and any check after it, never an answer, unless the question has no steps', () => {
  const start = toQ6.length
  expect(undoStep([...toQ6, 'send', 'req1-ok', 'q6-none-4', 'q6-client-1', 'verify'], start)).toEqual([...toQ6, 'send', 'q6-none-4', 'q6-client-1'])
  expect(undoStep([...toQ6, 'q6-none-4'], start)).toEqual(toQ6)
  expect(undoStep(['send', 'req1-ok', 'verify'], 0)).toEqual(['send'])
  expect(undoStep([...toQ3, 'q3-failed', 'verify'], toQ3.length)).toEqual(toQ3)
  for (const events of [[...toQ6, 'send', 'req1-ok', 'q6-none-4', 'q6-client-1', 'verify'] as LabEvent[], [...toQ3, 'q3-failed', 'verify'] as LabEvent[]]) {
    expect(() => replay(undoStep(events, events.lastIndexOf('next') + 1))).not.toThrow()
  }
})
