import type { TopicText } from '../../types'

export const t11 = {
  title: '多租戶資料如何分片',
  summary: '專用分片方便逐租戶還原；共用分片節省資源。兩者都要處理跨租戶查詢。',
  tags: ['多租戶', '分片', '租戶隔離', '跨租戶查詢'],
  sections: {
    'ch7-sharding-for-multitenancy': {
      conclusion: '多租戶（multitenancy）系統可每租戶一個分片（sharding），或讓小租戶共用分片。專用分片可直接逐租戶備份、還原與遷移；共用分片須另行設計這些能力。租戶隔離（tenant isolation）仍需存取控制，跨租戶查詢（cross-tenant query）可能跨片。',
      tradeoff: '專用分片對小租戶開銷高，大租戶又可能一片放不下；共用分片節省資源，卻讓逐租戶還原更難。',
      questions: ['一個租戶誤刪資料時，能只還原它而不影響其他租戶嗎？', '跨租戶分析是否需要獨立的衍生資料（derived data）流程？'],
      examples: [{ source: 'book', text: '書中以電子郵件行銷服務為例：每家企業的訂閱者與寄送資料各自獨立；若各有專用分片，就能分別備份與還原。' }],
    },
  },
} as const satisfies TopicText<'T11'>
