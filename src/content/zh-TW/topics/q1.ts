import type { TopicText } from '../../types'

export const q1 = {
  title: '營運資料和分析資料為何要分開？',
  summary: '使用者操作的資料庫和分析師查詢的資料服務不同的人；分開能讓報表不拖慢產品，代價是報表上的數字會晚一些。',
  tags: ['營運系統', '分析系統', '資料倉儲', '資料孤島'],
  sections: {
    'ch1-operational-versus-analytical-systems': {
      conclusion: '資料在營運系統（operational system）產生：應用程式依使用者的動作讀寫自己的資料庫。分析系統（analytical system）服務商業分析師與資料科學家，只存營運資料的唯讀副本，並為分析查詢最佳化。',
      tradeoff: '分成兩套系統讓分析不拖慢使用者的操作，代價是多一條把資料從營運系統搬到分析系統的管線，以及維護它的資料工程師。',
      questions: ['這個需求的使用者是終端使用者，還是內部分析師？', '這份資料該從營運系統（operational system）讀，還是從分析系統（analytical system）的副本讀？'],
      examples: [{ source: 'book', text: '書中把用資料的人分成三類：後端工程師的服務依使用者動作讀寫營運資料庫；商業分析師做報表幫管理層決策；資料科學家找新洞見，或做推薦這類功能。後兩類人看資料，但通常不修改它。' }],
    },
    'ch1-data-warehousing': {
      conclusion: '分析師不直接查營運資料庫，而是用擷取、轉換、載入（ETL）把各營運系統（operational system）的資料匯入資料倉儲（data warehouse），打破資料孤島（data silos），讓一個查詢就能合併它們。混合式交易／分析處理（HTAP）系統同時做交易與分析，仍取代不了倉儲：營運資料庫可能有數百個，倉儲通常只有一個。',
      tradeoff: '倉儲讓分析查詢不影響營運、能跨系統合併資料，代價是要建置與維護擷取、轉換、載入的流程，而且倉儲裡的數字比營運系統晚。',
      questions: ['報表資料多久從營運資料庫同步到資料倉儲（data warehouse）一次？', '使用者在報表上看到的數字，最舊可能是多久以前的？'],
      examples: [{ source: 'book', text: '書中列出不讓分析師直接查營運資料庫的四個理由：資料散在數十到數百個系統、難以合併；適合交易的資料布局不適合分析；分析查詢很貴，會拖慢其他使用者；營運系統可能因安全或合規，放在分析師連不到的獨立網路裡。' }],
    },
  },
} as const satisfies TopicText<'Q1'>
