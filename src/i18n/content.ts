import sqlSource from '../../examples/order_retry.sql?raw'
import { parseOrderRetrySql, type OrderRetrySql } from '../content/orderRetrySql'
import { CLIENT_REQUEST_ID, SERVER_REQUEST_IDS } from '../lessons/retryWorkshop'
import type { Lang } from './langs'
import { textFor, type Text } from './text'

export { labTitle, sectionText, sectionTitle, type D1Text, type TopicTexts, type Ui } from './text'

/** Everything a page shows, for one language. Components read text only from here. */
export type Content = Text & {
  /** The lab's SQL and request IDs, shared by both languages; only the notes beside them are translated. */
  readonly code: { readonly d1: OrderRetrySql & { readonly ids: Readonly<Record<string, string>> } }
}

const d1Code = {
  ...parseOrderRetrySql(sqlSource),
  ids: Object.fromEntries([CLIENT_REQUEST_ID, ...SERVER_REQUEST_IDS].map((id) => [id, id])),
}

export function contentFor(lang: Lang): Content {
  return { ...textFor(lang), code: { d1: d1Code } }
}

export type Contents = Readonly<Record<Lang, Content>>

/** Both languages: pages link across languages, and the 404 page shows both. */
export const contents: Contents = { 'zh-TW': contentFor('zh-TW'), en: contentFor('en') }
