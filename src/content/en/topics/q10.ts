import type { Translation } from '../../types'
import type { q10 as zh } from '../../zh-TW/topics/q10'

export const q10: Translation<typeof zh> = {
  title: 'Timeouts, clocks and “only one”',
  summary:
    'A timeout that is too short declares healthy nodes dead, and one that is too long keeps users waiting; timestamps cannot reliably order events; and a node that wrongly believes it still holds a lock can corrupt data.',
  tags: ['timeout', 'cascading failure', 'last write wins', 'lease', 'fencing token'],
  sections: {
    'ch9-timeouts-and-unbounded-delays': {
      conclusion:
        'There is no correct timeout. Too long, and a node that has really died goes unnoticed for a while, so users wait or see errors; too short, and a node that is only temporarily slow is declared dead. Network delays are unbounded, so the value has to come from measuring the real distribution of response times.',
      tradeoff:
        'The trade-off is detection speed against false alarms. A false alarm has a cost: the node was still working, and the node that takes over does the work again; moving its load onto other nodes can also overload them and cause a cascading failure.',
      questions: [
        'How was this timeout value chosen? Have we measured the distribution of response times?',
        'If a node is wrongly declared dead and another takes over, could the same action happen twice?',
        'During a load spike, could the timeout make nodes declare each other dead?',
      ],
      examples: [
        {
          source: 'book',
          text: 'The book’s example: a node is alive and in the middle of sending an email when it is declared dead; another node takes over and the email is sent twice. If the node was only slow from overload, moving its work elsewhere can also cause a cascading failure.',
        },
      ],
    },
    'ch9-timestamps-for-ordering-events': {
      conclusion:
        'Ordering events by timestamps from each node’s clock is dangerous: with clocks only milliseconds apart, a causally later write can get a smaller timestamp. If conflicts are resolved by last write wins, writes are silently dropped and the application receives no error. When causal order matters, use logical clocks or version vectors instead.',
      tradeoff:
        'Last write wins is simple and saves a read, at the price of silently losing writes; logical clocks or version vectors are more complex but preserve causal order.',
      questions: [
        'Where do we use a timestamp to decide which write is newer?',
        'If two machines’ clocks differ by a few milliseconds, which writes get dropped? Would users notice?',
      ],
      examples: [
        {
          source: 'book',
          text: 'In the book’s example, client A writes x = 1; client B then increments x to 2 on another node. B’s write is causally later, yet its timestamp, 42.003 seconds, is earlier than the 42.004 seconds of x = 1; last write wins keeps x = 1, and the increment is lost.',
        },
      ],
    },
    'ch9-fencing-off-zombies-and-delayed-requests': {
      conclusion:
        'A node holding a lease can pause so long that the lease expires without it knowing, turning it into a zombie; a request it sent before crashing can also be delayed in the network and arrive much later. The fix is a fencing token: each time the lock service grants a lease, it attaches an increasing number, every write must carry it, and storage rejects any number smaller than one it has already seen.',
      tradeoff:
        'Storage must check the token or support conditional writes; in return, neither zombies nor delayed requests can corrupt data. Merely shutting down a suspect node does not stop requests already on the network.',
      questions: [
        'Does storage check a fencing token or use conditional writes, or do we rely only on the lock service?',
        'If the node holding the lease pauses for a minute, then wakes up and keeps writing, what happens?',
      ],
      examples: [
        {
          source: 'book',
          text: 'In the book’s example, client 1 gets a lease with token 33, then pauses for a long time and the lease expires; client 2 gets the lease with token 34 and writes. Client 1 wakes up and writes with 33; storage has already processed 34, so it rejects the write.',
        },
        {
          source: 'book',
          text: 'The book points out this is not theoretical: HBase once lacked this protection, let two clients write the same file at once, and corrupted it.',
        },
      ],
    },
    'ch9-summary': {
      title: 'Stay on one machine if you can',
      conclusion:
        'Distributed systems bring a great deal of trouble from networks, clocks and process pauses; if a single machine can do the job, keep it on one machine. Good reasons to distribute go beyond scale: fault tolerance and low latency, meaning data placed close to users.',
      tradeoff:
        'Distribution buys fault tolerance and serving users nearby; the price is the uncertainty of a timeout, unreliable clocks and harder debugging.',
      questions: ['Can one machine handle this requirement?', 'Is the reason to distribute scale, fault tolerance, or being close to users?'],
      examples: [
        {
          source: 'book',
          text: 'The book argues that if you can avoid opening “Pandora’s box”, for example by using an embedded storage engine inside the application, it is usually worth it.',
        },
      ],
    },
    'ch9-how-to-choose': {
      title: 'Choosing protection by the cost of a wrong guess',
      conclusion:
        'Set a timeout by measurement; do not order events by time-of-day clocks. When there must be only one, a lease is enough if a wrong guess only causes duplicate work; if it could corrupt data, add a fencing token and have storage check it.',
      tradeoff:
        'Each layer of protection has a cost; choose how far to go by whether a wrong guess means duplicate work or corrupted data.',
      questions: [
        'Where does this feature rely on clock ordering or a lease? What protects each of them?',
        'If two nodes both believe they are the one in charge, what is the worst that can happen?',
      ],
      examples: [
        {
          source: 'book',
          text: 'The book distinguishes the cases: if several nodes believe they hold the lease and the only result is some wasted computation, it is no big deal; if it could lose or corrupt data, a fencing token is needed.',
        },
      ],
    },
  },
}
