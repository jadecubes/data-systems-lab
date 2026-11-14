import type { Translation } from '../../types'
import type { q14 as zh } from '../../zh-TW/topics/q14'

export const q14: Translation<typeof zh> = {
  title: 'Compute it live, or in a daily batch?',
  summary: 'A batch job reads immutable input and produces output that can be recomputed, so a job that goes wrong can simply be rerun; decide how late the data may be and how results get back to online systems safely.',
  tags: ['batch processing', 'stream processing', 'online systems', 'data contract', 'bulk-load'],
  sections: {
    'ch11-intro-online-and-batch': {
      title: 'Online systems and batch processing',
      conclusion: 'Online systems must answer each request as fast as possible. Batch processing reads immutable input and produces derived data from scratch each time, so bad output can be deleted, the code fixed, and the job rerun. Code that reads and writes a database cannot do this: a rollback of the code does not repair data it already corrupted.',
      tradeoff: 'Batch jobs can be rerun safely and use computing resources efficiently, but output appears only when the whole job finishes, and changing even a little input means reprocessing all of it.',
      questions: ['If this job writes bad data, do we delete the output and rerun, switch back to the previous output, or fix the data by hand?', 'How long is the previous output kept? Can we switch back to it directly when something goes wrong?'],
      examples: [{ source: 'book', text: 'The book suggests keeping the previous output in a different directory; if new code writes bad output, simply switch back to the old one. Many object stores support switching back to an earlier version like this, called time travel.' }],
    },
    'ch11-extract-transform-load': {
      conclusion: 'ETL extracts data from production databases, transforms it, and loads it downstream, for example into a data warehouse. Running ETL as batch processing makes it easy to schedule and debug: failures are retried automatically, and jobs that keep failing are flagged. Pipelines are also moving from a single data team to the teams that own the data.',
      tradeoff: 'Teams publishing their own data move faster and stay closer to the business, but this needs data contracts and metadata management; otherwise one upstream format change breaks the consumers downstream.',
      questions: ['Which team owns the input fields of this pipeline?', 'How do we learn in advance when they change the data structure? Is there a data contract?'],
      examples: [{ source: 'book', text: 'In the book’s example, an input file is missing a field the transformation needs and the job fails; a data engineer inspects the failed file directly, fixes the transformation or the job that produced the input, and reruns it.' }],
    },
    'ch11-serving-derived-data': {
      conclusion: 'When batch results such as product recommendations or user-facing reports must go back to an online database, do not write them to the production database one record at a time: it is slow, can overwhelm the database, and a retried failure leaves partial or duplicate results. Instead push the results to a stream, or build a whole new database file and bulk-load it, keeping new data invisible to queries until the job completes.',
      tradeoff: 'A stream or a bulk-load protects the production database and allows switching the whole dataset version at once, at the cost of an extra system and harder incremental updates.',
      questions: ['Does this batch result get written directly into the production database?', 'If the job fails halfway, could users see data that is half new and half old?'],
      examples: [{ source: 'book', text: 'In the book’s example, a batch job writes its results to a Kafka topic, which systems such as Elasticsearch, Apache Pinot, and Venice each ingest; alternatively, the batch job produces RocksDB SST files that are then imported into the database.' }],
    },
    'ch11-how-to-choose': {
      title: 'How to choose: online, batch, or stream',
      conclusion: 'For fast responses, use online systems; for large volumes where freshness does not matter, use batch processing; to process data soon after it changes, use stream processing. If the data is not that large, a single machine will do.',
      tradeoff: 'The more real-time, the more complex and costly; batch is simple and can be rerun, but the data arrives later.',
      questions: ['How late can this data be for users: a day, an hour, or seconds?', 'Is the data really large enough to need a distributed framework? Could one machine handle it?'],
      examples: [{ source: 'book', text: 'The book’s scale ladder: if the keys being tracked fit in memory, a hash table is enough; if not but they fit on one machine’s disk, sort and then merge; only when one machine cannot hold them, use a distributed batch framework.' }],
    },
  },
}
