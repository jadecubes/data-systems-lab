import type { Translation } from '../../types'
import type { q8 as zh } from '../../zh-TW/topics/q8'

export const q8: Translation<typeof zh> = {
  title: 'Should the data be split across machines?',
  summary: 'Sharding lets data volume and write throughput grow beyond one machine, but the partition key is hard to change, operations across shards get slower, and moving shards can itself cause failures.',
  tags: ['sharding', 'partition key', 'distributed transaction', 'rebalancing', 'cascading failure'],
  sections: {
    'ch7-pros-and-cons-of-sharding': {
      conclusion: 'Sharding spreads data and writes across several nodes when the data volume or write throughput is too much for one machine; if the problem is only read volume, let replicas share the reads instead. If one machine can cope, do not shard: you must pick a partition key that is hard to change later, finding a record without knowing its shard means searching every shard, and writes across shards need a distributed transaction.',
      tradeoff: 'Sharding gives horizontal scaling of data volume and writes, at the cost of complexity and slower queries, joins and transactions across shards.',
      questions: [
        'Is the bottleneck data volume, write throughput, or only reads? Do we really need sharding?',
        'What will the partition key be, and can we change it later?',
        'Which queries or transactions will span several shards?',
      ],
      examples: [{ source: 'book', text: 'The book points out that if the problem is only heavy read load, you do not need to shard; several replicas sharing the reads are enough. Sharding is a heavyweight solution, and if one machine can handle the load, a single shard is usually best.' }],
    },
    'ch7-operations-automatic-versus-manual-rebalancing': {
      conclusion: 'Rebalancing moves shards to other nodes. Fully automatic rebalancing saves routine operations work but is unpredictable: moving lots of data loads the network and the nodes. Combined with automatic failure detection, a node that is only temporarily slow can be declared dead, its load moved onto the others, and the result can be a cascading failure.',
      tradeoff: 'Automation saves people’s time at the cost of unpredictable operational surprises; having a person approve changes is slower but avoids surprises, and a known traffic peak is a good reason to rebalance manually in advance.',
      questions: [
        'Is rebalancing automatic, or does a person approve it?',
        'Before a known sale or event, how far ahead should we tell you so you can adjust the shards?',
      ],
      examples: [{ source: 'book', text: 'The book’s example: when a Cyber Monday sale or ticket sales for a popular sporting event are expected to bring a traffic peak, it makes sense to rebalance manually in advance.' }],
    },
  },
}
