import type { Translation } from '../../types'
import type { t10 as zh } from '../../zh-TW/topics/t10'

export const t10: Translation<typeof zh> = {
  title: 'Let data and code change gradually',
  summary: 'Old records and old code remain during a format change. Use staged migrations and rebuildable derived data to lower switching risk.',
  tags: ['evolvability', 'schema migration', 'old and new data', 'rebuild'],
  sections: {
    'ch2-evolvability-making-change-easy': {
      conclusion: 'Evolvability is the ability to change a system safely as requirements change. Clear interfaces and formats let changes roll out in steps; a schema migration needs validation and a rollback path.',
      tradeoff: 'Designing for change costs time now but reduces the outage and error risk of a large later rewrite.',
      questions: ['Can old code still read and write after a field is added?', 'Can each step deploy and roll back independently?'],
      examples: [{ source: 'book', text: 'The book uses a database migration: if the new system fails and there is no way back to the old database, the change is much riskier than one with a rollback path.' }],
    },
    'ch5-different-values-written-at-different-times': {
      conclusion: 'A database retains values written at many different times; old and new data routinely coexist. Adding a nullable field need not rewrite every old record at once, but readers must handle missing values until backfill finishes.',
      tradeoff: 'Delayed backfill avoids a large immediate load, at the price of supporting both record shapes during transition.',
      questions: ['What appears for an old record without the new field?', 'Can an interrupted backfill safely resume?'],
      examples: [{ source: 'book', text: 'The book observes that old records need not be rewritten immediately when a database adds a field. Readers may use a default or null, with backfill done gradually.' }],
    },
    'ch13-batch-and-stream-processing': {
      conclusion: 'Batch and stream processing can create new derived views from one source. If the source is retained, a new index or report can be rebuilt, allowing a schema migration to be verified beside the old view before reads switch over.',
      tradeoff: 'Running and rebuilding both views costs compute, storage, and comparison effort but makes the cutover measurable and reversible.',
      questions: ['From what source can the derived data be fully rebuilt?', 'How will old and new view results be compared before switching?'],
      examples: [{ source: 'book', text: 'The book discusses building old and new materialized views from the same event source, checking that the new view catches up, then gradually redirecting reads.' }],
    },
  },
}
