import type { Translation } from '../../types'
import type { t12 as zh } from '../../zh-TW/topics/t12'

export const t12: Translation<typeof zh> = {
  title: 'Decide whether to collect the data',
  summary: 'Collection, retention, and deletion of personal data need a reason. Deletion gets harder once data spreads to logs and derived systems.',
  tags: ['data minimization', 'retention period', 'deletion', 'personal data'],
  sections: {
    'ch1-data-systems-law-and-society': {
      conclusion: 'Personal data can reveal sensitive facts through seemingly ordinary browsing and location records. Data minimization means asking whether collection is needed before saving it for a hypothetical future use.',
      tradeoff: 'Collecting less limits future analysis but reduces breach, misuse, and long-term retention risk.',
      questions: ['Why is each field collected?', 'Can users learn what their data is used for?'],
      examples: [{ source: 'book', text: 'The book notes that IP addresses or location traces joined with visits can reveal sensitive places a person has been; a table without names is not necessarily anonymous.' }],
    },
    'ch14-legislation-and-self-regulation': {
      conclusion: 'Collect personal data for a specific purpose and apply data minimization: collect only what that purpose needs. Set a retention period tied to the purpose and a deletion process for data no longer needed. Check the precise legal duty for the jurisdiction and use.',
      tradeoff: 'Collecting more and keeping it longer helps explore new uses but increases exposure to breaches and compelled disclosure.',
      questions: ['Why is each field necessary for a stated purpose?', 'What happens to database, log, and backup copies after the retention deadline?'],
      examples: [{ source: 'book', text: 'The book points out that data never collected cannot later leak from the system, be stolen, or be compelled from its holder.' }],
    },
  },
}
