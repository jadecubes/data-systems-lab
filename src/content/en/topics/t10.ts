import type { Translation } from '../../types'
import type { t10 as zh } from '../../zh-TW/topics/t10'

export const t10: Translation<typeof zh> = {
  title: 'Let data and code change gradually',
  summary: 'Old records and old code remain during a format change. Use staged migrations and rebuildable derived data to lower switching risk.',
  tags: ['evolvability', 'schema migration', 'old and new data', 'rebuild'],
  sections: {
    'ch2-evolvability-making-change-easy': {
      conclusion: 'Evolvability is how easily a system can change as requirements change; simple, loosely coupled systems are easier to change than complex, tightly coupled ones. A major obstacle is irreversibility: be very careful with steps that cannot be undone, and keep a way back where you can.',
      tradeoff: 'Keeping a way back (running old and new side by side, being able to switch back) costs more; a one-shot cutover saves work but leaves no way back if the new system fails.',
      questions: ['If this migration goes wrong, can we switch back to the old system?', 'Which step cannot be undone?'],
      examples: [{ source: 'book', text: 'The book uses a database migration: if the new system fails and there is no way back to the old database, the change is much riskier than one with a rollback path.' }],
    },
    'ch5-different-values-written-at-different-times': {
      conclusion: 'Old and new data coexist for a long time: new code can replace the old within minutes, but values written years ago keep their original format unless rewritten. Simple changes can leave old data alone; changes such as turning one value into several, or moving data to another table, still need the data rewritten in the application, and staying compatible during that rewrite is hard.',
      tradeoff: 'Not rewriting old data saves a costly migration, at the price of a database that mixes formats from every period, which code must keep reading.',
      questions: ['What appears for an old record without the new field?', 'Will old data be rewritten into the new format? If not, could results differ between old and new records?'],
      examples: [{ source: 'book', text: 'In the book’s example, one database can hold values written 5 milliseconds ago and 5 years ago. Most relational databases add a column that defaults to null without rewriting old rows, and fill in null when an old row is read.' }],
    },
    'ch13-batch-and-stream-processing': {
      conclusion: 'Because batch processing can reprocess accumulated history, a schema migration need not switch all at once: rebuild old and new views side by side from the same source data, move a few users to the new view, widen gradually, then drop the old view; every step can be reversed.',
      tradeoff: 'Running both views costs compute and storage while they coexist; in return every step can be reversed, so no single switch can do irreversible damage.',
      questions: ['From what source can the derived data be fully rebuilt?', 'Can a few users try the new version first, and how do we roll back if it goes wrong?'],
      examples: [{ source: 'book', text: 'The book uses a railway analogy: after Britain set a standard gauge in 1846, old lines got a third rail so trains of both gauges could run; once every train was converted, the extra rail was removed.' }],
    },
  },
}
