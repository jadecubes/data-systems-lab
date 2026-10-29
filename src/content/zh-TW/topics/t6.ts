import type { TopicText } from '../../types'

export const t6 = {
  title: '兩人同時改，別默默丟掉一份',
  summary: '並行修改可能相互覆蓋；先定義衝突的意義，再選擇拒絕、合併或保留多個版本。',
  tags: ['遺失更新', '並行寫入', '衝突解決', '最後寫入者勝'],
  sections: {
    'ch8-preventing-lost-updates': {
      conclusion: '兩個讀者都根據舊值寫新值時，後提交的可能覆蓋先提交的，形成遺失更新（lost update）。原子更新、比較版本後寫入，或資料庫的適當隔離機制，可讓並行寫入（concurrent writes）不會靜默互蓋。',
      tradeoff: '偵測衝突能保住修改，但使用者或程式必須重試並決定如何合併。',
      questions: ['兩人同時編輯同一筆資料時，後存的人會覆蓋誰？', '提交時是否檢查讀取時的版本？'],
      examples: [{ source: 'book', text: '書中以兩人同時編輯維基頁面為例：兩人都從同一舊版開始，若直接覆蓋，先存的內容就不見了。' }],
    },
    'ch6-dealing-with-conflicting-writes': {
      conclusion: '多主節點或離線寫入會出現衝突。最後寫入者勝（last write wins）只選一個版本，可能造成遺失更新（lost update）；衝突解決（conflict resolution）應依資料語意選擇合併、保留多版本或請人決定。',
      tradeoff: '自動選勝者簡單快速，卻會丟資料；保留衝突能避免靜默遺失，但增加儲存和使用者處理成本。',
      questions: ['兩個地點都修改同一欄位，哪個版本留下？', '系統能否讓使用者看見未解決的衝突？'],
      examples: [{ source: 'book', text: '書中討論兩個副本同時把維基頁面標題從 A 改為 B 和 C；用時間戳選一個會丟掉另一個人的工作。' }],
    },
  },
} as const satisfies TopicText<'T6'>
