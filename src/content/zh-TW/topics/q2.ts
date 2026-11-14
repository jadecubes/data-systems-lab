import type { TopicText } from '../../types'

export const q2 = {
  title: '用雲端還是自己架？要不要拆微服務？',
  summary: '雲端與微服務都是拿錢或複雜度換別的東西；先看團隊會不會營運、負載穩不穩、有幾個團隊要協調。',
  tags: ['雲端服務', '自行託管', '廠商鎖定', '微服務', '無伺服器'],
  sections: {
    'ch1-pros-and-cons-of-cloud-services': {
      conclusion: '團隊已會營運、負載又可預測時，自行託管（self-hosting）通常較便宜；不會營運，或負載大起大落時，雲端服務（cloud services）較划算，因為閒置的資源可以還給供應商。代價是失去掌控。',
      tradeoff: '雲端省去營運、能隨負載擴縮；但缺功能只能請廠商加，服務掛了只能等，看不到內部日誌而難以診斷，沒有相容的 API 時也換不掉，形成廠商鎖定（vendor lock-in）。',
      questions: ['我們的負載是穩定的，還是尖峰比平時高很多？', '這個託管服務掛了或漲價時，我們能做什麼？', '要換掉這個服務時，有 API 相容的替代品嗎？還是會被廠商鎖定（vendor lock-in）？'],
      examples: [{ source: 'book', text: '書中以分析系統（analytical system）為例：大查詢要快就需要大量平行運算，查完資源就閒著；資料量大時，把閒置資源還給雲端供應商就能省錢。' }],
    },
    'ch1-microservices-and-serverless': {
      conclusion: '微服務（microservices）主要是用技術解決團隊協調的問題：每個服務由一個團隊負責、有自己的資料庫，可以獨立部署。這在大公司有價值；團隊少的公司多半是多餘的負擔。無伺服器（serverless）把開關機器交給雲端供應商，只為程式實際執行的時間付費。',
      tradeoff: '微服務讓團隊各自前進，代價是測一個服務得跑起它依賴的所有服務、每個服務都要部署與監控，而且 API 難以演進。無伺服器省去管機器，但函式有執行時間上限，第一次呼叫也可能很慢。',
      questions: ['要拆成微服務（microservices），是因為團隊之間互相卡住，還是為了預期中的規模？', '這次 API 改動會刪欄位或改欄位意義嗎？舊版用戶端還在呼叫時會不會壞？', '這段工作適合無伺服器（serverless）嗎？會不會碰到執行時間上限，或第一次呼叫太慢？'],
      examples: [
        { source: 'book', text: '書中說，用戶端預期某些欄位存在，服務增刪欄位就可能讓用戶端出錯，而這類錯誤常要部署到預備環境（staging）或正式環境才被發現。' },
        { source: 'book', text: '書中解釋為何每個服務有自己的資料庫：共用資料庫等於把整個資料庫結構變成 API 的一部分，之後很難改，一個服務的查詢也可能拖慢其他服務。' },
      ],
    },
  },
} as const satisfies TopicText<'Q2'>
