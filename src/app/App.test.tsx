import { fireEvent, render, screen, within } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, expect, test, vi } from 'vitest'
import { SectionBlock } from '../components/SectionBlock'
import { liveTopics, sectionsOf } from '../content/live'
import { contentFor, sectionText } from '../i18n/content'
import { expandPageRefs, interpolate } from '../i18n/format'
import { langs } from '../i18n/langs'
import { pseudoContents, unwrapped } from '../test/pseudo'
import { App, htmlLang, pageTitle } from './App'
import { INDEX_KEY } from './indexToggle'
import type { PageRoute } from './routes'

const contents = { 'zh-TW': contentFor('zh-TW'), en: contentFor('en') }
const base = '/b/'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  localStorage.clear()
  delete document.documentElement.dataset.index
})

const routes: (PageRoute | null)[] = [
  null,
  ...langs.flatMap((lang): PageRoute[] => [
    { kind: 'map', lang },
    { kind: 'topic', lang, topic: 'T3' },
    { kind: 'topic', lang, topic: 'T4' },
  ]),
]

test.each(routes)('no hard-coded text: every visible string and label comes from content (%o)', (route) => {
  const pseudo = pseudoContents()
  const { container } = render(<App route={route} contents={pseudo} phase={1} base={base} />)
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) expect(unwrapped(n.textContent!)).toBe('')
  for (const el of container.querySelectorAll('[aria-label],[alt],[title]')) {
    for (const a of ['aria-label', 'alt', 'title']) if (el.hasAttribute(a)) expect(unwrapped(el.getAttribute(a)!)).toBe('')
  }
  expect(unwrapped(pageTitle(route, pseudo))).toBe('')
})

// T3 and T4 have neither of these cases; phase 2 has both (12 rating exceptions, several sections with no book title).
test.each(['ch13-how-to-choose', 'ch2-how-important-is-reliability'] as const)(
  'no hard-coded text in a section block with no book title or with a rating exception (%s)',
  (id) => {
    const pseudo = pseudoContents()['zh-TW']
    const text = { title: '⟦Our title⟧', conclusion: '⟦c⟧', tradeoff: '⟦t⟧', questions: ['⟦q⟧'], examples: [{ source: 'book', text: '⟦e⟧' }] } as const
    const { container } = render(<SectionBlock content={pseudo} meta={pseudo.sections[id]} text={text} zone="first" />)
    if (id === 'ch13-how-to-choose') {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('⟦Our title⟧')
      expect(container).toHaveTextContent(pseudo.ui.fromChapter)
    } else {
      expect(container.querySelector('.rating-exception')).not.toBeNull()
    }
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
    for (let n = walker.nextNode(); n; n = walker.nextNode()) expect(unwrapped(n.textContent!)).toBe('')
  },
)

test('map at phase 1: one zone, left unnamed; one group, two folded cards, each with a read link to its base-absolute topic path', () => {
  const { container } = render(<App route={{ kind: 'map', lang: 'zh-TW' }} contents={contents} phase={1} base={base} />)
  // With a single live zone its name says nothing the page does not, so the group heading is the top level.
  expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['使用者會碰到的異常'])
  expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  const cards = [...container.querySelectorAll('.card')]
  expect(cards.map((card) => card.querySelector('.card-read')!.getAttribute('href'))).toEqual(['/b/zh-TW/topics/t3/', '/b/zh-TW/topics/t4/'])
  for (const card of cards) expect(card.querySelector('details')).not.toHaveAttribute('open')
  expect(container.textContent).not.toMatch(/\b[TQ]\d+\b/)
})

test.each(langs)('a folded map card shows its title and tags; unfolded, its summary and a link to each section (%s)', (lang) => {
  const { ui, topics } = contents[lang]
  render(<App route={{ kind: 'map', lang }} contents={contents} phase={1} base={base} />)
  for (const topic of liveTopics(1)) {
    const text = topics[topic]!
    // Two cards both say "Read", so each link is named after its topic.
    const read = screen.getByRole('link', { name: interpolate(ui.card.readLabel, { topic: text.title }) })
    expect(read).toHaveTextContent(ui.card.read)
    const details = read.closest('li')!.querySelector('details')!
    const summary = details.querySelector('summary')!
    expect(summary.querySelector('.card-title')!.textContent).toBe(text.title)
    expect([...summary.querySelectorAll('.learn-tag')].map((t) => t.textContent)).toEqual(text.tags)
    // Heard as one name with the title, the tags are introduced the way the topic page introduces them.
    expect(within(summary).getByText(ui.card.learn)).toHaveClass('visually-hidden')
    expect(details.querySelector(':scope > p')!.textContent).toBe(text.summary)
    expect([...details.querySelectorAll('ol a')].map((a) => a.getAttribute('href'))).toEqual(
      sectionsOf(topic).map(({ id }) => `/b/${lang}/topics/${topic.toLowerCase()}/#${id}`),
    )
  }
})

test.each(langs)('a topic page lists what it teaches under its summary (%s)', (lang) => {
  const { ui, topics } = contents[lang]
  render(<App route={{ kind: 'topic', lang, topic: 'T4' }} contents={contents} phase={1} base={base} />)
  const list = screen.getByRole('list', { name: ui.card.learn })
  expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual(topics.T4!.tags)
})

test('topic page has one block per section, and the site index opens the path to the current topic and its sections', () => {
  const { container } = render(<App route={{ kind: 'topic', lang: 'en', topic: 'T3' }} contents={contents} phase={1} base={base} />)
  const ids = sectionsOf('T3').map((s) => s.id)
  expect([...container.querySelectorAll('section[id^="ch"]')].map((s) => s.id)).toEqual(ids)
  const index = screen.getByRole('navigation', { name: 'Contents' })
  const current = within(index).getByRole('link', { current: 'page' })
  expect(current).toHaveAttribute('href', '/b/en/topics/t3/')
  const item = current.closest('li')!
  expect(within(item).getAllByRole('link').slice(1).map((a) => a.getAttribute('href'))).toEqual(ids.map((id) => `/b/en/topics/t3/#${id}`))
  // Every enclosing level and the current topic's sections are open; the other topic's sections are not.
  for (let el = item.parentElement; el && el !== index; el = el.parentElement) if (el.tagName === 'DETAILS') expect(el).toHaveAttribute('open')
  expect(item.querySelector('details')).toHaveAttribute('open')
  const other = within(index).getByRole('link', { name: contents.en.topics.T4!.title }).closest('li')!
  expect(other.querySelector('details')).not.toHaveAttribute('open')
})

test.each(langs)('the site index lists every live topic in map order and no map entry, with each topic folded on the map (%s)', (lang) => {
  render(<App route={{ kind: 'map', lang }} contents={contents} phase={1} base={base} />)
  const { ui } = contents[lang]
  const index = screen.getByRole('navigation', { name: ui.index.label })
  const topicLinks = within(index).getAllByRole('link').filter((a) => !a.getAttribute('href')!.includes('#'))
  expect(topicLinks.map((a) => a.getAttribute('href'))).toEqual(liveTopics(1).map((t) => `/b/${lang}/topics/${t.toLowerCase()}/`))
  // A single live zone is not listed: its group comes first, open, with a toggle named after it; each topic's sections toggle is closed.
  expect(index.firstElementChild).toHaveTextContent(ui.groups.anomalies)
  expect(within(index).getByText(ui.groups.anomalies).closest('details')).toHaveAttribute('open')
  for (const topic of liveTopics(1)) {
    const toggle = within(index).getByLabelText(interpolate(ui.index.sections, { topic: contents[lang].topics[topic]!.title }))
    expect(toggle.closest('details')).not.toHaveAttribute('open')
  }
})

test.each(langs)('a menu button named after the index hides and shows it, and remembers the choice for the next page (%s)', (lang) => {
  const { ui } = contents[lang]
  render(<App route={{ kind: 'map', lang }} contents={contents} phase={1} base={base} />)
  const nav = screen.getByRole('navigation', { name: ui.index.label })
  const toggle = screen.getByRole('button', { name: ui.index.label, expanded: true })
  expect(toggle).toHaveAttribute('aria-controls', nav.id)
  expect(toggle).toHaveAttribute('title', ui.index.label)
  fireEvent.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(document.documentElement.dataset.index).toBe('hidden')
  expect(localStorage.getItem(INDEX_KEY)).toBe('hidden')
  fireEvent.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(document.documentElement.dataset.index).toBeUndefined()
  expect(localStorage.getItem(INDEX_KEY)).toBeNull()
})

test('with storage blocked, the menu button still hides and shows the index on this page', () => {
  for (const method of ['setItem', 'removeItem'] as const) {
    vi.spyOn(Storage.prototype, method).mockImplementation(() => {
      throw new Error('blocked')
    })
  }
  render(<App route={{ kind: 'map', lang: 'en' }} contents={contents} phase={1} base={base} />)
  const toggle = screen.getByRole('button', { name: contents.en.ui.index.label })
  fireEvent.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(document.documentElement.dataset.index).toBe('hidden')
  fireEvent.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(document.documentElement.dataset.index).toBeUndefined()
})

test('the menu button follows what the page shows: if something else showed the index, one click hides it', () => {
  document.documentElement.dataset.index = 'hidden'
  render(<App route={{ kind: 'map', lang: 'en' }} contents={contents} phase={1} base={base} />)
  const toggle = screen.getByRole('button', { name: contents.en.ui.index.label, expanded: false })
  delete document.documentElement.dataset.index
  fireEvent.click(toggle)
  expect(document.documentElement.dataset.index).toBe('hidden')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test.each(langs)('on the map, the site name in the header is marked as the current page; elsewhere it is not (%s)', (lang) => {
  const { ui } = contents[lang]
  const { unmount } = render(<App route={{ kind: 'map', lang }} contents={contents} phase={1} base={base} />)
  expect(screen.getByRole('link', { name: ui.siteTitle })).toHaveAttribute('aria-current', 'page')
  unmount()
  render(<App route={{ kind: 'topic', lang, topic: 'T3' }} contents={contents} phase={1} base={base} />)
  expect(screen.getByRole('link', { name: ui.siteTitle })).not.toHaveAttribute('aria-current')
})

// The built site hydrates prerendered pages. In production React keeps the server's attributes when they differ,
// so a wrong href, lang or aria-current would ship silently; development React reports every difference.
test.each(routes.filter((route) => route !== null))('the prerendered page hydrates with nothing different, attributes included (%o)', (route) => {
  const app = <App route={route} contents={contents} phase={1} base={base} />
  const container = document.createElement('div')
  container.innerHTML = renderToString(app)
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  let root: ReturnType<typeof hydrateRoot> | undefined
  act(() => {
    root = hydrateRoot(container, app)
  })
  act(() => root!.unmount())
  expect(error).not.toHaveBeenCalled()
})

test('a page that starts with the index hidden shows the menu button collapsed', () => {
  document.documentElement.dataset.index = 'hidden'
  render(<App route={{ kind: 'topic', lang: 'en', topic: 'T3' }} contents={contents} phase={1} base={base} />)
  expect(screen.getByRole('button', { name: contents.en.ui.index.label, expanded: false })).toBeInTheDocument()
})

test('the prerendered page has no menu button, since it cannot work without JavaScript', () => {
  const html = renderToString(<App route={{ kind: 'map', lang: 'en' }} contents={contents} phase={1} base={base} />)
  expect(html).not.toContain('index-toggle')
})

test('the script in the page head hides the index before the page paints when the reader chose that', () => {
  const head = readFileSync('index.html', 'utf8') // vitest runs from the repo root
  const script = head.match(/<script>([\s\S]*?)<\/script>/)![1]
  new Function(script)()
  expect(document.documentElement.dataset.index).toBeUndefined()
  localStorage.setItem(INDEX_KEY, 'hidden')
  new Function(script)()
  expect(document.documentElement.dataset.index).toBe('hidden')
})

test('a skip link jumps past the site index to the page content', () => {
  render(<App route={{ kind: 'topic', lang: 'zh-TW', topic: 'T4' }} contents={contents} phase={1} base={base} />)
  const skip = screen.getByRole('link', { name: contents['zh-TW'].ui.index.skip })
  expect(skip).toHaveAttribute('href', '/b/zh-TW/topics/t4/#main')
  expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
})

test.each(langs.flatMap((lang) => (['T3', 'T4'] as const).map((topic) => [lang, topic] as const)))(
  'every piece of section text reaches its block (%s %s)',
  (lang, topic) => {
    const content = contents[lang]
    const { container } = render(<App route={{ kind: 'topic', lang, topic }} contents={contents} phase={1} base={base} />)
    for (const { id } of sectionsOf(topic)) {
      const text = sectionText(content, topic, id)
      const block = container.querySelector(`[id="${id}"]`)!
      for (const s of [text.conclusion, text.tradeoff, ...text.questions, ...text.examples.map((e) => e.text)]) {
        expect(block.textContent, id).toContain(expandPageRefs(s, content))
      }
      // Each example is its text alone, with no source tag in front of it.
      expect([...block.querySelectorAll('.examples li')].map((li) => li.textContent)).toEqual(text.examples.map((e) => expandPageRefs(e.text, content)))
    }
  },
)

const diagrammed = [
  ['T3', 'ch5-the-problems-with-remote-procedure-calls'],
  ['T3', 'ch9-unreliable-networks'],
  ['T4', 'ch13-the-end-to-end-argument-for-databases'],
] as const

test.each(langs)('the sections where the order of events is the point, and only those, have a sequence diagram (%s)', (lang) => {
  const withDiagram = (['T3', 'T4'] as const).flatMap((topic) =>
    sectionsOf(topic)
      .filter(({ id }) => sectionText(contents[lang], topic, id).diagram)
      .map(({ id }) => [topic, id]),
  )
  expect(withDiagram).toEqual(diagrammed)
})

test.each(langs.flatMap((lang) => diagrammed.map(([topic, id]) => [lang, topic, id] as const)))(
  'a sequence diagram shows its caption and says in each step who sends to whom (%s %s %s)',
  (lang, topic, id) => {
    const content = contents[lang]
    const text = sectionText(content, topic, id)
    const diagram = text.diagram!
    render(<SectionBlock content={content} meta={content.sections[id]} text={text} zone="first" />)
    const figure = screen.getByRole('figure')
    expect(figure.querySelector('figcaption')!.textContent).toBe(diagram.caption)
    const steps = within(figure).getAllByRole('listitem')
    expect(steps.map((li) => li.textContent)).toEqual(
      diagram.steps.map((s) =>
        'at' in s
          ? interpolate(content.ui.diagram.note, { lane: content.ui.laneNames[s.at] }) + s.text
          : interpolate(content.ui.diagram.message, { from: content.ui.laneNames[s.from], to: content.ui.laneNames[s.to] }) + s.text,
      ),
    )
    // A note spans two lanes, so its lane is named on screen, not only to screen readers.
    for (const note of figure.querySelectorAll('.sequence-note')) expect(note.querySelector('.visually-hidden')).toBeNull()
  },
)

test('zh-TW shows the book title beside the Chinese name, marked as English', () => {
  render(<App route={{ kind: 'topic', lang: 'zh-TW', topic: 'T3' }} contents={contents} phase={1} base={base} />)
  const heading = screen.getByRole('heading', { level: 2, name: /不可靠的網路/ })
  expect(within(heading).getByText('Unreliable Networks')).toHaveAttribute('lang', 'en')
})

test('the rating box states the default rating without naming a zone', () => {
  render(<App route={{ kind: 'topic', lang: 'zh-TW', topic: 'T3' }} contents={contents} phase={1} base={base} />)
  expect(screen.getByText('預設評級：產品型 PM 要會用、平台型 PM 要會用')).toBeInTheDocument()
})

test('a section shows a rating exception only where it differs from the zone default', () => {
  const zh = contents['zh-TW']
  const text = { conclusion: 'c', tradeoff: 't', questions: ['q'], examples: [{ source: 'book', text: 'e' }] } as const
  const { container, rerender } = render(
    <SectionBlock content={zh} meta={zh.sections['ch2-how-important-is-reliability']} text={text} zone="first" />,
  )
  expect(container).toHaveTextContent('本段評級與上述預設不同：平台型 PM 要能問')
  rerender(<SectionBlock content={zh} meta={zh.sections['ch9-unreliable-networks']} text={text} zone="first" />)
  expect(container).not.toHaveTextContent('本段評級與上述預設不同')
})

test('prev/next only among live topics', () => {
  const { unmount } = render(<App route={{ kind: 'topic', lang: 'en', topic: 'T3' }} contents={contents} phase={1} base={base} />)
  let pager = screen.getByRole('navigation', { name: 'Topic navigation' })
  expect(within(pager).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['/b/en/', '/b/en/topics/t4/'])
  unmount()
  render(<App route={{ kind: 'topic', lang: 'en', topic: 'T4' }} contents={contents} phase={1} base={base} />)
  pager = screen.getByRole('navigation', { name: 'Topic navigation' })
  expect(within(pager).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['/b/en/topics/t3/', '/b/en/'])
})

test('the language switch is a select of every language with this page\'s language chosen, each option marked with its lang', () => {
  render(<App route={{ kind: 'topic', lang: 'zh-TW', topic: 'T3' }} contents={contents} phase={1} base={base} />)
  const select = within(screen.getByRole('navigation', { name: '切換語言' })).getByRole('combobox', { name: '切換語言' })
  expect(select).toHaveValue('zh-TW')
  expect(within(select).getAllByRole('option').map((o) => [o.textContent, o.getAttribute('value'), o.getAttribute('lang')])).toEqual([
    ['繁體中文', 'zh-TW', 'zh-TW'],
    ['English', 'en', 'en'],
  ])
})

test('before scripts run, the prerendered switch is a link to the same page in the other language', () => {
  const page = document.createElement('div')
  page.innerHTML = renderToString(<App route={{ kind: 'topic', lang: 'zh-TW', topic: 'T3' }} contents={contents} phase={1} base={base} />)
  const nav = within(page).getByRole('navigation', { name: '切換語言' })
  expect(within(nav).queryByRole('combobox')).toBeNull()
  const link = within(nav).getByRole('link', { name: 'English' })
  expect(link).toHaveAttribute('href', '/b/en/topics/t3/')
  expect(link).toHaveAttribute('lang', 'en')
})

test('the not-found page offers both languages, each marked with its lang', () => {
  const { container } = render(<App route={null} contents={contents} phase={1} base={base} />)
  const links = screen.getAllByRole('link')
  expect(links.map((a) => [a.getAttribute('href'), a.closest('section[lang]')?.getAttribute('lang')])).toEqual([
    ['/b/zh-TW/', 'zh-TW'],
    ['/b/en/', 'en'],
  ])
  expect(container.querySelectorAll('h1')).toHaveLength(2)
  expect(htmlLang(null)).toBe('en')
})
