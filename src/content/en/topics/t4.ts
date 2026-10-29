import type { Translation } from '../../types'
import type { t4 as zh } from '../../zh-TW/topics/t4'

export const t4: Translation<typeof zh> = {
  title: 'Safe retries: request IDs and deduplication',
  summary:
    'For a resend not to duplicate anything, the server has to recognise “this is the same request”: each submission carries a unique request ID, and the database executes it only once.',
  tags: ['transaction', 'deduplication', 'request ID', 'uniqueness constraint', 'end-to-end argument'],
  sections: {
    'ch8-handling-errors-and-aborts': {
      conclusion:
        'Retrying a transaction after an abort is right; the database rolls back precisely so that a retry is safe. But if the transaction actually succeeded and only the commit acknowledgement was lost, a retry runs it twice, so you need deduplication. And only transient errors are worth retrying.',
      tradeoff:
        'Automatic retries recover from transient errors, but they can execute twice, or make an overloaded system worse; they need deduplication, a retry limit and exponential backoff.',
      questions: [
        'If the transaction succeeded and only the response was lost, what happens when the user presses again?',
        'What do we deduplicate on?',
        'Which errors are retried automatically? Is there a limit and backoff under overload?',
      ],
      examples: [
        {
          source: 'book',
          text: 'In the book’s example, the transaction commits, but the network drops while the server sends the acknowledgement; the client sees a timeout and retries, and the transaction runs twice.',
        },
        {
          source: 'ours',
          text: 'The order was placed, but the confirmation was lost on the way back; the user sees a timeout, presses “Place order” again, and gets a second order. Conversely, a permanent error such as a constraint violation (say, a quantity over the limit) gives the same result however often it is resent, so it should not be retried.',
        },
      ],
    },
    'ch8-exactly-once-message-processing-revisited': {
      conclusion:
        'Exactly-once processing does not need distributed transactions: in the same database transaction that processes a message, record its ID under a uniqueness constraint, and a redelivery takes effect only once.',
      tradeoff: 'An extra table of IDs, and one more lookup and write per message, buy safe retries.',
      questions: [
        'Does every request or message carry a unique ID?',
        'When something is resent, does the backend use that ID to spot the duplicate?',
        'Is the ID written in the same transaction as the order?',
      ],
      examples: [
        {
          source: 'book',
          text: 'In the book’s example, a processor crashes after committing but before acknowledging the message to the broker, so the broker redelivers it; the processor finds the ID already in the table and discards the message. If two concurrent transactions try to insert the same ID, the uniqueness constraint lets only one succeed.',
        },
        {
          source: 'ours',
          text: 'An order submission carries the cart session ID, which serves as the order’s request ID. In the same transaction that creates the order, the server marks the cart session as ordered; the order’s cart session ID has a uniqueness constraint, so a resend is rejected and the server returns the original order rather than an error.',
        },
      ],
    },
    'ch13-the-end-to-end-argument-for-databases': {
      conclusion:
        'Deduplication at the connection level cannot stop a user resending after a timeout: to the web server it is another request, to the database another transaction. There must be a unique request ID that exists before the first submission and travels with every resend all the way to the database, which executes each ID once. This is an instance of the end-to-end argument.',
      tradeoff:
        'An end-to-end request ID needs the frontend, backend and schema to cooperate: the ID is created before submission and reused on every resend, and the table gets a uniqueness constraint. Without it, customers can be charged twice or records created twice.',
      questions: [
        'When a user presses “Place order” again after a timeout, what lets the backend recognise the same purchase?',
        'After a page reload, or from another tab, does the resend still carry the same ID?',
        'Is the ID one per purchase, or shared by the whole login session?',
      ],
      examples: [
        {
          source: 'book',
          text: 'In the book’s example, a transfer debits $11 from one account and credits $11 to another; the client reconnects after a dropped connection and retries, and $22 may move instead of $11. The fix puts a uniqueness constraint on request_id in a requests table; the transaction inserts the request ID first, so a resend fails the insert and the whole transaction aborts.',
        },
        {
          source: 'book',
          text: 'The book also notes that a browser usually sends such an instruction as an HTTP POST. The Post/Redirect/Get pattern stops the browser asking whether to resubmit the form when the user reloads the page, but it does not help when the POST times out: to the web server the user’s resend is a separate request, and to the database a separate transaction.',
        },
        {
          source: 'ours',
          text: 'When the user adds the first item, the backend creates a cart session with its own ID, the cart session ID; this is the order’s request ID. Resends and page reloads carry the same one, because it lives on the backend, not on the connection. The order’s cart session ID has a uniqueness constraint, so one cart session becomes at most one order; after the order the backend opens a new one. TCP deduplicates only within one connection and cannot catch a user pressing again; this ID kept on the backend can.',
        },
      ],
      diagram: {
        lanes: ['browser', 'server', 'database'],
        caption:
          'The backend does not create the order again: it sees that cart session c1 has already been ordered and returns the original order. c1 exists on the backend before submission, so resends, new connections and reloads all carry the same one; TCP and the web server only ever see “another new request”. Without this ID the second transaction commits too, and order\u00a0#2 appears; that is how the book’s transfer moves $11 a second time.',
        steps: [
          { at: 'database', text: 'Before checkout: cart session c1 exists, status “open”' },
          { from: 'browser', to: 'server', text: 'Place order, with cart session ID c1 (connection\u00a01)' },
          { from: 'server', to: 'database', text: 'One transaction: create order\u00a0#1, mark c1 as ordered, commit' },
          { from: 'server', to: 'browser', fate: 'lost', text: 'The “Order placed” response is lost when connection\u00a01 drops' },
          { at: 'browser', text: 'Timeout. The user presses “Place order” again' },
          { from: 'browser', to: 'server', text: 'Sends again, still with c1. This is a new connection\u00a02, so TCP cannot tell it is a resend' },
          {
            from: 'server',
            to: 'database',
            fate: 'rejected',
            text: 'One transaction: c1 has already been ordered (uniqueness constraint), so the transaction aborts and creates no order\u00a0#2',
          },
          { from: 'server', to: 'browser', text: 'Looks up order\u00a0#1 for c1 and returns “Order placed”' },
        ],
      },
    },
  },
}
