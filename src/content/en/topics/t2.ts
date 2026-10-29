import type { Translation } from '../../types'
import type { t2 as zh } from '../../zh-TW/topics/t2'

export const t2: Translation<typeof zh> = {
  title: 'Use percentiles to see slow requests',
  summary: 'Use the median for typical experience and high percentiles for the slowest requests, then make the target measurable.',
  tags: ['median', 'percentile', 'tail latency', 'service level objective'],
  sections: {
    'ch2-average-median-and-percentiles': {
      conclusion: 'Average response time is not the typical experience: it does not say how many users actually waited that long. Half of requests are faster than the median; percentiles show the slower ones: a p99 of one second means 99 of 100 requests return within a second. High percentiles are also called tail latency.',
      tradeoff: 'The higher the percentile you target, the more you protect the slowest users and the more it costs; Amazon judged optimizing p9999 too expensive for the return.',
      questions: ['How long do the slowest 1% of requests take?', 'Is the number aggregated across users or separated by request type?'],
      examples: [{ source: 'book', text: 'The book uses Amazon to show that the slowest requests may come from customers who buy the most; a small group of slow requests can have a large business impact.' }],
    },
    'ch2-use-of-response-time-metrics': {
      conclusion: 'A service level objective sets measurable limits on the median, percentiles, and success rate. The more backend calls a page waits for, the more likely it hits a slow one: tail latency amplification.',
      tradeoff: 'Parallel backend calls make a page easy to assemble, but the page often waits for the slowest call. One backend’s p99 can understate page latency.',
      questions: ['How many backend calls does the page wait for, and what is each p99?', 'What happens when the service level objective is missed?'],
      examples: [
        { source: 'book', text: 'The book’s example objective: median under 200 ms, p99 under one second, and at least 99.9% of valid requests receiving a non-error response.' },
        { source: 'ours', text: 'Suppose each of 100 parallel backend calls independently has a 1% chance of being slow. The chance that at least one is slow is 1 − 0.99¹⁰⁰, about 63%.' },
      ],
    },
  },
}
