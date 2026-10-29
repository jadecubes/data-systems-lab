import type { Translation } from '../../types'
import type { t6 as zh } from '../../zh-TW/topics/t6'

export const t6: Translation<typeof zh> = {
  title: 'Two edits should not silently erase one another',
  summary: 'Concurrent changes can overwrite each other. Define what a conflict means before choosing rejection, merging, or multiple versions.',
  tags: ['lost update', 'concurrent writes', 'conflict resolution', 'last write wins'],
  sections: {
    'ch8-preventing-lost-updates': {
      conclusion: 'In a read-modify-write cycle—read a value, change it, write it back—the later of two concurrent writes can overwrite the earlier one’s change: a lost update. Preventing it takes deliberate design: let the database apply the change in one step (for example, add one), lock the record first, or check at write time that the value is still the version you read.',
      tradeoff: 'Detecting a conflict preserves work, but a user or program then must retry or merge it.',
      questions: ['If two people edit one record, whose changes survive?', 'Does the commit check the version that was read?'],
      examples: [{ source: 'book', text: 'The book uses two editors changing a wiki page from the same old revision. Blindly saving the second revision erases the first editor’s work.' }],
    },
    'ch6-dealing-with-conflicting-writes': {
      conclusion: 'With multi-leader replication or offline edits, writes that each succeeded locally are found to conflict later. Avoid conflicts where you can, for example by routing all writes to a record through one leader. Last write wins silently discards other writes that were already reported as successful, causing a lost update; when that is unacceptable, conflict resolution can merge automatically, keep multiple versions for the user to choose, or ask a person.',
      tradeoff: 'Last write wins is simple and makes replicas agree, at the cost of lost data; automatic merging keeps everyone’s changes but is complex to build; asking users to merge by hand is the most work, and users may not understand what is being asked.',
      questions: ['If two locations edit one field, which value remains?', 'Can users see unresolved conflicts?'],
      examples: [{ source: 'book', text: 'In the book, two users on different leaders change a wiki page title from A to B and from A to C at the same time, and both are told it succeeded; last write wins keeps one by timestamp and the other edit silently disappears.' }],
    },
  },
}
