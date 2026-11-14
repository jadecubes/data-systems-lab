import type { Translation } from '../../types'
import type { q9 as zh } from '../../zh-TW/topics/q9'

export const q9: Translation<typeof zh> = {
  title: 'Which isolation level do we need?',
  summary: 'Concurrent transactions cause read skew, lost updates and write skew; choose a safeguard for each problem, and long-running reports and backups must at least read from a consistent snapshot.',
  tags: ['isolation level', 'snapshot isolation', 'lost update', 'write skew', 'serializable'],
  sections: {
    'ch8-snapshot-isolation-and-repeatable-read': {
      conclusion: 'Read committed still allows read skew: in one look at the data, some values are from before a transfer and some from after it. For a user this is usually temporary and a reload fixes it; but backups, analytic queries and integrity checks that run for hours and mix data from different points in time give results that are permanently inconsistent or meaningless. Snapshot isolation has each transaction read from a consistent snapshot of everything committed when it started.',
      tradeoff: 'Snapshot isolation lets long reads run without blocking writes and keeps their results consistent, but the database must keep old versions, and it does not prevent write skew.',
      questions: [
        'Do our backups and report queries run under snapshot isolation?',
        'If a query runs for hours, can writes made meanwhile leak into its results?',
      ],
      examples: [{ source: 'book', text: 'In the book’s example, Aaliyah has $500 in each of two accounts; she checks her balances halfway through a $100 transfer, sees one account debited and the other not yet credited, and $100 seems to have vanished. If a backup that runs for hours captures this kind of inconsistency, restoring from it makes the inconsistency permanent.' }],
    },
    'ch8-how-to-choose': {
      title: 'Choosing a safeguard for each problem',
      conclusion: 'Identify the problem first, then choose the safeguard: for a lost update, prefer the database’s atomic operations; for the database to prevent write skew automatically, only serializable isolation works, though a uniqueness constraint covers some cases; for exactly-once message processing, making the processing idempotent is enough, with the message ID written in the same transaction as its effects. Backups and analytics need at least snapshot isolation; isolation level names differ between databases, so check the actual behavior.',
      tradeoff: 'Stronger guarantees (serializable isolation, distributed transactions) cost more, lowering throughput or raising the abort rate; cheaper approaches depend more on engineers never missing a spot.',
      questions: [
        'Could this feature suffer a lost update, or write skew?',
        'Which safeguard did we choose, and why not serializable isolation?',
        'Which problems does the isolation level named in our database’s documentation actually prevent?',
      ],
      examples: [{ source: 'book', text: 'The book notes that exactly-once message processing does not need a distributed transaction: record the message ID, under a uniqueness constraint, in the same transaction that processes the message, so that processing is idempotent.' }],
    },
  },
}
