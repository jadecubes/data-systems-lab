import type { Translation } from '../../types'
import type { q11 as zh } from '../../zh-TW/topics/q11'

export const q11: Translation<typeof zh> = {
  title: 'When do you need strong consistency?',
  summary:
    'Making the system behave as if there were one copy of the data makes development easier, but it is slower all the time and some users cannot write when the network splits; first ask whether the business really needs it.',
  tags: ['linearizability', 'strong consistency', 'eventual consistency', 'network partition', 'coordination service'],
  sections: {
    'ch10-intro-two-philosophies': {
      title: 'Two ways to handle replicas that disagree',
      conclusion:
        'Multiple replicas can make a read return an old value. One approach is eventual consistency: the application knows there are replicas, and developers handle inconsistencies and conflicts. The other is strong consistency: the system behaves like a single node, which is easier for developers, at a cost in performance and with outages under some faults.',
      tradeoff:
        'Strong consistency keeps development simple but is slower and stops serving under some faults; eventual consistency offers high availability, but the application must handle conflicts itself.',
      questions: ['Can users accept seeing a value that is a few seconds old?', 'Do users need to edit data while offline?'],
      examples: [
        {
          source: 'book',
          text: 'The book says an app that allows offline edits can only be eventually consistent; when all replicas sit in a datacenter with fast, reliable communication, the cost of strong consistency is usually acceptable.',
        },
      ],
    },
    'ch10-the-cost-of-linearizability': {
      conclusion:
        'Linearizability makes the system look as if there were only one copy of the data. It costs two things: during a network partition, the side that cannot reach the leader can neither write nor make linearizable reads; and even when the network is fine, reads and writes are slower, because response time is at least proportional to the uncertainty of network delay.',
      tradeoff:
        'During a network partition you must choose between consistent (stop serving) and available (serve old values or create conflicts); without a partition, the trade-off is latency against consistency. “Pick two of consistency, availability and partition tolerance” is misleading: a partition is a fault, not a choice.',
      questions: [
        'If the link between two regions fails, what can users on the side without the leader still do?',
        'Is it worth making this operation slower in exchange for always reading the latest value?',
      ],
      examples: [
        {
          source: 'book',
          text: 'In the book’s example, a single-leader database spans two regions and the link between them fails; clients that can reach only the follower region cannot write and can read only possibly stale data, so features that need linearizability stop until the network is repaired.',
        },
      ],
    },
    'ch10-coordination-services': {
      conclusion:
        'Locks, leader election and assigning shards to nodes are “only one” decisions that need consensus. Do not implement it yourself; hand it to a coordination service running on 3 or 5 nodes. It stores only a small amount of slowly changing data, such as which node leads a shard, and is not meant for data that changes thousands of times a second.',
      tradeoff:
        'Outsourcing consensus avoids the risk of building it yourself, but the coordination service’s availability affects every system that depends on it.',
      questions: [
        'How often does this data change? Does it belong in a coordination service or in an ordinary database?',
        'If the coordination service goes down, which features stop with it?',
      ],
      examples: [
        {
          source: 'book',
          text: 'The book’s example: a storage system with thousands of shards would be inefficient running consensus across thousands of nodes, so it outsources consensus to a small fixed set of nodes; Kubernetes relies on etcd this way.',
        },
      ],
    },
    'ch10-how-to-choose': {
      title: 'When linearizability is worth its cost',
      conclusion:
        'You need linearizability only when the write itself must guarantee no duplicates, no negative balance or no overselling; if you can compensate afterwards, or do not need the latest value, use multi-leader or leaderless replication for availability and speed. Hand locks, leases and leader election to a coordination service.',
      tradeoff:
        'Linearizability buys correctness; the price is stopping during a network partition and higher latency all the time.',
      questions: [
        'If this rule is broken at write time (a duplicate, an oversell), is fixing it and compensating afterwards acceptable?',
      ],
      examples: [
        {
          source: 'book',
          text: 'The book notes that an overbooked flight can be handled by moving passengers to another flight and compensating them, so linearizability may not be needed there; but hard rules such as one seat never going to two people, or an account balance never going negative, do need it.',
        },
      ],
    },
  },
}
