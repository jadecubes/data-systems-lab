import type { TopicText } from '../../types'

export const t6 = {
  title: '兩人同時改，別默默丟掉一份',
  summary: '並行修改可能相互覆蓋；先定義衝突的意義，再選擇拒絕、合併或保留多個版本。',
  tags: ['遺失更新', '並行寫入', '衝突解決', '最後寫入者勝'],
  sections: {
    'ch8-preventing-lost-updates': {
      conclusion: '讀出、修改、再寫回，也就是讀取-修改-寫入循環（read-modify-write cycle），遇到兩筆並行寫入（concurrent writes）時，後寫的會蓋掉前者的修改，形成遺失更新（lost update）。防法要明確設計：讓資料庫一步完成更新（例如直接加一）、先加鎖，或寫入時檢查值仍是當初讀到的版本。',
      tradeoff: '偵測衝突能保住修改，但使用者或程式必須重試並決定如何合併。',
      questions: ['兩人同時編輯同一筆資料時，後存的人會覆蓋誰？', '提交時是否檢查讀取時的版本？'],
      examples: [{ source: 'book', text: '書中以兩人同時編輯維基頁面為例：兩人都從同一舊版開始，若直接覆蓋，先存的內容就不見了。' }],
    },
    'ch6-dealing-with-conflicting-writes': {
      conclusion: '多主複製（multi-leader replication）或離線編輯時，兩邊各自成功的寫入事後才發現衝突。能避免就避免，例如同一筆紀錄的寫入都走同一個領導者（leader）。最後寫入者勝（last write wins）會悄悄丟掉其他已回報成功的寫入，造成遺失更新（lost update）；不能接受時，用衝突解決（conflict resolution）自動合併、保留多個版本讓使用者選，或請人決定。',
      tradeoff: '最後寫入者勝簡單、各副本最後一致，代價是資料遺失；自動合併保留每個人的修改，但實作複雜；讓使用者手動合併最費工，使用者也可能看不懂要做什麼。',
      questions: ['兩個地點都修改同一欄位，哪個版本留下？', '系統能否讓使用者看見未解決的衝突？'],
      examples: [{ source: 'book', text: '書中的例子：兩人在不同的領導者上，同時把維基頁面標題從 A 分別改成 B 和 C，兩邊都回報成功；最後寫入者勝依時間戳只留一個，另一人的修改悄悄消失。' }],
    },
  },
} as const satisfies TopicText<'T6'>
