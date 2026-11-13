import type { TopicText } from '../../types'

export const q11 = {
  title: '什麼時候需要強一致？',
  summary: '讓系統像只有一份資料，開發較省心，但平時就比較慢，網路斷開時部分使用者會無法寫入；先問業務是否真的需要。',
  tags: ['線性一致性', '強一致性', '最終一致性', '網路分區', '協調服務'],
  sections: {
    'ch10-intro-two-philosophies': {
      title: '兩種處理副本不一致的做法',
      conclusion:
        '多份副本可能讓讀取拿到舊值。一種做法是最終一致性（eventual consistency）：讓應用程式知道有多份副本，由開發者處理不一致與衝突；另一種是強一致性（strong consistency）：系統表現得像只有一個節點，開發者輕鬆，代價是效能，而且某些故障下會停擺。',
      tradeoff: '強一致讓開發簡單，但較慢，某些故障時無法服務；最終一致的可用性（availability）高，但應用程式要自己處理衝突。',
      questions: ['使用者能接受看到幾秒前的舊值嗎？', '使用者需要在離線時修改資料嗎？'],
      examples: [
        {
          source: 'book',
          text: '書中說，允許離線修改的應用只能最終一致；副本都在通訊快速可靠的資料中心裡時，強一致的成本通常可以接受。',
        },
      ],
    },
    'ch10-the-cost-of-linearizability': {
      conclusion:
        '線性一致性（linearizability）讓系統看起來只有一份資料。代價有二：發生網路分區（network partition）時，連不到領導者（leader）的那一邊不能寫，也不能做線性一致的讀取；而且即使網路正常，讀寫也比較慢，因為回應時間至少與網路延遲的不確定程度成正比。',
      tradeoff:
        '網路分區時，只能在一致（停擺）與可用（讀到舊值或產生衝突）之間二選一；沒有分區時，則在延遲與一致之間取捨。「一致、可用、分區容忍三選二」的說法有誤導性：分區是故障，不是可以選的。',
      questions: [
        '兩個地區之間斷線時，連不到領導者（leader）那一邊的使用者還能做什麼？',
        '這個操作慢一點、換來一定讀到最新值，值得嗎？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中的例子：單一領導者的資料庫跨兩個地區部署，地區之間斷線；只連得到追隨者（follower）那一區的用戶端不能寫，只能讀可能過期的資料，需要線性一致的功能就停擺，直到網路修好。',
        },
      ],
    },
    'ch10-coordination-services': {
      conclusion:
        '鎖、選出領導者（leader）、把分片（shard）指派給節點，這類「只能有一個」的決定需要共識（consensus）；不要自己實作，交給跑在 3 或 5 個節點上的協調服務（coordination service）。它只存少量、變化很慢的資料，例如哪個節點是某個分片的領導者，不適合存每秒變動上千次的資料。',
      tradeoff: '把共識外包，省掉自己實作的風險；但協調服務的可用性（availability），會影響所有依賴它的系統。',
      questions: [
        '這份資料多久變一次？適合放協調服務（coordination service），還是一般資料庫？',
        '協調服務（coordination service）停擺時，哪些功能會跟著停？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中的例子：有數千個分片的儲存系統，與其在數千個節點上跑共識，不如把共識外包給固定的少數幾個節點；Kubernetes 就依賴 etcd 做這件事。',
        },
      ],
    },
    'ch10-how-to-choose': {
      title: '何時值得付線性一致的代價',
      conclusion:
        '寫入當下就得保證不重複、餘額不為負或不超賣時，才需要線性一致性（linearizability）；能事後補償（compensation），或不需要最新值，就用多主（multi-leader）或無主（leaderless）複製，換取可用性（availability）與速度。鎖、租約（lease）與選出領導者（leader），交給協調服務（coordination service）。',
      tradeoff: '線性一致換到正確性，代價是網路分區（network partition）時停擺，平時延遲也較高。',
      questions: [
        '這個規則若在寫入當下被違反（重複、超賣），事後再補救、補償（compensation）可以接受嗎？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中提到，航班超賣時可以安排旅客改搭別班並給予補償，這時可能不需要線性一致性；但同一個座位不能被兩人訂走、帳戶餘額不能為負這類硬性規則就需要。',
        },
      ],
    },
  },
} as const satisfies TopicText<'Q11'>
