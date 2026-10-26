import type { SectionIdOf, TopicId } from './sections'

/** Rating codes: 要會用 / 要能問 / 懂名詞 / 跳過. */
export type Rating = 'use' | 'ask' | 'term' | 'skip'
/** Printed book pages, inclusive. */
export type PageRange = readonly [from: number, to: number]

export type SectionMeta = {
  readonly id: string
  readonly topic: string
  readonly chapter: number
  /** The book's English heading; null when the notes section has no book heading. */
  readonly bookTitle: string | null
  /** Chinese name of the book heading; null whenever bookTitle is null. */
  readonly zhName: string | null
  readonly pages: readonly PageRange[]
  readonly product: Rating
  readonly platform: Rating
}

export type Phase = 1 | 2 | 3 | 4 | 5 | 6
export type ZoneId = 'first' | 'second'
export type GroupId = 'spec' | 'anomalies' | 'change' | 'data'
export type LabId = 'd1' | 'd2' | 'd3'
export type RoleRatings = { readonly product: Rating; readonly platform: Rating }

export type ExampleSource = 'book' | 'ours'
export type Example = { readonly source: ExampleSource; readonly text: string }

/** A sequence diagram: lanes left to right, steps top to bottom in time order. */
export type Lane = 'browser' | 'server' | 'database'
/** A message is an arrow between two lanes; `lost` never arrives, `rejected` arrives and is refused. */
export type DiagramMessage = { readonly from: Lane; readonly to: Lane; readonly fate?: 'lost' | 'rejected'; readonly text: string }
/** A note is something that happens on one lane without a message. */
export type DiagramNote = { readonly at: Lane; readonly text: string }
export type SequenceDiagram = {
  readonly lanes: readonly Lane[]
  /** Says what the diagram shows that the prose does not. */
  readonly caption: string
  readonly steps: readonly (DiagramMessage | DiagramNote)[]
}

export type SectionText = {
  /** Required only when the section has no book title (checked by content.test.ts). */
  readonly title?: string
  readonly conclusion: string
  readonly tradeoff: string
  readonly questions: readonly string[]
  readonly examples: readonly Example[]
  readonly diagram?: SequenceDiagram
}

export type TopicText<T extends TopicId> = {
  readonly title: string
  readonly summary: string
  /** What the reader will learn: glossary terms the topic's own sections teach (checked by content.test). */
  readonly tags: readonly string[]
  readonly sections: { readonly [S in SectionIdOf<T>]: SectionText }
}

/** Fields holding codes rather than text: the same in every language, never translated. */
export const codeKeys = ['source', 'lanes', 'from', 'to', 'at', 'fate'] as const

/**
 * The English shape derived from the Chinese one: every string becomes `string`, while codes and tuple
 * lengths stay fixed, so a missing or extra section, question, example or diagram step fails typecheck.
 */
export type Translation<T> = T extends string
  ? string
  : { readonly [K in keyof T]: K extends (typeof codeKeys)[number] ? T[K] : Translation<T[K]> }
