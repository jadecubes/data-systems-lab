import type { TopicText } from '../../types'

export const t0 = {
  title: '先分清記錄系統與衍生資料',
  summary: '知道哪份資料是權威來源、哪份可以重算，才能安全地加索引、快取和新視圖。',
  tags: ['記錄系統', '衍生資料', '正規化', '反正規化'],
  sections: {
    'ch1-systems-of-record-and-derived-data': {
      conclusion: '記錄系統（system of record）存放權威版本，每個事實只存一次；衍生資料（derived data），例如快取、搜尋索引、資料倉儲（data warehouse），由它轉換而來，遺失了可以重建。兩者不一致時，以記錄系統為準。',
      tradeoff: '衍生資料讓讀取更快或提供不同查詢方式，但需要維護更新流程與處理落後。',
      questions: ['這個畫面讀的是記錄系統（system of record）還是衍生資料（derived data）？來源改了以後，多久會反映出來？', '若索引壞掉，能否從來源重建？'],
      examples: [{ source: 'book', text: '書中最典型的例子是快取：資料在快取裡就直接回應，不在就回頭查底層資料庫。同一套資料庫可以當記錄系統，也可以當衍生資料，看應用怎麼用它。' }],
    },
    'ch3-normalization-denormalization-and-joins': {
      conclusion: '正規化（normalization）把共同事實放在一處並用識別碼引用，避免多份文字互相矛盾。反正規化（denormalization）把資料複製到讀取位置，可減少 join，但更新時要同步多份副本。',
      tradeoff: '正規化讓修改與更名一致，查詢可能要 join；反正規化讀取方便，卻提高更新與修正成本。',
      questions: ['同一名稱會在多少地方重複儲存？', '更名時，哪些資料必須一起更新？'],
      examples: [{ source: 'book', text: '書中用履歷地區說明：儲存 region_id 並連到地區表，能統一拼字，也能在地區改名或翻譯時集中修改。' }],
    },
  },
} as const satisfies TopicText<'T0'>
