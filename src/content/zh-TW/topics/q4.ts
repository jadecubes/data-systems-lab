import type { TopicText } from '../../types'

export const q4 = {
  title: '壞掉時撐得住、出事時好處理嗎？',
  summary: '容錯只涵蓋事先選定的幾種故障，要演練才知道有效；自動化越多，出事時越需要人看得懂、接得了手。',
  tags: ['容錯', '單點故障', '故障注入', '可營運性', '可觀測性'],
  sections: {
    'ch2-fault-tolerance': {
      conclusion: '容錯（fault tolerance）是某些故障發生時，系統仍持續提供服務；一壞就讓整個系統停擺的部分，叫單點故障（single point of failure）。容錯永遠只針對一定數量的某些故障，例如三個節點最多壞一個。刻意做故障注入（fault injection），例如隨機關掉行程（process），容錯機制才會一直被演練到。',
      tradeoff: '容忍的故障種類與數量越多越可靠，成本也越高；容忍任意故障是不可能的。資料外洩這類無法補救的故障，預防比容忍好。',
      questions: ['我們的設計要容忍哪些故障？最多幾個同時發生？', '單點故障（single point of failure）在哪裡？', '有沒有實際關掉機器演練過？接手時會不會漏掉或重複處理？'],
      examples: [{ source: 'book', text: '書中的例子：負責更新時間軸的機器在投遞途中當機，另一台要接手，而且既不漏掉、也不重複投遞貼文，也就是恰好一次（exactly-once）。' }],
    },
    'ch2-operability-making-life-easy-for-operations': {
      conclusion: '好的可營運性（operability）讓例行工作簡單、系統行為可預測，營運團隊才能專注在高價值的事。自動化是兩面刃：自動化處理不了的，往往是最複雜的情況，所以自動化越多，營運人員需要的技能越高。',
      tradeoff: '自動化減少手動工作，但出錯的自動化常比手動操作更難排查。系統要提供監控與可觀測性（observability）、清楚的「做 X 會發生 Y」說明，並讓人能覆寫預設、手動接管。',
      questions: ['出問題時，營運人員看得到什麼？能手動介入嗎？', '哪些情況是自動化處理不了、一定要有人來的？', '一台機器下線維護時，服務會中斷嗎？'],
      examples: [{ source: 'book', text: '書中列出資料系統能怎麼幫營運：監控關鍵指標並支援可觀測性工具；不依賴個別機器，機器能下線維護；有好文件和「做 X 會發生 Y」的營運模型；有好的預設、也能覆寫；能自我修復，也讓管理員能手動控制。' }],
    },
  },
} as const satisfies TopicText<'Q4'>
