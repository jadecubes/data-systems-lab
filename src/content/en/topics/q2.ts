import type { Translation } from '../../types'
import type { q2 as zh } from '../../zh-TW/topics/q2'

export const q2: Translation<typeof zh> = {
  title: 'Cloud or self-hosted? Microservices or not?',
  summary: 'Cloud services and microservices both trade money or complexity for something else; first ask whether the team can operate the system, whether load is steady, and how many teams must coordinate.',
  tags: ['cloud services', 'self-hosting', 'vendor lock-in', 'microservices', 'serverless'],
  sections: {
    'ch1-pros-and-cons-of-cloud-services': {
      conclusion: 'Self-hosting is usually cheaper when the team already knows how to operate the system and load is predictable. Cloud services pay off when the team lacks that skill or load swings widely, because idle resources go back to the provider. The price is loss of control.',
      tradeoff: 'The cloud removes operations work and scales with load; but a missing feature means asking the vendor, an outage means waiting, diagnosis is hard without internal logs, and without a compatible API the service is hard to leave: vendor lock-in.',
      questions: ['Is our load steady, or are peaks far above normal?', 'What can we do if this managed service goes down or raises its price?', 'If we need to leave this service, is there a replacement with a compatible API, or are we facing vendor lock-in?'],
      examples: [{ source: 'book', text: 'The book uses analytics: large queries need many machines in parallel to finish quickly, and those machines sit idle afterward; with a large dataset, handing idle resources back to the cloud provider saves money.' }],
    },
    'ch1-microservices-and-serverless': {
      conclusion: 'Microservices are mainly a technical fix for a people problem: each service has one owning team and its own database, and deploys independently. That pays off in large companies; with few teams it is usually unnecessary overhead. Serverless hands starting and stopping machines to the cloud provider, and you pay only for the time your code runs.',
      tradeoff: 'Microservices let teams move independently, at the cost of running every dependency to test one service, deployment and monitoring for each service, and APIs that are hard to evolve. Serverless removes machine management, but functions have execution time limits and the first call can be slow.',
      questions: ['Are we splitting into microservices because teams block each other, or for scale we only expect?', 'Does this API change remove fields or change their meaning? Will clients still on the old version break?', 'Does this work suit serverless, or will it hit execution time limits or slow first calls?'],
      examples: [
        { source: 'book', text: 'The book notes that clients expect certain fields to be present, so adding or removing fields can break them, and such errors often surface only after deployment to staging or production.' },
        { source: 'book', text: 'The book explains why each service keeps its own database: sharing one makes the whole database schema part of the API, hard to change later, and one service’s queries can slow the others.' },
      ],
    },
  },
}
