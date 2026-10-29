import type { Translation } from '../../types'
import type { t7 as zh } from '../../zh-TW/topics/t7'

export const t7: Translation<typeof zh> = {
  title: 'Keep constraints true under concurrency',
  summary: 'Two transactions can each see a free slot while together exceeding capacity. Enforce hard rules at the point of writing.',
  tags: ['consistency', 'write skew', 'uniqueness constraint', 'linearizability'],
  sections: {
    'ch8-consistency': {
      conclusion: 'Transaction consistency means application invariants remain true across a commit, such as balanced accounting entries. A database can enforce particular constraints, but the application must express rules spanning multiple records through correct transaction design.',
      tradeoff: 'Single-field checks are easy; cross-record invariants require stronger transaction design and testing.',
      questions: ['Which rules must be true after every commit?', 'Where are those rules checked at write time?'],
      examples: [{ source: 'book', text: 'The book uses accounting: if a transfer debits one account, the other must receive the same amount. This is an invariant defined by the application.' }],
    },
    'ch8-more-examples-of-write-skew': {
      conclusion: 'Write skew occurs when two transactions read the same condition but write different rows. Each sees a valid state, yet together they break a consistency rule. Locking only the rows each transaction writes may not help.',
      tradeoff: 'Stronger isolation blocks this anomaly but brings more waiting, conflicts, and retries.',
      questions: ['Can two people both commit after seeing the last available slot?', 'Are all records involved in the rule protected by one transaction?'],
      examples: [{ source: 'book', text: 'The book includes two users trying to claim the same name. Both can read “available” at once; a database uniqueness constraint decides which write succeeds.' }],
    },
    'ch13-enforcing-constraints': {
      conclusion: 'A uniqueness constraint needs one place that can order competing writes. If conflicting requests reach different nodes, requests for the same key must meet to keep consistency.',
      tradeoff: 'Coordinating a key preserves a hard rule, but a hot key may become a bottleneck and writes may be refused during a partition.',
      questions: ['Do two writes for the same key encounter the same constraint?', 'If the coordinator is unavailable, should the write wait or fail?'],
      examples: [{ source: 'book', text: 'The book describes routing the same username to one partition, which orders the claims and accepts only one. Independent replicas could each promise the name.' }],
    },
    'ch10-relying-on-linearizability': {
      conclusion: 'Linearizability makes reads and writes appear to take effect at one instant. It suits locks, unique names, or authorization decisions that need the latest global state. Identify operations that truly require that order.',
      tradeoff: 'Linearizability gives a clear order but increases cross-region latency and limits availability under network faults.',
      questions: ['Can this decision tolerate a briefly stale value?', 'If not, which read and write must share one order?'],
      examples: [{ source: 'book', text: 'The book discusses file storage and video transcoding: if a worker reads an old file after an update, it may transcode the wrong input. The workflow must decide whether it needs the newest version.' }],
    },
  },
}
