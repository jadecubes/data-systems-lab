import type { Translation } from '../../types'
import type { t3 as zh } from '../../zh-TW/topics/t3'

export const t3: Translation<typeof zh> = {
  title: 'Timeouts: not knowing whether it worked',
  summary:
    'When a request times out, the server may have finished the work or may never have received it. What the screen says, and whether to send again, both start from that uncertainty.',
  tags: ['Timeout', 'Unreliable networks', 'Retry', 'Idempotence'],
  sections: {
    'ch1-problems-with-distributed-systems': {
      conclusion:
        'Any request over a network can time out, and the sender cannot tell whether the other side received it. When each service has its own database, consistency across services becomes the application’s problem. Work that fits on one machine is usually far simpler and cheaper than a distributed system.',
      tradeoff:
        'A distributed system buys scale and fault tolerance; the price is the uncertainty of timeouts, harder debugging, and handling cross-service consistency yourself.',
      questions: [
        'After this request times out, could the backend already have written the data?',
        'If the user presses the button again, could we create the record twice or charge twice?',
      ],
      examples: [
        {
          source: 'ours',
          text: 'On a weak signal, a user presses “Place order”; the spinner runs, then the request times out. The order may already exist, or the server may never have received it. If the screen simply says “Order failed”, a second press can place a second order.',
        },
      ],
    },
    'ch5-the-problems-with-remote-procedure-calls': {
      conclusion:
        'A network request is fundamentally different from a function call in your own program: the request or the response can be lost, and latency varies wildly. After a timeout you cannot know whether the request arrived; retrying may perform the action twice unless it is idempotent, meaning repeating it has the same effect as doing it once.',
      tradeoff: 'Automatic retries raise the success rate; without idempotence, the price is duplicate execution.',
      questions: [
        'If this write times out and we resend it, could it create two records?',
        'Is there a unique request ID that lets the backend recognise a resend?',
      ],
      examples: [
        {
          source: 'ours',
          text: '“Place order” times out and the app resends automatically. If the first attempt actually succeeded and only the response was lost, a second order appears and the customer is charged twice.',
        },
      ],
      diagram: {
        lanes: ['browser', 'server', 'database'],
        caption:
          'The first send actually succeeded; only the response was lost. The app does not know that, resends on its own, and the backend creates a second order. To the web server the resend is just another new request; without a request ID it cannot tell it is a resend.',
        steps: [
          { from: 'browser', to: 'server', text: 'Place order' },
          { from: 'server', to: 'database', text: 'Create order\u00a0#1, commit' },
          { from: 'server', to: 'browser', fate: 'lost', text: 'The “Order placed” response is lost on the way' },
          { at: 'browser', text: 'Timeout. The app resends automatically' },
          { from: 'browser', to: 'server', text: 'Sends the same order again' },
          { from: 'server', to: 'database', text: 'Create order\u00a0#2, commit' },
          { from: 'server', to: 'browser', text: 'Returns “Order placed”: the user thinks there is one order, but there are two, charged twice' },
        ],
      },
    },
    'ch9-unreliable-networks': {
      conclusion:
        'A request with no response may have been lost, may still be queued, or may have reached a node that crashed or paused; or the other side may have processed it and only the response was lost or delayed. From the sender’s side these cases look identical. A timeout means only “no response yet”.',
      tradeoff: 'Timeouts spare users an endless wait; the price is facing a state where the action may already have succeeded.',
      questions: ['After a timeout, how does the user find out whether the record was written?', 'If the user sends it again, could it be duplicated?'],
      examples: [
        {
          source: 'book',
          text: 'The book lists six reasons a response never arrives. In two of them the remote node has already processed the request and only the response is lost or delayed; to the sender this is indistinguishable from a lost request.',
        },
        {
          source: 'ours',
          text: 'On a timeout the screen should not say “Order failed”; it should say “We couldn’t confirm whether your order was placed. Check your order list.” A lost request and a lost response look the same from the browser: “failed” is true for the first and false for the second. But if the request is still on its way, the list may not show the order yet; what actually prevents a second order is the request ID covered under “Safe retries”.',
        },
      ],
      diagram: {
        lanes: ['browser', 'server', 'database'],
        caption:
          'In both cases the browser sees exactly the same thing: a spinner, then a timeout. The difference is only on the server side: in the first there is no order; in the second the order was placed. So on a timeout the screen must not say “Order failed”.',
        steps: [
          { from: 'browser', to: 'server', fate: 'lost', text: 'Case 1: place order; the request is lost on the way' },
          { at: 'database', text: 'No order' },
          { at: 'browser', text: 'Timeout; the spinner stops' },
          { from: 'browser', to: 'server', text: 'Case 2: place order' },
          { from: 'server', to: 'database', text: 'Create order\u00a0#1, commit' },
          { from: 'server', to: 'browser', fate: 'lost', text: 'The “Order placed” response is lost on the way' },
          { at: 'browser', text: 'Timeout; the spinner stops, just the same' },
        ],
      },
    },
  },
}
