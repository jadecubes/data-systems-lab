import type { TopicText } from '../../types'

export const t9 = {
  title: '新舊版本要能共存',
  summary: '部署不是同一瞬間完成；新程式、舊程式和不同時期寫入的資料，會在一段時間內互相讀寫。',
  tags: ['向後相容', '向前相容', '滾動升級', '未知欄位'],
  sections: {
    'ch5-intro-why-versions-coexist': {
      title: '為何新舊版本同時存在',
      conclusion: '滾動升級（rolling upgrade）會讓新舊節點共存。向後相容（backward compatibility）讓新程式讀舊資料；向前相容（forward compatibility）讓舊程式讀新資料。兩個方向都要考慮，因為資料不會跟著部署同時換版。',
      tradeoff: '允許版本共存能避免停機部署，但限制一次改掉所有欄位或訊息格式的自由。',
      questions: ['部署期間舊節點會讀到新節點寫的資料嗎？', '若回滾，舊版仍能處理新版留下的資料嗎？'],
      examples: [{ source: 'book', text: '書中提醒：舊程式讀到含有新欄位的紀錄，若重新編碼時只寫自己認識的欄位，就可能抹除新資料。' }],
    },
    'ch5-data-encoding-and-evolution-for-rpc': {
      conclusion: '遠端程序呼叫（RPC）的伺服器通常先升級、用戶端後升級，因此請求要向後相容（backward compatibility），回應要向前相容（forward compatibility）。新增選填請求欄位或回應中的未知欄位（unknown fields）通常可行，前提是舊用戶端能忽略額外欄位。',
      tradeoff: '維持相容讓用戶端不必同步更新；外部用戶端可能長期不升級，破壞性變更就需要並存多個 API 版本。',
      questions: ['這次 API 變更只新增選填欄位，還是會破壞舊用戶端？', '若需並存多版 API，各版本要支援到什麼時候？'],
      examples: [{ source: 'book', text: '書中以 RPC 的升級順序說明：伺服器先接受新增的選填請求參數，並在回應加上欄位；舊用戶端若能忽略額外回應欄位，就能繼續使用。' }],
    },
  },
} as const satisfies TopicText<'T9'>
