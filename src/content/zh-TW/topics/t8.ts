import type { TopicText } from '../../types'

export const t8 = {
  title: '分清晚到與算錯',
  summary: '延遲呈現結果和產生錯誤結果是不同風險。先界定使用者能等多久，以及哪些事絕不能錯。',
  tags: ['及時性', '完整性', '同步協調', '補償'],
  sections: {
    'ch13-timeliness-and-integrity': {
      conclusion: '及時性（timeliness）指變更何時可見；完整性（integrity）指資料沒有損壞、遺失或違反約束。信用卡帳單晚到一天通常是及時性問題；扣了款卻沒付給商家則是完整性問題。',
      tradeoff: '非同步處理改善可用性與速度，但會讓結果晚些出現；不能讓晚到掩蓋錯誤或遺失。',
      questions: ['使用者可以等多久才看到結果？', '若結果晚到，怎麼確認資料最後仍正確？'],
      examples: [{ source: 'book', text: '書中對比信用卡帳單晚一天送達，與持卡人被扣款卻沒有把錢付給商家：前者是延遲，後者破壞了帳務正確性。' }],
    },
    'ch13-how-to-choose': {
      title: '何時要協調，何時可補償',
      conclusion: '完整性（integrity）若要求「絕不能同時成立」，可用資料庫約束或同步協調（synchronous coordination）阻止衝突；防止重複執行也要讓請求 ID（request ID）一路傳到資料庫。若錯誤可以事後修正，則可先接受請求，再用補償（compensation）處理例外。',
      tradeoff: '同步協調讓衝突在當下被拒絕，代價是延遲和故障時可用性；補償讓流程先走下去，代價是使用者可能暫時看見未定案的結果。',
      questions: ['這項操作是否真的需要立即且不可逆的唯一結果？', '若稍後發現衝突，退款或重新安排能否接受？'],
      examples: [{ source: 'book', text: '書中以重複請求為例：用戶端先產生請求 ID（request ID），重送時沿用；資料庫以唯一約束（uniqueness constraint）拒絕第二次執行。' }],
    },
  },
} as const satisfies TopicText<'T8'>
