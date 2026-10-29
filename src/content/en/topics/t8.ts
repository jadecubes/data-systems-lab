import type { Translation } from '../../types'
import type { t8 as zh } from '../../zh-TW/topics/t8'

export const t8: Translation<typeof zh> = {
  title: 'Separate late results from wrong results',
  summary: 'A delayed result and an incorrect result pose different risks. Define how long users can wait and what must never be wrong.',
  tags: ['timeliness', 'integrity', 'synchronous coordination', 'compensation'],
  sections: {
    'ch13-timeliness-and-integrity': {
      conclusion: 'Timeliness asks when a change becomes visible; integrity asks whether data remains correct, complete, and within its constraints. A credit-card bill arriving a day late is usually a timeliness problem; charging the card without paying the merchant is an integrity problem.',
      tradeoff: 'Asynchronous processing improves availability and speed but delays visibility. A delay must not conceal corruption or loss.',
      questions: ['How long can users wait to see the result?', 'If it arrives late, how will we verify the final state is correct?'],
      examples: [{ source: 'book', text: 'The book contrasts a credit-card statement delivered a day late with a card charge that never reaches the merchant: one is a delay, the other breaks accounting correctness.' }],
    },
    'ch13-how-to-choose': {
      title: 'When to coordinate and when to compensate',
      conclusion: 'If integrity requires that two conflicting outcomes never both happen, a database constraint or synchronous coordination can reject one. Preventing duplicate execution also requires a request ID that reaches the database. If a mistake can be repaired later, use compensation for the exception.',
      tradeoff: 'Synchronous coordination rejects conflicts immediately but adds latency and reduces availability during faults. Compensation lets work proceed but can expose a provisional result.',
      questions: ['Does this operation require one immediate, irreversible answer?', 'If a conflict appears later, are refunds or rearrangements acceptable?'],
      examples: [{ source: 'book', text: 'The book uses duplicate requests: the client creates a request ID before sending and reuses it on retry; a database uniqueness constraint rejects a second execution.' }],
    },
  },
}
