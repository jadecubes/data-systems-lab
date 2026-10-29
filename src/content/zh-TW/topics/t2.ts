import type { TopicText } from '../../types'

export const t2 = {
  title: '別讓平均值藏住慢請求',
  summary: '看中位數理解一般體驗，再用尾端百分位數看最慢的一群，並把目標寫成可量測的服務水準。',
  tags: ['中位數', '百分位數', '尾端延遲', '服務水準目標'],
  sections: {
    'ch2-average-median-and-percentiles': {
      conclusion: '平均回應時間會被少數極慢請求拉高，也會掩蓋多數人與少數人的差別。中位數（median）代表一半請求比它快；百分位數（percentile）如 p99 可顯示尾端延遲（tail latency）。',
      tradeoff: '單一指標容易報告，卻看不到分布；多個百分位數更有用，也需要足夠樣本與正確統計窗口。',
      questions: ['使用者最慢的 1% 請求要等多久？', '這個數字是所有使用者混在一起，還是依請求類型拆開？'],
      examples: [{ source: 'book', text: '書中以 Amazon 為例：最慢請求往往來自購買量大的使用者，尾端延遲影響的人數雖少，商業影響卻不小。' }],
    },
    'ch2-use-of-response-time-metrics': {
      conclusion: '服務水準目標（service level objective）應寫出可驗證的界線，例如中位數（median）與百分位數（percentile）如 p99 的回應時間，還有成功率。頁面要等待多個後端呼叫時，碰到尾端延遲（tail latency）的機會也會增加。',
      tradeoff: '平行呼叫多個後端容易組裝頁面，但整頁常要等最慢的呼叫；只看單一後端的 p99，可能低估頁面延遲。',
      questions: ['頁面載入要等幾個後端呼叫？各自的 p99 是多少？', '服務水準目標沒達到時會怎麼處理？'],
      examples: [
        { source: 'book', text: '書中示範用「中位數低於 200 毫秒、p99 低於 1 秒、至少 99.9% 的有效請求得到非錯誤回應」描述目標，讓團隊能實際量測。' },
        { source: 'ours', text: '假設每個後端呼叫各自有 1% 的機率變慢，且彼此獨立：一頁平行等待 100 個呼叫，至少碰到一個慢呼叫的機率是 1 − 0.99¹⁰⁰，約 63%。' },
      ],
    },
  },
} as const satisfies TopicText<'T2'>
