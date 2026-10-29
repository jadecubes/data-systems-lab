import type { TopicText } from '../../types'

export const t12 = {
  title: '先決定要不要收這些資料',
  summary: '個人資料的蒐集、保存和刪除都要有理由；資料散到日誌與衍生系統後，補做刪除會更難。',
  tags: ['資料最小化', '保留期限', '刪除', '個人資料'],
  sections: {
    'ch1-data-systems-law-and-society': {
      conclusion: '個人資料（personal data）可能從看似普通的瀏覽或位置紀錄推知敏感資訊。資料最小化（data minimization）要求先問是否真的需要收集，而不是先留著以後再說。',
      tradeoff: '少收資料會限制未來的分析，但減少外洩、誤用與長期保存的風險。',
      questions: ['每個欄位為何要收集？', '使用者可否知道資料被用於什麼目的？'],
      examples: [{ source: 'book', text: '書中指出，IP 位址或位置與造訪紀錄結合，可能透露一個人去過哪些敏感場所；資料表看似沒有姓名，也未必匿名。' }],
    },
    'ch14-legislation-and-self-regulation': {
      conclusion: '蒐集個人資料（personal data）要有特定目的，並遵守資料最小化（data minimization）：只收達成目的所需的部分。保留期限（retention period）應與目的相符；不再需要的資料要有刪除（deletion）流程。具體法律義務仍要依地區與用途確認。',
      tradeoff: '多收集、長期保存方便探索新用途，卻增加外洩與被要求交出資料的風險。',
      questions: ['每個欄位對哪個明確目的有必要？', '到期後資料庫、日誌和備份中的副本會怎麼處理？'],
      examples: [{ source: 'book', text: '書中提醒：一開始沒有收集的資料，之後就不會從系統外洩、被竊，或被要求交出。' }],
    },
  },
} as const satisfies TopicText<'T12'>
