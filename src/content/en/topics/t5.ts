import type { Translation } from '../../types'
import type { t5 as zh } from '../../zh-TW/topics/t5'

export const t5: Translation<typeof zh> = {
  title: 'Why can a fresh write disappear?',
  summary: 'After a save, a read can land on a copy that has not caught up, so the user sees the old value; decide which reads must see the latest write.',
  tags: ['replication lag', 'eventual consistency', 'read-your-writes consistency', 'stale read'],
  sections: {
    'ch6-problems-with-replication-lag': {
      conclusion: 'The leader accepts writes and sends them to followers by asynchronous replication. Reading from a follower that has not caught up returns an old value: a stale read. This replication lag is usually under a second but can reach minutes when the system is near capacity or the network has problems; the “eventually” in eventual consistency has no upper bound.',
      tradeoff: 'Asynchronous followers raise read capacity and availability, but while replication lags, readers may see different versions.',
      questions: ['Can this read land on a lagging replica?', 'Will an old value make the user think the write failed?'],
      examples: [{ source: 'book', text: 'The book notes that the same query sent at the same moment to the leader and to a follower can return different results.' }],
    },
    'ch6-reading-your-own-writes': {
      conclusion: 'Read-your-writes consistency guarantees that users who reload see their own updates; other users’ updates are not covered. Options: read anything the user may have changed from the leader, read from the leader for a minute after their last write, or have the client remember its last write timestamp and read only from replicas that have caught up.',
      tradeoff: 'Leader reads are simple but add leader load. Tracking timestamps gives more routing flexibility but complicates clients and reads. Across devices it is harder: the timestamp must be stored centrally.',
      questions: ['After submitting and refreshing, can the user still see the new content?', 'If the user saves on a laptop and then checks on a phone, will they see it?'],
      examples: [{ source: 'book', text: 'The book gives a user who posts a comment and immediately reloads from a lagging follower: their own comment appears to have vanished.' }],
    },
  },
}
