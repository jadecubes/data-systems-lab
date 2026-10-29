import type { Translation } from '../../types'
import type { t5 as zh } from '../../zh-TW/topics/t5'

export const t5: Translation<typeof zh> = {
  title: 'Why can a fresh write disappear?',
  summary: 'A replica can lag behind its leader. When users read an old value right after editing, the read path needs an explicit policy.',
  tags: ['replication lag', 'eventual consistency', 'read-your-writes consistency', 'stale read'],
  sections: {
    'ch6-problems-with-replication-lag': {
      conclusion: 'With asynchronous replication, a follower can trail its leader. This replication lag causes a stale read. Eventual consistency says replicas converge eventually if no new writes arrive and they can catch up; it does not promise an immediate result.',
      tradeoff: 'Asynchronous followers raise read capacity and availability, but readers may briefly see different versions.',
      questions: ['Can this read land on a lagging replica?', 'Will an old value make the user think the write failed?'],
      examples: [{ source: 'book', text: 'The book describes one record updated on the leader while two followers are at different points; consecutive reads routed to different replicas can return different answers.' }],
    },
    'ch6-reading-your-own-writes': {
      conclusion: 'Read-your-writes consistency means a user sees at least their own latest write. Read temporarily from the leader, or carry a write version until a replica catches up; eventual consistency alone does not guarantee immediate visibility.',
      tradeoff: 'Leader reads are simple but add leader load. Tracking versions gives more routing flexibility but complicates clients and reads.',
      questions: ['After submitting and refreshing, can the user still see the new content?', 'How is the same user recognized across devices?'],
      examples: [{ source: 'book', text: 'The book gives a user who posts a comment and immediately reloads from a lagging follower: their own comment appears to have vanished.' }],
    },
  },
}
