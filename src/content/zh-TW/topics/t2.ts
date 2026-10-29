import type { TopicText } from '../../types'

export const t2 = {
  title: '用百分位數看見慢請求',
  summary: '看中位數理解一般體驗，再用尾端百分位數看最慢的一群，並把目標寫成可量測的服務水準。',
  tags: ['中位數', '百分位數', '尾端延遲', '服務水準目標'],
  sections: {
    'ch2-average-median-and-percentiles': {
      conclusion: '平均回應時間不代表典型體驗，因為它不告訴你有多少人真的等了那麼久。中位數（median）表示一半請求比它快；百分位數（percentile）看較慢的那群：p99 是 1 秒，表示 100 個請求有 99 個在 1 秒內回來。高百分位數又叫尾端延遲（tail latency）。',
      tradeoff: '要求的百分位數越高，越照顧最慢的使用者，成本也越高；Amazon 認為最佳化到 p9999 太貴、效益遞減。',
      questions: ['使用者最慢的 1% 請求要等多久？', '這個數字是所有使用者混在一起，還是依請求類型拆開？'],
      examples: [{ source: 'book', text: '書中以 Amazon 為例：最慢請求往往來自購買量大的使用者，尾端延遲影響的人數雖少，商業影響卻不小。' }],
    },
    'ch2-use-of-response-time-metrics': {
      conclusion: '服務水準目標（service level objective）用中位數（median）、百分位數（percentile）與成功率訂出可量測的界線。頁面要等的後端呼叫越多，越可能碰到慢的那個，這叫尾端延遲放大（tail latency amplification）。',
      tradeoff: '一頁平行呼叫很多後端較好開發，但整頁速度由最慢的呼叫決定；只看單一後端的 p99 會低估頁面延遲。',
      questions: ['頁面載入要等幾個後端呼叫？各自的 p99 是多少？', '服務水準目標（service level objective）沒達到時會怎麼處理？'],
      examples: [
        { source: 'book', text: '書中的服務水準目標範例：中位數低於 200 毫秒、p99 低於 1 秒，且至少 99.9% 的有效請求得到非錯誤回應。' },
        { source: 'ours', text: '假設每個後端呼叫各自有 1% 的機率變慢，且彼此獨立：一頁平行等待 100 個呼叫，至少碰到一個慢呼叫的機率是 1 − 0.99¹⁰⁰，約 63%。' },
      ],
    },
  },
} as const satisfies TopicText<'T2'>
