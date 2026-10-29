import type { TopicText } from '../../types'

export const t12 = {
  title: '先決定要不要收這些資料',
  summary: '個人資料的蒐集、保存和刪除都要有理由；資料散到日誌與衍生系統後，補做刪除會更難。',
  tags: ['資料最小化', '保留期限', '刪除', '個人資料'],
  sections: {
    'ch1-data-systems-law-and-society': {
      conclusion: '存個人資料（personal data）的成本不只是儲存費，還有外洩的責任、違法的罰款、被要求交出資料，以及使用者的人身安全：看似普通的位置或 IP 紀錄，也可能推出敏感行蹤。資料最小化（data minimization）就是把這些風險算進去，不值得存的就不收或刪掉。',
      tradeoff: '多存資料日後也許有用，代價是外洩與違法風險，以及很難刪乾淨：僅附加日誌（append-only log）、已併入機器學習訓練資料的副本都不好刪。',
      questions: ['使用者要求刪除（deletion）時，快取、資料倉儲（data warehouse）和訓練資料裡的副本怎麼刪？', '使用者可否知道資料被用於什麼目的？'],
      examples: [{ source: 'book', text: '書中指出，位置資料、甚至一段時間的 IP 位址紀錄，就可能看出一個人去過哪些敏感場所。' }],
    },
    'ch14-legislation-and-self-regulation': {
      conclusion: '蒐集個人資料（personal data）要有特定目的，並遵守資料最小化（data minimization）：只收達成目的所需的部分。保留期限（retention period）應與目的相符；不再需要的資料要有刪除（deletion）流程。具體法律義務仍要依地區與用途確認。',
      tradeoff: '多收集、長期保存方便探索新用途，卻增加外洩與被要求交出資料的風險。',
      questions: ['每個欄位對哪個明確目的有必要？', '到期後資料庫、日誌和備份中的副本會怎麼處理？'],
      examples: [{ source: 'book', text: '書中提醒：一開始沒有收集的資料，之後就不會從系統外洩、被竊，或被要求交出。' }],
    },
  },
} as const satisfies TopicText<'T12'>
