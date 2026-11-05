import type { Translation } from '../../types'
import type { q5 as zh } from '../../zh-TW/topics/q5'

export const q5: Translation<typeof zh> = {
  title: 'How many copies of data, and how strict a format?',
  summary: 'Normalizing or denormalizing, and checking the format at read or write time, decide how much data and code must change when the format does.',
  tags: ['normalization', 'denormalization', 'schema-on-read', 'schema-on-write', 'schema migration'],
  sections: {
    'ch3-trade-offs-of-normalization': {
      conclusion: 'Normalized data is stored once: writes are fast, and reads are slower because they need joins (queries that combine tables). Denormalized data is fast to read, but every write must update each copy; those copies are a form of derived data and need a process that keeps them updated. Operational databases and small-to-medium systems are usually best normalized.',
      tradeoff: 'Denormalization speeds reads at the cost of more space, updating every copy, and possible inconsistency if a process crashes halfway; analytical systems, which mostly read and update in batches, often suit denormalization better.',
      questions: ['Who updates this redundant data, and when?', 'If an update crashes after changing only some copies, is the data left inconsistent? Does a transaction protect it?'],
      examples: [{ source: 'book', text: 'The book uses company logos on résumés: if every résumé stores the logo URL, changing a logo means finding and updating every old URL; with an organization entity that résumés reference by ID, the change happens in one place.' }],
    },
    'ch3-schema-flexibility-in-the-document-model': {
      conclusion: 'A document database is not schemaless: code reading the data still assumes a structure, interpreted only at read time: schema-on-read. A relational database checks the structure when data is written: schema-on-write. The difference shows when the format changes: the former needs every read path to handle old formats; the latter needs a schema migration.',
      tradeoff: 'Schema-on-read makes format changes fast and suits data whose structure varies, at the cost of old formats living on in reading code; schema-on-write keeps data consistent, but migrating large tables is slow and an operational challenge.',
      questions: ['When the data format changes, is old data migrated at once or converted when read?', 'How long will the schema migration take on large tables, and can it run without downtime?'],
      examples: [{ source: 'book', text: 'The book splits a full name into first and last name: a document database simply writes the new format, and the application fills in the first name when it reads an old document; a relational database adds a column and then fills it with UPDATE, which rewrites every row and can be slow on a large table.' }],
    },
    'ch5-the-merits-of-schemas': {
      conclusion: 'A schema is documentation that is guaranteed to be current, because decoding the data requires it. Keeping a database of schema versions lets you check before deployment that a change keeps backward compatibility and forward compatibility. The fewer formats in use at once, the simpler operations stay.',
      tradeoff: 'Schema-driven binary formats are compact and have clearly defined compatibility rules, but data must be decoded before a person can read it.',
      questions: ['Are schema changes checked automatically for backward and forward compatibility before deployment?', 'Who is responsible for blocking an incompatible change?', 'How many data formats are in use at the same time today?'],
      examples: [{ source: 'book', text: 'The book notes that schema-based formats such as Protocol Buffers and Avro can omit field names and so are much more compact than binary JSON variants; for statically typed languages, code can be generated from the schema and type-checked at compile time.' }],
    },
  },
}
