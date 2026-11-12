import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, expect, test, vi } from 'vitest'
import { App, pageTitle } from '../app/App'
import type { PageRoute } from '../app/routes'
import { contentFor } from '../i18n/content'
import { interpolate } from '../i18n/format'
import { langs } from '../i18n/langs'
import { HISTORY_LIMIT, STANDARD_Q1, labHref, type LabEvent, type StepEvent } from '../lessons/retryWorkshop'
import { pseudoContents, unwrapped } from '../test/pseudo'

const contents = { 'zh-TW': contentFor('zh-TW'), en: contentFor('en') }
const base = '/b/'
const en = contents.en.labs.d1
const lab = (lang: PageRoute['lang']): PageRoute => ({ kind: 'lab', lang, lab: 'd1' })

afterEach(() => {
  window.history.replaceState(null, '', '/')
  localStorage.clear()
  vi.restoreAllMocks()
})

const pass = (trace: readonly StepEvent[]): LabEvent[] => [...trace, 'verify', 'next']
const Q2: StepEvent[] = ['send', 'req1-lost', 'timeout', 'resend', 'req2-ok', 'process', 'res2-ok']
const throughQ2 = [...pass(STANDARD_Q1), ...pass(Q2)]
const throughQ5: LabEvent[] = [...throughQ2, 'q3-unknown', 'verify', 'next', 'q4-blocked', 'verify', 'next', 'q5-two', 'verify', 'next']
const fourOrders = ['send', ...[1, 2, 3].flatMap((n) => [`req${n}-ok`, 'process', `res${n}-lost`, 'timeout', 'resend']), 'req4-ok', 'process', 'res4-ok'] as StepEvent[]
const lateFirst: StepEvent[] = ['send', 'req1-ok', 'process', 'timeout', 'res1-ok', 'resend', 'req2-ok', 'process', 'res2-ok']

/** Opens the lab at a point in its history, as a shared link would. */
function open(events: readonly LabEvent[], lang: PageRoute['lang'] = 'en', c = contents, phase: 1 | 2 | 3 = 3) {
  window.history.replaceState(null, '', `/b/${lang}/labs/d1/${labHref(events)}`)
  return render(<App route={lab(lang)} contents={c} phase={phase} base={base} />)
}

const histories: [string, LabEvent[]][] = [
  ['the start', []],
  ['question 1 under way', ['send', 'req1-ok', 'process']],
  ['question 1 waiting on the server', ['send', 'req1-lost', 'timeout', 'resend', 'req2-ok', 'timeout']],
  ['question 1 failed', ['send', 'req1-ok', 'process', 'res1-ok', 'verify']],
  ['question 1 passed', [...STANDARD_Q1, 'verify']],
  ['question 2 passed', [...pass(STANDARD_Q1), ...Q2, 'verify']],
  ['question 3 answered', [...throughQ2, 'q3-failed', 'verify']],
  ['question 4 before the reveal', [...throughQ2, 'q3-unknown', 'verify', 'next', 'q4-tcp']],
  ['question 4 revealed on a substituted trace', [...pass(lateFirst), ...pass(Q2), 'q3-unknown', 'verify', 'next', 'q4-blocked', 'verify']],
  ['question 4 revealed with a timeout left out', [...pass(['send', 'timeout', 'resend', 'req1-ok', 'process', 'res1-ok', 'timeout', 'req2-ok', 'process', 'res2-ok']), ...pass(Q2), 'q3-silent', 'verify', 'next', 'q4-blocked', 'verify']],
  ['question 5 revealed', [...throughQ2, 'q3-unknown', 'verify', 'next', 'q4-blocked', 'verify', 'next', 'q5-one', 'verify']],
  ['question 6 too few', [...throughQ5, 'q6-none-4', 'q6-client-1', 'send', 'req1-ok', 'process', 'res1-ok', 'verify']],
  ['the lab finished', [...throughQ5, 'q6-none-4', 'q6-client-1', ...fourOrders, 'verify']],
]

test.each(langs.flatMap((lang) => histories.map(([name, events]) => [lang, name, events] as const)))(
  'no hard-coded text on the lab page (%s, %s)',
  (lang, _, events) => {
    const pseudo = pseudoContents()
    const { container } = open(events, lang, pseudo)
    expect(container.querySelector('.lab-workshop')).not.toBeNull()
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
    for (let n = walker.nextNode(); n; n = walker.nextNode()) expect(unwrapped(n.textContent!), n.parentElement!.outerHTML.slice(0, 120)).toBe('')
    for (const el of container.querySelectorAll('[aria-label],[alt],[title]')) {
      for (const a of ['aria-label', 'alt', 'title']) if (el.hasAttribute(a)) expect(unwrapped(el.getAttribute(a)!)).toBe('')
    }
    expect(unwrapped(pageTitle(lab(lang), pseudo))).toBe('')
  },
)

test('the prerendered lab has the setup and idea table but no workshop, and says the workshop needs JavaScript', () => {
  const html = renderToString(<App route={lab('en')} contents={contents} phase={3} base={base} />)
  expect(html).toContain(en.setup[0].detail)
  expect(html).toContain(en.idea.rows[0].meaning)
  expect(html).toContain(en.noscript)
  expect(html).not.toContain('lab-workshop')
  expect(html).not.toContain(en.idea.rows[0].rightWhen)
})

test('the prerendered lab hydrates with nothing different, then shows the workshop', () => {
  const app = <App route={lab('zh-TW')} contents={contents} phase={3} base={base} />
  const container = document.createElement('div')
  container.innerHTML = renderToString(app)
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  let root: ReturnType<typeof hydrateRoot> | undefined
  act(() => {
    root = hydrateRoot(container, app)
  })
  expect(error).not.toHaveBeenCalled()
  expect(container.querySelector('.lab-workshop')).not.toBeNull()
  act(() => root!.unmount())
  vi.unstubAllGlobals()
})

test.each(langs)('topics T3 and T4 link to the lab from phase 3, on their page and their map card; the lab links back (%s)', (lang) => {
  const { ui, labs } = contents[lang]
  const name = interpolate(ui.lab.link, { title: labs.d1.title })
  const href = `/b/${lang}/labs/d1/`
  for (const phase of [2, 3] as const) {
    for (const topic of ['T3', 'T4'] as const) {
      const page = render(<App route={{ kind: 'topic', lang, topic }} contents={contents} phase={phase} base={base} />)
      expect(within(screen.getByRole('main')).queryByRole('link', { name }), `${topic} ${phase}`).toEqual(phase === 3 ? expect.anything() : null)
      page.unmount()
    }
    const map = render(<App route={{ kind: 'map', lang }} contents={contents} phase={phase} base={base} />)
    expect(within(screen.getByRole('main')).queryAllByRole('link', { name }).map((a) => a.getAttribute('href'))).toEqual(phase === 3 ? [href, href] : [])
    map.unmount()
  }
  render(<App route={{ kind: 'topic', lang, topic: 'T5' }} contents={contents} phase={3} base={base} />)
  expect(screen.queryByRole('link', { name })).toBeNull()
})

test('the lab links to the topics it practises and to what to read next', () => {
  open([])
  const practises = screen.getByRole('list', { name: en.practises })
  expect(within(practises).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['/b/en/topics/t3/', '/b/en/topics/t4/'])
  const next = screen.getByRole('navigation', { name: en.related })
  expect(within(next).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['/b/en/topics/t5/', '/b/en/topics/t6/', '/b/en/topics/t7/'])
  expect(pageTitle(lab('en'), contents)).toBe(`${en.title} · ${contents.en.ui.siteTitle}`)
})

const button = (name: string) => screen.getByRole('button', { name })

test('question 1, step by step: a disabled step says why beside it, and the check names the reader\'s own steps', () => {
  open([])
  expect(button(en.buttons.resend.user)).toBeDisabled()
  expect(button(en.buttons.resend.user)).toHaveAccessibleDescription(en.reasons.notSent)
  fireEvent.click(button(en.buttons.send))
  expect(button(en.buttons.resend.user)).toHaveAccessibleDescription(en.reasons.stillWaiting)
  expect(button(en.controls.verify)).toBeDisabled()
  expect(screen.getByText(en.hints.waiting)).toBeInTheDocument()
  fireEvent.click(button('Deliver request 1'))
  fireEvent.click(button(interpolate(en.buttons.process, { n: '1' })))
  fireEvent.click(button('Lose response 1'))
  fireEvent.click(button(en.buttons.timeout))
  // The naive screen lies: the order exists, and it says the order failed.
  expect(screen.getByRole('figure', { name: en.phone.label })).toHaveTextContent(en.claims.failed)
  expect(screen.getByRole('group', { name: en.rule.heading })).toHaveTextContent(en.rule.screenLie)
  fireEvent.click(button(en.buttons.resend.user))
  fireEvent.click(button('Deliver request 2'))
  fireEvent.click(button(interpolate(en.buttons.process, { n: '2' })))
  fireEvent.click(button('Deliver response 2'))
  expect(screen.getByRole('group', { name: en.rule.heading })).toHaveTextContent(en.rule.ordersBad)
  fireEvent.click(button(en.controls.verify))
  // The verdict word is its own element, so the languages space it their own way.
  expect(within(screen.getByRole('status')).getByText(en.verdicts.passed.trim()).tagName).toBe('STRONG')
  expect(screen.getByRole('status')).toHaveTextContent(interpolate(en.verdicts.q1['response-lost'], { lostAt: '4', writtenAt: '3' }))
  expect(window.location.search).toBe(labHref([...STANDARD_Q1, 'verify']))
  // Steps stop once the question has passed, and the stage says why.
  expect(screen.queryByRole('button', { name: en.buttons.send })).toBeNull()
  expect(screen.getByText(en.stage.passed)).toBeInTheDocument()
  fireEvent.click(button(en.controls.next))
  expect(screen.getByRole('heading', { level: 3, name: en.questions[1].title })).toBeInTheDocument()
})

test('"Run the next step for me" goes on past the timeout, when nothing is on its way, to the end of the standard order', () => {
  open([])
  for (let i = 0; i < STANDARD_Q1.length; i++) fireEvent.click(button(en.stage.guided))
  expect(window.location.search).toBe(labHref(STANDARD_Q1))
  expect(screen.queryByRole('button', { name: en.stage.guided })).toBeNull()
})

test('"Run the next step for me" stops when the reader leaves the standard order, and says why', () => {
  open([])
  fireEvent.click(button(en.stage.guided))
  fireEvent.click(button(en.stage.guided))
  fireEvent.click(button(en.stage.guided))
  expect(screen.getByRole('status')).toHaveTextContent(en.stage.crux)
  fireEvent.click(button(en.buttons.timeout))
  expect(button(en.stage.guided)).toBeDisabled()
  expect(button(en.stage.guided)).toHaveAccessibleDescription(en.stage.guidedOff)
})

test('a finished question reads again in full; a locked one shows a preview only', () => {
  open([...throughQ2])
  const progress = screen.getByRole('list', { name: en.progress.label })
  fireEvent.click(within(progress).getAllByRole('button')[0])
  expect(screen.getByText(interpolate(en.readOnly, { n: '1' }))).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent(interpolate(en.verdicts.q1['response-lost'], { lostAt: '4', writtenAt: '3' }))
  expect(screen.queryByRole('button', { name: en.controls.verify })).toBeNull()
  fireEvent.click(button(interpolate(en.controls.back, { n: '3' })))
  fireEvent.click(within(progress).getAllByRole('button')[4])
  expect(screen.getByText(interpolate(en.preview.locked, { n: '4' }), { exact: false })).toBeInTheDocument()
  expect(screen.queryByRole('radio')).toBeNull()
})

test('leaving a question read again or previewed puts focus on the live question, not the page body', () => {
  open([...throughQ2])
  const progress = screen.getByRole('list', { name: en.progress.label })
  const live = () => screen.getByRole('heading', { level: 3, name: en.questions[2].title })
  fireEvent.click(within(progress).getAllByRole('button')[0])
  fireEvent.click(button(interpolate(en.controls.back, { n: '3' })))
  expect(live()).toHaveFocus()
  fireEvent.click(within(progress).getAllByRole('button')[4])
  fireEvent.click(button(interpolate(en.preview.back, { n: '3' })))
  expect(live()).toHaveFocus()
})

test('every progress button that says where to go goes there: a passed question\'s own button moves on', () => {
  open([...STANDARD_Q1, 'verify'])
  const passed = within(screen.getByRole('list', { name: en.progress.label })).getAllByRole('button')[0]
  expect(passed).toHaveTextContent(interpolate(en.progress.checkedHere, { n: '2' }))
  fireEvent.click(passed)
  expect(screen.getByRole('heading', { level: 3, name: en.questions[1].title })).toBeInTheDocument()
})

test('question 3 marks the world where a background resend duplicates the order, though the screen says nothing false', () => {
  open([...throughQ2, 'q3-silent', 'verify'])
  const table = screen.getByRole('table', { name: interpolate(en.answers.q3.reveal.caption, { answer: en.answers.q3.options.silent }) })
  const cells = within(table).getAllByRole('row').slice(1).map((r) => r.lastElementChild!)
  expect(cells.map((c) => [c.textContent, c.classList.contains('verdict-bad')])).toEqual([
    [en.answers.q3.reveal.silentDuplicate, true],
    [en.answers.q3.reveal.silent, false],
  ])
})

test('the two worlds line up: the browser\'s rows read the same, and each stretch it cannot see is one row that opens to its steps', () => {
  const rows = (figure: HTMLElement) => [...figure.querySelectorAll('.timeline-steps > li')].map((li) => li.querySelector('summary')?.textContent ?? li.textContent)
  const worlds = () => within(screen.getByRole('region', { name: en.worlds.heading })).getAllByRole('figure')
  const hidden = (count: number) => interpolate(en.worlds.hiddenSteps, { count: String(count) })

  const { unmount } = open([...pass(STANDARD_Q1), ...Q2, 'verify'])
  const [first, second] = worlds().map(rows)
  expect(first).toEqual([second[0], hidden(3), second[2]])
  expect(second[1]).toBe(hidden(1))
  expect(worlds()[1]).toHaveTextContent(interpolate(en.timeline.requestLost, { n: '1' }))
  unmount()

  // A request that arrives late leaves nothing hidden before the first timeout in question 1's world; the row says so.
  open([...pass(['send', 'timeout', 'resend', 'req1-ok', 'process', 'res1-ok', 'timeout', 'req2-ok', 'process', 'res2-ok']), ...Q2, 'verify'])
  expect(worlds().map(rows).map((r) => r[1])).toEqual([en.worlds.hiddenNone, hidden(1)])
})

test('in questions 3 to 5, once an answer is chosen the status line asks for the check, not for an answer', () => {
  open([...throughQ2])
  expect(screen.getByRole('status')).toHaveTextContent(en.notices.pickAnswer)
  fireEvent.click(screen.getByRole('radio', { name: en.answers.q3.options.failed }))
  fireEvent.click(button(en.controls.verify))
  fireEvent.click(screen.getByRole('radio', { name: en.answers.q3.options.placed }))
  expect(screen.getByRole('status')).toHaveTextContent(en.hints.ready)
})

test('question 3 compares the chosen message against both worlds', () => {
  open([...throughQ2, 'q3-failed', 'verify'])
  const table = screen.getByRole('table', { name: interpolate(en.answers.q3.reveal.caption, { answer: en.answers.q3.options.failed }) })
  expect(within(table).getAllByRole('row').slice(1).map((r) => [...r.children].map((c) => c.textContent))).toEqual([
    [en.worlds.first, en.answers.q3.reveal.yes, en.answers.q3.reveal.false],
    [en.worlds.second, en.answers.q3.reveal.no, en.answers.q3.reveal.true],
  ])
  expect(button(en.controls.verify)).toBeDisabled()
  expect(screen.getByText(en.hints.failedAnswer)).toBeInTheDocument()
})

test('question 4 replays the standard order, and says so, when the reader\'s own could not resend under the new screen', () => {
  open([...pass(lateFirst), ...pass(Q2), 'q3-unknown', 'verify', 'next'])
  expect(screen.getByText(en.replayed)).toBeInTheDocument()
  // Before the answer, the standard order is shown, and the caption says it is not the reader's own run.
  expect(screen.getByText(en.reference.standard)).toBeInTheDocument()
  expect(screen.queryByText(en.reference.caption)).toBeNull()
  fireEvent.click(screen.getByRole('radio', { name: en.answers.q4.options.blocked }))
  fireEvent.click(button(en.controls.verify))
  const requests = screen.getByRole('table', { name: en.shared.requests })
  expect(within(requests).getAllByRole('row').at(-1)).toHaveTextContent(en.shared.blocked)
})

test('the dry run appears after question 2 and adds each ID column only once its question is answered', () => {
  const first = open([...throughQ2])
  const table = () => screen.getByRole('table', { name: en.dryRun.caption })
  const headers = () => within(table()).getAllByRole('columnheader').map((h) => h.textContent)
  expect(headers()).toEqual([en.dryRun.columns.request, en.dryRun.columns.response, en.dryRun.columns.resend, en.dryRun.columns.none])
  expect(screen.getByText(en.dryRun.pending)).toBeInTheDocument()
  first.unmount()
  open(throughQ5)
  expect(headers().slice(3)).toEqual([en.dryRun.columns.none, en.dryRun.columns.server, en.dryRun.columns.client])
  expect(screen.queryByText(en.dryRun.pending)).toBeNull()
  expect(screen.getByText(en.dryRun.late)).toBeInTheDocument()
})

test('the idea table opens its other columns once question 5 is answered', () => {
  const first = open([...throughQ2])
  expect(screen.queryByText(en.idea.rows[0].rightWhen)).toBeNull()
  expect(screen.getByText(en.idea.locked)).toBeInTheDocument()
  first.unmount()
  open(throughQ5)
  expect(screen.getAllByText(en.idea.rows[0].rightWhen)).not.toHaveLength(0)
})

test('question 6 asks for a run with four orders when the numbers are right but the run has fewer', () => {
  open([...throughQ5, 'q6-none-4', 'q6-client-1', 'send', 'req1-ok', 'process', 'res1-ok', 'verify'])
  expect(screen.getByRole('status')).toHaveTextContent(interpolate(en.verdicts.q6['too-few'], { count: '1' }))
  expect(screen.getByText(en.hints.failedBuild)).toBeInTheDocument()
})

test('the last part keeps its draft in this browser, and offers the sample answer only once something is written', () => {
  const finished: LabEvent[] = [...throughQ5, 'q6-none-4', 'q6-client-1', ...fourOrders, 'verify']
  const first = open(finished)
  const show = button(en.final.show)
  expect(show).toBeDisabled()
  expect(show).toHaveAccessibleDescription(en.final.disabled)
  fireEvent.change(screen.getByRole('textbox', { name: en.final.label }), { target: { value: 'On a timeout, say we cannot confirm.' } })
  fireEvent.click(screen.getByRole('checkbox', { name: en.final.checks[0] }))
  fireEvent.click(button(en.final.show))
  expect(screen.getByText(en.final.answer)).toBeInTheDocument()
  first.unmount()
  open(finished)
  expect(screen.getByRole('textbox', { name: en.final.label })).toHaveValue('On a timeout, say we cannot confirm.')
  expect(screen.getByRole('checkbox', { name: en.final.checks[0] })).toBeChecked()
})

test('with storage blocked, the draft still works on the page', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked')
  })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('blocked')
  })
  open([...throughQ5, 'q6-none-4', 'q6-client-1', ...fourOrders, 'verify'])
  fireEvent.change(screen.getByRole('textbox', { name: en.final.label }), { target: { value: 'x' } })
  expect(button(en.final.show)).toBeEnabled()
})

test('a bad link says the lab starts over; reset, previous step and start over each say what they did', () => {
  window.history.replaceState(null, '', '/b/en/labs/d1/?v=1&events=send,send')
  render(<App route={lab('en')} contents={contents} phase={3} base={base} />)
  expect(screen.getByRole('alert')).toHaveTextContent(en.notices.invalid)
  expect(button(en.controls.undo)).toBeDisabled()
  expect(screen.getByText(en.hints.undo)).toBeInTheDocument()
  fireEvent.click(button(en.buttons.send))
  fireEvent.click(button(en.controls.undo))
  expect(window.location.search).toBe('')
  fireEvent.click(button(en.buttons.send))
  fireEvent.click(button(en.controls.reset))
  expect(screen.getByRole('status')).toHaveTextContent(en.notices.reset)
  fireEvent.click(button(en.buttons.send))
  fireEvent.click(button(en.controls.restart))
  expect(screen.getByRole('status')).toHaveTextContent(en.notices.restart)
})

test('reset and start over are off, and say why, when they would change nothing', () => {
  const first = open([])
  for (const name of [en.controls.undo, en.controls.reset, en.controls.restart]) expect(button(name)).toBeDisabled()
  expect(screen.getByText(en.hints.undo)).toBeInTheDocument()
  first.unmount()
  open([...pass(STANDARD_Q1)])
  expect(button(en.controls.reset)).toBeDisabled()
  expect(button(en.controls.reset)).toHaveAccessibleDescription(expect.stringContaining(en.hints.reset))
  expect(button(en.controls.restart)).toBeEnabled()
  fireEvent.click(button(en.buttons.send))
  expect(button(en.controls.reset)).toBeEnabled()
})

test('the language switch opens the lab in the other language at the same point', () => {
  const assign = vi.fn()
  vi.stubGlobal('location', { ...window.location, assign, search: '?v=1&events=send', pathname: '/b/en/labs/d1/' })
  render(<App route={lab('en')} contents={contents} phase={3} base={base} />)
  fireEvent.change(screen.getByRole('combobox', { name: contents.en.ui.languageSwitchLabel }), { target: { value: 'zh-TW' } })
  expect(assign).toHaveBeenCalledWith('/b/zh-TW/labs/d1/?v=1&events=send')
  vi.unstubAllGlobals()
})

test('the crux notice comes once, when the server has just written the first order', () => {
  open([])
  for (let i = 0; i < 3; i++) fireEvent.click(button(en.stage.guided))
  expect(screen.getByRole('status')).toHaveTextContent(en.stage.crux)
  for (let i = 3; i < 8; i++) fireEvent.click(button(en.stage.guided))
  expect(screen.getByRole('status')).not.toHaveTextContent(en.stage.crux)
})

test('a locked question\'s preview shows its question but not its instructions, which name earlier answers', () => {
  open([...throughQ2])
  fireEvent.click(within(screen.getByRole('list', { name: en.progress.label })).getAllByRole('button')[3])
  expect(screen.getByText(en.questions[3].question)).toBeInTheDocument()
  expect(screen.queryByText(en.questions[3].instruction)).toBeNull()
})

test('a notice about one question is not shown on another read again', () => {
  open([...throughQ2, 'q3-failed'])
  fireEvent.click(button(en.controls.reset))
  expect(screen.getByRole('status')).toHaveTextContent(en.notices.reset)
  fireEvent.click(within(screen.getByRole('list', { name: en.progress.label })).getAllByRole('button')[0])
  expect(screen.getByRole('status')).toHaveTextContent(interpolate(en.verdicts.q1['response-lost'], { lostAt: '4', writtenAt: '3' }))
})

test('question 4 says so when it leaves out a timeout of the reader\'s own order that the new screen makes impossible', () => {
  const lateRequest: StepEvent[] = ['send', 'timeout', 'resend', 'req1-ok', 'process', 'res1-ok', 'timeout', 'req2-ok', 'process', 'res2-ok']
  const first = open([...pass(lateRequest), ...pass(Q2), 'q3-unknown', 'verify', 'next', 'q4-blocked'])
  expect(screen.queryByText(en.replayedDropped)).toBeNull()
  first.unmount()
  open([...pass(lateRequest), ...pass(Q2), 'q3-unknown', 'verify', 'next', 'q4-blocked', 'verify'])
  expect(screen.getByText(en.replayedDropped)).toBeInTheDocument()
})

test('when question 4 replays the standard order, its reference timeline shows that order too', () => {
  open([...pass(lateFirst), ...pass(Q2), 'q3-unknown', 'verify', 'next'])
  const reference = screen.getByRole('figure', { name: en.timeline.heading })
  // The standard order loses response 1; the reader's own let it arrive late.
  expect(reference).toHaveTextContent(interpolate(en.timeline.responseLost, { n: '1' }))
})

test('when only the server is left to act, the hint names the request it must handle before the check turns on', () => {
  open(['send', 'req1-lost', 'timeout', 'resend', 'req2-ok', 'timeout'])
  expect(screen.getByText(en.messages.empty)).toBeInTheDocument()
  expect(button(en.controls.verify)).toBeDisabled()
  expect(button(en.controls.verify)).toHaveAccessibleDescription(expect.stringContaining(interpolate(en.hints.unhandled, { n: '2' })))
})

test('steps within a question replace the history entry; the next question, a reset and starting over add one', () => {
  open([])
  const start = window.history.length
  for (let i = 0; i < STANDARD_Q1.length; i++) fireEvent.click(button(en.stage.guided))
  fireEvent.click(button(en.controls.verify))
  expect(window.history.length).toBe(start)
  expect(window.location.search).toContain('verify')
  fireEvent.click(button(en.controls.next))
  expect(window.history.length).toBe(start + 1)
  fireEvent.click(button(en.buttons.send))
  fireEvent.click(button(en.controls.reset))
  expect(window.history.length).toBe(start + 2)
  fireEvent.click(button(en.controls.restart))
  expect(window.history.length).toBe(start + 3)
})

test('Previous step stays within this question: on a question with no steps yet it is off and says why, and Start over stays on', () => {
  open([...pass(STANDARD_Q1)])
  expect(button(en.controls.undo)).toBeDisabled()
  expect(button(en.controls.undo)).toHaveAccessibleDescription(expect.stringContaining(en.hints.reset))
  expect(button(en.controls.restart)).toBeEnabled()
  fireEvent.click(button(en.buttons.send))
  fireEvent.click(button(en.controls.undo))
  expect(button(en.controls.undo)).toBeDisabled()
  expect(screen.getByRole('heading', { level: 3, name: en.questions[1].title })).toBeInTheDocument()
})

test('the progress strip has no toggle buttons; the question shown again says so in its status', () => {
  open([...throughQ2])
  const buttons = within(screen.getByRole('list', { name: en.progress.label })).getAllByRole('button')
  fireEvent.click(buttons[0])
  for (const b of buttons) expect(b).not.toHaveAttribute('aria-pressed')
  expect(buttons[0]).toHaveTextContent(en.progress.viewing)
  expect(buttons[2]).toHaveAttribute('aria-current', 'step')
})

test('question 6: a response that arrives late, before the app resends, ends the run; the feedback says how to reach 4', () => {
  open([...throughQ5, 'q6-none-4', 'q6-client-1', 'send', 'req1-ok', 'process', 'timeout', 'res1-ok', 'verify'])
  expect(screen.getByRole('status')).toHaveTextContent(interpolate(en.verdicts.q6['too-few'], { count: '1' }))
})

test('at the step limit, another step leaves the lab as it was and says how to go on; a longer link starts over', () => {
  // The lab itself folds changed answers together, so only a hand-made link this long reaches the limit.
  const full: LabEvent[] = [...throughQ5, 'send']
  while (full.length < HISTORY_LIMIT) full.push(full.length % 2 ? 'q6-none-1' : 'q6-none-2')
  const first = open(full)
  const before = window.location.search
  fireEvent.click(button(interpolate(en.messages.deliver, { message: interpolate(en.messages.request, { n: '1' }) })))
  expect(screen.getByRole('status')).toHaveTextContent(en.notices.limit)
  expect(window.location.search).toBe(before)
  first.unmount()
  open([...full, 'req1-ok'])
  expect(screen.getByRole('alert')).toHaveTextContent(en.notices.invalid)
})

test('giving a message its fate removes its buttons, so focus moves to the network card instead of the page body', () => {
  open(['send'])
  const message = interpolate(en.messages.request, { n: '1' })
  const deliver = button(interpolate(en.messages.deliver, { message }))
  deliver.focus()
  fireEvent.click(deliver)
  expect(screen.getByRole('heading', { level: 4, name: en.actors.network.name })).toHaveFocus()
})

test('a role button that turns itself off, such as Place order or Time out, moves focus to its own card', () => {
  open([])
  for (const [label, actor] of [[en.buttons.send, en.actors.browser.name], [en.buttons.timeout, en.actors.browser.name]]) {
    const pressed = button(label)
    pressed.focus()
    fireEvent.click(pressed)
    expect(pressed).toBeDisabled()
    expect(screen.getByRole('heading', { level: 4, name: actor })).toHaveFocus()
  }
})

test('a passed question keeps its steps, so what it earned stays: Previous step and Reset are off and say why', () => {
  open([...throughQ2.slice(0, -1)])
  const dryRun = () => screen.queryByRole('heading', { name: en.dryRun.heading })
  expect(dryRun()).not.toBeNull()
  for (const name of [en.controls.undo, en.controls.reset]) {
    expect(button(name)).toBeDisabled()
    expect(button(name)).toHaveAccessibleDescription(expect.stringContaining(en.hints.checked))
  }
  expect(button(en.controls.restart)).toBeEnabled()
  expect(screen.queryByText(en.hints.reset)).toBeNull()
})

test('Previous step after a failed check takes back the last step too, not only the check', () => {
  const q1LostResend: StepEvent[] = ['send', 'req1-ok', 'process', 'res1-lost', 'timeout', 'resend', 'req2-lost', 'timeout']
  open([...q1LostResend, 'verify'])
  expect(screen.getByRole('status')).toHaveTextContent(en.verdicts.q1['resend-lost'])
  fireEvent.click(button(en.controls.undo))
  expect(window.location.search).toBe(labHref(q1LostResend.slice(0, -1)))
})

test('in question 6, Previous step takes back a step and keeps the chosen numbers, even when they were chosen last', () => {
  const steps: StepEvent[] = ['send', 'req1-ok', 'process', 'res1-ok']
  open([...throughQ5, ...steps, 'q6-none-4', 'q6-client-1', 'verify'])
  fireEvent.click(button(en.controls.undo))
  expect(window.location.search).toBe(labHref([...throughQ5, ...steps.slice(0, -1), 'q6-none-4', 'q6-client-1']))
  expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(2)
})

test('Next question, and the last step Run the next step for me can take, leave focus on the page, not its body', () => {
  open([...STANDARD_Q1, 'verify'])
  fireEvent.click(button(en.controls.next))
  expect(screen.getByRole('heading', { level: 3, name: en.questions[1].title })).toHaveFocus()
  for (let i = 0; i < Q2.length; i++) {
    const guided = button(en.stage.guided)
    guided.focus()
    fireEvent.click(guided)
  }
  expect(button(en.controls.verify)).toHaveFocus()
})

test('pressing the current question\'s progress card goes to that question', () => {
  open([])
  fireEvent.click(within(screen.getByRole('list', { name: en.progress.label })).getAllByRole('button')[0])
  expect(screen.getByRole('heading', { level: 3, name: en.questions[0].title })).toHaveFocus()
})

test('a control that turns itself off hands focus to Check this question when it is on, otherwise to the feedback', () => {
  const feedback = () => screen.getByRole('status')
  const press = (name: string) => {
    const b = button(name)
    b.focus()
    fireEvent.click(b)
  }
  const first = open([...STANDARD_Q1])
  press(en.controls.verify)
  expect(feedback()).toHaveFocus()
  first.unmount()
  const second = open(['send'])
  press(en.controls.reset)
  expect(feedback()).toHaveTextContent(en.notices.reset)
  expect(feedback()).toHaveFocus()
  second.unmount()
  open(throughQ5)
  const guided = () => screen.queryByRole('button', { name: en.stage.guided })
  for (let i = 0; i < 30 && guided() && !guided()!.hasAttribute('disabled'); i++) press(en.stage.guided)
  expect(button(en.controls.verify)).toBeDisabled()
  expect(feedback()).toHaveFocus()
})

test('questions 4 and 5 replay question 1 under the new code only once answered correctly, so a wrong check gives nothing away', () => {
  const stage = () => screen.queryByRole('group', { name: en.stage.heading })
  const first = open([...throughQ2, 'q3-unknown', 'verify', 'next', 'q4-tcp', 'verify'])
  expect(screen.getByRole('status')).toHaveTextContent(en.answers.q4.feedback.tcp)
  expect(stage()).toBeNull()
  expect(screen.getByRole('group', { name: en.reference.heading })).toBeInTheDocument()
  first.unmount()
  open([...throughQ2, 'q3-unknown', 'verify', 'next', 'q4-blocked', 'verify'])
  expect(stage()).not.toBeNull()
})
