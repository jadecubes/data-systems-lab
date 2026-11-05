import type { Translation } from '../../types'
import type { q3 as zh } from '../../zh-TW/topics/q3'

export const q3: Translation<typeof zh> = {
  title: 'Will the system hold up as load grows?',
  summary: 'Describe today’s load in numbers before asking what breaks first as it grows; under overload, retries can keep a system from recovering.',
  tags: ['scalability', 'throughput', 'retry storm', 'exponential backoff', 'materialized view'],
  sections: {
    'ch2-scalability': {
      conclusion: 'Scalability is not a yes-or-no label. Ask instead: if load grows in a particular way, what options do we have, and when will current growth hit the limits of today’s architecture? A new product with few users should stay simple and easy to change.',
      tradeoff: 'Designing early for imagined scale is at best wasted effort and at worst locks you into an inflexible design; once growth shows where the bottlenecks are, that is the time to scale.',
      questions: ['At the current growth forecast, which limit will today’s architecture hit first, and when?', 'When it does, what are our options, and how long would each take?'],
      examples: [{ source: 'book', text: 'The book takes up the common advice that you are not Google or Amazon and should stop worrying about scale, and says whether it holds depends on the application: for a new product with few users, the first goal is a system simple enough to change quickly as you learn what customers need.' }],
    },
    'ch2-understanding-load': {
      conclusion: 'First describe current load in numbers: usually throughput, such as requests per second or checkouts per hour, and sometimes a peak such as simultaneous online users. Then ask what happens if load doubles: with the same resources, how much worse does performance get, and how many more resources keep performance unchanged?',
      tradeoff: 'The goal is to keep performance within the service level agreement (SLA) while keeping cost low. Handling twice the load with twice the resources is called linear scalability and already counts as a good result; cost often grows faster than load.',
      questions: ['Which number describes our load, and what is the peak as a multiple of the average?', 'If load doubles, how many more resources keep today’s response times?'],
      examples: [{ source: 'book', text: 'The book lists numbers that describe load: requests per second, gigabytes of new data per day, shopping cart checkouts per hour. Statistics such as the read/write ratio or cache hit rate can matter too, and the bottleneck may be set by a few extreme cases.' }],
    },
    'ch2-principles-for-scalability': {
      conclusion: 'There is no one-size-fits-all scalable architecture: 100,000 small requests per second and 3 large requests per minute can move the same volume of data yet need very different designs. Each tenfold growth in load may require rethinking the architecture, so planning more than one order of magnitude ahead rarely pays. The principles: split the system into components that can run largely independently, and keep it no more complex than necessary.',
      tradeoff: 'Designing for large scale early can save a rewrite, but costs complexity now, while requirements may still change.',
      questions: ['What multiple of today’s load is this design built for?', 'Is there a simpler design that would last until load is ten times larger?'],
      examples: [{ source: 'book', text: 'The book says that when load is fairly predictable, a manually scaled system may cause fewer operational surprises than autoscaling, and that a system of 5 services is simpler than one of 50.' }],
    },
    'ch2-when-an-overloaded-system-won-t-recover': {
      conclusion: 'Near overload, requests queue up, clients time out and resend, and the extra requests slow the system further: a retry storm. Even after load drops, the system may stay overloaded: a metastable failure. Countermeasures sit on both sides: clients use exponential backoff with random jitter and pause calls to a service that keeps failing; servers reject some requests (load shedding) or ask clients to slow down (backpressure).',
      tradeoff: 'Retrying immediately recovers one user faster, but once the system slows, all clients resending at once multiply the load. Backing off makes individual requests slower and lets the system recover.',
      questions: ['How do clients retry after a failure? Is there exponential backoff with random jitter?', 'When the server nears overload, does it reject requests, or accept them all and queue?', 'After traffic drops, does the system recover on its own, or does someone have to restart it?'],
      examples: [
        { source: 'book', text: 'The book describes the cycle: requests queue up, responses become slow enough that clients time out and resend, the request rate rises, and things get worse; even after load falls, the system may stay overloaded until it is restarted or reset.' },
        { source: 'ours', text: 'Automatic retries in a front end work the same way: if every browser resends as soon as a request fails, then once the server slows down, thousands of browsers resend at once and cause a retry storm. Retries therefore need exponential backoff with random jitter.' },
      ],
    },
    'ch2-materializing-and-updating-timelines': {
      conclusion: 'Precomputing a query result and keeping it updated is materialization; the stored result is a materialized view. Reads become fast, at the cost of more work on every write. The number of downstream writes one request triggers is its fan-out. During peaks, delivery can be queued and appear a little later.',
      tradeoff: 'Materialization trades write cost for read speed. For most users the write cost is small, but a celebrity with millions of followers turns one post into millions of writes, so such posts need separate handling, such as merging them in at read time.',
      questions: ['How often is this precomputed data refreshed?', 'During a peak, how late can results appear before users mind?', 'Are there a few extreme users or records that turn one write into millions?'],
      examples: [{ source: 'book', text: 'In the book’s social media timeline, 5,800 posts per second, each delivered to 200 followers on average, become about 1 million timeline writes per second: far fewer than the 400 million lookups per second needed without precomputing.' }],
    },
  },
}
