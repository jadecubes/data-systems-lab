import type { Translation } from '../../types'
import type { t11 as zh } from '../../zh-TW/topics/t11'

export const t11: Translation<typeof zh> = {
  title: 'Shard data by tenant',
  summary: 'Sharding by tenant buys isolation and per-tenant restore, at the cost of handling large tenants, many small tenants, and cross-tenant queries.',
  tags: ['multitenancy', 'sharding', 'tenant isolation', 'cross-tenant query'],
  sections: {
    'ch7-sharding-for-multitenancy': {
      conclusion: 'With multitenancy, a system can give each tenant its own shard or group several small tenants into one. Sharding by tenant brings tenant isolation: one tenant’s heavy queries slow others less, an access-control bug is less likely to expose another tenant’s data, and each tenant can be backed up, restored, exported, deleted, or placed in a required region on its own. A cross-tenant query, joining data across tenants, has to span shards and is harder to build.',
      tradeoff: 'One shard per tenant costs too much when there are many small tenants; grouping them means moving a tenant out once it grows; and a tenant too large for one machine must be sharded again internally.',
      questions: ['If one tenant deletes data by mistake, can it be restored without affecting others?', 'Do cross-tenant analytics need a separate derived-data pipeline?'],
      examples: [{ source: 'book', text: 'The book uses an email-marketing service: each business has separate subscribers and deliveries. With a dedicated shard each, they can be backed up and restored separately.' }],
    },
  },
}
