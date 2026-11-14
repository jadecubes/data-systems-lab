import type { TopicText } from '../../types'

export const q10 = {
  title: '逾時、時鐘與「只能有一個」',
  summary: '逾時設太短會誤判、設太長讓人久等；時間戳排不出可靠的先後；以為自己還握著鎖的節點，可能把資料寫壞。',
  tags: ['逾時', '連鎖故障', '最後寫入者勝', '租約', '隔離權杖'],
  sections: {
    'ch9-timeouts-and-unbounded-delays': {
      conclusion:
        '逾時（timeout）沒有正確值。設太長，節點真的掛了也要等很久才發現，這段時間使用者只能等或看到錯誤；設太短，只是暫時變慢的節點會被誤判為死亡。網路延遲沒有上限（unbounded delays），只能量測實際回應時間的分布再決定。',
      tradeoff:
        '在偵測速度與誤判率之間取捨。誤判的代價：原節點其實還在做事，接手的節點再做一次；它的工作轉給其他節點，還會加重它們的負載，引發連鎖故障（cascading failure）。',
      questions: [
        '這個逾時（timeout）值是怎麼決定的？有量過回應時間的分布嗎？',
        '節點被誤判為死亡、由別的節點接手時，同一件事會不會做兩次？',
        '負載尖峰時，逾時（timeout）會不會讓節點互相判定對方死亡？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中舉例：節點其實還活著、正在寄一封 email，卻被判定死亡；另一個節點接手後，信寄了兩次。若原節點只是過載變慢，把它的工作轉出去，還可能引起連鎖故障。',
        },
      ],
    },
    'ch9-timestamps-for-ordering-events': {
      conclusion:
        '用各節點時鐘產生的時間戳（timestamp）排序事件（event）很危險：時鐘只差幾毫秒，因果上較晚的寫入也可能拿到較小的時間戳。若以最後寫入者勝（last write wins）解決衝突，就會無聲丟掉寫入，應用程式收不到任何錯誤。需要因果順序時，改用邏輯時鐘（logical clock）或版本向量（version vector）。',
      tradeoff: '最後寫入者勝簡單、省一次讀取，代價是可能無聲遺失寫入；邏輯時鐘或版本向量較複雜，但保得住因果順序。',
      questions: [
        '哪裡用時間戳（timestamp）判斷哪筆寫入比較新？',
        '兩台機器的時鐘差幾毫秒時，會丟掉哪些寫入？使用者會發現嗎？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中的例子：用戶端 A 寫入 x = 1；用戶端 B 隨後在另一個節點把 x 加一，得到 2。B 的寫入因果上較晚，時間戳卻是 42.003 秒，比 x = 1 的 42.004 秒還早；最後寫入者勝留下 x = 1，這次加一就此消失。',
        },
      ],
    },
    'ch9-fencing-off-zombies-and-delayed-requests': {
      conclusion:
        '取得租約（lease）的節點可能暫停太久，租約已過期卻不自知，成了殭屍（zombie）；它當機前送出的請求，也可能在網路裡延遲很久才送到。對策是隔離權杖（fencing token）：鎖服務（lock service）每次授予租約時附上一個遞增的數字，寫入時必須帶著，儲存端拒絕比已見過的更小的數字。',
      tradeoff:
        '儲存端必須能檢查權杖，或支援條件寫入（conditional write），換來殭屍和延遲的請求都寫不壞資料。只靠關掉可疑的節點，擋不住已經在網路上的延遲請求。',
      questions: [
        '儲存端會檢查隔離權杖（fencing token）或用條件寫入（conditional write）嗎？還是只靠鎖服務？',
        '持有租約（lease）的節點暫停一分鐘後醒來繼續寫，會發生什麼事？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中的例子：用戶端 1 以權杖 33 取得租約後長時間暫停，租約過期；用戶端 2 以權杖 34 取得租約並寫入。用戶端 1 醒來後帶著 33 寫入，儲存服務已處理過 34，於是拒絕這次寫入。',
        },
        {
          source: 'book',
          text: '書中指出這不是理論：HBase 曾因少了這層保護，讓兩個用戶端同時寫同一個檔案，把檔案寫壞。',
        },
      ],
    },
    'ch9-summary': {
      title: '能用單機就留在單機',
      conclusion:
        '分散式系統帶來網路、時鐘與行程暫停（process pauses）的大量麻煩；單機能解決，就留在單機。值得分散的理由不只擴展，還有容錯（fault tolerance）與低延遲，也就是把資料放在離使用者近的地方。',
      tradeoff: '分散換到容錯與就近服務，代價是逾時（timeout）帶來的不確定、不可靠的時鐘，以及更難除錯。',
      questions: ['這個需求一台機器撐得住嗎？', '要分散的理由是擴展、容錯（fault tolerance），還是離使用者近？'],
      examples: [
        {
          source: 'book',
          text: '書中認為，如果能不打開「潘朵拉的盒子」，例如改用嵌入在應用程式裡的儲存引擎，通常值得。',
        },
      ],
    },
    'ch9-how-to-choose': {
      title: '依誤判的後果選擇保護',
      conclusion:
        '逾時（timeout）靠量測決定；排序事件（event）不靠日曆時鐘（time-of-day clock）。需要「只能有一個」時，誤判只會造成重複工作，用租約（lease）就夠；可能寫壞資料，就加上隔離權杖（fencing token），並讓儲存端檢查。',
      tradeoff: '每一層保護都有成本；依誤判的後果是重複工作還是資料損壞（data corruption），決定做到哪一層。',
      questions: [
        '這個功能哪裡依賴時鐘排序或租約（lease）？有對應的保護嗎？',
        '兩個節點同時以為自己是負責的那一個時，最壞會發生什麼事？',
      ],
      examples: [
        {
          source: 'book',
          text: '書中區分：多個節點同時以為自己持有租約時，若後果只是浪費一些運算資源，沒什麼大不了；若可能造成資料遺失（data loss）或損壞，就需要隔離權杖。',
        },
      ],
    },
  },
} as const satisfies TopicText<'Q10'>
