import { expect, test } from 'vitest'
import { contentFor, sectionTitle } from './content'
import { interpolate } from './format'

const zh = contentFor('zh-TW')
const en = contentFor('en')

test('interpolate fills named params and throws on a missing one', () => {
  expect(interpolate('訂單有 {count} 筆', { count: '2' })).toBe('訂單有 2 筆')
  expect(() => interpolate('{a} {b}', { a: '1' })).toThrow(/\{b\}/)
})

test('sectionTitle: Chinese name plus book title in zh-TW, book title in en, our title when the book has none', () => {
  const text = { conclusion: 'x', tradeoff: 'x', questions: ['x'], examples: [{ source: 'book', text: 'x' }] } as const
  expect(sectionTitle(zh, zh.sections['ch9-unreliable-networks'], text)).toEqual({
    title: '不可靠的網路',
    bookTitle: 'Unreliable Networks',
  })
  expect(sectionTitle(en, en.sections['ch9-unreliable-networks'], text)).toEqual({
    title: 'Unreliable Networks',
    bookTitle: null,
  })
  expect(sectionTitle(en, en.sections['ch13-how-to-choose'], { ...text, title: 'How to choose' })).toEqual({
    title: 'How to choose',
    bookTitle: null,
  })
})
