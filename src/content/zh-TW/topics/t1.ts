import type { TopicText } from '../../types'

export const t1 = {
  title: '把可靠性寫成需求',
  summary: '功能會說系統做什麼；可靠性要說故障時哪些結果仍可接受，以及如何知道服務是否達標。',
  tags: ['非功能性需求', '可靠性', '漸進推出', '資料遺失'],
  sections: {
    'ch2-intro-functional-and-nonfunctional-requirements': {
      title: '功能性與非功能性需求',
      conclusion: '非功能性需求（nonfunctional requirements）和功能一樣重要：慢到受不了或不可靠的 App 等於沒用。只寫「系統要可靠」無法驗收；要寫出可容忍的停機與資料遺失（data loss），以及怎麼量測。',
      tradeoff: '訂得越嚴，備援、測試和營運成本通常越高；先寫清楚可接受的失敗範圍，才能取捨。',
      questions: ['失敗時，哪些資料絕對不能遺失？', '服務中斷多久，使用者仍可接受？'],
      examples: [{ source: 'book', text: '書中說，功能性需求（functional requirements）是要有哪些畫面和按鈕、每個操作做什麼；快、可靠、安全、合規、好維護這些需求，常因看起來理所當然而沒人寫下。' }],
    },
    'ch2-humans-and-reliability': {
      conclusion: '人為錯誤不是事故的原因，而是整個系統與組織出了問題的症狀，責怪個人沒有用。可靠性（reliability）要靠徹底測試、漸進推出（staged rollout）、能快速回滾（rollback）的設定變更和清楚的監控，降低錯誤的影響。',
      tradeoff: '測試與韌性要花時間和錢，組織常先做功能；可預防的錯誤發生時，問題多半在優先順序，不在犯錯的人。',
      questions: ['設定錯誤會在影響所有人之前被發現嗎？', '發布後能快速回到上一個可用版本嗎？'],
      examples: [{ source: 'book', text: '書中引用一項大型網路服務的研究：營運人員的設定變更是服務中斷的首要原因，硬體故障只在 10%–25% 的案例中有份。' }],
    },
    'ch2-how-important-is-reliability': {
      conclusion: '可靠性（reliability）不只是核電廠或航管的事，一般商業應用也要可靠。許多應用能容忍短暫中斷，但資料永久遺失（data loss）或數字算錯是災難，甚至會讓無辜的人受罰。',
      tradeoff: '為了降低開發成本可以犧牲一些可靠性，例如替還沒驗證的市場做原型；但要清楚知道哪裡偷工、後果可能多嚴重。',
      questions: ['資料錯誤會讓誰承擔後果？', '如果紀錄遺失或算錯，有辦法查核與更正嗎？'],
      examples: [{ source: 'book', text: '書中提到英國郵局 Horizon 醜聞：1999 到 2019 年間，數百名郵局分局經營者因會計軟體顯示帳目短缺，被判竊盜或詐欺；許多短缺其實是軟體 bug 造成的。' }],
    },
  },
} as const satisfies TopicText<'T1'>
