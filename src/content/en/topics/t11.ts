import type { Translation } from '../../types'
import type { t11 as zh } from '../../zh-TW/topics/t11'

export const t11: Translation<typeof zh> = {
  title: 'Shard data by tenant',
  summary: 'A dedicated shard simplifies per-tenant restore; shared shards save resources. Both need a plan for cross-tenant queries.',
  tags: ['multitenancy', 'sharding', 'tenant isolation', 'cross-tenant query'],
  sections: {
    'ch7-sharding-for-multitenancy': {
      conclusion: 'A multitenant system can give each tenant a shard or group small tenants on a shared shard. A dedicated shard allows direct per-tenant backup, restore, and migration; on shared shards, these operations need extra work. Tenant isolation still needs access controls, and a cross-tenant query may span shards.',
      tradeoff: 'Dedicated shards cost more for small tenants, while large tenants may outgrow one. Shared shards save resources but make per-tenant restore harder.',
      questions: ['If one tenant deletes data by mistake, can it be restored without affecting others?', 'Do cross-tenant analytics need a separate derived-data pipeline?'],
      examples: [{ source: 'book', text: 'The book uses an email-marketing service: each business has separate subscribers and deliveries. With a dedicated shard each, they can be backed up and restored separately.' }],
    },
  },
}
