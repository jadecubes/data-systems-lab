import type { Translation } from '../../types'
import type { t11 as zh } from '../../zh-TW/topics/t11'

export const t11: Translation<typeof zh> = {
  title: 'Shard data by tenant',
  summary: 'Partitioning by tenant can isolate data and operations, but large tenants and cross-tenant queries need separate plans.',
  tags: ['multitenancy', 'sharding', 'tenant isolation', 'cross-tenant query'],
  sections: {
    'ch7-sharding-for-multitenancy': {
      conclusion: 'In multitenancy, sharding by tenant ID can keep one tenant’s data together for tenant isolation, backups, restores, and tenant-by-tenant migrations. A cross-tenant query then has to reach multiple shards.',
      tradeoff: 'Tenant-based sharding makes boundaries clear, but one large tenant can outgrow a shard and cross-tenant reports become more expensive.',
      questions: ['Could one tenant grow beyond a single shard?', 'Do cross-tenant analytics need a separate derived-data pipeline?'],
      examples: [{ source: 'book', text: 'The book uses an email-marketing service: each business has its own subscribers and delivery records, so backup, restore, and data location can be arranged per tenant.' }],
    },
  },
}
