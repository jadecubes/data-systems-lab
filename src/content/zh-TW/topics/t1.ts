import type { TopicText } from '../../types'

export const t1 = {
  title: '把可靠性寫成需求',
  summary: '功能會說系統做什麼；可靠性要說故障時哪些結果仍可接受，以及如何知道服務是否達標。',
  tags: ['非功能性需求', '可靠性', '漸進推出', '資料遺失'],
  sections: {
    'ch2-intro-functional-and-nonfunctional-requirements': {
      title: '功能與非功能性需求',
      conclusion: '非功能性需求（nonfunctional requirements）描述可靠性（reliability）、效能等品質。只說「系統要可靠」無法驗收；要界定可容忍的停機、錯誤與資料遺失（data loss），並說明怎麼量測。',
      tradeoff: '訂得越嚴，備援、測試和營運成本通常越高；先寫清楚可接受的失敗範圍，才能取捨。',
      questions: ['失敗時，哪些資料絕對不能遺失？', '服務中斷多久，使用者仍可接受？'],
      examples: [{ source: 'book', text: '書中區分功能性需求與非功能性需求：前者像是儲存資料並供查詢，後者關心故障後是否仍能正確提供這些功能。' }],
    },
    'ch2-humans-and-reliability': {
      conclusion: '人會犯錯；操作、設定變更和軟體部署都可能讓服務中斷。可靠性（reliability）設計應讓錯誤容易被發現和復原，例如先測試、漸進推出（staged rollout）、監測結果並提供回滾。',
      tradeoff: '漸進推出增加發布步驟與時間，卻縮小一次錯誤影響的範圍。',
      questions: ['設定錯誤會在影響所有人之前被發現嗎？', '發布後能快速回到上一個可用版本嗎？'],
      examples: [{ source: 'book', text: '書中指出，人為操作或設定錯誤是常見的系統故障原因；即使每個人都很謹慎，也需要讓系統容許犯錯。' }],
    },
    'ch2-how-important-is-reliability': {
      conclusion: '可靠性（reliability）不只影響大型網站。資料錯誤或資料遺失（data loss）可能造成金錢損失，甚至讓無辜的人承擔後果；因此不能只用平均可用率評估風險。',
      tradeoff: '更高的可靠性需要資源，但省下保護措施也可能把代價轉嫁給使用者。',
      questions: ['資料錯誤會讓誰承擔後果？', '如果紀錄丟失或算錯，有辦法查核與更正嗎？'],
      examples: [{ source: 'book', text: '書中提到英國郵局 Horizon 系統的錯誤紀錄：軟體產生的不正確財務數字，傷害了被要求為短缺負責的人。' }],
    },
  },
} as const satisfies TopicText<'T1'>
