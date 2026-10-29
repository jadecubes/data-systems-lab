import type { TopicText } from '../../types'

export const t10 = {
  title: '讓資料與程式能逐步改變',
  summary: '變更結構時，舊紀錄和舊程式仍在；用分階段遷移與可重建的衍生資料降低切換風險。',
  tags: ['可演進性', '結構遷移', '新舊資料', '重建'],
  sections: {
    'ch2-evolvability-making-change-easy': {
      conclusion: '可演進性（evolvability）指需求改變時系統能輕易修改；簡單、鬆耦合的系統比複雜、緊耦合的好改。讓大型系統難改的一大原因是不可逆（irreversibility）：做了就回不去的步驟要特別小心，盡量保留退路。',
      tradeoff: '保留退路（新舊系統並行、能切回）要多花成本；一次切換省工，但新系統出問題時回不去。',
      questions: ['這次遷移出問題時，能切回舊系統嗎？', '哪一步做了就回不去？'],
      examples: [{ source: 'book', text: '書中以資料庫搬遷為例：若新系統出了問題卻無法切回舊資料庫，風險比保留退路高得多。' }],
    },
    'ch5-different-values-written-at-different-times': {
      conclusion: '新舊資料（old and new data）會長期共存：新版程式幾分鐘就能換上，資料庫裡多年前寫的值，沒重寫過就仍是當年的格式。簡單的變更可以不重寫舊資料；把單值改成多值、把資料搬到另一張表這類變更，仍得在應用層重寫，而且過程中很難維持相容。',
      tradeoff: '不重寫舊資料省下大量搬移成本，代價是資料庫長期混著各時期的格式，程式要一直讀得懂舊格式。',
      questions: ['舊紀錄沒有新欄位時畫面顯示什麼？', '舊資料要不要重寫成新格式？不重寫的話，計算結果會不會因新舊紀錄而不同？'],
      examples: [{ source: 'book', text: '書中的例子：同一個資料庫裡可能同時有 5 毫秒前和 5 年前寫入的值。多數關聯式資料庫新增一個預設為空值的欄位時不重寫舊列，讀到舊列時才補上空值。' }],
    },
    'ch13-batch-and-stream-processing': {
      conclusion: '批次處理（batch processing）能重新處理累積的歷史資料，所以結構遷移（schema migration）不必一次切換：從同一份來源資料重建（rebuild）新舊兩個視圖並存，先讓少數使用者用新視圖，再逐步擴大，最後丟掉舊視圖；每一步都能退回。',
      tradeoff: '並存期間要維護兩套視圖，多花算力與儲存；換來每一步都能退回，不會一次造成無法挽回的損害。',
      questions: ['衍生資料（derived data）能從哪個來源完整重建（rebuild）？', '能不能先讓少數使用者用新版？出問題時怎麼退回？'],
      examples: [{ source: 'book', text: '書中用鐵路打比方：英國在 1846 年定下標準軌距後，先在舊線上加第三條軌，讓兩種軌距的火車都能跑；等所有火車都改完，再拆掉多餘的軌。' }],
    },
  },
} as const satisfies TopicText<'T10'>
