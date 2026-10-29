import type { TopicText } from '../../types'

export const t11 = {
  title: '多租戶資料如何分片',
  summary: '以租戶切分能隔離資料與操作，但大租戶與跨租戶查詢會帶來新的限制。',
  tags: ['多租戶', '分片', '租戶隔離', '跨租戶查詢'],
  sections: {
    'ch7-sharding-for-multitenancy': {
      conclusion: '多租戶（multitenancy）系統可按租戶 ID 分片（sharding），讓同一租戶的資料放在一起，便於租戶隔離（tenant isolation）、備份還原和逐租戶遷移；跨租戶查詢（cross-tenant query）則要跨多個分片。',
      tradeoff: '按租戶分片讓資料邊界清楚，但單一大租戶可能超過一個分片容量，跨租戶報表也更昂貴。',
      questions: ['單一租戶是否可能成長到超過一個分片？', '跨租戶分析是否需要獨立的衍生資料流程？'],
      examples: [{ source: 'book', text: '書中以電子郵件行銷服務為例：每家企業的訂閱者與寄送資料可依企業分開，讓備份、還原與資料所在地安排以租戶為單位。' }],
    },
  },
} as const satisfies TopicText<'T11'>
