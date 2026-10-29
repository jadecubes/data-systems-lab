import type { Translation } from '../../types'
import type { t6 as zh } from '../../zh-TW/topics/t6'

export const t6: Translation<typeof zh> = {
  title: 'Two edits should not silently erase one another',
  summary: 'Concurrent changes can overwrite each other. Define what a conflict means before choosing rejection, merging, or multiple versions.',
  tags: ['lost update', 'concurrent writes', 'conflict resolution', 'last write wins'],
  sections: {
    'ch8-preventing-lost-updates': {
      conclusion: 'When two readers derive changes from the same old value, the later commit can overwrite the first: a lost update. Atomic operations, version checks, or a suitable database isolation mechanism keep concurrent writes from silently replacing one another.',
      tradeoff: 'Detecting a conflict preserves work, but a user or program then must retry or merge it.',
      questions: ['If two people edit one record, whose changes survive?', 'Does the commit check the version that was read?'],
      examples: [{ source: 'book', text: 'The book uses two editors changing a wiki page from the same old revision. Blindly saving the second revision erases the first editor’s work.' }],
    },
    'ch6-dealing-with-conflicting-writes': {
      conclusion: 'Multi-leader or offline writes can conflict. Last write wins chooses one version and can cause a lost update. Conflict resolution should follow the data’s meaning: merge, keep multiple versions, or ask a person to decide.',
      tradeoff: 'Automatically picking a winner is fast and simple but drops work. Keeping conflicts avoids silent loss at the cost of storage and user effort.',
      questions: ['If two locations edit one field, which value remains?', 'Can users see unresolved conflicts?'],
      examples: [{ source: 'book', text: 'The book discusses two replicas changing a wiki title from A to B and from A to C. Selecting one by timestamp discards the other edit.' }],
    },
  },
}
