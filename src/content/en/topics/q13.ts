import type { Translation } from '../../types'
import type { q13 as zh } from '../../zh-TW/topics/q13'

export const q13: Translation<typeof zh> = {
  title: 'How do several systems stay consistent with the same data?',
  summary: 'Search indexes, caches, and the data warehouse must follow the database; letting one system decide the order of writes and deriving the rest from it is more reliable than having the application write twice.',
  tags: ['dual writes', 'change data capture', 'outbox pattern', 'immutability', 'derived data'],
  sections: {
    'ch12-keeping-systems-in-sync': {
      conclusion: 'When the application writes to the database and then writes to the search index or cache itself, that is dual writes. With two concurrent requests, the two systems may receive the writes in opposite orders, or one write may succeed while the other fails. The result is permanent inconsistency, and no error is ever raised.',
      tradeoff: 'Dual writes are simple and need no extra infrastructure, but the inconsistency caused by race conditions and partial failures normally goes unseen. The real fix is to let one system decide the order of writes and have the others follow it.',
      questions: ['Besides the database, where else is this data written, such as a cache or search index?', 'Does the application write twice, as dual writes, or is the copy derived from the database’s changes?', 'When one of the writes fails, how do we find out the two systems disagree?'],
      examples: [{ source: 'book', text: 'In the book’s example, two clients concurrently set X to A and to B, each writing to the database first and then to the search index. The database receives A then B and ends with B; the search index receives B then A and ends with A.' }],
    },
    'ch12-change-data-capture': {
      conclusion: 'Change data capture (CDC) sends every change in the database downstream in the order it was written; the search index and data warehouse apply them in that same order and become followers of the database. It is usually asynchronous, so there is replication lag, and the upstream table structure becomes an interface that downstream systems depend on.',
      tradeoff: 'It keeps systems consistent with almost no change to existing applications, but dropping or changing an upstream column breaks downstream consumers. The outbox pattern adds a separate table that only change data capture reads, so internal tables can change freely; the cost is writing the data twice and maintaining the translation between the two structures.',
      questions: ['Which downstream systems consume change data capture (CDC) events from this table?', 'Who must be told before this column changes? Is there an outbox pattern or a data contract protecting downstream consumers?'],
      examples: [{ source: 'book', text: 'The book mentions the open source tool Debezium, which attaches to the replication log of databases such as MySQL and PostgreSQL and emits change events in a standard format. The book also explains that the outbox table is written in the same transaction as the business data, so it avoids the races and partial failures of dual writes.' }],
    },
    'ch12-state-streams-and-immutability': {
      conclusion: 'Current state is the result of a sequence of events. Immutability means an event is never modified once written; keeping such an event log makes auditing and recovery from a bad deployment easier, and lets new read views be built from the same log.',
      tradeoff: 'You gain full history and easier migration, but views derived from the log are usually updated asynchronously, so users may not see what they just wrote: read-your-writes consistency is missing. History also takes storage, and deletion required by law is hard because copies are scattered across logs and backups.',
      questions: ['After users save and return to the list, do they read the same data or an asynchronously updated view?', 'When someone’s personal data must be deleted, what happens to the copies in logs and backups?'],
      examples: [
        { source: 'book', text: 'The book uses accounting: a mistaken entry is not erased and rewritten; a compensating transaction is added, and the wrong entry stays for auditing.' },
        { source: 'book', text: 'In the book’s other example, a customer adds an item to the cart and then removes it. For shipping the two events cancel out; for analytics, the fact that the customer considered the item and then dropped it is useful information.' },
      ],
    },
    'ch13-combining-specialized-tools-by-deriving-data': {
      conclusion: 'All writes first go into one system of record that decides their order; search indexes, caches, and analytics systems are then derived in the same order. Derived data is mostly updated asynchronously, so by default a write is not guaranteed to be readable right away, and events in different services or shards have no shared order, so causality can be lost.',
      tradeoff: 'Deriving data from a log recovers more easily than a distributed transaction and couples components more loosely, at the cost of read-your-writes consistency and a single order across services.',
      questions: ['Which is the system of record for this feature?', 'Is the data elsewhere derived from it, or written separately by the application?', 'If two actions live in different services, could a downstream system process them in the opposite order?'],
      examples: [{ source: 'book', text: 'In the book’s example, someone unfriends their ex and then sends friends a message complaining about the ex. If the friend list and the messages are stored in different places and the order is lost, the notification service may process the message first and notify the ex.' }],
    },
    'ch13-composing-data-storage-technologies': {
      conclusion: 'An unbundled database uses change data capture and event logs to connect several storage systems, aiming for breadth rather than depth. If a single technology meets the need, use it; the fewer moving parts, the better.',
      tradeoff: 'Composing several systems covers a wider range of workloads and lets teams work independently, but each added system brings its own learning, configuration, and operations cost.',
      questions: ['What exactly can the current database not do for this requirement?', 'Once this system is added, who operates and monitors it?'],
      examples: [{ source: 'book', text: 'The book warns that building for scale you do not need is wasted effort and can lock you into an inflexible design; unbundling pays off only when no single piece of software meets all your requirements.' }],
    },
  },
}
