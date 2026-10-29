import type { TopicText } from '../../types'

export const t11 = {
  title: '多租戶資料如何分片',
  summary: '依租戶分片換來隔離與逐租戶還原，代價是大租戶、大量小租戶與跨租戶查詢。',
  tags: ['多租戶', '分片', '租戶隔離', '跨租戶查詢'],
  sections: {
    'ch7-sharding-for-multitenancy': {
      conclusion: '多租戶（multitenancy）系統可以每個租戶一個分片（sharding），或把幾個小租戶合成一個分片。依租戶分片帶來租戶隔離（tenant isolation）：一個租戶跑重度查詢時較不拖累別人，存取控制（access control）有 bug 時也較不會露出別家的資料，還能逐租戶備份還原、匯出與刪除（deletion）、放到指定地區。需要跨租戶連結資料的跨租戶查詢（cross-tenant query）則要跨分片，較難實作。',
      tradeoff: '每租戶一個分片，小租戶很多時開銷太大；合成較大的分片，又得處理租戶長大後怎麼搬走；單一租戶大到一台機器放不下時，還得在租戶內再分片。',
      questions: ['一個租戶誤刪資料時，能只還原它而不影響其他租戶嗎？', '跨租戶分析是否需要獨立的衍生資料（derived data）流程？'],
      examples: [{ source: 'book', text: '書中以電子郵件行銷服務為例：每家企業的訂閱者與寄送資料各自獨立；若各有專用分片，就能分別備份與還原。' }],
    },
  },
} as const satisfies TopicText<'T11'>
