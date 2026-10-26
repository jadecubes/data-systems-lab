import type { TopicText } from '../../types'

export const t3 = {
  title: '逾時：不知道到底成功沒有',
  summary: '請求逾時的時候，伺服器可能已經做完，也可能根本沒收到。畫面怎麼說、要不要重送，都要從這個不確定出發。',
  tags: ['逾時', '不可靠的網路', '重試', '冪等'],
  sections: {
    'ch1-problems-with-distributed-systems': {
      conclusion:
        '跨網路的請求隨時可能逾時（timeout），而送出的一方不知道對方到底收到沒有。每個服務各有資料庫時，跨服務的一致性要由應用程式自己處理。能在一台機器上完成的工作，通常比分散式系統簡單、便宜得多。',
      tradeoff: '分散式系統換來擴展與容錯，代價是逾時帶來的不確定、更難除錯，以及跨服務的一致性要自己處理。',
      questions: ['這個請求逾時後，後端可能已經寫入了嗎？', '使用者再按一次，會不會重複建立或重複扣款？'],
      examples: [
        {
          source: 'ours',
          text: '使用者在訊號不穩時按下「送出訂單」，畫面轉圈後逾時。訂單可能已經成立，也可能伺服器根本沒收到；畫面若直接說「送出失敗」，使用者再按一次，就可能下了兩張訂單。',
        },
      ],
    },
    'ch5-the-problems-with-remote-procedure-calls': {
      conclusion:
        '網路請求和程式裡的函式呼叫本質不同：請求或回應可能遺失，延遲忽快忽慢。逾時（timeout）時無法得知請求是否已經送達；這時重試（retry），動作可能執行兩次，除非把它設計成冪等（idempotent），也就是做幾次結果都一樣。',
      tradeoff: '自動重試提高成功率，代價是沒有冪等時會重複執行。',
      questions: ['這個寫入請求逾時後重送，會不會建立兩筆？', '有沒有唯一的請求 ID（request ID），讓後端認出這是重送？'],
      examples: [
        {
          source: 'ours',
          text: '「送出訂單」逾時後，程式自動重送。如果第一次其實已經成功，只是回應在路上遺失，就會多出第二張訂單，使用者被扣兩次款。',
        },
      ],
      diagram: {
        lanes: ['browser', 'server', 'database'],
        caption:
          '第一次其實成功了，只是回應遺失；程式不知道，自動重送，後端就再建立一張。對網頁伺服器來說，重送只是另一個新請求；沒有請求 ID，它認不出這是重送。',
        steps: [
          { from: 'browser', to: 'server', text: '送出訂單' },
          { from: 'server', to: 'database', text: '建立訂單\u00a0#1，提交' },
          { from: 'server', to: 'browser', fate: 'lost', text: '「訂單已成立」的回應在路上遺失' },
          { at: 'browser', text: '逾時。程式自動重送' },
          { from: 'browser', to: 'server', text: '再送一次同樣的訂單' },
          { from: 'server', to: 'database', text: '建立訂單\u00a0#2，提交' },
          { from: 'server', to: 'browser', text: '回傳「訂單已成立」：使用者以為只有一張，其實有兩張，被扣兩次款' },
        ],
      },
    },
    'ch9-unreliable-networks': {
      conclusion:
        '送出請求卻沒收到回應，可能是請求遺失、還在排隊、對方當機或暫停，也可能對方已經處理完，只是回應遺失或延遲。從送出的一方看，這些情況一模一樣。逾時（timeout）只代表「還沒收到回應」。',
      tradeoff: '逾時讓使用者不必無限等待，代價是要面對「可能已經成功」的不確定狀態。',
      questions: ['逾時後，使用者要怎麼確認這筆是否已經寫入？', '使用者重送的話，會不會重複？'],
      examples: [
        {
          source: 'book',
          text: '書中列出六種收不到回應的原因，其中兩種是遠端已經處理了請求，只是回應在網路上遺失或被延遲；在送出的一方看來，和請求遺失沒有分別。',
        },
        {
          source: 'ours',
          text: '逾時時，畫面不該說「送出失敗」，而該說「無法確認訂單是否成立，請到訂單列表查看」。請求遺失和回應遺失從瀏覽器看起來一樣：前者說「失敗」是真話，後者卻是假話。但請求若還在路上，列表此刻可能還看不到這筆；真正擋住重複下單的，是「安全重試」主題講的請求 ID（request ID）。',
        },
      ],
      diagram: {
        lanes: ['browser', 'server', 'database'],
        caption:
          '兩種情況，瀏覽器看到的一模一樣：轉圈，然後逾時。差別只在伺服器那端：第一種沒有訂單，第二種訂單已經成立。所以逾時時，畫面不能說「送出失敗」。',
        steps: [
          { from: 'browser', to: 'server', fate: 'lost', text: '情況一：送出訂單，請求在路上遺失' },
          { at: 'database', text: '沒有訂單' },
          { at: 'browser', text: '逾時，畫面轉圈後停住' },
          { from: 'browser', to: 'server', text: '情況二：送出訂單' },
          { from: 'server', to: 'database', text: '建立訂單\u00a0#1，提交' },
          { from: 'server', to: 'browser', fate: 'lost', text: '「訂單已成立」的回應在路上遺失' },
          { at: 'browser', text: '逾時，畫面同樣轉圈後停住' },
        ],
      },
    },
  },
} as const satisfies TopicText<'T3'>
