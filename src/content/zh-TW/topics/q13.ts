import type { TopicText } from '../../types'

export const q13 = {
  title: '同一份資料寫到好幾個系統，怎麼保持一致？',
  summary: '搜尋索引、快取和資料倉儲都要跟著資料庫更新；讓一個系統決定寫入順序、其他系統從它衍生，比應用程式自己寫兩次可靠。',
  tags: ['雙寫', '變更資料擷取', '外寄匣模式', '不可變性', '衍生資料'],
  sections: {
    'ch12-keeping-systems-in-sync': {
      conclusion: '應用程式先寫資料庫、再自己寫搜尋索引（search index）或快取，叫雙寫（dual writes）。兩個請求並行時，兩邊收到寫入的順序可能相反；或一邊成功、另一邊失敗。結果是永久不一致，而且不會出現任何錯誤。',
      tradeoff: '雙寫實作簡單、不需要額外基礎設施，但競爭條件（race condition）和部分失敗造成的不一致平常看不見。根本解法是只讓一個系統決定寫入順序，其他系統跟著它。',
      questions: ['這筆資料除了資料庫，還寫到哪些地方，例如快取或搜尋索引（search index）？', '是應用程式自己寫兩次，也就是雙寫（dual writes），還是從資料庫的變更衍生出來？', '其中一邊寫入失敗時，我們怎麼發現兩邊已經不一致？'],
      examples: [{ source: 'book', text: '書中的例子：兩個用戶端同時把 X 分別設成 A 和 B，都是先寫資料庫、再寫搜尋索引。資料庫先收到 A 再收到 B，最後是 B；搜尋索引先收到 B 再收到 A，最後是 A。' }],
    },
    'ch12-change-data-capture': {
      conclusion: '變更資料擷取（change data capture，CDC）把資料庫的每筆變更依寫入順序送給下游；搜尋索引（search index）、資料倉儲（data warehouse）照同樣順序套用，就成了資料庫的追隨者（follower）。它通常是非同步的，所以有複製延遲（replication lag）；上游的資料表結構也變成下游依賴的介面。',
      tradeoff: '幾乎不必改動既有應用就能讓各系統一致，但上游刪改欄位會弄壞下游。外寄匣模式（outbox pattern）另建一張專給變更資料擷取讀的表，內部的表就能自由修改；代價是同一筆交易裡多存一份資料，並維護兩種結構之間的轉換。',
      questions: ['有哪些下游在讀這張表的變更資料擷取（CDC）事件（event）？', '改這個欄位前要通知誰？有用外寄匣模式（outbox pattern）或資料合約（data contract）保護下游嗎？'],
      examples: [{ source: 'book', text: '書中提到開源工具 Debezium：它接上 MySQL、PostgreSQL 等資料庫的複製日誌，以統一的格式輸出每筆變更的事件（event）。書中也說明，外寄匣表和業務資料在同一筆交易（transaction）裡寫入，所以沒有雙寫（dual writes）的競爭與部分失敗問題。' }],
    },
    'ch12-state-streams-and-immutability': {
      conclusion: '目前狀態是一連串事件（event）累積的結果。不可變性（immutability）指事件寫入後不再修改；保留這樣的事件日誌（event log），方便稽核（auditing）、從錯誤的部署中復原，也能從同一份日誌另建新的讀取視圖。',
      tradeoff: '換來完整歷史與容易遷移，但從日誌衍生的視圖通常非同步更新，使用者可能讀不到自己剛寫的資料，也就是缺少寫後讀一致性（read-your-writes consistency）。歷史也占儲存空間；法規要求刪除（deletion）時很難做到，因為副本散在日誌和備份（backup）裡。',
      questions: ['使用者存檔後回到列表，讀的是同一份資料，還是非同步更新的視圖？', '要刪除某人的個人資料（personal data）時，日誌和備份（backup）裡的副本怎麼處理？'],
      examples: [
        { source: 'book', text: '書中用會計說明：記錯帳不擦掉重寫，而是新增一筆補償交易（compensating transaction），錯的那筆留著供稽核。' },
        { source: 'book', text: '書中另一個例子：顧客把商品放進購物車又移除。對出貨來說兩件事互相抵銷；對分析來說，顧客考慮過又放棄，是有用的資訊。' },
      ],
    },
    'ch13-combining-specialized-tools-by-deriving-data': {
      conclusion: '所有寫入先進入一個決定順序的記錄系統（system of record），搜尋索引（search index）、快取、分析系統（analytical system）再依同樣順序衍生。衍生資料（derived data）多半非同步更新，預設不保證寫完立刻讀得到；不同服務或不同分片（shard）的事件（event）也沒有共同順序，因果關係可能遺失。',
      tradeoff: '從日誌衍生資料比分散式交易（distributed transaction）好恢復，元件之間也較鬆散；代價是失去寫後讀一致性（read-your-writes consistency）與跨服務的統一順序。',
      questions: ['這個功能的記錄系統（system of record）是哪一個？', '其他地方的資料是從它衍生，還是應用程式另外寫入的？', '兩個動作若存在不同服務，下游有可能以相反的順序處理嗎？'],
      examples: [{ source: 'book', text: '書中的例子：一個人先把前任解除好友，再傳訊息向朋友抱怨前任。若好友名單和訊息存在不同地方、先後順序遺失，通知服務可能先處理訊息，把通知送給前任。' }],
    },
    'ch13-composing-data-storage-technologies': {
      conclusion: '拆解式資料庫（unbundled database）用變更資料擷取（change data capture）和事件日誌（event log）把多套儲存系統接在一起，求的是廣度而不是深度。單一技術能滿足需求時就直接用它；活動零件越少越好。',
      tradeoff: '組合多套系統能涵蓋更廣的工作負載，也讓團隊各自開發；但每多一套，就多一份學習、設定與營運成本。',
      questions: ['現有資料庫做不到這個需求的具體地方是什麼？', '加了這套系統之後，誰負責營運和監控？'],
      examples: [{ source: 'book', text: '書中提醒：為用不到的規模提前建置，不但浪費，還會把你鎖進僵化的設計；只有沒有任何單一軟體能滿足需求時，拆解才划算。' }],
    },
  },
} as const satisfies TopicText<'Q13'>
