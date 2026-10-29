import type { TopicText } from '../../types'

export const t5 = {
  title: '寫入後，為何讀不到？',
  summary: '副本可能晚於主節點；使用者剛改完資料又讀到舊值時，需要明確的讀取策略。',
  tags: ['複製延遲', '最終一致性', '寫後讀一致性', '過期讀取'],
  sections: {
    'ch6-problems-with-replication-lag': {
      conclusion: '非同步複製（asynchronous replication）使追隨者副本晚於主節點，這段複製延遲（replication lag）會造成過期讀取（stale read）。最終一致性（eventual consistency）只保證在沒有新寫入且副本能追上的前提下，最後會看見相同值。',
      tradeoff: '非同步副本讓讀取容量和可用性提高，但短時間內不同讀者可能看到不同版本。',
      questions: ['讀取可能落到落後的副本嗎？', '使用者看見舊值時會以為寫入失敗嗎？'],
      examples: [{ source: 'book', text: '書中描述同一筆資料：主節點已更新，兩個追隨者進度不同，連續查詢落在不同副本便得到不同結果。' }],
    },
    'ch6-reading-your-own-writes': {
      conclusion: '寫後讀一致性（read-your-writes consistency）要求使用者至少看見自己的最新寫入。可暫時從主節點讀取，或讓用戶端攜帶寫入版本，直到副本追上；只等待最終一致性（eventual consistency）不足以保證立即看見。',
      tradeoff: '強制從主節點讀簡單但增加主節點負載；追蹤版本較彈性，卻增加用戶端與路由複雜度。',
      questions: ['提交後立刻重新整理，還能看到剛寫的內容嗎？', '若使用不同裝置，怎麼辨認屬於同一人的寫入？'],
      examples: [{ source: 'book', text: '書中舉例：使用者發表留言，立刻重新整理卻從落後副本讀到舊頁面，自己的留言像是消失了。' }],
    },
  },
} as const satisfies TopicText<'T5'>
