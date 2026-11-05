import type { Translation } from '../../types'
import type { q7 as zh } from '../../zh-TW/topics/q7'

export const q7: Translation<typeof zh> = {
  title: 'If the data is replicated, can it still be lost?',
  summary: 'Replication keeps the system running through node and even region failures, but it copies accidental deletes too and can still lose acknowledged writes; know which failures replicas cover and which only backups can.',
  tags: ['backup', 'asynchronous replication', 'failover', 'multi-leader replication', 'durability'],
  sections: {
    'ch6-intro-replication-and-backups': {
      title: 'Replication and backups',
      conclusion: 'Replication keeps a copy of the same data on several machines, giving availability, durability and read scaling. But replicas reflect every write quickly, so an accidental delete reaches all of them too; only a backup, which holds an old snapshot, can go back in time.',
      tradeoff: 'Replicas keep the system up but cannot go back in time; backups can, at the cost of storage and restore time.',
      questions: [
        'If a user or a program deletes data by mistake, how far back can we restore from backup?',
        'How long does a restore from backup take, and what do users see meanwhile?',
      ],
      examples: [{ source: 'book', text: 'The book stresses that replication does not replace backups: replicas quickly reflect writes from other nodes, accidental deletes included. The two also work together; for example, a new replica is often set up from a backup.' }],
    },
    'ch6-synchronous-versus-asynchronous-replication': {
      conclusion: 'With synchronous replication the leader waits for a follower to confirm before reporting success; with asynchronous replication it does not wait. If replication is fully asynchronous, a write already confirmed to the user can still be lost when the leader fails; if every follower were synchronous, any one of them stalling would block all writes, so in practice one follower is synchronous and the rest asynchronous: semisynchronous.',
      tradeoff: 'Synchronous replication guarantees one more up-to-date copy, but writes stop when that follower has trouble; asynchronous replication keeps writes independent of followers at the cost of weaker durability.',
      questions: [
        'Do we use synchronous, semisynchronous or asynchronous replication?',
        'If the leader fails, how many writes already confirmed as successful could we lose?',
      ],
      examples: [{ source: 'book', text: 'In the book’s example a user updates a profile picture: the leader reports success only after the synchronous follower confirms, while the asynchronous follower is not waited for. Changes usually apply within a second, but a follower recovering from a failure, or cut off by network problems between nodes, can fall minutes or more behind.' }],
    },
    'ch6-handling-node-outages': {
      conclusion: 'When the leader fails, failover promotes a follower to be the new leader. With asynchronous replication the new leader may lack the old leader’s last writes, and those supposedly committed writes are usually just discarded; two nodes that both believe they are leader is split brain. The timeout for declaring the leader dead is hard to set: too long means slow recovery, too short means a load spike triggers needless failover, so some teams prefer to fail over manually.',
      tradeoff: 'Automatic failover recovers fast but risks false alarms, split brain and lost writes; manual failover is slower but causes fewer surprises.',
      questions: [
        'When the leader fails, is failover automatic or manual? What timeout declares it dead?',
        'Which outside systems would disagree with the database if failover discards some writes?',
      ],
      examples: [{ source: 'book', text: 'The book describes an incident at GitHub: an out-of-date MySQL follower was promoted to leader, and its autoincrementing primary-key counter was behind, so it reused keys the old leader had already assigned. Those keys were also stored in Redis, the two disagreed, and some private data was shown to the wrong users.' }],
    },
    'ch6-solutions-for-replication-lag': {
      conclusion: 'With an eventually consistent system, first ask what the application does if replication lag grows to minutes or even hours. If that hurts users, it needs a stronger guarantee such as read-your-writes consistency. Adding such guarantees in application code is complex and easy to get wrong; the simplest option is a database that offers strong consistency and transactions.',
      tradeoff: 'Weakly consistent replication is more resilient to network interruptions and has lower overhead, but the application must handle stale reads itself.',
      questions: [
        'Are we treating asynchronous replication as if it were synchronous?',
        'If replication lag stretches to several minutes, which features break?',
      ],
      examples: [{ source: 'book', text: 'The book puts it plainly: pretending that replication is synchronous when it is in fact asynchronous is a recipe for problems later.' }],
    },
    'ch6-geographically-distributed-operation': {
      conclusion: 'With replicas in several regions, multi-leader replication lets each region handle writes locally: latency stays low, and the system survives a whole region going down or links between regions failing. The price is much weaker consistency: it cannot guarantee that an account never goes negative or that a username is unique; if you need such constraints, use single-leader replication.',
      tradeoff: 'Local writes buy low latency and resilience, but constraints across regions cannot be enforced; a single leader gives strong consistency, but every write must travel to the leader’s region.',
      questions: [
        'In a multi-region setup, can we still guarantee the uniqueness constraints or no-negative-balance rules we rely on?',
        'If the region holding the leader goes down, what happens to writes?',
      ],
      examples: [{ source: 'book', text: 'In the book’s example, leaders in two regions each accept a registration for the same username; each write is fine on its own, but together they break the rule that usernames are unique.' }],
    },
    'ch6-how-to-choose': {
      title: 'How to choose a replication approach',
      conclusion: 'If you need strong consistency or constraints across records (no negative balances, unique usernames), choose single-leader replication. If writes must complete locally in each region, or you need offline editing or real-time collaboration, choose multi-leader replication and prepare to resolve conflicts. If you must keep latency low while nodes are slow or the network misbehaves, and can tolerate eventual consistency, choose leaderless replication.',
      tradeoff: 'Each approach sits at a different point between consistency, availability and latency: single-leader is the most consistent but cannot accept writes while the leader is unreachable; multi-leader and leaderless keep latency low and accept writes through outages, at the cost of resolving conflicts or settling for eventual consistency.',
      questions: [
        'Which constraints in our requirements (uniqueness, no negative values) can only single-leader replication guarantee?',
        'Do users need offline editing or real-time collaboration? If so, what are the rules for conflict resolution?',
      ],
      examples: [{ source: 'book', text: 'The book’s rule of thumb: if you need to enforce that an account never goes negative or that usernames are unique, use a single leader.' }],
    },
    'ch8-replication-and-durability': {
      conclusion: 'There is no perfect durability: machines fail, a power outage or one bug can take out every replica at once, and data on disk can silently become corrupted. No single technique guarantees that data is never lost; combine writing to disk, replicating to remote machines and keeping backups.',
      tradeoff: 'Each extra layer of protection (remote replicas, older historical backups) adds cost, but it can rescue failures that any single method cannot.',
      questions: [
        'If data has been silently corrupted for a while, how far back can we restore from backup?',
        'Do we regularly practice restoring from backup to prove it actually works?',
      ],
      examples: [{ source: 'book', text: 'The book notes that data on disk can become corrupted gradually without anyone noticing; by the time it is found, the replicas and recent backups are corrupted too, and only an older historical backup helps. One study found that 30% to 80% of SSDs develop at least one bad block in their first four years.' }],
    },
  },
}
