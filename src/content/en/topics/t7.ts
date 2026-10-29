import type { Translation } from '../../types'
import type { t7 as zh } from '../../zh-TW/topics/t7'

export const t7: Translation<typeof zh> = {
  title: 'Keep constraints true under concurrency',
  summary: 'Two transactions can each see a free slot while together exceeding capacity. Enforce hard rules at the point of writing.',
  tags: ['consistency', 'write skew', 'uniqueness constraint', 'linearizability'],
  sections: {
    'ch8-consistency': {
      conclusion: 'Transaction consistency means invariants the application defines hold after every commit, such as balanced accounting entries. The database enforces only the rules you declare as constraints (unique, foreign key, check); a rule it cannot express depends on the application writing its transactions correctly.',
      tradeoff: 'Rules declared as constraints are guaranteed by the database; rules left to application code are easier to get wrong under concurrency.',
      questions: ['Is this rule declared as a database constraint?', 'If not, which code enforces it, and does it still hold when two people act at once?'],
      examples: [{ source: 'book', text: 'In the book’s example, debits and credits across all accounts in an accounting system must balance.' }],
    },
    'ch8-more-examples-of-write-skew': {
      conclusion: 'Write skew occurs when two transactions read the same condition but write different rows. Each sees a valid state, yet together they break a consistency rule. Locking only the rows each transaction writes may not help.',
      tradeoff: 'Stronger isolation blocks this anomaly but brings more waiting, conflicts, and retries.',
      questions: ['Can two people both commit after seeing the last available slot?', 'Are all records involved in the rule protected by one transaction?'],
      examples: [{ source: 'book', text: 'The book includes two users trying to claim the same name. Both can read “available” at once; a database uniqueness constraint decides which write succeeds.' }],
    },
    'ch13-enforcing-constraints': {
      conclusion: 'To reject a duplicate at write time, a uniqueness constraint needs every request for the same value (say, the same username) to go to one decider that orders them: a single leader, or the one shard that value maps to. If nodes accept writes independently and sync later (asynchronous multi-leader replication), it cannot be done.',
      tradeoff: 'Every request for the same value must go through one decider, even from a client on the other side of the world; that limits throughput, and while the decider is unavailable, writes can only wait or fail.',
      questions: ['If two people create the same record (say, the same name) at once, who succeeds, and what does the other one see?', 'If the node that decides is unavailable, should the write wait or fail?'],
      examples: [{ source: 'book', text: 'In the book’s example, several people claim the same username. Each request goes to the log shard chosen by the name, and a processor reads them in order: if the name is free it records the claim and replies success, otherwise it replies with a rejection.' }],
    },
    'ch10-relying-on-linearizability': {
      conclusion: 'Linearizability makes each read and write appear to take effect at one instant, so every later read sees it. It is needed for locks and electing a single leader, for names or seats that must not be taken twice, and when one step writes a file and another channel (such as a message queue) tells someone to read it. A score shown a few seconds late does not need it, and rules the business can compensate for later can be relaxed.',
      tradeoff: 'Linearizability gives a clear order but increases cross-region latency and limits availability under network faults.',
      questions: ['Can this decision tolerate a briefly stale value?', 'If not, which read and write must share one order?'],
      examples: [{ source: 'book', text: 'In the book’s example, a user uploads a video; the web server writes it to file storage, then puts a transcode command on a message queue. The queue can outrun replication inside the storage, so the transcoder fetches an old version or nothing at all; if it transcodes the old version, the original and the transcoded copy stay inconsistent for good.' }],
    },
  },
}
