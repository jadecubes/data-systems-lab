import type { TopicText } from '../../types'

export const t10 = {
  title: '讓資料與程式能逐步改變',
  summary: '變更結構時，舊紀錄和舊程式仍在；用分階段遷移與可重建的衍生資料降低切換風險。',
  tags: ['可演進性', '結構遷移', '新舊資料', '重建'],
  sections: {
    'ch2-evolvability-making-change-easy': {
      conclusion: '可演進性（evolvability）是需求變更時能安全修改系統的能力。好的界面和資料格式讓變更能分步推出；結構遷移（schema migration）應有驗證與回滾路徑。',
      tradeoff: '預留演進空間會增加當下設計成本，但降低日後一次性大改帶來的停機和錯誤。',
      questions: ['新增欄位後，舊版程式還能讀寫嗎？', '每一步能否獨立部署與回滾？'],
      examples: [{ source: 'book', text: '書中以資料庫搬遷為例：若新系統出了問題卻無法切回舊資料庫，風險比保留回退路徑高得多。' }],
    },
    'ch5-different-values-written-at-different-times': {
      conclusion: '同一資料庫會長期保存不同時期寫入的值；新舊資料（old and new data）共存是常態。新增可空欄位通常無須立刻重寫全部舊紀錄，但讀取端必須處理缺值，直到回填完成。',
      tradeoff: '延後回填減少一次性負載，代價是過渡期需要同時理解兩種紀錄形狀。',
      questions: ['舊紀錄沒有新欄位時畫面顯示什麼？', '回填被中斷後能安全繼續嗎？'],
      examples: [{ source: 'book', text: '書中指出，資料庫加上新欄位後，舊資料不一定立刻改寫；讀取時可依預設值或空值理解，之後再逐步回填。' }],
    },
    'ch13-batch-and-stream-processing': {
      conclusion: '批次和串流可以從相同來源建立新的衍生視圖。若來源資料仍在，就能重建（rebuild）新索引或報表，讓結構遷移（schema migration）先在旁邊驗證，再切換讀取。',
      tradeoff: '雙軌維護與重建需要額外算力、儲存及比對，但讓切換可測量、可回退。',
      questions: ['衍生資料能從哪個來源完整重建？', '新舊視圖的結果如何比對後再切換？'],
      examples: [{ source: 'book', text: '書中討論從同一事件來源同時建立舊視圖和新視圖，等新視圖追上並核對結果，再逐步把讀取轉過去。' }],
    },
  },
} as const satisfies TopicText<'T10'>
