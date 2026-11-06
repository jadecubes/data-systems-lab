import type { TopicText } from '../../types'

export const q14 = {
  title: '這份資料要即時算，還是每天批次算？',
  summary: '批次作業讀不可變的輸入、產生可重算的輸出，出錯能重跑；要決定資料可以晚多久，以及結果怎麼安全地送回線上系統。',
  tags: ['批次處理', '串流處理', '線上系統', '資料合約', '批量載入'],
  sections: {
    'ch11-intro-online-and-batch': {
      title: '線上系統與批次處理',
      conclusion: '線上系統（online systems）收到請求就要盡快回應；批次處理（batch processing）讀不可變（immutable）的輸入、每次從頭產生衍生資料（derived data），寫錯了可以刪掉輸出、修好程式再重跑。直接讀寫資料庫的程式就不行：回滾（rollback）程式碼，修不回已經寫壞的資料。',
      tradeoff: '批次可以安全重跑，運算資源也用得有效率；但整個作業跑完才有輸出，輸入改一點也得整份重算。',
      questions: ['這個作業如果寫錯資料，我們是刪掉輸出重跑、切回舊的輸出，還是只能手動修資料？', '上一次的輸出會保留多久？出錯時能直接切回去嗎？'],
      examples: [{ source: 'book', text: '書中建議把上一次的輸出留在另一個目錄；新版程式寫壞了，直接切回舊輸出即可。許多物件儲存支援這種切回舊版本的功能，稱為時間旅行（time travel）。' }],
    },
    'ch11-extract-transform-load': {
      conclusion: '擷取、轉換、載入（ETL）把資料從正式資料庫取出、轉換後載入下游，例如資料倉儲（data warehouse）。用批次處理（batch processing）跑 ETL 好排程、好除錯：失敗會自動重試（retry），反覆失敗的作業會被標出來。管線也逐漸從單一資料團隊交給各團隊自己管理。',
      tradeoff: '各團隊自己發布資料更快、更貼近業務，但需要資料合約（data contract）和中繼資料管理；否則上游一改格式，下游就壞了。',
      questions: ['這條管線的輸入欄位由哪個團隊負責？', '對方改資料結構時，我們怎麼事先知道？有資料合約（data contract）嗎？'],
      examples: [{ source: 'book', text: '書中的例子：輸入檔少了轉換要用的欄位，作業失敗；資料工程師直接檢查失敗的檔案，修好轉換邏輯或產生輸入的作業，再重跑。' }],
    },
    'ch11-serving-derived-data': {
      conclusion: '商品推薦、給使用者看的報表等批次結果，要送回線上資料庫時，不要在作業裡逐筆寫正式資料庫：太慢、可能壓垮它，失敗重試（retry）時還會留下一半或重複的結果。改把結果推到串流，或建好整份新的資料庫檔再批量載入（bulk-load），並在作業完成前讓新資料對查詢不可見。',
      tradeoff: '經串流或批量載入能保護正式資料庫，也能一次切換整份資料的版本；代價是多一套系統，增量更新也較難。',
      questions: ['這個批次結果是直接寫進正式資料庫的嗎？', '作業跑到一半失敗時，使用者會不會看到一半新、一半舊的資料？'],
      examples: [{ source: 'book', text: '書中的例子：批次作業把結果寫進 Kafka 主題（topic），Elasticsearch、Apache Pinot、Venice 等系統各自匯入；也可以讓批次作業直接產生 RocksDB 的 SST 檔，再匯入資料庫。' }],
    },
    'ch11-how-to-choose': {
      title: '怎麼選：線上、批次或串流',
      conclusion: '要快速回應，用線上系統（online systems）；量大且不在乎新鮮度，用批次處理（batch processing）；要在資料變更後不久就處理，用串流處理（stream processing）。資料量不夠大時，一台機器就夠了。',
      tradeoff: '越即時越複雜、成本越高；批次簡單、可以重跑，但資料較晚。',
      questions: ['使用者能接受這份資料晚多久：一天、一小時，還是幾秒？', '資料量真的大到需要分散式框架嗎？一台機器處理得了嗎？'],
      examples: [{ source: 'book', text: '書中的規模階梯：要追蹤的鍵放得進記憶體，用雜湊表就好；放不下但單機磁碟放得下，就先排序再合併；單機都放不下，才用分散式批次框架。' }],
    },
  },
} as const satisfies TopicText<'Q14'>
