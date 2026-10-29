import type { Translation } from '../../types'
import type { t12 as zh } from '../../zh-TW/topics/t12'

export const t12: Translation<typeof zh> = {
  title: 'Decide whether to collect the data',
  summary: 'Collection, retention, and deletion of personal data need a reason. Deletion gets harder once data spreads to logs and derived systems.',
  tags: ['data minimization', 'retention period', 'deletion', 'personal data'],
  sections: {
    'ch1-data-systems-law-and-society': {
      conclusion: 'Storing personal data costs more than the storage bill: liability for breaches, fines if processing is ruled unlawful, compelled disclosure, and risk to users’ safety, since ordinary-looking location or IP records can reveal where someone has been. Data minimization means counting those risks and not keeping data that is not worth them.',
      tradeoff: 'Keeping more data may pay off later, at the cost of breach and legal risk and of data that is hard to delete: append-only logs and copies merged into machine-learning training data resist deletion.',
      questions: ['When a user asks for deletion, how are the copies in caches, the data warehouse, and training data deleted?', 'Can users learn what their data is used for?'],
      examples: [{ source: 'book', text: 'The book notes that location data, or even a period of IP address logs, can show which sensitive places a person has visited.' }],
    },
    'ch14-legislation-and-self-regulation': {
      conclusion: 'Collect personal data for a specific purpose and apply data minimization: collect only what that purpose needs. Set a retention period tied to the purpose and a deletion process for data no longer needed. Check the precise legal duty for the jurisdiction and use.',
      tradeoff: 'Collecting more and keeping it longer helps explore new uses but increases exposure to breaches and compelled disclosure.',
      questions: ['Why is each field necessary for a stated purpose?', 'What happens to database, log, and backup copies after the retention deadline?'],
      examples: [{ source: 'book', text: 'The book points out that data never collected cannot later leak from the system, be stolen, or be compelled from its holder.' }],
    },
  },
}
