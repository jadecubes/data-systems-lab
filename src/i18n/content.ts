import { topics as enTopics } from '../content/en/topics'
import { ui as enUi } from '../content/en/ui'
import { sections, type SectionId, type TopicId } from '../content/sections'
import type { SectionMeta, SectionText, TopicText, Translation } from '../content/types'
import { topics as zhTopics } from '../content/zh-TW/topics'
import { ui as zhUi } from '../content/zh-TW/ui'
import type { Lang } from './langs'

export type Ui = Translation<typeof zhUi>
export type TopicTexts = { readonly [T in TopicId]?: Translation<TopicText<T>> }

/** Everything a page shows, for one language. Components read text only from here. */
export type Content = {
  readonly lang: Lang
  readonly ui: Ui
  readonly topics: TopicTexts
  readonly sections: Readonly<Record<SectionId, SectionMeta>>
  readonly number: (n: number) => string
}

const sectionsById = Object.fromEntries(sections.map((s): [string, SectionMeta] => [s.id, s])) as Record<SectionId, SectionMeta>

export function contentFor(lang: Lang): Content {
  const format = new Intl.NumberFormat(lang)
  return {
    lang,
    ui: lang === 'en' ? enUi : zhUi,
    topics: lang === 'en' ? enTopics : zhTopics,
    sections: sectionsById,
    number: (n) => format.format(n),
  }
}

/** One section's text; the per-topic types are exact, this is the lookup by a section id of that topic. */
export function sectionText(content: Content, topic: TopicId, id: SectionId): SectionText {
  return (content.topics[topic]!.sections as Record<string, SectionText>)[id]
}

/**
 * zh-TW shows the Chinese name with the book's English heading beside it; English shows the book heading.
 * A section with no book heading uses our own title.
 */
export function sectionTitle(content: Content, meta: SectionMeta, text: SectionText) {
  const title = (content.lang === 'en' ? meta.bookTitle : meta.zhName) ?? text.title ?? ''
  return { title, bookTitle: content.lang === 'en' ? null : meta.bookTitle }
}

export type Contents = Readonly<Record<Lang, Content>>

/** Both languages: pages link across languages, and the 404 page shows both. */
export const contents: Contents = { 'zh-TW': contentFor('zh-TW'), en: contentFor('en') }
