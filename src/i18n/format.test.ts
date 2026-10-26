import { expect, test } from 'vitest'
import { contentFor, sectionTitle } from './content'
import { expandPageRefs, formatPages, interpolate } from './format'

const zh = contentFor('zh-TW')
const en = contentFor('en')

test('interpolate fills named params and throws on a missing one', () => {
  expect(interpolate('訂單有 {count} 筆', { count: '2' })).toBe('訂單有 2 筆')
  expect(() => interpolate('{a} {b}', { a: '1' })).toThrow(/\{b\}/)
})

test('pages: single, range and multiple ranges, per language', () => {
  expect(formatPages([[33, 33]], zh)).toBe(interpolate(zh.ui.pageSingle, { page: '33' }))
  expect(formatPages([[177, 178], [192, 192]], en)).toBe(
    interpolate(en.ui.pageRange, { from: '177', to: '178' }) + en.ui.listSeparator + interpolate(en.ui.pageSingle, { page: '192' }),
  )
})

test('in-text page tokens hold PDF pages and render printed pages', () => {
  expect(expandPageRefs('見 {p:372}。', zh)).toBe(`見 ${interpolate(zh.ui.pageRef, { page: '348' })}。`)
  expect(expandPageRefs('no tokens', en)).toBe('no tokens')
  expect(expandPageRefs('({p:371-372})', en)).toBe(`(${interpolate(en.ui.pageRefRange, { from: '347', to: '348' })})`)
})

test('sectionTitle: Chinese name plus book title in zh-TW, book title in en, our title when the book has none', () => {
  const text = { conclusion: 'x', tradeoff: 'x', questions: ['x'], examples: [{ source: 'book', text: 'x' }] } as const
  expect(sectionTitle(zh, zh.sections['ch9-unreliable-networks'], text)).toEqual({
    title: '不可靠的網路',
    bookTitle: 'Unreliable Networks',
    ours: false,
  })
  expect(sectionTitle(en, en.sections['ch9-unreliable-networks'], text)).toEqual({
    title: 'Unreliable Networks',
    bookTitle: null,
    ours: false,
  })
  expect(sectionTitle(en, en.sections['ch13-how-to-choose'], { ...text, title: 'How to choose' })).toEqual({
    title: 'How to choose',
    bookTitle: null,
    ours: true,
  })
})
