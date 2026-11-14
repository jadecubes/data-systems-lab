// Everything a page says, for one language, without the lab's SQL: the e2e tests read it in Node, where a Vite `?raw`
// import of the SQL cannot load. content.ts adds the SQL.
import { d1 as enD1 } from '../content/en/labs/d1'
import { topics as enTopics } from '../content/en/topics'
import { ui as enUi } from '../content/en/ui'
import { sections, type SectionId, type TopicId } from '../content/sections'
import type { LabId, SectionMeta, SectionText, TopicText, Translation } from '../content/types'
import { d1 as zhD1 } from '../content/zh-TW/labs/d1'
import { topics as zhTopics } from '../content/zh-TW/topics'
import { ui as zhUi } from '../content/zh-TW/ui'
import type { Lang } from './langs'

export type Ui = Translation<typeof zhUi>
export type TopicTexts = { readonly [T in TopicId]?: Translation<TopicText<T>> }
export type D1Text = Translation<typeof zhD1>

export type Text = {
  readonly lang: Lang
  readonly ui: Ui
  readonly topics: TopicTexts
  readonly sections: Readonly<Record<SectionId, SectionMeta>>
  readonly labs: { readonly d1: D1Text }
  readonly number: (n: number) => string
  readonly money: (n: number) => string
}

const sectionsById = Object.fromEntries(sections.map((s): [string, SectionMeta] => [s.id, s])) as Record<SectionId, SectionMeta>

export function textFor(lang: Lang): Text {
  const format = new Intl.NumberFormat(lang)
  // The lab's amounts are New Taiwan dollars in both languages, with no cents.
  const money = new Intl.NumberFormat(lang, { style: 'currency', currency: 'TWD', maximumFractionDigits: 0, minimumFractionDigits: 0 })
  return {
    lang,
    ui: lang === 'en' ? enUi : zhUi,
    topics: lang === 'en' ? enTopics : zhTopics,
    sections: sectionsById,
    labs: { d1: lang === 'en' ? enD1 : zhD1 },
    number: (n) => format.format(n),
    money: (n) => money.format(n),
  }
}

export type Texts = Readonly<Record<Lang, Text>>
export const texts: Texts = { 'zh-TW': textFor('zh-TW'), en: textFor('en') }

/** One section's text; the per-topic types are exact, this is the lookup by a section id of that topic. */
export function sectionText(content: Text, topic: TopicId, id: SectionId): SectionText {
  return (content.topics[topic]!.sections as Record<string, SectionText>)[id]
}

/**
 * zh-TW shows the Chinese name with the book's English heading beside it; English shows the book heading.
 * A section with no book heading uses our own title.
 */
export function sectionTitle(content: Text, meta: SectionMeta, text: SectionText) {
  const title = (content.lang === 'en' ? meta.bookTitle : meta.zhName) ?? text.title ?? ''
  return { title, bookTitle: content.lang === 'en' ? null : meta.bookTitle }
}

/** A live lab's title. Only D1 has text so far; D2 and D3 get theirs with their own phases. */
export function labTitle(content: Text, lab: LabId): string {
  return content.labs[lab as 'd1'].title
}
