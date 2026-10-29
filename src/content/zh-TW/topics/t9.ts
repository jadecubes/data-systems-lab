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
      questions: ['部署期間舊節點會讀到新節點寫的資料嗎？', '若回滾（rollback），舊版仍能處理新版留下的資料嗎？'],
      examples: [{ source: 'book', text: '書中的例子：新版程式在紀錄裡加了一個欄位；舊版程式讀出這筆紀錄、改了別的欄位再寫回，如果它只保留自己認識的欄位，新欄位就不見了。' }],
    },
    'ch5-data-encoding-and-evolution-for-rpc': {
      conclusion: '遠端程序呼叫（RPC）的伺服器通常先升級、用戶端後升級，因此請求要向後相容（backward compatibility），回應要向前相容（forward compatibility）。新增選填請求欄位或回應中的未知欄位（unknown fields）通常可行，前提是舊用戶端能忽略額外欄位。',
      tradeoff: '外部用戶端可能一直不升級；要做破壞性變更，就得並行維護多個 API 版本，而且可能維護很久，甚至無限期。',
      questions: ['這次 API 變更只新增選填欄位，還是會破壞舊用戶端？', '若需並存多版 API，各版本要支援到什麼時候？'],
      examples: [{ source: 'book', text: '書中提到，API 要並存多個版本時，RESTful API 常把版本號放在網址裡，或用 HTTP 的 Accept 標頭指定；以 API 金鑰識別用戶端的服務，也可以在伺服器端記住每個用戶端要用的版本。' }],
    },
  },
} as const satisfies TopicText<'T9'>
