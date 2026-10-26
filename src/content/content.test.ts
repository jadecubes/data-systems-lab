import { readFileSync } from 'node:fs'
import { expect, test } from 'vitest'
import { CURRENT_PHASE } from '../config'
import { contentFor, sectionText, sectionTitle } from '../i18n/content'
import { langs } from '../i18n/langs'
import { ui as enUi } from './en/ui'
import { liveTopics, sectionsOf } from './live'
import { codeKeys } from './types'
import { ui as zhUi } from './zh-TW/ui'

// Raw source of every content file, so comments and unused strings are checked too.
const files = import.meta.glob<string>('./{zh-TW,en}/**/*.ts', { query: '?raw', import: 'default', eager: true })
const CJK = /[㐀-鿿豈-﫿　-〿＀-￯]/

function placeholders(value: unknown, path = ''): Record<string, string[]> {
  if (typeof value === 'string') return { [path]: [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort() }
  return Object.assign({}, ...Object.entries(value as object).map(([k, v]) => placeholders(v, `${path}.${k}`)))
}

test('placeholders match between languages for every ui string', () => {
  expect(placeholders(enUi)).toEqual(placeholders(zhUi))
})

test('no Chinese characters or full-width punctuation in English content files', () => {
  const english = Object.entries(files).filter(([path]) => path.startsWith('./en/'))
  expect(english.length).toBeGreaterThan(0)
  for (const [path, source] of english) expect(source.match(CJK), path).toBeNull()
})

test('no raw page numbers in content; in-text pages are {p:N} tokens', () => {
  for (const [path, source] of Object.entries(files)) expect(source.match(/\bpp?\.\s*\d|\bpages?\s+\d|第\s*\d+\s*頁/i), path).toBeNull()
})

test.each(langs)('every live topic has complete text in %s', (lang) => {
  const content = contentFor(lang)
  for (const id of liveTopics(CURRENT_PHASE)) {
    const topic = content.topics[id]
    expect(topic, id).toBeDefined()
    expect(topic!.title.trim(), id).not.toBe('')
    expect(topic!.summary.trim(), id).not.toBe('')
    for (const meta of sectionsOf(id)) {
      const s = sectionText(content, id, meta.id)
      for (const text of [s.conclusion, s.tradeoff, ...s.questions, ...s.examples.map((e) => e.text)]) {
        expect(text.trim(), meta.id).not.toBe('')
      }
      expect(s.questions.length, meta.id).toBeGreaterThan(0)
      expect(s.examples.length, meta.id).toBeGreaterThan(0)
      if (meta.bookTitle === null) expect(s.title?.trim(), meta.id).toBeTruthy()
    }
  }
})

test.each(langs)('every live topic tags what it teaches: 4–5 terms its own section titles and conclusions use (%s)', (lang) => {
  const content = contentFor(lang)
  for (const topic of liveTopics(CURRENT_PHASE)) {
    const { tags } = content.topics[topic]!
    expect(tags.length, topic).toBeGreaterThanOrEqual(4)
    expect(tags.length, topic).toBeLessThanOrEqual(5)
    const taught = sectionsOf(topic)
      .map(({ id }) => {
        const text = sectionText(content, topic, id)
        return `${sectionTitle(content, content.sections[id], text).title} ${text.conclusion} ${text.tradeoff}`
      })
      .join(' ')
      .toLowerCase()
    for (const tag of tags) {
      expect(taught, `${topic}: ${tag}`).toContain(tag.toLowerCase())
    }
  }
})

test('each Chinese tag is a glossary term, and the English tag in the same place is its English', () => {
  // A glossary row is "| 中文 | English（note） | 說明 |"; the English cell may list several forms.
  const english = new Map(
    readFileSync('docs/glossary.md', 'utf8')
      .split('\n') // vitest runs from the repo root
      .map((line) => line.split('|').map((cell) => cell.trim()))
      .filter((cells) => cells.length === 5)
      .map(([, zh, en]) => [zh, en.replace(/（[^）]*）/g, '').split(/[/；]/).map((form) => form.trim().toLowerCase())]),
  )
  const [zh, en] = [contentFor('zh-TW'), contentFor('en')]
  for (const topic of liveTopics(CURRENT_PHASE)) {
    zh.topics[topic]!.tags.forEach((tag, i) => expect(english.get(tag), `${topic}: ${tag}`).toContain(en.topics[topic]!.tags[i].toLowerCase()))
  }
})

test('every Chinese topic string has Chinese in it, so English pasted into a Chinese file is caught', () => {
  const missing: string[] = []
  const walk = (value: unknown, path: string) => {
    if (typeof value === 'string') {
      if (!CJK.test(value)) missing.push(`${path}: ${value}`)
    } else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) if (!(codeKeys as readonly string[]).includes(k)) walk(v, `${path}.${k}`)
    }
  }
  walk(contentFor('zh-TW').topics, 'topics')
  expect(missing).toEqual([])
})

// Examples carry no source tag and no page number on screen; the opening words tell a book example from ours.
const bookOpening = { 'zh-TW': /^書中/, en: /^(The book|In the book)/ } as const

test.each(langs)('every book example opens by naming the book, no example of ours does, and none cites a page (%s)', (lang) => {
  const content = contentFor(lang)
  for (const id of liveTopics(CURRENT_PHASE)) {
    for (const meta of sectionsOf(id)) {
      for (const e of sectionText(content, id, meta.id).examples) {
        expect(bookOpening[lang].test(e.text), `${meta.id}: ${e.text}`).toBe(e.source === 'book')
        expect(e.text, meta.id).not.toContain('{p:')
      }
    }
  }
})

test.each(langs)('every diagram step uses only its own lanes, and a message goes between two lanes (%s)', (lang) => {
  const content = contentFor(lang)
  for (const id of liveTopics(CURRENT_PHASE)) {
    for (const meta of sectionsOf(id)) {
      const diagram = sectionText(content, id, meta.id).diagram
      if (!diagram) continue
      expect(diagram.caption.trim(), meta.id).not.toBe('')
      for (const step of diagram.steps) {
        const lanes = 'at' in step ? [step.at] : [step.from, step.to]
        for (const lane of lanes) expect(diagram.lanes, meta.id).toContain(lane)
        if (!('at' in step)) expect(step.from, meta.id).not.toBe(step.to)
        expect(step.text.trim(), meta.id).not.toBe('')
      }
    }
  }
})
