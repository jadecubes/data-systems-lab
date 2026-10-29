import type { Translation } from '../../types'
import type { t0 as zh } from '../../zh-TW/topics/t0'

export const t0: Translation<typeof zh> = {
  title: 'Separate systems of record from derived data',
  summary: 'Knowing which data is authoritative and which can be recomputed makes indexes, caches, and new views safer.',
  tags: ['system of record', 'derived data', 'normalization', 'denormalization'],
  sections: {
    'ch1-systems-of-record-and-derived-data': {
      conclusion: 'A system of record holds the authoritative version, storing each fact once. Derived data, such as a cache, search index, or data warehouse, is transformed from it and can be rebuilt if lost. When they disagree, the system of record wins.',
      tradeoff: 'Derived data speeds reads or supports different queries, but requires an update path and a policy for lag.',
      questions: ['Does this screen read the system of record or derived data? How long after a change in the source does it show?', 'If an index fails, can it be rebuilt from the source?'],
      examples: [{ source: 'book', text: 'The book’s classic example is a cache: a hit is served from the cache, and a miss goes back to the underlying database. The same database can serve as a system of record or as derived data, depending on how the application uses it.' }],
    },
    'ch3-normalization-denormalization-and-joins': {
      conclusion: 'Normalization stores a shared fact once and refers to it by ID, avoiding contradictory copies. Denormalization copies data near its readers and can avoid joins, but updates must reach every copy.',
      tradeoff: 'Normalization makes renames consistent but may require joins; denormalization simplifies reads while making updates and corrections harder.',
      questions: ['How many places store the same name?', 'What must change together when that name changes?'],
      examples: [{ source: 'book', text: 'The book uses a résumé region: storing a region_id linked to a region table keeps spelling consistent and lets renames or translations be made in one place.' }],
    },
  },
}
