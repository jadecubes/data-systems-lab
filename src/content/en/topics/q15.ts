import type { Translation } from '../../types'
import type { q15 as zh } from '../../zh-TW/topics/q15'

export const q15: Translation<typeof zh> = {
  title: 'Why are live counts sometimes wrong or double-counted?',
  summary: 'Stream processing must decide which time to count by, what to do with late events, which version of reference data to use, and how to avoid writing results twice after a restart.',
  tags: ['event time', 'processing time', 'straggler events', 'exactly-once', 'idempotent'],
  sections: {
    'ch12-reasoning-about-time': {
      conclusion: 'Group statistics by event time, not processing time; when a processor pauses or reprocesses old events, the two can differ widely. For straggler events that arrive after their time window (say, one minute) has closed, decide whether to ignore them while tracking how many, or to publish a correction. Clocks on users’ devices cannot be trusted either.',
      tradeoff: 'Closing a window early gives timelier results but misses late events; waiting longer or publishing corrections is more accurate but slower and more complex.',
      questions: ['Is this statistic counted by when the event happened, or by when the system processed it?', 'Are late events added to reports already sent out? Will readers know the numbers changed?', 'Data from a device that was offline arrives the next day: which day does it count toward?'],
      examples: [{ source: 'book', text: 'In the book’s example, a processor counting requests per second is redeployed and stops for a minute, then processes the backlog all at once. Measured by processing time, the chart shows an abnormal spike, although the request rate was steady throughout.' }],
    },
    'ch12-stream-joins': {
      conclusion: 'In a stream join (matching related records from two sides), the data being joined changes over time; use the version in force when the event happened, such as the tax rate at the time of sale. The order of events across streams is not fixed, so reprocessing historical data can give different results.',
      tradeoff: 'Giving each version a unique ID and recording in the event which version it used makes the join deterministic and reproducible, but every version must be kept; writing the value in force directly into the event is simpler but duplicates data.',
      questions: ['When historical data is recomputed, does it use the reference data in force then (such as the tax rate) or today’s?', 'Is every version of the reference data kept? Does each event record which version it used?'],
      examples: [{ source: 'book', text: 'In the book’s example, an invoice must use the tax rate at the time of sale. Each change to a tax rate gets a new ID, and the invoice records the ID of the rate in force at the sale, so a later recomputation gives the same amount.' }],
    },
    'ch12-fault-tolerance': {
      conclusion: 'Exactly-once means the visible effect is as if each record were processed once; in reality, some events may be processed more than once after a restart. Checkpoints (progress the stream processing framework saves periodically) or transactions inside the framework protect only state inside it; once output leaves it, such as a write to an external database or an email, a rerun can repeat it, and idempotent writes are needed.',
      tradeoff: 'Transactions inside the framework give strong guarantees but only within it; idempotent writes are cheap but require replay in the same order, deterministic processing, and no other writer updating the same value concurrently.',
      questions: ['When the processor fails and restarts, could it resend notifications or write to an external database twice?', 'How do we tell that a given message has already been processed?'],
      examples: [{ source: 'book', text: 'In the book’s example, a write to an external database stores the offset of the Kafka message that triggered it; after a restart, replayed messages at offsets already processed are skipped.' }],
    },
    'ch12-how-to-choose': {
      title: 'How to choose: keeping systems in sync and exactly-once',
      conclusion: 'To keep several systems in sync, avoid dual writes, where the application writes to each system itself, and use change data capture, which sends every database change to the other systems in order, so the database decides the order. When downstream systems should not depend on internal tables, add the outbox pattern: a separate table, written in the same transaction, that only downstream systems read. Once exactly-once effects leave the stream processing framework, they depend on idempotent writes.',
      tradeoff: 'Change data capture and an outbox keep systems consistent, but add infrastructure and some delay; dual writes are simple but drift out of sync silently.',
      questions: ['Will the systems here be kept in sync with change data capture, the outbox pattern, or dual writes from the application?', 'When a new downstream system goes live, how does it get all the existing data?'],
      examples: [{ source: 'book', text: 'The book’s rule: when a new derived system must start from existing data and the change log is incomplete, first take a consistent snapshot tied to a known position in the log, then apply changes from that position; if the log uses log compaction, so every key keeps its latest value, simply reread it from the start.' }],
    },
  },
}
