import type { TopicText } from '../../types'

export const t5 = {
  title: '寫入後，為何讀不到？',
  summary: '資料存好後，讀取可能落到還沒更新的副本，使用者就看到舊值；要決定哪些讀取必須看到最新寫入。',
  tags: ['複製延遲', '最終一致性', '寫後讀一致性', '過期讀取'],
  sections: {
    'ch6-problems-with-replication-lag': {
      conclusion: '領導者（leader）接受寫入後，以非同步複製（asynchronous replication）送給追隨者（follower）；從還沒追上的追隨者讀，會讀到舊值，也就是過期讀取（stale read）。這段複製延遲（replication lag）平常不到一秒，系統吃緊或網路出問題時可達數分鐘；最終一致性（eventual consistency）的「最終」沒有上限。',
      tradeoff: '非同步副本讓讀取容量和可用性提高，但複製延遲期間，不同讀者可能看到不同版本。',
      questions: ['讀取可能落到落後的副本嗎？', '使用者看見舊值時會以為寫入失敗嗎？'],
      examples: [{ source: 'book', text: '書中說，同一時間對領導者和追隨者送出同一個查詢，可能得到不同結果。' }],
    },
    'ch6-reading-your-own-writes': {
      conclusion: '寫後讀一致性（read-your-writes consistency）保證使用者重新載入後一定看得到自己送出的更新，別人的更新則不保證。做法：讀自己可能改過的東西時走領導者（leader）；最後一次寫入後一分鐘內都走領導者；或讓用戶端記住最後寫入的時間戳，只從已追上的副本讀。',
      tradeoff: '強制從領導者讀簡單但增加領導者負載；追蹤時間戳較彈性，卻增加用戶端與路由複雜度。跨裝置更難，時間戳要集中存放。',
      questions: ['提交後立刻重新整理，還能看到剛寫的內容嗎？', '使用者在電腦上儲存、再用手機查看，也看得到嗎？'],
      examples: [{ source: 'book', text: '書中舉例：使用者發表留言，立刻重新整理卻從落後副本讀到舊頁面，自己的留言像是消失了。' }],
    },
  },
} as const satisfies TopicText<'T5'>
