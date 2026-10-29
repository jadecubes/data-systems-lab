import type { Translation } from '../../types'
import type { t0 as zh } from '../../zh-TW/topics/t0'

export const t0: Translation<typeof zh> = {
  title: 'Separate source records from derived data',
  summary: 'Knowing which data is authoritative and which can be recomputed makes indexes, caches, and new views safer.',
  tags: ['system of record', 'derived data', 'normalization', 'denormalization'],
  sections: {
    'ch1-systems-of-record-and-derived-data': {
      conclusion: 'A system of record holds authoritative facts. Derived data, such as a cache, search index, or report, is built from it. Its source and rebuild process must be clear or the copy may be mistaken for another truth.',
      tradeoff: 'Derived data speeds reads or supports different queries, but requires an update path and a policy for lag.',
      questions: ['Which copy is the final authority?', 'If an index fails, can it be rebuilt from the source?'],
      examples: [{ source: 'book', text: 'The book treats caches, search indexes, and data warehouses as derived from systems of record. Each can optimize a different query while the original facts keep one authority.' }],
    },
    'ch3-normalization-denormalization-and-joins': {
      conclusion: 'Normalization stores a shared fact once and refers to it by ID, avoiding contradictory copies. Denormalization copies data near its readers and can avoid joins, but updates must reach every copy.',
      tradeoff: 'Normalization makes renames consistent but may require joins; denormalization simplifies reads while making updates and corrections harder.',
      questions: ['How many places store the same name?', 'What must change together when that name changes?'],
      examples: [{ source: 'book', text: 'The book uses a résumé region: storing a region_id linked to a region table keeps spelling consistent and lets renames or translations be made in one place.' }],
    },
  },
}
