import type { TopicText } from '../../types'

export const q7 = {
  title: '有了副本，資料就不會丟嗎？',
  summary: '複製讓系統撐過節點甚至整個地區的故障，卻會把誤刪一起複製，也可能丟掉已確認的寫入；要知道哪些故障靠副本、哪些只能靠備份。',
  tags: ['備份', '非同步複製', '故障轉移', '多主複製', '持久性'],
  sections: {
    'ch6-intro-replication-and-backups': {
      title: '複製與備份',
      conclusion: '複製（replication）把同一份資料存在多台機器上，帶來可用性（availability）、持久性（durability）和讀取擴展。但副本會很快反映每筆寫入，誤刪也會一起傳到所有副本；只有存著舊快照的備份（backup）能回到過去。',
      tradeoff: '副本讓系統不停機，卻不能回到過去；備份可以，代價是儲存成本與還原時間。',
      questions: [
        '使用者或程式誤刪資料後，最多能從備份（backup）還原到多久以前？',
        '從備份（backup）還原要多久？這段時間使用者會看到什麼？',
      ],
      examples: [{ source: 'book', text: '書中提醒：有複製仍要備份，因為副本很快就會反映其他節點的寫入，包括誤刪。兩者也互補，例如建立新的副本常從備份開始。' }],
    },
    'ch6-synchronous-versus-asynchronous-replication': {
      conclusion: '同步複製（synchronous replication）時，領導者（leader）要等追隨者（follower）確認才回報成功；非同步複製（asynchronous replication）不等。完全非同步時，已向使用者回報成功的寫入，仍可能在領導者掛掉時遺失；全部同步則任何一台追隨者停住就擋下所有寫入，所以實務上常用半同步（semisynchronous）：一台同步、其他非同步。',
      tradeoff: '同步保證最新資料至少多一份副本，代價是那台追隨者出問題時寫入停擺；非同步讓寫入不受追隨者拖累，代價是持久性（durability）較弱。',
      questions: [
        '我們用同步、半同步（semisynchronous）還是非同步複製（asynchronous replication）？',
        '領導者（leader）掛掉時，最多可能丟掉多少已回報成功的寫入？',
      ],
      examples: [{ source: 'book', text: '書中例子：使用者更新頭像，領導者等同步的追隨者確認後才回報成功，另一台非同步的追隨者則不等。多數時候一秒內就套用完成，但追隨者在故障復原或網路出問題時可能落後數分鐘以上。' }],
    },
    'ch6-handling-node-outages': {
      conclusion: '領導者（leader）故障時要做故障轉移（failover）：把一台追隨者（follower）升為新領導者。非同步複製（asynchronous replication）下，新領導者可能缺了舊領導者最後幾筆寫入，這些以為已提交的寫入通常直接被丟掉；兩個節點都以為自己是領導者，叫腦裂（split brain）。判定故障的逾時（timeout）太長則復原慢，太短則負載尖峰也會誤觸發，所以有些團隊寧願手動轉移。',
      tradeoff: '自動故障轉移恢復得快，代價是誤判、腦裂與遺失寫入的風險；手動轉移較慢，但出意外的機會少。',
      questions: [
        '領導者（leader）故障時是自動還是手動轉移？判定故障的逾時（timeout）設多少？',
        '故障轉移（failover）時丟掉的寫入，會讓哪些外部系統和資料庫對不上？',
      ],
      examples: [{ source: 'book', text: '書中提到 GitHub 的事故：落後的 MySQL 追隨者被升為領導者，它的自動遞增主鍵計數器也落後，重用了舊領導者已發出的主鍵。這些主鍵也存在 Redis 裡，兩邊對不上，部分私人資料洩漏給錯的使用者。' }],
    },
    'ch6-solutions-for-replication-lag': {
      conclusion: '使用最終一致性（eventual consistency）的系統時，先問：複製延遲（replication lag）變成數分鐘甚至數小時，應用會怎樣？會出問題，就需要更強的保證，例如寫後讀一致性（read-your-writes consistency）。在應用程式裡自己補這些保證既複雜又容易錯；最簡單的是選一個提供強一致性（strong consistency）與交易（transaction）的資料庫。',
      tradeoff: '弱一致的複製（replication）在網路中斷時更有韌性、開銷也低，代價是應用要自己處理過期讀取（stale read）。',
      questions: [
        '我們是不是把非同步複製（asynchronous replication）當成同步在用？',
        '複製延遲（replication lag）拉長到幾分鐘時，哪些功能會壞？',
      ],
      examples: [{ source: 'book', text: '書中的例子：使用者送出一則留言後馬上重新整理，這次讀取剛好落在還沒跟上的追隨者（follower），剛送出的留言看起來就像不見了。寫後讀一致性保證使用者一定看得到自己剛寫入的資料。' }],
    },
    'ch6-geographically-distributed-operation': {
      conclusion: '副本分散在多個地區時，多主複製（multi-leader replication）讓每個地區在本地處理寫入，延遲低，也撐得過整個地區停機或跨地區斷線。代價是一致性（consistency）弱得多：無法保證帳戶不為負、使用者名稱唯一；需要這類約束就用單主複製（single-leader replication）。',
      tradeoff: '本地寫入換來低延遲與韌性，代價是跨地區的約束保證不了；單主能給強一致性（strong consistency），但每筆寫入都要跨地區送到領導者（leader）。',
      questions: [
        '多地區架構下，我們依賴的唯一約束（uniqueness constraint）或餘額不得為負，還保證得了嗎？',
        '領導者（leader）所在的地區停機時，寫入會怎樣？',
      ],
      examples: [{ source: 'book', text: '書中例子：兩個地區的領導者各自接受一筆註冊同一個使用者名稱的寫入，單獨看都沒問題，合起來卻違反名稱唯一。' }],
    },
    'ch6-how-to-choose': {
      title: '怎麼選複製方式',
      conclusion: '需要強一致性（strong consistency）或跨紀錄的約束（帳戶不得為負、使用者名稱唯一）時，選單主複製（single-leader replication）；寫入要在各地區本地完成，或要離線編輯與即時協作時，選多主複製（multi-leader replication），並準備處理衝突；要在節點變慢或網路出問題時仍維持低延遲，又能容忍最終一致性（eventual consistency）時，選無主複製（leaderless replication）。',
      tradeoff: '三種做法在一致性（consistency）、可用性（availability）與延遲之間各落在不同位置：單主最一致，但領導者（leader）連不上時不能寫入；多主與無主延遲低、斷線時仍能寫入，代價是要處理衝突或只有最終一致性。',
      questions: [
        '需求裡有哪些約束（唯一、不得為負）只有單主複製（single-leader replication）保證得了？',
        '使用者需要離線編輯或多人即時協作嗎？若要，衝突解決（conflict resolution）的規則是什麼？',
      ],
      examples: [{ source: 'book', text: '書中的判準：需要強制帳戶不為負或使用者名稱唯一時，就用單主複製。' }],
    },
    'ch8-replication-and-durability': {
      conclusion: '持久性（durability）沒有完美的：機器會掛，停電或同一個 bug 可能一起打掉所有副本，磁碟上的資料也可能悄悄損壞。沒有單一技術能保證資料不丟，要合併使用寫入磁碟、複製（replication）到遠端機器和備份（backup）。',
      tradeoff: '每多一層保護（遠端複製、保留更久的歷史備份）就多一份成本，但能救回單一手段救不了的故障。',
      questions: [
        '資料若已悄悄損壞一段時間，我們能從多久以前的備份（backup）還原？',
        '有定期演練從備份（backup）還原，確認真的救得回來嗎？',
      ],
      examples: [{ source: 'book', text: '書中提到，磁碟上的資料可能慢慢損壞而沒被發現，等發現時副本和近期備份也都壞了，只能從更早的歷史備份還原；一項研究發現 30% 到 80% 的 SSD 在使用的前四年至少出現一個壞區塊。' }],
    },
  },
} as const satisfies TopicText<'Q7'>
