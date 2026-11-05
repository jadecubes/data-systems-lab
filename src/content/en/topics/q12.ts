import type { Translation } from '../../types'
import type { q12 as zh } from '../../zh-TW/topics/q12'

export const q12: Translation<typeof zh> = {
  title: 'How does data flow between services?',
  summary:
    'Data can travel through a shared database, a multi-step workflow or messages; each must answer whether old and new versions can read each other, what happens when it fails halfway, and whether messages can be lost or duplicated.',
  tags: ['forward compatibility', 'durable execution', 'message broker', 'dead letter queue', 'partition key'],
  sections: {
    'ch5-dataflow-through-databases': {
      conclusion:
        'The process that writes to the database encodes, and the process that reads decodes. A service often runs several instances in parallel; during a rolling upgrade, values written by the new version are read by old instances not yet upgraded, so a database needs forward compatibility as well as backward compatibility. When old code updates a record, it must also keep the unknown fields it does not understand.',
      tradeoff: 'Running instances in parallel buys scale and fault tolerance; the price is a data format that must be compatible in both directions.',
      questions: [
        'During a rolling upgrade, what happens when an old instance reads data in the new format?',
        'When old code edits a record and writes it back, could it drop fields the new version added?',
      ],
      examples: [
        {
          source: 'book',
          text: 'The book reminds us that one database may hold values written milliseconds ago next to values written years ago; upgrading the code does not convert old data to the new format.',
        },
      ],
    },
    'ch5-durable-execution-and-workflows': {
      conclusion:
        'A multi-step workflow across services cannot be wrapped in one database transaction. Durable execution records the result of each call and, when rerunning after a failure, skips the steps that already succeeded, giving the workflow an exactly-once effect. External services must still offer idempotent APIs, and reruns must carry the same unique ID.',
      tradeoff:
        'The price is that workflow code must be deterministic, with no direct calls to random number generators or the system clock; changing workflow code can break reruns, so it is safer to deploy the new version separately and let running workflows keep the old one.',
      questions: [
        'What happens if the workflow fails after charging the card but before depositing the money?',
        'On a rerun, does the call to the external payment API use the same unique ID?',
        'If we change the order of the steps, what happens to workflows already in progress?',
      ],
      examples: [
        {
          source: 'book',
          text: 'The book’s payment workflow first calls a fraud-detection service, then charges the credit card, then deposits the money in a bank account. A failure midway can leave the card charged but nothing deposited; the three steps span three services and cannot share one database transaction.',
        },
      ],
    },
    'ch5-message-brokers': {
      conclusion:
        'A message broker holds messages between services. A message on a queue goes to only one consumer; a message published to a topic goes to every subscriber. Many brokers delete a message once it is consumed; a consumer that republishes messages must keep unknown fields.',
      tradeoff:
        'Deleting after consumption saves space, at the price of never replaying past messages; event sourcing requires configuring the broker to keep messages indefinitely.',
      questions: [
        'How long are these messages kept? Can a new consumer replay them from the start?',
        'Should this message be handled by just one consumer, or must every subscriber receive it?',
      ],
      examples: [
        {
          source: 'book',
          text: 'The book says that to use event sourcing, the broker must be configured to keep messages indefinitely instead of deleting them once consumed.',
        },
      ],
    },
    'ch5-how-to-choose': {
      title: 'Database, service call or message broker',
      conclusion:
        'Dataflow through a database needs compatibility in both directions and must keep unknown fields; dataflow through service calls can usually assume servers upgrade first. Use a message broker only when you need buffering, automatic redelivery, one-to-many delivery, or senders that need not know the receivers.',
      tradeoff: 'Stricter compatibility rules and format-checking tools prevent mistakes during upgrades, at the cost of adopting and operating them.',
      questions: [
        'Which direction of compatibility does this dataflow need: new code reading old data, old code reading new data, or both?',
        'Why use a remote procedure call (RPC) rather than a message broker here, or the other way around?',
      ],
      examples: [
        {
          source: 'book',
          text: 'The book lists what a message broker adds over a direct call: it buffers messages when the receiver is down or overloaded, redelivers messages to a process that crashed, spares the sender from knowing the receiver’s address, and can deliver one message to several receivers.',
        },
      ],
    },
    'ch12-messaging-systems': {
      conclusion:
        'To choose a messaging system, ask two questions first: when producers are faster than consumers, does it drop messages, buffer them, or apply backpressure (block the producer); and can messages be lost when a node crashes? The broker redelivers a message until it gets an acknowledgment, so if the acknowledgment is lost on the way, the same message is processed twice.',
      tradeoff:
        'Writing to disk and redelivering until acknowledged means no lost messages, but lower throughput; spreading messages across several consumers and redelivering also reorders them. If a malformed message keeps crashing consumers, moving it to a dead letter queue is what unblocks the stream.',
      questions: [
        'What does losing one of these events, or processing it twice, mean for the business?',
        'Who watches the dead letter queue, and how do messages there get fixed?',
      ],
      examples: [
        {
          source: 'book',
          text: 'The book contrasts the two: a sensor that reports periodically can miss an occasional reading because the next one comes soon; with counting events, every lost message makes the count wrong.',
        },
        {
          source: 'book',
          text: 'In the book’s example, a producer sends JSON missing a required key; the consumer crashes while processing it and never acknowledges; the broker redelivers to the next consumer, which also crashes, in an endless loop until the message is moved to a dead letter queue.',
        },
      ],
    },
    'ch12-log-based-message-brokers': {
      conclusion:
        'A log-based message broker such as Kafka does not delete messages when they are read; each consumer just records the offset it has reached, so messages can be replayed. Order holds only within one partition, so events that must stay in order need the same partition key. The log is a bounded buffer: a consumer that falls behind by more than the retention period misses messages.',
      tradeoff:
        'It buys high throughput, ordering within a partition and replay; the price is that parallelism is capped at the number of partitions, and one slow message holds up every message behind it in the same partition.',
      questions: [
        'For events that must be processed in order, what do we use as the partition key?',
        'How far behind can a consumer fall before an alert fires? How many days is the retention period?',
      ],
      examples: [
        {
          source: 'book',
          text: 'In the book’s example, a user’s events must stay in order, so the user ID is the partition key; starting a copy of a consumer from yesterday’s offset, with its output written elsewhere, reprocesses the last day of messages.',
        },
      ],
    },
  },
}
